import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';
import Booking from '@/models/Booking';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');

    // Simple implementation for now, returning all published trips if 'upcoming'
    let query = {};
    if (filter === 'upcoming') {
      query.isPublished = true;
    }

    const trips = await Trip.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ trips });
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
    
    if (body._id) {
      const updated = await Trip.findByIdAndUpdate(body._id, body, { new: true });
      return NextResponse.json({ success: true, trip: updated }, { status: 200 });
    }
    
    // Create new trip
    const newTrip = await Trip.create(body);
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
