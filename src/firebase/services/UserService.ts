import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firestore';
import { FirestoreUserDocument } from '../types';
import { sanitizeFirestoreData } from '../utils/sanitize';

export interface IUserService {
  getUserProfile(uid: string): Promise<FirestoreUserDocument | null>;
  updateUserProfile(uid: string, profile: Partial<FirestoreUserDocument>): Promise<FirestoreUserDocument>;
  setUserStatus(uid: string, status: 'active' | 'suspended' | 'pending'): Promise<void>;
}

export class UserService implements IUserService {
  async getUserProfile(uid: string): Promise<FirestoreUserDocument | null> {
    if (!isFirebaseConfigured) return null;
    try {
      const docRef = doc(db, 'users', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { uid: snap.id, ...snap.data() } as FirestoreUserDocument;
      }
      return null;
    } catch (err) {
      console.warn('UserService.getUserProfile warning:', err);
      return null;
    }
  }

  async updateUserProfile(uid: string, profile: Partial<FirestoreUserDocument>): Promise<FirestoreUserDocument> {
    if (!isFirebaseConfigured) return { uid, ...profile } as FirestoreUserDocument;
    const docRef = doc(db, 'users', uid);
    const cleanUpdates = sanitizeFirestoreData({ ...profile, updatedAt: new Date().toISOString() });
    await updateDoc(docRef, cleanUpdates);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error(`User profile ${uid} was not persisted`);
    return { uid: snap.id, ...snap.data() } as FirestoreUserDocument;
  }

  async setUserStatus(uid: string, status: 'active' | 'suspended' | 'pending'): Promise<void> {
    if (!isFirebaseConfigured) return;
    try {
      const docRef = doc(db, 'users', uid);
      const cleanUpdates = sanitizeFirestoreData({
        accountStatus: status,
        status: status,
        updatedAt: new Date().toISOString(),
      });
      await updateDoc(docRef, cleanUpdates);
    } catch (err) {
      console.warn('UserService.setUserStatus warning:', err);
    }
  }
}

export const userService = new UserService();
