import mongoose from 'mongoose';

const TravellerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emailAddress: { type: String },
  city: { type: String },
  emergencyContact: { type: String },
  idProofUrl: { type: String }, // Optional
  foodPreference: { type: String }, // e.g., Veg, Non-Veg, Jain
  medicalConditions: { type: String },
  specialRequests: { type: String },
});

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  pickupLocation: { type: String },
  totalAmount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['Pending', 'Partial', 'Completed', 'Failed'], default: 'Pending' },
  bookingStatus: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  travellers: [TravellerSchema],
  razorpayPaymentId: { type: String },
  invoiceUrl: { type: String },
  travelDates: {
    startDate: { type: Date },
    endDate: { type: Date }
  }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
