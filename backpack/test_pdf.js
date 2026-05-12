import connectDB from './src/lib/mongodb.js';
import Booking from './src/models/Booking.js';
import Trip from './src/models/Trip.js';
import { generateInvoicePDF } from './src/lib/pdfGenerator.js';
import fs from 'fs';

async function run() {
  await connectDB();
  const booking = await Booking.findOne({ bookingId: "BPJ425610281" });
  const trip = await Trip.findById(booking.tripId);
  try {
    const pdf = await generateInvoicePDF(booking, trip);
    fs.writeFileSync('test.pdf', pdf);
    console.log("PDF generated successfully!");
  } catch (e) {
    console.error("PDF generation failed:", e);
  }
  process.exit(0);
}
run();
