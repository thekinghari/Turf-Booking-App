import nodemailer from 'nodemailer';
import twilio from 'twilio';
import config from '../config/config';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

interface WhatsAppOptions {
  to: string;
  message: string;
}

export class NotificationService {
  private transporter: nodemailer.Transporter | null = null;
  private client: twilio.Twilio | null = null;

  constructor() {
    // Initialize email transporter with SendGrid
    this.transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY || ''
      }
    });

    // Initialize Twilio client only if configured
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    } else {
      console.warn('WhatsApp service is not configured');
    }
  }

  async initialize(): Promise<void> {
    // Test email connection
    if (this.transporter) {
      try {
        await this.transporter.verify();
        console.log('Email service verified successfully');
      } catch (error) {
        console.error('Email service verification failed:', error);
      }
    } else {
      console.error('Email service is not initialized');
    }

    // Test WhatsApp connection if configured
    if (this.client && process.env.TWILIO_WHATSAPP_NUMBER) {
      try {
        const message = await this.client.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          body: 'WhatsApp service test message'
        });
        console.log('WhatsApp service verified successfully');
      } catch (error) {
        console.error('WhatsApp service verification failed:', error);
      }
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    if (!this.transporter) {
      console.error('Email service is not initialized');
      throw new Error('Email service is not configured');
    }

    try {
      const fromEmail = process.env.SMTP_FROM || 'noreply@turfbook.com';
      
      await this.transporter.sendMail({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      });
      console.log('Email sent successfully to:', options.to);
    } catch (error) {
      console.error('Failed to send email:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        config: {
          host: 'smtp.sendgrid.net',
          port: 587,
          from: process.env.SMTP_FROM || 'noreply@turfbook.com'
        }
      });
      throw error;
    }
  }

  async sendWhatsApp(options: WhatsAppOptions): Promise<void> {
    if (!this.client) {
      throw new Error('WhatsApp service is not configured');
    }

    try {
      const message = await this.client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${options.to}`,
        body: options.message,
      });
      console.log(`WhatsApp message sent to ${options.to}`);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }
}
