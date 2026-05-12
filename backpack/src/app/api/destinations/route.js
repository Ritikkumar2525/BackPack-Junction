import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { destinations as hardcodedDestinations } from '@/data/destinations';

export async function GET() {
  try {
    await connectToDatabase();
    const dbDestinations = await Destination.find();
    // Merge DB destinations with hardcoded ones
    const allDestinations = [...hardcodedDestinations, ...dbDestinations];
    return NextResponse.json(allDestinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 });
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
