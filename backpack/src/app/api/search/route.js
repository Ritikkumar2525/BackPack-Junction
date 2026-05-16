import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Trip from '@/models/Trip';
import Destination from '@/models/Destination';
import connectDB from '@/lib/mongodb';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const regex = new (global.RegExp)(query, 'i');

    const [trips, destinations] = await Promise.all([
      Trip.find({ 
        isPublished: true, 
        $or: [{ title: regex }, { destination: regex }] 
      }).limit(5).select('title destination _id'),
      Destination.find({ 
        $or: [{ name: regex }, { tagline: regex }] 
      }).limit(5).select('name tagline id _id image')
    ]);

    const results = [
      ...destinations.map(d => ({
        type: 'destination',
        id: d.id || d._id,
        title: d.name,
        subtitle: d.tagline,
        image: d.image,
        href: `/destinations/${d.id || d._id}`
      })),
      ...trips.map(t => ({
        type: 'trip',
        id: t._id,
        title: t.title,
        subtitle: t.destination,
        href: `/trips/${t._id}`
      }))
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
