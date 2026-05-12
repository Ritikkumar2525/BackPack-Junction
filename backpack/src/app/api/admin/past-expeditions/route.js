import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PastExpedition from '@/models/PastExpedition';

export async function GET() {
  try {
    await connectToDatabase();
    const expeditions = await PastExpedition.find().sort({ createdAt: -1 });
    return NextResponse.json(expeditions);
  } catch (error) {
    console.error("Error fetching past expeditions:", error);
    return NextResponse.json({ error: "Failed to fetch expeditions" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const newExpedition = await PastExpedition.create(data);
    return NextResponse.json(newExpedition, { status: 201 });
  } catch (error) {
    console.error("Error creating past expedition:", error);
    return NextResponse.json({ error: "Failed to create expedition" }, { status: 500 });
  }
}
