import mongoose from "mongoose";
import { Blog } from "./src/lib/blogs.js";

async function test() {
  await mongoose.connect("mongodb://localhost:27017/backpack");
  const blogs = await Blog.find({});
  console.log("Total blogs:", blogs.length);
  
  const blog = await Blog.findOne({ slug: "the-complete-kedarnath-trek-guide-2026" });
  console.log("Found blog:", blog ? blog.title : null);
  process.exit(0);
}
test();
