import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PastExpedition from '@/models/PastExpedition';
import Trip from '@/models/Trip';
import Booking from '@/models/Booking';

// Hardcoded past expeditions that should be seeded
const SEED_EXPEDITIONS = [
  { title: "Valley of Flowers Trek", destination: "Uttarakhand", date: "Sep 2025", travelers: 18, rating: 4.9, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
  { title: "Chadar Frozen River", destination: "Ladakh", date: "Jan 2026", travelers: 12, rating: 5.0, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80" },
  { title: "Banaras Spiritual Walk", destination: "Banaras", date: "Dec 2025", travelers: 22, rating: 4.8, image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80" },
  { title: "Hampta Pass Crossing", destination: "Himachal", date: "Oct 2025", travelers: 15, rating: 4.9, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80" },
  { title: "Tungnath Winter Trek", destination: "Uttarakhand", date: "Nov 2025", travelers: 20, rating: 4.7, image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=600&q=80" },
  { title: "Kashmir Houseboat Experience", destination: "Kashmir", date: "Mar 2026", travelers: 16, rating: 5.0, image: "https://images.unsplash.com/photo-1597074866923-dc0589150a53?w=600&q=80" },
];

// Auto-migrate completed trips to Past Expeditions
async function autoMigrateCompletedTrips() {
  try {
    // Find all published trips whose endDate has passed
    const completedTrips = await Trip.find({
      endDate: { $lt: new Date() },
      isPublished: true,
    }).lean();

    for (const trip of completedTrips) {
      // Check if this trip has already been migrated
      const alreadyMigrated = await PastExpedition.findOne({ tripId: trip._id });
      if (alreadyMigrated) continue;

      // Count confirmed travelers for this trip
      const bookings = await Booking.find({ 
        tripId: trip._id, 
        bookingStatus: { $in: ["Confirmed"] }
      });
      const totalTravelers = bookings.reduce((sum, b) => sum + (b.travellers?.length || 0), 0);

      // Format date
      const endDate = new Date(trip.endDate);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const dateStr = `${monthNames[endDate.getMonth()]} ${endDate.getFullYear()}`;

      // Create Past Expedition entry
      await PastExpedition.create({
        title: trip.title,
        destination: trip.destination || "India",
        date: dateStr,
        travelers: totalTravelers || 0,
        rating: 5.0, // Default rating, admin can update later
        image: trip.images?.[0] || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
        tripId: trip._id,
      });

      // Unpublish the trip so it doesn't show in upcoming
      await Trip.findByIdAndUpdate(trip._id, { isPublished: false });
    }
  } catch (error) {
    console.error("Auto-migration error:", error);
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const seed = searchParams.get("seed");

    // Auto-seed if database is empty
    const count = await PastExpedition.countDocuments();
    if (count === 0 || seed === "true") {
      for (const exp of SEED_EXPEDITIONS) {
        const exists = await PastExpedition.findOne({ title: exp.title });
        if (!exists) {
          await PastExpedition.create(exp);
        }
      }
    }

    // Auto-migrate completed trips
    await autoMigrateCompletedTrips();

    const expeditions = await PastExpedition.find().sort({ createdAt: -1 });
    return NextResponse.json(expeditions);
  } catch (error) {
    console.error("Error fetching past expeditions:", error);
    return NextResponse.json({ error: "Failed to fetch expeditions" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const newExpedition = await PastExpedition.create(data);
    return NextResponse.json(newExpedition, { status: 201 });
  } catch (error) {
    console.error("Error creating past expedition:", error);
    return NextResponse.json({ error: "Failed to create expedition" }, { status: 500 });
  }
}
