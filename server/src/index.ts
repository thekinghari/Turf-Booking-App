import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer'; // Keep for config test, though actual mail might be separate
import twilio from 'twilio'; // Keep for config test
import notificationRoutes from './routes/notifications';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import bookingsRoutes from './routes/bookings';
import config from './config/config';

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/bookings', bookingsRoutes); // Assuming this was missing and intended

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Export the app for serverless environments
export { app };

// MongoDB Connection and Server Listening (for traditional server start)
// This part will be executed if this file is run directly (e.g. `node dist/index.js`)
// but not when imported by serverless a handler that just needs the `app`.

let MONGODB_URI = config.mongoUri;
if (!MONGODB_URI) {
  console.error('MongoDB URI is not defined. Please set MONGODB_URI environment variable.');
  // process.exit(1); // Don't exit if imported, allow serverless to handle
}

// Function to connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    console.log('MongoDB already connected.');
    return;
  }
  try {
    if (!MONGODB_URI) throw new Error("MONGODB_URI not set, cannot connect.");
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully (from connectDB).');
  } catch (error) {
    console.error('MongoDB connection error (from connectDB):', error);
    // In a serverless context, throwing here might fail the function invocation.
    // Depending on strategy, you might want to handle this differently or let it fail.
    throw error;
  }
};

// Test configuration status (can be called by the serverless handler if needed)
const testConfig = async () => {
  // ... (keep existing testConfig function, ensure it doesn't try to send mail unless truly configured)
  // For brevity, assuming testConfig is defined as before.
  // Ensure it's callable and doesn't rely on app.listen()
  try {
    // Test email configuration
    if (config.emailConfig.host && config.emailConfig.user && config.emailConfig.pass) {
      console.log('Email service is configured');
      // Add more detailed checks if necessary
    } else {
      console.warn('Email service is not configured');
    }

    // Test WhatsApp configuration
    if (config.whatsappConfig.accountSid && config.whatsappConfig.authToken) {
      console.log('WhatsApp service is configured');
      // Add more detailed checks if necessary
    } else {
      console.warn('WhatsApp service is not configured');
    }
  } catch (error) {
    console.error('Configuration test failed:', error);
  }
};


// This block will run if the script is executed directly
if (require.main === module) {
  console.log('Running in standalone mode (not serverless import).');
  (async () => {
    try {
      await connectDB();
      await testConfig(); // Test config when running standalone
      app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
        // ... other console logs from original file
      });
    } catch (error) {
      console.error('Failed to start standalone server:', error);
      process.exit(1);
    }
  })();
} else {
  console.log('Running in import mode (likely serverless). MongoDB connection will be managed by handler or on first request.');
  // Optionally, connect to DB here if you want it to connect as soon as the function is loaded.
  // However, it's often better to connect lazily on the first request in the handler.
}