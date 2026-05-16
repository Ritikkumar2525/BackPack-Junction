import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import { Blog } from "@/lib/blogs";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectMongo();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit")) || 0;
    const exclude = searchParams.get("exclude");

    const query = { status: "published" };
    if (category && category !== "All") query.category = category;
    if (tag) query.tags = tag;
    if (featured === "true") query.isFeatured = true;
    if (exclude) query._id = { $ne: exclude };

    let blogsQuery = Blog.find(query).sort({ createdAt: -1 });
    if (limit > 0) blogsQuery = blogsQuery.limit(limit);

    const blogs = await blogsQuery;

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
