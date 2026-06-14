import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/backpack";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    const isAtlas = MONGODB_URI.includes('mongodb+srv') || MONGODB_URI.includes('mongodb.net');
    console.log(`Connecting to MongoDB (${isAtlas ? 'Atlas' : 'Local'})...`);

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log(`Successfully connected to MongoDB (${isAtlas ? 'Atlas' : 'Local'})!`);
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Failed to connect to MongoDB:", e.message);
    throw e;
  }

  return cached.conn;
}

// Graceful shutdown handling
if (typeof process !== 'undefined') {
  const gracefulShutdown = async (signal) => {
    try {
      await mongoose.connection.close();
      console.log(`MongoDB connection closed through ${signal}`);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

// Connection event listeners for monitoring
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting reconnect...');
  cached.conn = null;
  cached.promise = null;
});

export default connectDB;
