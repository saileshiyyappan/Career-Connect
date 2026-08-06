import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firestore';
import { FirestoreUserDocument } from '../types';

export interface IUserService {
  getUserProfile(uid: string): Promise<FirestoreUserDocument | null>;
  updateUserProfile(uid: string, profile: Partial<FirestoreUserDocument>): Promise<void>;
  setUserStatus(uid: string, status: 'active' | 'suspended' | 'pending'): Promise<void>;
}

export class UserService implements IUserService {
  async getUserProfile(uid: string): Promise<FirestoreUserDocument | null> {
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

  async updateUserProfile(uid: string, profile: Partial<FirestoreUserDocument>): Promise<void> {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        ...profile,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('UserService.updateUserProfile warning:', err);
    }
  }

  async setUserStatus(uid: string, status: 'active' | 'suspended' | 'pending'): Promise<void> {
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, {
        accountStatus: status,
        status: status,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('UserService.setUserStatus warning:', err);
    }
  }
}

export const userService = new UserService();
