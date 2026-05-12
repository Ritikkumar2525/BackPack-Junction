export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";
import { sendCancellationEmail } from "@/lib/notifications";

const BOOKING_CHARGE_PER_HEAD = 1000;

// GET single booking
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { bookingId: id };

    const booking = await Booking.findOne(query)
      .populate('tripId')
      .populate('userId', 'name email phone');

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only allow user to see their own booking, or admin to see any
    if (session.user.role !== 'admin' && booking.userId._id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ booking: booking.toJSON() });
  } catch (error) {
    console.error("Fetch booking error:", error);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

// PATCH — Cancel booking (user) or update status (admin)
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { bookingId: id };
    const booking = await Booking.findOne(query).populate('tripId');
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Admin can update any field
    if (session.user.role === 'admin') {
      if (body.bookingStatus) booking.bookingStatus = body.bookingStatus;
      if (body.paymentStatus) booking.paymentStatus = body.paymentStatus;
      if (body.amountPaid !== undefined) booking.amountPaid = body.amountPaid;
      if (body.adminNotes) booking.adminNotes = body.adminNotes;
      await booking.save();
      return NextResponse.json({ booking: booking.toJSON() });
    }

    // User can only cancel their own booking
    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (body.action === 'cancel') {
      if (booking.bookingStatus === 'Cancelled') {
        return NextResponse.json({ error: "Booking is already cancelled" }, { status: 400 });
      }

      // Calculate refund
      const nonRefundable = BOOKING_CHARGE_PER_HEAD * booking.travellers.length;
      const refundAmount = Math.max(0, booking.amountPaid - nonRefundable);

      booking.bookingStatus = 'Cancelled';
      booking.paymentStatus = booking.amountPaid > 0 ? 'Refunded' : 'Failed';
      booking.cancelledAt = new Date();
      booking.cancellationReason = body.reason || 'User requested cancellation';
      booking.refundAmount = refundAmount;

      // Restore seats (only if they were reserved)
      if (booking.seatsReserved && booking.tripId) {
        const trip = await Trip.findById(booking.tripId._id || booking.tripId);
        if (trip) {
          trip.availableSeats = Math.min(trip.totalSeats, trip.availableSeats + booking.travellers.length);
          await trip.save();
        }
        booking.seatsReserved = false;
      }

      await booking.save();

      // Send cancellation email
      try {
        const trip = await Trip.findById(booking.tripId._id || booking.tripId);
        await sendCancellationEmail(booking, trip);
      } catch (err) {
        console.error("Cancellation email failed:", err);
      }

      return NextResponse.json({
        booking: booking.toJSON(),
        message: `Booking cancelled. ₹${nonRefundable.toLocaleString('en-IN')} booking charge deducted (non-refundable). Refund of ₹${refundAmount.toLocaleString('en-IN')} will be processed in 7-10 working days.`,
      });
    } else if (body.action === 'submit_utr') {
      const createdAt = new Date(booking.createdAt).getTime();
      const now = new Date().getTime();
      if (now - createdAt > 60 * 60 * 1000) {
        // Auto cancel if they try to submit after 1 hour
        booking.bookingStatus = 'Cancelled';
        booking.paymentStatus = 'Failed';
        booking.cancellationReason = 'Payment timeout after 1 hour';
        await booking.save();
        return NextResponse.json({ error: "Payment timeframe of 1 hour has expired. Booking has been cancelled." }, { status: 400 });
      }

      const fallbackMethod = booking.paymentMethod !== 'Razorpay' ? booking.paymentMethod : 'Bank Transfer';
      const newMethod = booking.paymentMethod === 'Razorpay' ? fallbackMethod : booking.paymentMethod;
      
      await Booking.updateOne(
        { _id: booking._id },
        { 
          $set: { 
            manualUtr: body.utr, 
            manualScreenshot: body.screenshot,
            paymentMethod: newMethod
          } 
        },
        { strict: false }
      );
      
      const updatedBooking = await Booking.findById(booking._id).populate('tripId').populate('userId');
      return NextResponse.json({ booking: updatedBooking.toJSON(), message: "UTR submitted successfully." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json({ error: "Failed to update booking: " + error.message }, { status: 500 });
  }
}
