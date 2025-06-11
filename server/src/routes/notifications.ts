import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { NotificationController } from '../controllers/notificationController';

const router = express.Router();
const notificationController = new NotificationController();

// Email notification route
router.post('/email', async (req: Request, res: Response) => {
  await notificationController.sendEmail(req, res);
});

// WhatsApp notification route
router.post('/whatsapp', async (req: Request, res: Response) => {
  await notificationController.sendWhatsApp(req, res);
});

// Test configuration route
router.get('/test-config', async (req: Request, res: Response) => {
  try {
    // Test email configuration
    if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.verify();
        console.log('Email service is working');
      } catch (error) {
        console.error('Email service test failed:', error);
        return res.status(500).json({ error: 'Email service test failed' });
      }
    }

    // Test WhatsApp configuration
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
      try {
        const client = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );

        // Try to fetch account details to verify connection
        await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
        console.log('WhatsApp service is working');
      } catch (error) {
        console.error('WhatsApp service test failed:', error);
        return res.status(500).json({ error: 'WhatsApp service test failed' });
      }
    }
  } catch (error) {
    console.error('Configuration test error:', error);
    res.status(500).json({ 
      message: 'Failed to test configuration',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 