import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import { Blog } from "@/lib/blogs";

export async function GET(req, { params }) {
  try {
    const { slug } = params;
    await connectMongo();

    const blog = await Blog.findOne({ slug, status: "published" });

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    // Increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
