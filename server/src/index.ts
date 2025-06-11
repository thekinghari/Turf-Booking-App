import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import notificationRoutes from './routes/notifications';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import bookingsRoutes from './routes/bookings';
import config from './config/config';

const app = express();

// Debug: Log configuration
console.log('Starting server with configuration:');
console.log('PORT:', config.port);
console.log('MONGODB_URI:', config.mongoUri);
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

// Test configuration status
const testConfig = async () => {
  try {
    // Test email configuration
    if (config.emailConfig.host && config.emailConfig.user && config.emailConfig.pass) {
      console.log('Email service is configured');
      try {
        const transporter = nodemailer.createTransport({
          host: config.emailConfig.host,
          port: config.emailConfig.port,
          secure: false,
          auth: {
            user: config.emailConfig.user,
            pass: config.emailConfig.pass
          },
          debug: true
        });
        
        // Test sending an email to verify configuration
        // Use SendGrid sandbox template for testing
        const testEmail = {
          from: config.emailConfig.from,
          to: config.emailConfig.from,
          subject: 'Test Email Configuration',
          text: 'This is a test email to verify email configuration',
          templateId: 'd-d41d8cd98f00b204e9800998ecf8427e' // SendGrid sandbox template ID
        };
        
        const info = await transporter.sendMail(testEmail);
        console.log('Email service verified successfully');
        console.log('Test email sent:', info.response);
      } catch (error) {
        console.error('Email service verification failed:', error);
        console.error('Email configuration details:');
        console.error('Host:', config.emailConfig.host);
        console.error('Port:', config.emailConfig.port);
        console.error('From:', config.emailConfig.from);
      }
    } else {
      console.warn('Email service is not configured');
    }

    // Test WhatsApp configuration
    if (config.whatsappConfig.accountSid && config.whatsappConfig.authToken) {
      console.log('WhatsApp service is configured');
      const client = twilio(
        config.whatsappConfig.accountSid,
        config.whatsappConfig.authToken
      );
      await client.api.accounts(config.whatsappConfig.accountSid).fetch();
      console.log('WhatsApp service verified successfully');
    } else {
      console.warn('WhatsApp service is not configured');
    }
  } catch (error) {
    console.error('Configuration test failed:', error);
  }
};

// MongoDB Connection
mongoose.connect(config.mongoUri)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Test configurations
    await testConfig();

    // Start server only after DB connection
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`API URL: http://localhost:${config.port}`);
      console.log('');
      console.log('Available API Endpoints:');
      console.log('- GET /api/notifications/test-config - Check service configurations');
      console.log('- POST /api/notifications/email - Send email notification');
      console.log('- POST /api/notifications/whatsapp - Send WhatsApp notification');
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
}); 