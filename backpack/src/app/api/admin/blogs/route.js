import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/mongodb";
import { Blog } from "@/lib/blogs";

export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const blogs = await Blog.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error("Admin Blogs GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const body = await req.json();

    // Generate slug if not provided or empty
    if (!body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    // Ensure tags are an array
    if (typeof body.tags === "string") {
      body.tags = body.tags.split(",").map(t => t.trim()).filter(Boolean);
    }

    const newBlog = await Blog.create(body);

    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error) {
    console.error("Admin Blogs POST error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A blog with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
