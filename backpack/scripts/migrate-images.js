import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Import models dynamically or define them here to avoid Next.js specific issues
const TripSchema = new mongoose.Schema({ images: [String] }, { strict: false });
const Trip = mongoose.models.Trip || mongoose.model('Trip', TripSchema);

const DestinationSchema = new mongoose.Schema({ image: String }, { strict: false });
const Destination = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);

const PastExpeditionSchema = new mongoose.Schema({ image: String }, { strict: false });
const PastExpedition = mongoose.models.PastExpedition || mongoose.model('PastExpedition', PastExpeditionSchema);

const GallerySchema = new mongoose.Schema({ url: String }, { strict: false });
const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);

async function uploadToCloudinary(buffer, folder = 'backpack_migration') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

async function migrateUrl(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return url;
  if (url.includes('res.cloudinary.com')) return url; // Already migrated
  
  console.log(`Downloading: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`Uploading to Cloudinary...`);
    const result = await uploadToCloudinary(buffer);
    console.log(`Migrated -> ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`Error migrating ${url}:`, error.message);
    return url; // Return original if failed to avoid losing data
  }
}

async function runMigration() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    // Migrate Trips
    console.log('\n--- Migrating Trips ---');
    const trips = await Trip.find();
    for (const trip of trips) {
      if (trip.images && trip.images.length > 0) {
        let changed = false;
        const newImages = [];
        for (const imgUrl of trip.images) {
          const newUrl = await migrateUrl(imgUrl);
          newImages.push(newUrl);
          if (newUrl !== imgUrl) changed = true;
        }
        if (changed) {
          trip.images = newImages;
          await trip.save();
          console.log(`Saved Trip: ${trip._id}`);
        }
      }
    }

    // Migrate Destinations
    console.log('\n--- Migrating Destinations ---');
    const destinations = await Destination.find();
    for (const dest of destinations) {
      if (dest.image) {
        const newUrl = await migrateUrl(dest.image);
        if (newUrl !== dest.image) {
          dest.image = newUrl;
          await dest.save();
          console.log(`Saved Destination: ${dest._id}`);
        }
      }
    }

    // Migrate Past Expeditions
    console.log('\n--- Migrating Past Expeditions ---');
    const pastExpeditions = await PastExpedition.find();
    for (const exp of pastExpeditions) {
      if (exp.image) {
        const newUrl = await migrateUrl(exp.image);
        if (newUrl !== exp.image) {
          exp.image = newUrl;
          await exp.save();
          console.log(`Saved Past Expedition: ${exp._id}`);
        }
      }
    }
    
    // Migrate Gallery
    console.log('\n--- Migrating Gallery ---');
    const galleryItems = await Gallery.find();
    for (const item of galleryItems) {
      if (item.url) {
        const newUrl = await migrateUrl(item.url);
        if (newUrl !== item.url) {
          item.url = newUrl;
          await item.save();
          console.log(`Saved Gallery Item: ${item._id}`);
        }
      }
    }

    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

runMigration();
