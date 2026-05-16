import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";
import { sendCancellationRequestNotification } from "@/lib/notifications";

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { reason, upiId, comments } = body;

    if (!reason || !upiId) {
      return NextResponse.json({ error: "Reason and UPI ID are required" }, { status: 400 });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify ownership
    if (booking.userId.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // Check if cancellation is allowed
    if (booking.bookingStatus === 'Cancelled' || booking.bookingStatus === 'Completed') {
      return NextResponse.json({ error: `Booking is already ${booking.bookingStatus.toLowerCase()}` }, { status: 400 });
    }

    const trip = await Trip.findById(booking.tripId);
    if (!trip) {
      return NextResponse.json({ error: "Associated trip not found" }, { status: 404 });
    }

    // Prevent cancellation after trip start date
    const tripStartDate = booking.travelDates?.startDate || trip.startDate;
    if (tripStartDate && new Date(tripStartDate) < new Date()) {
      return NextResponse.json({ error: "Cannot cancel a trip after its start date" }, { status: 400 });
    }

    // Update booking
    booking.bookingStatus = 'Cancellation Requested';
    booking.cancellationRequest = {
      isRequested: true,
      reason,
      upiId,
      comments,
      requestedAt: new Date()
    };
    booking.refundStatus = 'Pending';
    
    await booking.save();

    // Notify Admin
    try {
      await sendCancellationRequestNotification(booking, trip);
    } catch (e) {
      console.error("Failed to notify admin:", e);
    }

    return NextResponse.json({ success: true, booking: booking.toJSON() });
  } catch (error) {
    console.error("Cancellation Request Error:", error);
    return NextResponse.json({ error: "Failed to submit cancellation request" }, { status: 500 });
  }
}
