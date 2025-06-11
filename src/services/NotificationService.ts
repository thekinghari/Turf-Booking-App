import { Notification, Booking } from '../types';

class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private apiBaseUrl: string;

  private constructor() {
    // Use the correct API URL
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async sendProfileUpdateNotification(userId: string, userEmail: string, userPhone: string): Promise<void> {
    try {
      // Send email notification
      await this.sendEmailNotification({
        to: userEmail,
        subject: 'Profile Updated - TurfBook',
        template: 'profile-update',
        data: {
          userId,
          timestamp: new Date().toISOString()
        }
      });
      
      // Send WhatsApp notification if phone number is provided
      if (userPhone) {
        await this.sendWhatsAppNotification({
          to: userPhone,
          template: 'profile-update',
          data: {
            userId,
            timestamp: new Date().toISOString()
          }
        });
      }
      
      // Store notification in local state
      this.notifications.push({
        id: Math.random().toString(36).substr(2, 9),
        userId,
        type: 'system',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated.',
        read: false,
        createdAt: new Date().toISOString(),
        metadata: {
          actionUrl: '/profile'
        }
      });
    } catch (error) {
      console.error('Error sending profile update notifications:', error);
      throw error;
    }
  }

  async sendBookingConfirmation(booking: Booking, userEmail: string, userPhone: string): Promise<void> {
    try {
      // Send email notification
      await this.sendEmailNotification({
        to: userEmail,
        subject: 'Booking Confirmation - TurfBook',
        template: 'booking-confirmation',
        data: {
          bookingId: booking.id,
          turfName: booking.turfName,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          totalPrice: booking.totalPrice,
          bookingUrl: `/bookings/${booking.id}`
        }
      });
      
      // Send WhatsApp notification
      if (userPhone) {
        await this.sendWhatsAppNotification({
          to: userPhone,
          template: 'booking-confirmation',
          data: {
            bookingId: booking.id,
            turfName: booking.turfName,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            totalPrice: booking.totalPrice
          }
        });
      }
      
      // Store notification in local state
      this.notifications.push({
        id: Math.random().toString(36).substr(2, 9),
        userId: booking.userId,
        type: 'booking',
        title: 'Booking Confirmed',
        message: `Your booking for ${booking.turfName} on ${booking.date} at ${booking.startTime} has been confirmed.`,
        read: false,
        createdAt: new Date().toISOString(),
        metadata: {
          bookingId: booking.id,
          turfId: booking.turfId,
          actionUrl: `/bookings/${booking.id}`
        }
      });
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw error;
    }
  }

  private async sendEmailNotification(data: {
    to: string;
    subject: string;
    template: string;
    data: any;
  }): Promise<void> {
    try {
      console.log('Sending email notification to:', data.to);
      console.log('API URL:', `${this.apiBaseUrl}/notifications/email`);

      const response = await fetch(`${this.apiBaseUrl}/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include' // Include cookies if needed
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send email notification');
      }

      const result = await response.json();
      console.log('Email notification sent successfully:', result);
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  }

  private async sendWhatsAppNotification(data: {
    to: string;
    template: string;
    data: any;
  }): Promise<void> {
    try {
      console.log('Sending WhatsApp notification to:', data.to);
      console.log('API URL:', `${this.apiBaseUrl}/notifications/whatsapp`);

      const response = await fetch(`${this.apiBaseUrl}/notifications/whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include' // Include cookies if needed
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send WhatsApp notification');
      }

      const result = await response.json();
      console.log('WhatsApp notification sent successfully:', result);
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
      throw error;
    }
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notifications.filter(n => n.userId === userId);
  }

  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }
}

export const notificationService = NotificationService.getInstance(); 