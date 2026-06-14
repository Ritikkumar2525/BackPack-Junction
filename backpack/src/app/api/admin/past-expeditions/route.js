import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import PastExpedition from '@/models/PastExpedition';
import Trip from '@/models/Trip';
import Booking from '@/models/Booking';

const SEED_EXPEDITIONS = [
  { 
    title: "Valley of Flowers Trek", destination: "Uttarakhand", date: "Sep 2025", travelers: 18, rating: 4.9, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    duration: "6 Days", difficulty: "Moderate", distance: "38 km",
    description: "A magical trek through the UNESCO World Heritage site, blooming with rare alpine flora set against the backdrop of snow-capped Himalayan peaks.",
    highlights: ["Valley of Flowers National Park", "Hemkund Sahib Gurudwara", "Ghangaria Village base camp", "Rare Himalayan flora and fauna"],
    route: ["Haridwar", "Govindghat", "Ghangaria", "Valley of Flowers", "Hemkund Sahib"],
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa"
    ],
    timeline: [
      { day: 1, title: "Arrival at Govindghat", description: "Journey alongside the Alaknanda river, acclimatizing to the altitude." },
      { day: 2, title: "Trek to Ghangaria", description: "A steep 14km climb through dense forests and waterfalls." },
      { day: 3, title: "The Valley Blooms", description: "Entering the actual valley. A riot of colors and surreal landscapes." }
    ],
    testimonials: [
      { name: "Aarav Sharma", rating: 5, review: "Absolutely breathtaking! The arrangements were top notch.", image: "https://i.pravatar.cc/150?u=1" },
      { name: "Priya Patel", rating: 4.8, review: "A tough climb but the view was worth every step.", image: "https://i.pravatar.cc/150?u=2" }
    ]
  },
  { 
    title: "Chadar Frozen River", destination: "Ladakh", date: "Jan 2026", travelers: 12, rating: 5.0, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    duration: "9 Days", difficulty: "Difficult", distance: "65 km",
    description: "One of India's most thrilling winter treks. Walking over the frozen Zanskar river in sub-zero temperatures.",
    highlights: ["Walking on frozen river", "Camping in sub-zero caves", "Tibetan culture", "Frozen waterfalls"],
    route: ["Leh", "Shingra Koma", "Tibb Cave", "Naerak"],
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
    ],
    timeline: [
      { day: 1, title: "Acclimatization in Leh", description: "Resting and preparing for the sub-zero trek ahead." },
      { day: 2, title: "Drive to Shingra Koma", description: "First steps on the icy Chadar." }
    ],
    testimonials: [
      { name: "Vikram Singh", rating: 5, review: "A true test of endurance. Backpack Junction made it incredibly safe.", image: "https://i.pravatar.cc/150?u=3" }
    ]
  },
  { 
    title: "Banaras Spiritual Walk", destination: "Banaras", date: "Dec 2025", travelers: 22, rating: 4.8, image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80",
    duration: "3 Days", difficulty: "Easy", distance: "15 km",
    description: "Immerse in the ancient spiritual aura of Kashi, witnessing the grand Ganga Aarti and exploring hidden alleyways.",
    highlights: ["Ganga Aarti at Dashashwamedh Ghat", "Boat ride at sunrise", "Kashi Vishwanath Temple", "Local street food"],
    route: ["Varanasi City", "Assi Ghat", "Sarnath"],
    gallery: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc",
      "https://images.unsplash.com/photo-1627894483216-2138af692e32"
    ],
    timeline: [
      { day: 1, title: "Arrival & Evening Aarti", description: "Experience the mesmerizing Ganga Aarti." }
    ],
    testimonials: [
      { name: "Neha Gupta", rating: 4.5, review: "Very peaceful and well-organized spiritual journey.", image: "https://i.pravatar.cc/150?u=4" }
    ]
  },
  { title: "Hampta Pass Crossing", destination: "Himachal", date: "Oct 2025", travelers: 15, rating: 4.9, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80", duration: "5 Days", difficulty: "Moderate", description: "A dramatic crossover from the lush Kullu valley to the barren landscapes of Spiti." },
  { title: "Tungnath Winter Trek", destination: "Uttarakhand", date: "Nov 2025", travelers: 20, rating: 4.7, image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=600&q=80", duration: "4 Days", difficulty: "Easy-Moderate", description: "Trek to the highest Shiva temple in the world covered in pristine white snow." },
  { title: "Kashmir Houseboat Experience", destination: "Kashmir", date: "Mar 2026", travelers: 16, rating: 5.0, image: "https://images.unsplash.com/photo-1597074866923-dc0589150a53?w=600&q=80", duration: "5 Days", difficulty: "Easy", description: "Relaxing stay on traditional houseboats with Shikara rides and valley tours." },
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
