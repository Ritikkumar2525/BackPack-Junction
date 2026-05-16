import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true, maxlength: 1000 },
  photos: [{ type: String }], // URLs or base64
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  isFeatured: { type: Boolean, default: false },
  adminNote: { type: String },
}, { timestamps: true });

// One review per booking
ReviewSchema.index({ bookingId: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
