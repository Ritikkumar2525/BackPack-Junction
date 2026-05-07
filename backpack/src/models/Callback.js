import mongoose from 'mongoose';

const CallbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending', // pending, contacted, closed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Callback || mongoose.model('Callback', CallbackSchema);
