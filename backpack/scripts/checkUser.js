import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function setupAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const email = 'junctionbackpack@gmail.com';
    const rawPassword = 'backpack@501';
    
    // First delete any existing account with this email to be absolutely sure
    await User.deleteMany({ email });
    console.log(`Cleared existing accounts for ${email}`);
    
    // Create exactly as requested
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    
    await User.create({
      name: 'Admin',
      email: email,
      phone: '+91 0000000000',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log(`SUCCESS! Created admin account for ${email} with password ${rawPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

setupAdmin();
