import mongoose from 'mongoose';

const TravellerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emailAddress: { type: String },
  city: { type: String },
  emergencyContact: { type: String },
  idProofUrl: { type: String },
  foodPreference: { type: String },
  medicalConditions: { type: String },
  specialRequests: { type: String },
});

const PaymentRecordSchema = new mongoose.Schema({
  method: { type: String, enum: ['Razorpay', 'Bank Transfer', 'UPI', 'QR Code', 'Pay Later'], required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  screenshot: { type: String },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed', 'Refunded'], default: 'Pending' },
  note: { type: String }, // e.g. "Booking charge ₹1000/head" or "Manual bank transfer"
  createdAt: { type: Date, default: Date.now },
});

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  pickupLocation: { type: String },

  // Financial
  totalAmount: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  bookingCharge: { type: Number, default: 0 }, // ₹1000/head non-refundable
  refundAmount: { type: Number, default: 0 },

  // Status
  paymentStatus: { type: String, enum: ['Pending', 'Partial', 'Completed', 'Failed', 'Refunded'], default: 'Pending' },
  bookingStatus: { type: String, enum: ['Pending', 'Confirmed', 'Cancellation Requested', 'Cancelled', 'Completed'], default: 'Pending' },
  paymentMode: { type: String, enum: ['Full Payment', 'Pay Later'], default: 'Full Payment' },

  // Payment method used
  paymentMethod: { type: String, enum: ['Razorpay', 'Bank Transfer', 'UPI', 'QR Code', 'Pay Later'], default: 'Razorpay' },

  // Payment history
  payments: [PaymentRecordSchema],

  // Travellers
  travellers: [TravellerSchema],

  // Razorpay
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },

  // Consent & Policy
  consentAccepted: { type: Boolean, default: false },
  cancellationPolicy: {
    nonRefundablePerHead: { type: Number, default: 1000 },
    acknowledged: { type: Boolean, default: false },
  },

  // Cancellation
  cancelledAt: { type: Date },
  cancellationReason: { type: String },
  cancellationRequest: {
    isRequested: { type: Boolean, default: false },
    reason: { type: String },
    upiId: { type: String },
    comments: { type: String },
    requestedAt: { type: Date },
    adminResponse: { type: String },
    resolvedAt: { type: Date }
  },
  refundStatus: { type: String, enum: ['N/A', 'Pending', 'Processing', 'Refunded'], default: 'N/A' },

  // Invoice
  invoiceUrl: { type: String },

  // Travel dates
  travelDates: {
    startDate: { type: Date },
    endDate: { type: Date }
  },

  // Admin notes
  adminNotes: { type: String },

  // Manual Payment UTR
  manualUtr: { type: String },
  manualScreenshot: { type: String },

  // Seat tracking
  seatsReserved: { type: Boolean, default: false },
}, { timestamps: true });

// Virtual for balance due
BookingSchema.virtual('balanceDue').get(function() {
  return Math.max(0, this.totalAmount - this.amountPaid);
});

// Ensure virtuals are serialized
BookingSchema.set('toJSON', { virtuals: true });
BookingSchema.set('toObject', { virtuals: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
