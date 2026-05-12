import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const stories = await db.collection('stories').find({}).toArray();
  console.log("Total stories:", stories.length);
  for (let s of stories) {
    console.log(`- ID: ${s._id}, Title: ${s.title}, Status: ${s.status}`);
  }
  process.exit(0);
}
check();
