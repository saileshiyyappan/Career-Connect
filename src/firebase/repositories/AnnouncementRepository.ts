import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firestore';
import { FirestoreAnnouncementDocument } from '../types';
import { sanitizeFirestoreData } from '../utils/sanitize';

export interface IAnnouncementRepository {
  findById(id: string): Promise<FirestoreAnnouncementDocument | null>;
  create(announcement: Omit<FirestoreAnnouncementDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreAnnouncementDocument>;
  update(id: string, updates: Partial<FirestoreAnnouncementDocument>): Promise<void>;
  delete(id: string): Promise<void>;
  listPublished(targetRole?: string): Promise<FirestoreAnnouncementDocument[]>;
  listAll(): Promise<FirestoreAnnouncementDocument[]>;
}

export class AnnouncementRepository implements IAnnouncementRepository {
  private collectionName = 'announcements';

  async findById(id: string): Promise<FirestoreAnnouncementDocument | null> {
    if (!isFirebaseConfigured) return null;
    try {
      const docRef = doc(db, this.collectionName, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as FirestoreAnnouncementDocument;
      }
      return null;
    } catch (err) {
      console.warn('AnnouncementRepository.findById warning:', err);
      return null;
    }
  }

  async create(ancData: Omit<FirestoreAnnouncementDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreAnnouncementDocument> {
    const now = new Date().toISOString();
    const id = `anc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newAnc: FirestoreAnnouncementDocument = {
      ...ancData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    if (!isFirebaseConfigured) return newAnc;

    try {
      const docRef = doc(db, this.collectionName, id);
      const cleanAnc = sanitizeFirestoreData(newAnc);
      await setDoc(docRef, cleanAnc);
    } catch (err) {
      console.warn('AnnouncementRepository.create warning:', err);
    }
    return newAnc;
  }

  async update(id: string, updates: Partial<FirestoreAnnouncementDocument>): Promise<void> {
    if (!isFirebaseConfigured) return;
    const now = new Date().toISOString();
    try {
      const docRef = doc(db, this.collectionName, id);
      const cleanUpdates = sanitizeFirestoreData({ ...updates, updatedAt: now });
      await updateDoc(docRef, cleanUpdates);
    } catch (err) {
      console.warn('AnnouncementRepository.update warning:', err);
    }
  }

  async delete(id: string): Promise<void> {
    if (!isFirebaseConfigured) return;
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('AnnouncementRepository.delete warning:', err);
    }
  }

  async listPublished(_targetRole?: string): Promise<FirestoreAnnouncementDocument[]> {
    if (!isFirebaseConfigured) return [];
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('published', '==', true), limit(50));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreAnnouncementDocument));
    } catch (err) {
      console.warn('AnnouncementRepository.listPublished warning:', err);
      return [];
    }
  }

  async listAll(): Promise<FirestoreAnnouncementDocument[]> {
    if (!isFirebaseConfigured) return [];
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, limit(100));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreAnnouncementDocument));
    } catch (err) {
      console.warn('AnnouncementRepository.listAll warning:', err);
      return [];
    }
  }
}

export const announcementRepository = new AnnouncementRepository();
