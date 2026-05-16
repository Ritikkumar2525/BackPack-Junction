import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { revalidatePath } from 'next/cache';

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    await Destination.findOneAndDelete({ id: id });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json({ error: "Failed to delete destination" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const data = await req.json();
    
    // Use upsert to create the document if it doesn't exist in DB yet
    // (handles hardcoded destinations being edited for the first time)
    const updated = await Destination.findOneAndUpdate(
      { id: id },
      { $set: data },
      { returnDocument: "after", upsert: true, setDefaultsOnInsert: true }
    );
    
    // Force cache invalidation so the frontend reflects new images instantly
    revalidatePath(`/destinations/${id}`);
    revalidatePath(`/destinations`);
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json({ error: "Failed to update destination" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const destination = await Destination.findOne({ id: id });
    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 });
    }
    return NextResponse.json(destination);
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json({ error: "Failed to fetch destination" }, { status: 500 });
  }
}
