import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Story from '@/models/Story';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.email !== "junctionbackpack@gmail.com")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (!id || id === 'undefined') {
      return NextResponse.json({ error: "Story ID is required" }, { status: 400 });
    }

    const deletedStory = await Story.findByIdAndDelete(id);
    
    if (!deletedStory) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Story deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete story:", error);
    return NextResponse.json({ error: "Failed to delete story", details: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.email !== "junctionbackpack@gmail.com")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await req.json();

    if (!id || id === 'undefined') {
      return NextResponse.json({ error: "Story ID is required" }, { status: 400 });
    }

    const updatedStory = await Story.findByIdAndUpdate(id, { status: body.status }, { returnDocument: "after" });
    
    if (!updatedStory) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json(updatedStory, { status: 200 });
  } catch (error) {
    console.error("Failed to update story:", error);
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}
