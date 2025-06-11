import { NotificationService } from '../services/notificationService';
import config from '../config/config'; // Actual config
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');

const mockSendMail = jest.fn();
const mockVerify = jest.fn();

(nodemailer.createTransport as jest.Mock).mockReturnValue({
  sendMail: mockSendMail,
  verify: mockVerify,
  options: { // Mock options similar to how NotificationService accesses them
    host: config.emailConfig.host,
    port: config.emailConfig.port,
    auth: {
      user: config.emailConfig.user,
    }
  }
});

// Mock parts of the config to control it for tests
jest.mock('../config/config', () => ({
  __esModule: true,
  default: {
    emailConfig: {
      host: 'smtp.test.com',
      port: 587,
      user: 'apikey', // As expected by SendGrid
      apiKey: 'test_sendgrid_api_key',
      fromEmail: 'test@example.com',
    },
    // Keep other configs like mongoUri, port if NotificationService or its imports need them
    // For this test, primarily emailConfig is crucial
  },
}));


describe('NotificationService', () => {
  let notificationService: NotificationService;

  beforeEach(() => {
    // Reset mocks before each test
    mockSendMail.mockReset();
    mockVerify.mockReset();
    notificationService = new NotificationService();
  });

  describe('constructor', () => {
    it('should create a nodemailer transporter with config values', () => {
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: config.emailConfig.host,
        port: config.emailConfig.port,
        secure: false, // As SendGrid typically uses explicit TLS on 587
        auth: {
          user: config.emailConfig.user, // Should be 'apikey'
          pass: config.emailConfig.apiKey,
        },
      });
    });
  });

  describe('sendEmail', () => {
    const emailOptions = {
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>',
    };

    it('should call sendMail with correct parameters', async () => {
      mockSendMail.mockResolvedValueOnce({ messageId: 'test-message-id' }); // Simulate successful send

      await notificationService.sendEmail(emailOptions);

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: config.emailConfig.fromEmail,
        to: emailOptions.to,
        subject: emailOptions.subject,
        text: emailOptions.text,
        html: emailOptions.html,
      });
    });

    it('should log success when email is sent', async () => {
      mockSendMail.mockResolvedValueOnce({ messageId: 'test-message-id' });
      const consoleSpy = jest.spyOn(console, 'log');

      await notificationService.sendEmail(emailOptions);

      expect(consoleSpy).toHaveBeenCalledWith('Email sent successfully to:', emailOptions.to);
      consoleSpy.mockRestore();
    });

    it('should throw error and log details if sendMail fails', async () => {
      const error = new Error('SMTP Error');
      mockSendMail.mockRejectedValueOnce(error);
      const consoleErrorSpy = jest.spyOn(console, 'error');

      await expect(notificationService.sendEmail(emailOptions)).rejects.toThrow('SMTP Error');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to send email:',
        expect.objectContaining({
          recipient: emailOptions.to,
          subject: emailOptions.subject,
          message: 'SMTP Error',
          smtpConfig: expect.objectContaining({
              host: config.emailConfig.host,
              port: config.emailConfig.port,
              user: config.emailConfig.user,
              from: config.emailConfig.fromEmail
          })
        })
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe('initialize', () => {
    it('should call transporter.verify and log success if verification works', async () => {
      mockVerify.mockResolvedValueOnce(true);
      const consoleSpy = jest.spyOn(console, 'log');

      // Re-initialize for this test if transporter is null initially
      // Or ensure constructor sets it up for verify to be called
      if (!(notificationService as any).transporter) {
         (notificationService as any).transporter = (nodemailer.createTransport as jest.Mock)();
      }
      await notificationService.initialize();

      expect(mockVerify).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Email service verified successfully');
      consoleSpy.mockRestore();
    });

    it('should log error if transporter.verify fails', async () => {
      const error = new Error('Verification failed');
      mockVerify.mockRejectedValueOnce(error);
      const consoleErrorSpy = jest.spyOn(console, 'error');

      if (!(notificationService as any).transporter) {
         (notificationService as any).transporter = (nodemailer.createTransport as jest.Mock)();
      }
      await notificationService.initialize();

      expect(mockVerify).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Email service verification failed:', error);
      consoleErrorSpy.mockRestore();
    });

    it('should log error if transporter is not initialized', async () => {
        (notificationService as any).transporter = null; // Force transporter to be null
        const consoleErrorSpy = jest.spyOn(console, 'error');

        await notificationService.initialize();

        expect(consoleErrorSpy).toHaveBeenCalledWith('Email service is not initialized');
        consoleErrorSpy.mockRestore();
    });
  });
});
