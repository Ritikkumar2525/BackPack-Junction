import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: "Backpack Junction Team",
  },
  category: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "published",
  },
  readTime: {
    type: Number,
    default: 5,
  },
  views: {
    type: Number,
    default: 0,
  },
  seoTitle: {
    type: String,
  },
  seoDescription: {
    type: String,
  },
}, { timestamps: true });

export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
