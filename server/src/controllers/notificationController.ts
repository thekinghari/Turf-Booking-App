import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  async sendEmail(req: Request, res: Response) {
    try {
      const { to, subject, text, html } = req.body;
      
      if (!to || !subject || !text) {
        return res.status(400).json({ error: 'to, subject, and text are required' });
      }

      await this.notificationService.sendEmail({
        to,
        subject,
        text,
        html,
      });

      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error in sendEmail:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  }

  async sendWhatsApp(req: Request, res: Response) {
    try {
      const { to, message } = req.body;
      
      if (!to || !message) {
        return res.status(400).json({ error: 'to and message are required' });
      }

      await this.notificationService.sendWhatsApp({
        to,
        message,
      });

      res.status(200).json({ message: 'WhatsApp message sent successfully' });
    } catch (error) {
      console.error('Error in sendWhatsApp:', error);
      res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }
  }
}
