import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firestore';
import { FirestoreUserDocument } from '../types';
import { sanitizeFirestoreData } from '../utils/sanitize';

export interface IUserRepository {
  findById(id: string): Promise<FirestoreUserDocument | null>;
  create(user: Omit<FirestoreUserDocument, 'createdAt' | 'updatedAt'>): Promise<FirestoreUserDocument>;
  update(id: string, updates: Partial<FirestoreUserDocument>): Promise<FirestoreUserDocument>;
  delete(id: string): Promise<void>;
  listAll(limitCount?: number): Promise<FirestoreUserDocument[]>;
}

export class UserRepository implements IUserRepository {
  private collectionName = 'users';

  async findById(id: string): Promise<FirestoreUserDocument | null> {
    if (!isFirebaseConfigured) return null;
    try {
      const docRef = doc(db, this.collectionName, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { uid: snap.id, ...snap.data() } as FirestoreUserDocument;
      }
      return null;
    } catch (err) {
      console.warn('Firestore UserRepository.findById warning:', err);
<<<<<<< HEAD
      throw err;
=======
      return null;
>>>>>>> origin/main
    }
  }

  async create(userData: Omit<FirestoreUserDocument, 'createdAt' | 'updatedAt'>): Promise<FirestoreUserDocument> {
    const now = new Date().toISOString();
    const newUser: FirestoreUserDocument = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    };

    if (!isFirebaseConfigured) return newUser;

    try {
      const docRef = doc(db, this.collectionName, userData.uid);
      // Guard against race conditions and unauthorized overwrites on existing profiles
      const existingSnap = await getDoc(docRef);
      if (existingSnap.exists()) {
        return { uid: existingSnap.id, ...existingSnap.data() } as FirestoreUserDocument;
      }

      const cleanUser = sanitizeFirestoreData(newUser);
      // Perform clean setDoc (without merge) so Firestore evaluates 'create' security rules
      await setDoc(docRef, cleanUser);
      return cleanUser;
    } catch (err) {
      // If document creation failed (e.g. concurrent creation or permissions due to existing doc),
      // re-check whether document already exists in Firestore before throwing.
      try {
        const docRef = doc(db, this.collectionName, userData.uid);
        const checkSnap = await getDoc(docRef);
        if (checkSnap.exists()) {
          return { uid: checkSnap.id, ...checkSnap.data() } as FirestoreUserDocument;
        }
      } catch {
        // Fall through to original error logging
      }
      console.warn('Firestore UserRepository.create warning:', err);
      throw err;
    }
  }

  async update(id: string, updates: Partial<FirestoreUserDocument>): Promise<FirestoreUserDocument> {
    if (!isFirebaseConfigured) {
      const existing = await this.findById(id);
      return { ...(existing || { uid: id }), ...updates } as FirestoreUserDocument;
    }
    const now = new Date().toISOString();
    const docRef = doc(db, this.collectionName, id);
    const cleanUpdates = sanitizeFirestoreData({ ...updates, updatedAt: now });
    await updateDoc(docRef, cleanUpdates);
    const persisted = await getDoc(docRef);
    if (!persisted.exists()) throw new Error(`User profile ${id} disappeared after update`);
    return { uid: persisted.id, ...persisted.data() } as FirestoreUserDocument;
  }

  async delete(id: string): Promise<void> {
    if (!isFirebaseConfigured) return;
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore UserRepository.delete warning:', err);
    }
  }

  async listAll(limitCount: number = 50): Promise<FirestoreUserDocument[]> {
    if (!isFirebaseConfigured) return [];
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, limit(limitCount));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as FirestoreUserDocument);
    } catch (err) {
      console.warn('Firestore UserRepository.listAll warning:', err);
      return [];
    }
  }
}

export const userRepository = new UserRepository();

