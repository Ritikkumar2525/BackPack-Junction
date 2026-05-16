import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  url: { // Using url instead of imageUrl to be generic for both image and video
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tripBatch: {
    type: String,
  },
  tags: [{
    type: String,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  }
}, { timestamps: true });

export default mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
