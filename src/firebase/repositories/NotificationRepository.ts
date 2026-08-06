import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db } from '../config/firestore';
import { FirestoreNotificationDocument } from '../types';

export interface INotificationRepository {
  findByUserId(userId: string): Promise<FirestoreNotificationDocument[]>;
  create(notification: Omit<FirestoreNotificationDocument, 'id' | 'createdAt'>): Promise<FirestoreNotificationDocument>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  delete(id: string): Promise<void>;
}

export class NotificationRepository implements INotificationRepository {
  private collectionName = 'notifications';

  async findByUserId(userId: string): Promise<FirestoreNotificationDocument[]> {
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('userId', '==', userId), limit(50));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreNotificationDocument));
    } catch (err) {
      console.warn('NotificationRepository.findByUserId warning:', err);
      return [];
    }
  }

  async create(notifData: Omit<FirestoreNotificationDocument, 'id' | 'createdAt'>): Promise<FirestoreNotificationDocument> {
    const now = new Date().toISOString();
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newNotif: FirestoreNotificationDocument = {
      ...notifData,
      id,
      createdAt: now,
    };

    try {
      const docRef = doc(db, this.collectionName, id);
      await setDoc(docRef, newNotif);
    } catch (err) {
      console.warn('NotificationRepository.create warning:', err);
    }
    return newNotif;
  }

  async markAsRead(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, { read: true });
    } catch (err) {
      console.warn('NotificationRepository.markAsRead warning:', err);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const notifs = await this.findByUserId(userId);
      await Promise.all(
        notifs.map((n) => {
          if (!n.read) {
            const docRef = doc(db, this.collectionName, n.id);
            return updateDoc(docRef, { read: true });
          }
          return Promise.resolve();
        })
      );
    } catch (err) {
      console.warn('NotificationRepository.markAllAsRead warning:', err);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('NotificationRepository.delete warning:', err);
    }
  }
}

export const notificationRepository = new NotificationRepository();
