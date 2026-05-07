import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Story from '@/models/Story';

const initialStories = [
  {
    title: "Dawn at Kedarnath",
    author: "Arjun M.",
    image: "https://picsum.photos/id/1036/600/800",
    likes: 342,
  },
  {
    title: "Pangong Sunrise",
    author: "Priya S.",
    image: "https://picsum.photos/id/1015/600/800",
    likes: 289,
  },
  {
    title: "Spiti Under Stars",
    author: "Rohan K.",
    image: "https://picsum.photos/id/1044/600/800",
    likes: 412,
  },
  {
    title: "Old Manali Vibes",
    author: "Ananya G.",
    image: "https://picsum.photos/id/1050/600/800",
    likes: 198,
  },
  {
    title: "Ganga Aarti",
    author: "Vikram S.",
    image: "https://picsum.photos/id/29/600/800",
    likes: 367,
  },
  {
    title: "Chandrashila Peak",
    author: "Meera T.",
    image: "https://picsum.photos/id/10/600/800",
    likes: 256,
  },
];

export async function GET() {
  try {
    await connectDB();
    
    let stories = await Story.find({}).sort({ _id: -1 }); // Sort newest first
    
    // Seed initial data if empty
    if (stories.length === 0) {
      await Story.insertMany(initialStories);
      stories = await Story.find({}).sort({ _id: -1 });
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
    const body = await req.json();
    const { title, author, image } = body;
    
    if (!title || !author || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newStory = await Story.create({ title, author, image });
    return NextResponse.json(newStory, { status: 201 });
  } catch (error) {
    console.error("Failed to create story:", error);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}
