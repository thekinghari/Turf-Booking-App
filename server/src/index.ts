import express from 'express';
import cors from 'cors';
// import mongoose from 'mongoose'; // mongoose is used in db.ts
import serverless from 'serverless-http';
import notificationRoutes from './routes/notifications';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import bookingsRoutes from './routes/bookings';
import config from './config/config';
import { connectDB } from './db'; // Import connectDB

const app = express();

// Debug: Log configuration
console.log('Initializing Express app for serverless environment...');
console.log('CORS_ORIGIN:', config.corsOrigin);

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
app.use('/api/bookings', bookingsRoutes);

// Comment out MongoDB Connection and server start
/*
// Original mongoose.connect and app.listen are removed/commented.
// testConfig() call at startup is also removed/commented.
mongoose.connect(config.mongoUri)
  .then(async () => {
    console.log('MongoDB connected');
    // await testConfig(); // testConfig might also need adjustment
    // app.listen(config.port, () => { ... }); // Remove app.listen
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // This will also need to be handled differently
  });
*/

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const serverlessApp = serverless(app);

export const handler = async (event: any, context: any) => {
  // Ensure context.callbackWaitsForEmptyEventLoop is false for long-running connections if needed,
  // though for DB connection pooling, mongoose handles this.
  // context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectDB(); // Ensure DB is connected on each invocation (if not already)
    return await serverlessApp(event, context);
  } catch (error) {
    console.error('Error in handler execution:', error);
    // Return a generic error response
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error during handler execution.' }),
    };
  }
};