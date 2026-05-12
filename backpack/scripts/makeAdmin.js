import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const userSchema = new mongoose.Schema({
  role: String,
  email: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Specifically target junctionbackpack@gmail.com
    const result = await User.updateOne(
      { email: 'junctionbackpack@gmail.com' }, 
      { $set: { role: 'admin' } }
    );
    
    console.log(`Updated ${result.modifiedCount} account(s) to Admin role!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

makeAdmin();
