import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., "5 Days / 4 Nights"
  price: { type: Number, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  images: [{ type: String }],
  videos: [{ type: String }],
  gallery: [{ type: String }],
  itinerary: [{
    day: { type: Number, required: true },
    title: { type: String, required: true },
    activities: [{ type: String }],
  }],
  itineraryPdf: { type: String }, // URL or base64 data URI for itinerary PDF
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
  routeLocations: [{
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  }],
}, { timestamps: true });

if (mongoose.models.Trip) {
  delete mongoose.models.Trip;
}

export default mongoose.model('Trip', TripSchema);
