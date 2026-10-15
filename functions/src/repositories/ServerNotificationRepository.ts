import { adminDb } from '../config/firebase';
import { ServerNotificationDocument, NotificationDispatchPayload } from '../types/notification';
import { logger } from '../utils/logger';

export class ServerNotificationRepository {
  private collectionName = 'notifications';

  private get collection() {
    return adminDb.collection(this.collectionName);
  }

  async createNotification(payload: NotificationDispatchPayload): Promise<ServerNotificationDocument | null> {
    try {
      const now = new Date().toISOString();
      const docRef = this.collection.doc();
      const notification: ServerNotificationDocument = {
        id: docRef.id,
        userId: payload.userId,
        title: payload.title,
        message: payload.message,
        type: payload.type,
        link: payload.link,
        read: false,
        metadata: payload.metadata,
        createdAt: now,
      };

      await docRef.set(notification);
      return notification;
    } catch (error) {
      logger.error('ServerNotificationRepository.createNotification error', error, {
        userId: payload.userId,
        type: payload.type,
      });
      return null;
    }
  }

  async createBatchNotifications(payloads: NotificationDispatchPayload[]): Promise<number> {
    if (!payloads.length) return 0;
    try {
      const batch = adminDb.batch();
      const now = new Date().toISOString();
      let count = 0;

      for (const payload of payloads) {
        const docRef = this.collection.doc();
        const notification: ServerNotificationDocument = {
          id: docRef.id,
          userId: payload.userId,
          title: payload.title,
          message: payload.message,
          type: payload.type,
          link: payload.link,
          read: false,
          metadata: payload.metadata,
          createdAt: now,
        };
        batch.set(docRef, notification);
        count++;
        // Firestore batch limit is 500
        if (count >= 450) break;
      }

      await batch.commit();
      return count;
    } catch (error) {
      logger.error('ServerNotificationRepository.createBatchNotifications error', error);
      return 0;
    }
  }
}

export const serverNotificationRepository = new ServerNotificationRepository();
