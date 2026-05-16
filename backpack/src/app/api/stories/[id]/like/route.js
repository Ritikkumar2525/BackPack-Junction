import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Story from '@/models/Story';

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const updatedStory = await Story.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { returnDocument: "after" }
    );

    if (!updatedStory) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, likes: updatedStory.likes });
  } catch (error) {
    console.error("Failed to update like:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
