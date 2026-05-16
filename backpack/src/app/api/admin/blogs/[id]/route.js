import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/lib/mongodb";
import { Blog } from "@/lib/blogs";

export async function PUT(req, props) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const { id } = params;
    await connectMongo();
    const body = await req.json();

    if (body.title && !body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    if (typeof body.tags === "string") {
      body.tags = body.tags.split(",").map(t => t.trim()).filter(Boolean);
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, body, { returnDocument: "after", runValidators: true });

    if (!updatedBlog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (error) {
    console.error("Admin Blogs PUT error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A blog with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, props) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const { id } = params;
    await connectMongo();

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Blogs DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
