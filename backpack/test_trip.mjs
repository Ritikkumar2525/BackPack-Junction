import fetch from 'node-fetch';

async function test() {
  const tripData = {
    title: "Test Node Trip",
    destination: "Node Test",
    duration: "5 Days",
    price: 1000,
    totalSeats: 20,
    startDate: "2026-10-15T00:00:00.000Z",
    endDate: "2026-10-20T00:00:00.000Z",
  };
  
  // We can't hit the API without auth. Let's just use Mongoose directly.
  const mongoose = await import('mongoose');
  const dotenv = await import('dotenv');
  dotenv.config({ path: '.env.local' });
  
  await mongoose.connect(process.env.MONGODB_URI);
  
  const { default: Trip } = await import('./src/models/Trip.js');
  
  const trip = await Trip.create(tripData);
  console.log("Created Trip ID:", trip._id);
  console.log("Dates:", trip.startDate, trip.endDate);
  
  // Update it
  const updated = await Trip.findByIdAndUpdate(trip._id, { startDate: "2026-12-01T00:00:00.000Z" }, { new: true });
  console.log("Updated Dates:", updated.startDate, updated.endDate);
  
  // Delete it
  await Trip.findByIdAndDelete(trip._id);
  process.exit(0);
}
test();
