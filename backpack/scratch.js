import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");
  const db = mongoose.connection.db;
  const galleries = await db.collection('galleries').find({}).toArray();
  console.log("Galleries count:", galleries.length);
  if (galleries.length > 0) console.log(galleries[0]);
  process.exit(0);
}
check();
