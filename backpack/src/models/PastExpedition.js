import mongoose from 'mongoose';

const PastExpeditionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: String, required: true },
  travelers: { type: Number, required: true },
  rating: { type: Number, required: true },
  image: { type: String, required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }, // links to original trip if auto-migrated
  gallery: [{ type: String }],
}, { timestamps: true });

if (mongoose.models.PastExpedition) {
  delete mongoose.models.PastExpedition;
}

export default mongoose.model('PastExpedition', PastExpeditionSchema);
