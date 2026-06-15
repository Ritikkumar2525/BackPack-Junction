import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';
import Booking from '@/models/Booking';
import { revalidatePath } from 'next/cache';
import { notifySubscribersOfNewTrip } from '@/lib/emailService';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');

    let query = {};
    let sortOrder = { createdAt: -1 };

    if (filter === 'upcoming') {
      query.isPublished = true;
      // Show all published trips; exclude only those with endDate in the past
      query.$or = [
        { endDate: { $gte: new Date() } },
        { endDate: { $exists: false } },
        { endDate: null }
      ];
      sortOrder = { startDate: 1 }; // nearest departure first
    }

    const trips = await Trip.find(query).sort(sortOrder).lean();

    // Compute accurate seat counts from confirmed bookings
    const tripIds = trips.map(t => t._id);
    const seatCounts = await Booking.aggregate([
      { $match: { 
        tripId: { $in: tripIds }, 
        bookingStatus: { $in: ["Confirmed", "Pending"] },
        seatsReserved: true
      }},
      { $group: { 
        _id: "$tripId", 
        bookedSeats: { $sum: { $size: "$travellers" } }
      }}
    ]);

    const seatMap = {};
    seatCounts.forEach(s => { seatMap[s._id.toString()] = s.bookedSeats; });

    const enrichedTrips = trips.map(t => {
      const dbBooked = seatMap[t._id.toString()] || 0;
      const totalSeats = t.totalSeats || 20;
      return {
        ...t,
        totalSeats,
        bookedSeats: dbBooked,
        availableSeats: Math.max(0, totalSeats - dbBooked),
      };
    });

    return NextResponse.json({ trips: enrichedTrips });
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    console.log("Trip POST body:", JSON.stringify({ title: body.title, startDate: body.startDate, endDate: body.endDate, hasPdf: !!body.itineraryPdf }));
    
    if (body._id) {
      // Update existing trip — don't override availableSeats (managed by booking system)
      const updateData = { ...body };
      delete updateData._id;
      delete updateData.availableSeats; // preserve booking-managed seat count
      
      const oldTrip = await Trip.findById(body._id);
      const updated = await Trip.findByIdAndUpdate(body._id, updateData, { returnDocument: "after", runValidators: true });
      if (!updated) {
        return NextResponse.json({ error: "Trip not found" }, { status: 404 });
      }
      
      // If the trip was just published, notify subscribers
      if (updated.isPublished && oldTrip && !oldTrip.isPublished) {
        notifySubscribersOfNewTrip(updated).catch(err => console.error("Notification dispatch failed:", err));
      }
      
      revalidatePath('/trips');
      revalidatePath(`/trips/${updated.destination}`);
      
      return NextResponse.json({ success: true, trip: updated }, { status: 200 });
    }
    
    // Create new trip
    const newTrip = await Trip.create(body);
    revalidatePath('/trips');

    // Notify subscribers if the new trip is published immediately
    if (newTrip.isPublished) {
      notifySubscribersOfNewTrip(newTrip).catch(err => console.error("Notification dispatch failed:", err));
    }

    return NextResponse.json({ success: true, trip: newTrip }, { status: 201 });
  } catch (error) {
    console.error("Failed to save trip:", error);
    return NextResponse.json({ error: "Failed to save trip", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Check if any active bookings exist for this trip
    const activeBookings = await Booking.countDocuments({
      tripId: id,
      bookingStatus: { $in: ['Confirmed', 'Pending'] }
    });

    if (activeBookings > 0) {
      return NextResponse.json({ 
        error: `Cannot delete: ${activeBookings} active booking(s) exist for this trip. Cancel them first.` 
      }, { status: 400 });
    }

    await Trip.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete trip:", error);
    return NextResponse.json({ error: "Failed to delete trip", details: error.message }, { status: 500 });
  }
}
