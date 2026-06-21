import { sendBookingEmail } from './src/lib/notifications.js';
import connectDB from './src/lib/mongodb.js';
import Trip from './src/models/Trip.js';
import Booking from './src/models/Booking.js';
import User from './src/models/User.js';
import { generateInvoicePDF } from './src/lib/pdfGenerator.js';

async function testEmail() {
  await connectDB();
  const trip = await Trip.findOne({ itineraryPdf: { $exists: true, $ne: '' } });
  if (!trip) {
    console.log("No trip with itinerary found");
    return;
  }
  
  const booking = await Booking.findOne({ tripId: trip._id }).populate('userId');
  if (!booking) {
    console.log("No booking found for trip");
    return;
  }

  console.log("Found trip:", trip.title);
  console.log("Itinerary PDF:", trip.itineraryPdf.substring(0, 50) + "...");
  
  const pdfBuffer = await generateInvoicePDF(booking, trip);
  
  let itineraryBuffer;
  if (trip.itineraryPdf) {
    if (trip.itineraryPdf.startsWith('http')) {
      console.log("Fetching HTTP URL");
      const res = await fetch(trip.itineraryPdf);
      const arrayBuffer = await res.arrayBuffer();
      itineraryBuffer = Buffer.from(arrayBuffer);
    } else {
      console.log("Parsing base64");
      const base64Data = trip.itineraryPdf.split(',')[1];
      if (base64Data) {
        itineraryBuffer = Buffer.from(base64Data, 'base64');
      }
    }
  }

  console.log("Invoice buffer size:", pdfBuffer?.length);
  console.log("Itinerary buffer size:", itineraryBuffer?.length);

  // We won't actually send email, just check if buffers are created correctly
  console.log("If we called sendBookingEmail, it would send with these buffers.");
  process.exit(0);
}

testEmail().catch(console.error);
