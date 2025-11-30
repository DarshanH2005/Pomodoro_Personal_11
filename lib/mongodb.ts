import * as mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://darshan1970h:darshan1970h@cluster0-shard-00-00.ujsji9c.mongodb.net:27017,cluster0-shard-00-01.ujsji9c.mongodb.net:27017,cluster0-shard-00-02.ujsji9c.mongodb.net:27017/?ssl=true&authSource=admin&retryWrites=true&w=majority';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: any = {
      bufferCommands: false, // Disable buffering to fail fast if not connected
      serverSelectionTimeoutMS: 5000,
      family: 4, // Force IPv4 to resolve ENOTFOUND on SRV records
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection failed:', e);
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;