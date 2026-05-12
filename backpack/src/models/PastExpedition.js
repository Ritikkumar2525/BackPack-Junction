import mongoose from 'mongoose';

const PastExpeditionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: String, required: true },
  travelers: { type: Number, required: true },
  rating: { type: Number, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.PastExpedition || mongoose.model('PastExpedition', PastExpeditionSchema);
