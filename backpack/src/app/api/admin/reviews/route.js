import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

// GET all reviews for admin
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.email !== "junctionbackpack@gmail.com")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const reviews = await Review.find()
      .populate("userId", "name email image")
      .populate("tripId", "title destination")
      .populate("bookingId", "bookingId travellers")
      .sort({ createdAt: -1 });
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Admin reviews GET error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
