import mongoose from 'mongoose';
import config from './config/config';

let isConnected: boolean = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('MongoDB is already connected.');
    return;
  }
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    isConnected = true;
    console.log('MongoDB connected successfully.');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB runtime error:', err);
      isConnected = false; // Reset connection status on error
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected.');
      isConnected = false;
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    // In a serverless function, throwing an error might be better than process.exit
    throw new Error('Failed to connect to MongoDB during initialization.');
  }
};
