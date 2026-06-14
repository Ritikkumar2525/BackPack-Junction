import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";
import User from "@/models/User";
import { sendCancellationEmail } from "@/lib/notifications";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== 'admin' && session.user.email !== 'junctionbackpack@gmail.com')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    
    const url = new URL(request.url);
    const filter = url.searchParams.get("filter") || "all";
    
    let query = { "cancellationRequest.isRequested": true };
    if (filter === "pending") {
      query.bookingStatus = "Cancellation Requested";
    } else if (filter === "resolved") {
      query.bookingStatus = "Cancelled";
    }

    const requests = await Booking.find(query)
      .populate({ path: "userId", select: "name email phone", model: User })
      .populate({ path: "tripId", select: "title destination", model: Trip })
      .sort({ "cancellationRequest.requestedAt": -1 })
      .lean();

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Fetch Cancellations Error:", error);
    return NextResponse.json({ error: "Failed to fetch cancellation requests" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== 'admin' && session.user.email !== 'junctionbackpack@gmail.com')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    
    const { bookingId, action, refundStatus, adminResponse } = await request.json();
    
    if (!bookingId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId).populate('tripId').populate('userId');
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (action === "accept") {
      booking.bookingStatus = "Cancelled";
      booking.cancelledAt = new Date();
      booking.cancellationReason = booking.cancellationRequest.reason;
      booking.cancellationRequest.resolvedAt = new Date();
      if (adminResponse) booking.cancellationRequest.adminResponse = adminResponse;
      if (refundStatus) booking.refundStatus = refundStatus;
      
      // Release seats
      if (booking.seatsReserved && booking.tripId) {
        booking.seatsReserved = false;
      }
      await booking.save();

      // Notify User
      try {
        await sendCancellationEmail(booking, booking.tripId, booking.userId);
      } catch (e) {
        console.error("Failed to send cancellation notification email", e);
      }

    } else if (action === "reject") {
      booking.bookingStatus = "Confirmed"; // revert back to confirmed
      booking.cancellationRequest.isRequested = false;
      booking.cancellationRequest.resolvedAt = new Date();
      if (adminResponse) booking.cancellationRequest.adminResponse = adminResponse;
      await booking.save();
      // Optionally notify user of rejection
    } else if (action === "updateRefund") {
      if (refundStatus) booking.refundStatus = refundStatus;
      if (adminResponse) booking.cancellationRequest.adminResponse = adminResponse;
      await booking.save();
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("Update Cancellation Error:", error);
    return NextResponse.json({ error: "Failed to update cancellation" }, { status: 500 });
  }
}
