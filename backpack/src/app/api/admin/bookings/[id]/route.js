import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";
import { generateInvoicePDF } from "@/lib/pdfGenerator";
import { sendBookingEmail, sendCancellationEmail, sendWhatsAppConfirmation } from "@/lib/notifications";

// Admin-only: update booking status
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update allowed fields
    const previousStatus = booking.bookingStatus;
    
    if (body.bookingStatus) booking.bookingStatus = body.bookingStatus;
    if (body.paymentStatus) {
      booking.paymentStatus = body.paymentStatus;
      if (body.paymentStatus === 'Completed') {
        booking.amountPaid = booking.totalAmount;
      } else if (body.paymentStatus === 'Pending' || body.paymentStatus === 'Failed') {
        booking.amountPaid = 0;
      }
    }
    if (body.amountPaid !== undefined) booking.amountPaid = body.amountPaid;
    if (body.adminNotes !== undefined) booking.adminNotes = body.adminNotes;

    // If admin confirms manual payment
    if (body.confirmManualPayment) {
      const paymentRecord = booking.payments.find(p => p.status === 'Pending');
      if (paymentRecord) {
        paymentRecord.status = 'Completed';
        paymentRecord.transactionId = body.transactionId || `MANUAL-${Date.now()}`;
      }
      booking.paymentStatus = booking.amountPaid >= booking.totalAmount ? 'Completed' : 'Partial';
      booking.bookingStatus = 'Confirmed';
    }

    await booking.save();

    // Handle Seat Inventory
    if (booking.bookingStatus === 'Confirmed' && !booking.seatsReserved) {
      const trip = await Trip.findById(booking.tripId);
      if (trip && trip.availableSeats >= booking.travellers.length) {
        trip.availableSeats -= booking.travellers.length;
        await trip.save();
        booking.seatsReserved = true;
        await booking.save();
      }
    } else if (booking.bookingStatus === 'Cancelled' && booking.seatsReserved) {
      const trip = await Trip.findById(booking.tripId);
      if (trip) {
        trip.availableSeats = Math.min(trip.totalSeats, trip.availableSeats + booking.travellers.length);
        await trip.save();
        booking.seatsReserved = false;
      }
    }

    // Send notifications if status changed
    if (booking.bookingStatus !== previousStatus) {
      const trip = await Trip.findById(booking.tripId);
      
      if (booking.bookingStatus === 'Confirmed') {
        try {
          const pdfBuffer = await generateInvoicePDF(booking, trip);
          await sendBookingEmail(booking, trip, pdfBuffer);
          await sendWhatsAppConfirmation(booking, trip);
        } catch (err) {
          console.error("Failed to send confirmation email/invoice:", err);
        }
      } else if (booking.bookingStatus === 'Cancelled') {
        try {
          await sendCancellationEmail(booking, trip);
        } catch (err) {
          console.error("Failed to send cancellation email:", err);
        }
      }
    }

    return NextResponse.json({ booking: booking.toJSON() });
  } catch (error) {
    console.error("Admin booking update error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
