import mongoose from 'mongoose';

const DestinationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // slug
  name: { type: String, required: true },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  bestSeason: { type: String, required: true },
  difficulty: { type: String, required: true },
  altitude: { type: String, required: true },
  duration: { type: String, required: true },
  temperature: { type: String, required: true },
  rating: { type: Number, required: true },
  price: { type: Number, required: true },
  category: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
