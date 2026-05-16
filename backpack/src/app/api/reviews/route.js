import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Booking from "@/models/Booking";

// GET reviews — for user (their own) or public featured reviews
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const bookingId = searchParams.get("bookingId");

    // Public: get featured approved reviews for homepage
    if (featured === "true") {
      const reviews = await Review.find({ status: "Approved", isFeatured: true })
        .populate("userId", "name image")
        .populate("tripId", "title destination images")
        .sort({ createdAt: -1 })
        .limit(10);
      return NextResponse.json({ reviews });
    }

    // Check if a review already exists for a booking
    if (bookingId) {
      const session = await auth();
      if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      const existing = await Review.findOne({ bookingId, userId: session.user.id });
      return NextResponse.json({ exists: !!existing, review: existing });
    }

    // User's own reviews
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const reviews = await Review.find({ userId: session.user.id })
      .populate("tripId", "title destination images")
      .sort({ createdAt: -1 });
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST — submit a review
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { bookingId, rating, review, photos } = await req.json();

    if (!bookingId || !rating || !review) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Verify booking belongs to user and trip is completed
    const booking = await Booking.findById(bookingId).populate("tripId");
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "This is not your booking" }, { status: 403 });
    }

    // Check if review already exists
    const existing = await Review.findOne({ bookingId });
    if (existing) {
      return NextResponse.json({ error: "You have already submitted a review for this booking" }, { status: 409 });
    }

    const newReview = new Review({
      userId: session.user.id,
      bookingId,
      tripId: booking.tripId._id || booking.tripId,
      rating,
      review: review.substring(0, 1000),
      photos: (photos || []).slice(0, 5),
      status: "Pending",
    });

    await newReview.save();
    return NextResponse.json({ review: newReview, message: "Review submitted! It will appear after admin approval." }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "You have already reviewed this booking" }, { status: 409 });
    }
    console.error("Review POST error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
