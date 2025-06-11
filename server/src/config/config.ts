import dotenv from 'dotenv';

// Load both frontend and server .env files
const envFiles = [
  '.env', // Server .env
  '../.env' // Frontend .env
];

envFiles.forEach(file => {
  try {
    dotenv.config({ path: file });
  } catch (error) {
    console.warn(`Could not load ${file}:`, error);
  }
});

interface Config {
  port: number;
  mongoUri: string;
  corsOrigin: string;
  emailConfig: {
    host: string;
    port: number;
    user: string; // Expected to be 'apikey' for SendGrid
    apiKey: string; // SendGrid API Key
    fromEmail: string; // Sender's email address
  };
  whatsappConfig: {
    accountSid: string;
    authToken: string;
    whatsappFrom: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3003'),
  mongoUri: process.env.MONGODB_URI || process.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/turf-booking',
  corsOrigin: process.env.CORS_ORIGIN || process.env.VITE_CORS_ORIGIN || 'http://localhost:5173',
  emailConfig: {
    host: process.env.SMTP_HOST || process.env.VITE_SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || process.env.VITE_SMTP_PORT || '587'),
    user: process.env.SMTP_USER || process.env.VITE_SMTP_USER || 'apikey', // Default to 'apikey' for SendGrid
    apiKey: process.env.SENDGRID_API_KEY || process.env.VITE_SENDGRID_API_KEY || '',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || process.env.VITE_SENDGRID_FROM_EMAIL || ''
  },
  whatsappConfig: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || process.env.VITE_TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || process.env.VITE_TWILIO_AUTH_TOKEN || '',
    whatsappFrom: process.env.TWILIO_WHATSAPP_FROM || process.env.VITE_TWILIO_WHATSAPP_FROM || ''
  }
};

// Validate required configurations
const validateConfig = () => {
  const missing: string[] = [];

  // Check required configurations
  if (!config.mongoUri) missing.push('MONGODB_URI');
  if (!config.emailConfig.host) missing.push('SMTP_HOST');
  if (!config.emailConfig.port) missing.push('SMTP_PORT');
  if (!config.emailConfig.user) missing.push('SMTP_USER'); // nodemailer still uses this
  if (!config.emailConfig.apiKey) missing.push('SENDGRID_API_KEY');
  if (!config.emailConfig.fromEmail) missing.push('SENDGRID_FROM_EMAIL');
  if (!config.whatsappConfig.accountSid) missing.push('TWILIO_ACCOUNT_SID');
  if (!config.whatsappConfig.authToken) missing.push('TWILIO_AUTH_TOKEN');
  if (!config.whatsappConfig.whatsappFrom) missing.push('TWILIO_WHATSAPP_FROM');

  if (missing.length > 0) {
    console.warn('Missing configuration variables:', missing);
    console.warn('Services may not work properly.');
  }
};

validateConfig();

export default config;
