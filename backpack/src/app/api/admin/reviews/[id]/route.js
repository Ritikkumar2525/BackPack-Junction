import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

// PATCH — approve/reject/feature a review
export async function PATCH(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.email !== "junctionbackpack@gmail.com")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const review = await Review.findById(id);
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    if (body.status) review.status = body.status;
    if (body.isFeatured !== undefined) review.isFeatured = body.isFeatured;
    if (body.adminNote !== undefined) review.adminNote = body.adminNote;

    await review.save();
    const populated = await Review.findById(id)
      .populate("userId", "name email image")
      .populate("tripId", "title destination")
      .populate("bookingId", "bookingId travellers");
    return NextResponse.json({ review: populated });
  } catch (error) {
    console.error("Admin review PATCH error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// DELETE a review
export async function DELETE(req, { params }) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "admin" && session.user.email !== "junctionbackpack@gmail.com")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { id } = await params;
    await Review.findByIdAndDelete(id);
    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    console.error("Admin review DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
