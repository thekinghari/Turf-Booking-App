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
  private emailTransporter: nodemailer.Transporter | null = null;
  private twilioClient: twilio.Twilio | null = null;

  constructor() {
    // Initialize email transporter if credentials are available
    if (config.emailConfig.host && config.emailConfig.user && config.emailConfig.pass) {
      this.emailTransporter = nodemailer.createTransport({
        host: config.emailConfig.host,
        port: config.emailConfig.port,
        secure: false,
        auth: {
          user: config.emailConfig.user,
          pass: config.emailConfig.pass
        }
      });
    }

    // Initialize Twilio client if credentials are available
    if (config.whatsappConfig.accountSid && config.whatsappConfig.authToken) {
      this.twilioClient = twilio(
        config.whatsappConfig.accountSid,
        config.whatsappConfig.authToken
      );
    }
  }

  async initialize(): Promise<void> {
    // Test email connection
    if (this.emailTransporter) {
      try {
        await this.emailTransporter.verify();
        console.log('Email service verified successfully');
      } catch (error) {
        console.error('Email service verification failed:', error);
      }
    } else {
      console.error('Email service is not initialized');
    }

    // Test WhatsApp connection if configured
    if (this.twilioClient && process.env.TWILIO_WHATSAPP_NUMBER) {
      try {
        const message = await this.twilioClient.messages.create({
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

  async sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string }) {
    if (!this.emailTransporter) {
      console.warn('Email service not configured');
      return;
    }

    try {
      const info = await this.emailTransporter.sendMail({
        from: config.emailConfig.from,
        to,
        subject,
        text,
        html
      });
      console.log('Email sent:', info.response);
      return info;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendWhatsApp({ to, message }: { to: string; message: string }) {
    if (!this.twilioClient) {
      console.warn('WhatsApp service not configured');
      return;
    }

    try {
      const twilioMessage = await this.twilioClient.messages.create({
        from: `whatsapp:${config.whatsappConfig.whatsappFrom}`,
        to: `whatsapp:${to}`,
        body: message
      });
      console.log('WhatsApp message sent:', twilioMessage.sid);
      return twilioMessage;
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      throw error;
    }
  }
}
