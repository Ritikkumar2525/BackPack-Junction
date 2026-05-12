import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Story from '@/models/Story';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

const initialStories = [
  {
    title: "Dawn at Kedarnath",
    author: "Arjun M.",
    image: "https://picsum.photos/id/1036/600/800",
    likes: 342,
    status: "approved"
  },
  {
    title: "Pangong Sunrise",
    author: "Priya S.",
    image: "https://picsum.photos/id/1015/600/800",
    likes: 289,
    status: "approved"
  },
  {
    title: "Spiti Under Stars",
    author: "Rohan K.",
    image: "https://picsum.photos/id/1044/600/800",
    likes: 412,
    status: "approved"
  },
];

export async function GET(req) {
  try {
    await connectDB();
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const view = searchParams.get('view');
    
    let query = {};

    if (view === 'admin') {
      // Admin sees everything
      if (!session?.user || (session.user.role !== "admin" && session.user.email !== "junctionbackpack@gmail.com")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    } else if (view === 'my-uploads') {
      // User sees only their own uploads
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      query = { uploaderEmail: session.user.email };
    } else {
      // Public view (Home page, public gallery) - only approved items or legacy items without status
      query = { $or: [{ status: "approved" }, { status: { $exists: false } }] };
    }
    
    let stories = await Story.find(query).sort({ _id: -1 });
    
    // Seed initial data if totally empty (just for demo purposes)
    if (stories.length === 0 && view !== 'my-uploads') {
      const allStories = await Story.countDocuments();
      if (allStories === 0) {
        await Story.insertMany(initialStories);
        stories = await Story.find(query).sort({ _id: -1 });
      }
    }
    
    return NextResponse.json(stories);
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const session = await auth();
    const body = await req.json();
    const { title, author, image } = body;
    
    if (!title || !author || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isAdmin = session?.user?.role === "admin" || session?.user?.email === "junctionbackpack@gmail.com";
    const status = isAdmin ? "approved" : "pending";
    const uploaderEmail = session?.user?.email || "anonymous";

    const newStory = await Story.create({ 
      title, 
      author, 
      image,
      uploaderEmail,
      status
    });
    
    return NextResponse.json(newStory, { status: 201 });
  } catch (error) {
    console.error("Failed to create story:", error);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}
