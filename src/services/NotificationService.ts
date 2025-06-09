interface Notification {
  userId: string;
  type: 'system' | 'booking' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt?: Date;
}

class NotificationService {
  private notifications: Notification[] = [];

  async sendNotification(notification: Notification): Promise<void> {
    // In a real application, this would send the notification to a backend service
    // For now, we'll just store it locally
    this.notifications.push({
      ...notification,
      createdAt: new Date(),
    });

    // If the user has enabled push notifications, we would send a push notification here
    if (notification.type === 'system') {
      console.log('System notification:', notification);
    }
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notifications.filter(n => n.userId === userId);
  }

  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.userId === notificationId);
    if (notification) {
      notification.read = true;
    }
  }
}

export const notificationService = new NotificationService(); 