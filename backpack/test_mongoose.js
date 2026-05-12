import mongoose from 'mongoose';
import connectDB from './src/lib/mongodb.js';
import Booking from './src/models/Booking.js';

async function test() {
  await connectDB();
  const b = await Booking.findOne({ bookingId: 'BPJ715013264' });
  console.log("Payments array:", JSON.stringify(b.payments, null, 2));
  process.exit(0);
}
test();
