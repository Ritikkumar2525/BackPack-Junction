import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Destination from '@/models/Destination';

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
