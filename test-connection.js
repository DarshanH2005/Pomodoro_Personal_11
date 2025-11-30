const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://darshan1970h:darshan1970h@cluster0-shard-00-00.ujsji9c.mongodb.net:27017,cluster0-shard-00-01.ujsji9c.mongodb.net:27017,cluster0-shard-00-02.ujsji9c.mongodb.net:27017/?ssl=true&authSource=admin&retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4,
    });
    console.log('✅ MongoDB connected successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
