import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PastExpedition from '@/models/PastExpedition';

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    await PastExpedition.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting expedition:", error);
    return NextResponse.json({ error: "Failed to delete expedition" }, { status: 500 });
  }
}
