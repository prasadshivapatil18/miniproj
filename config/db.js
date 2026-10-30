const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (!uri) {
      console.log('No MONGO_URI provided in environment. Initializing MongoMemoryServer...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log(`InMemory MongoDB started at: ${uri}`);

      // Seed initial demo data automatically when starting in-memory DB
      await mongoose.connect(uri);
      console.log('MongoDB connected (in-memory)');
      
      const User = require('../models/User');
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('Seeding demo users and initial data...');
        try {
          const { seedDemoData } = require('../seed');
          if (seedDemoData) {
            await seedDemoData();
          }
        } catch (seedErr) {
          console.warn('Auto-seed notice:', seedErr.message);
        }
      }
      return;
    }

    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

