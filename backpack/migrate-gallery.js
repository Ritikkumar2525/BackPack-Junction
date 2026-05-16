import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const unsplashUrls = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
  "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=600&q=80",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
  "https://images.unsplash.com/photo-1580289437401-1a5b5be2dbe0?w=600&q=80",
  "https://images.unsplash.com/photo-1597074866923-dc0589150a53?w=600&q=80",
];

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  // Upload unsplash images to cloudinary to reuse them
  console.log("Uploading unsplash placeholder images to Cloudinary...");
  const cloudinaryUrls = [];
  for (const url of unsplashUrls) {
    try {
      const result = await cloudinary.uploader.upload(url, { folder: 'backpack_gallery' });
      cloudinaryUrls.push(result.secure_url);
      console.log(`Uploaded: ${result.secure_url}`);
    } catch (e) {
      console.error(`Failed to upload ${url}`, e);
    }
  }

  const collections = ['destinations', 'trips', 'pastexpeditions', 'stories'];
  
  for (const collName of collections) {
    const coll = mongoose.connection.db.collection(collName);
    const docs = await coll.find({}).toArray();
    console.log(`Found ${docs.length} documents in ${collName}`);
    
    let updated = 0;
    for (const doc of docs) {
      let docGallery = doc.gallery || [];
      if (docGallery.length === 0 && cloudinaryUrls.length > 0) {
        // Assign the newly uploaded cloudinary URLs
        await coll.updateOne(
          { _id: doc._id },
          { $set: { gallery: cloudinaryUrls } }
        );
        updated++;
      }
    }
    console.log(`Updated ${updated} documents in ${collName} with default gallery`);
  }

  // Migrate existing Gallery documents
  const galleries = await mongoose.connection.db.collection('galleries').find({}).toArray();
  console.log(`Found ${galleries.length} items in Gallery collection.`);
  
  for (const g of galleries) {
    if (g.url && g.destination) {
      // Find destination with this name
      const destColl = mongoose.connection.db.collection('destinations');
      const dest = await destColl.findOne({ name: { $regex: new RegExp(`^${g.destination}$`, 'i') } });
      if (dest) {
        const destGallery = dest.gallery || [];
        if (!destGallery.includes(g.url)) {
          await destColl.updateOne({ _id: dest._id }, { $push: { gallery: g.url } });
          console.log(`Migrated gallery image to Destination: ${dest.name}`);
        }
      }
    }
  }

  console.log("Migration complete.");
  process.exit(0);
}

migrate();
