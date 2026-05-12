import connectDB from './src/lib/mongodb.js';
import Booking from './src/models/Booking.js';
async function run() {
  await connectDB();
  const b = await Booking.findOne({ bookingId: 'BPJ425610281' });
  console.log(JSON.stringify(b, null, 2));
  process.exit(0);
}
run();
