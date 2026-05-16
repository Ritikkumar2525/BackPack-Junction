import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PastExpedition from '@/models/PastExpedition';
import { revalidatePath } from 'next/cache';

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await PastExpedition.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting expedition:", error);
    return NextResponse.json({ error: "Failed to delete expedition" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const data = await req.json();
    const updated = await PastExpedition.findByIdAndUpdate(id, data, { returnDocument: "after" });
    if (!updated) return NextResponse.json({ error: "Expedition not found" }, { status: 404 });
    
    // Invalidate cache
    revalidatePath('/past-expeditions');
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating expedition:", error);
    return NextResponse.json({ error: "Failed to update expedition" }, { status: 500 });
  }
}
