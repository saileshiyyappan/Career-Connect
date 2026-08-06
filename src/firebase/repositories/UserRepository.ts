import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../config/firestore';
import { FirestoreUserDocument } from '../types';

export interface IUserRepository {
  findById(id: string): Promise<FirestoreUserDocument | null>;
  create(user: Omit<FirestoreUserDocument, 'createdAt' | 'updatedAt'>): Promise<FirestoreUserDocument>;
  update(id: string, updates: Partial<FirestoreUserDocument>): Promise<void>;
  delete(id: string): Promise<void>;
  listAll(limitCount?: number): Promise<FirestoreUserDocument[]>;
}

export class UserRepository implements IUserRepository {
  private collectionName = 'users';

  async findById(id: string): Promise<FirestoreUserDocument | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as FirestoreUserDocument;
      }
      return null;
    } catch (err) {
      console.warn('Firestore UserRepository.findById warning:', err);
      return null;
    }
  }

  async create(userData: Omit<FirestoreUserDocument, 'createdAt' | 'updatedAt'>): Promise<FirestoreUserDocument> {
    const now = new Date().toISOString();
    const newUser: FirestoreUserDocument = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const docRef = doc(db, this.collectionName, userData.uid);
      await setDoc(docRef, newUser, { merge: true });
    } catch (err) {
      console.warn('Firestore UserRepository.create warning:', err);
    }
    return newUser;
  }

  async update(id: string, updates: Partial<FirestoreUserDocument>): Promise<void> {
    const now = new Date().toISOString();
    try {
      const docRef = doc(db, this.collectionName, id);
      await setDoc(docRef, { ...updates, updatedAt: now }, { merge: true });
    } catch (err) {
      console.warn('Firestore UserRepository.update warning:', err);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore UserRepository.delete warning:', err);
    }
  }

  async listAll(limitCount: number = 50): Promise<FirestoreUserDocument[]> {
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

