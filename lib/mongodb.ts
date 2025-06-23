import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://darshan1970h:EDrGPqeUeuc1efII@cluster0.ujsji9c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached: any = null;

async function connectToDatabase() {
  if (cached) {
    return cached;
  }

  try {
    // Use mongoose.default.connect to be consistent with model creation
    const connection = await mongoose.default.connect(MONGODB_URI, {
      bufferCommands: true,
    });
    cached = connection;
    console.log('✅ MongoDB connected successfully');
    return cached;
  } catch (e) {
    console.error('❌ MongoDB connection failed:', e);
    cached = null;
    throw e;
  }
}

export default connectToDatabase;