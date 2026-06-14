import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PastExpedition from '@/models/PastExpedition';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid expedition ID" }, { status: 400 });
    }

    const expedition = await PastExpedition.findById(id).lean();

    if (!expedition) {
      return NextResponse.json({ error: "Expedition not found" }, { status: 404 });
    }

    return NextResponse.json(expedition);
  } catch (error) {
    console.error("Error fetching past expedition details:", error);
    return NextResponse.json({ error: "Failed to fetch expedition details" }, { status: 500 });
  }
}
