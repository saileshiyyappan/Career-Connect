import { FirestoreNotificationDocument } from '../types';
import { notificationRepository } from '../repositories/NotificationRepository';

export interface INotificationService {
  getUserNotifications(userId: string): Promise<FirestoreNotificationDocument[]>;
  sendNotification(
    notification: Omit<FirestoreNotificationDocument, 'id' | 'createdAt' | 'read'>
  ): Promise<FirestoreNotificationDocument>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}

export class NotificationService implements INotificationService {
  async getUserNotifications(userId: string): Promise<FirestoreNotificationDocument[]> {
    return notificationRepository.findByUserId(userId);
  }

  async sendNotification(
    notification: Omit<FirestoreNotificationDocument, 'id' | 'createdAt' | 'read'>
  ): Promise<FirestoreNotificationDocument> {
    return notificationRepository.create({
      ...notification,
      read: false,
    });
  }

  async markAsRead(notificationId: string): Promise<void> {
    return notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    return notificationRepository.markAllAsRead(userId);
  }
}

export const notificationService = new NotificationService();
