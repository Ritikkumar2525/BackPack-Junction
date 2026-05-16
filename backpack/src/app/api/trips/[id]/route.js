import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Trip from "@/models/Trip";
import Booking from "@/models/Booking";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    await connectDB();

    // Check if valid ObjectId or a slug (if we support slugs later)
    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.slug = id;
    }

    const trip = await Trip.findOne(query).lean();

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Compute accurate seat counts from confirmed bookings
    const bookings = await Booking.aggregate([
      { $match: { 
        tripId: trip._id.toString(), 
        bookingStatus: { $in: ["Confirmed", "Pending"] },
        seatsReserved: true
      }},
      { $group: { 
        _id: "$tripId", 
        bookedSeats: { $sum: { $size: "$travellers" } }
      }}
    ]);

    const dbBooked = bookings.length > 0 ? bookings[0].bookedSeats : 0;
    const totalSeats = trip.totalSeats || 20;

    const enrichedTrip = {
      ...trip,
      totalSeats,
      bookedSeats: dbBooked,
      availableSeats: Math.max(0, totalSeats - dbBooked),
      // Ensure frontend fields match (e.g. price, duration, itinerary)
      // The admin UI creates these fields directly on the document.
    };

    return NextResponse.json({ trip: enrichedTrip });
  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
