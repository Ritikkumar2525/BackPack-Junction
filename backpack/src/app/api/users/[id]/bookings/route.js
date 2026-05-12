import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const bookings = await Booking.find({ userId: id })
      .populate('tripId', 'title destination duration')
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Failed to fetch user bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch user bookings' }, { status: 500 });
  }
}
