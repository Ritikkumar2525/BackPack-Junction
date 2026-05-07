import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., "5 Days / 4 Nights"
  price: { type: Number, required: true },
  images: [{ type: String }],
  videos: [{ type: String }],
  itinerary: [{
    day: { type: Number, required: true },
    title: { type: String, required: true },
    activities: [{ type: String }],
  }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  faqs: [{
    question: { type: String },
    answer: { type: String }
  }],
  policies: { type: String },
  pickupLocations: [{ type: String }],
  dropLocations: [{ type: String }],
  hotelDetails: { type: String },
  totalSeats: { type: Number, default: 20 },
  availableSeats: { type: Number, default: 20 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Trip || mongoose.model('Trip', TripSchema);
