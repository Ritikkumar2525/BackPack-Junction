import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function verify() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: 'junctionbackpack@gmail.com' });
    console.log('User role in DB:', user?.role, typeof user?.role);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

verify();
