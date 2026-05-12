import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  role: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find({});
  console.log(users.map(u => ({ email: u.email, role: u.role })));
  
  // Fix roles
  for (let u of users) {
    if (u.email === 'junctionbackpack@gmail.com') {
      u.role = 'admin';
    } else {
      u.role = 'user';
    }
    await u.save();
  }
  console.log("Roles fixed.");
  process.exit(0);
}
check();
