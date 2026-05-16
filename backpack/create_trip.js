const fs = require('fs');
async function run() {
  const trip = {
    title: "Node Script Trip",
    destination: "Node",
    duration: "1 Day",
    price: 100,
    startDate: new Date("2026-12-01").toISOString(),
    endDate: new Date("2026-12-05").toISOString(),
    totalSeats: 20,
    availableSeats: 20,
    isPublished: true,
    itineraryPdf: "data:application/pdf;base64,JVBER" // dummy base64
  };
  
  // Need to use the Mongoose model directly since we don't have admin session
  require('dotenv').config({ path: '.env.local' });
  const mongoose = require('mongoose');
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Trip = require('./src/models/Trip').default;
  const newTrip = await Trip.create(trip);
  console.log("Trip created with dates:", newTrip.startDate, newTrip.endDate, newTrip.itineraryPdf);
  process.exit(0);
}
run();
