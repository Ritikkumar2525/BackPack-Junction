import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { destinations as hardcodedDestinations } from '@/data/destinations';

export const dynamic = 'force-dynamic'; // Prevent aggressive static caching

export async function GET() {
  try {
    await connectToDatabase();
    
    // Auto-seed any missing hardcoded destinations into DB
    for (const dest of hardcodedDestinations) {
      const exists = await Destination.findOne({ id: dest.id });
      if (!exists) {
        await Destination.create(dest);
      }
    }
    
    const dbDestinations = await Destination.find().sort({ createdAt: 1 });
    return NextResponse.json(dbDestinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    // Fallback to hardcoded if DB fails
    return NextResponse.json(hardcodedDestinations);
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const newDestination = await Destination.create(data);
    return NextResponse.json(newDestination, { status: 201 });
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json({ error: "Failed to create destination" }, { status: 500 });
  }
}
