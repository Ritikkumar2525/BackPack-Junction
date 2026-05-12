import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  uploaderEmail: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending',
  }
}, { strict: false });

if (mongoose.models.Story) {
  delete mongoose.models.Story;
}

export default mongoose.model('Story', StorySchema);
