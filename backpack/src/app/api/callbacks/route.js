import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Callback from '@/models/Callback';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, phone } = body;
    
    if (!name || !phone) {
      return NextResponse.json({ error: "Name and Phone are required" }, { status: 400 });
    }

    const newCallback = await Callback.create({ name, phone });
    return NextResponse.json(newCallback, { status: 201 });
  } catch (error) {
    console.error("Failed to create callback request:", error);
    return NextResponse.json({ error: "Failed to request callback" }, { status: 500 });
  }
}
