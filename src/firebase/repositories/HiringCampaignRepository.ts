import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firestore';
import { FirestoreHiringCampaignDocument } from '../types';
import { sanitizeFirestoreData } from '../utils/sanitize';

export interface IHiringCampaignRepository {
  create(data: Omit<FirestoreHiringCampaignDocument, 'createdAt' | 'updatedAt'>): Promise<FirestoreHiringCampaignDocument>;
  update(id: string, updates: Partial<FirestoreHiringCampaignDocument>): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<FirestoreHiringCampaignDocument | null>;
  findByEmployerId(employerId: string): Promise<FirestoreHiringCampaignDocument[]>;
  listActive(limitCount?: number): Promise<FirestoreHiringCampaignDocument[]>;
}

export class HiringCampaignRepository implements IHiringCampaignRepository {
  private collectionName = 'hiring_campaigns';

  async create(
    data: Omit<FirestoreHiringCampaignDocument, 'createdAt' | 'updatedAt'>
  ): Promise<FirestoreHiringCampaignDocument> {
    const now = new Date().toISOString();
    const docData: FirestoreHiringCampaignDocument = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    if (!isFirebaseConfigured) return docData;

    try {
      const docRef = doc(db, this.collectionName, data.id);
      const cleanData = sanitizeFirestoreData(docData);
      await setDoc(docRef, cleanData);
    } catch (err) {
      console.warn('HiringCampaignRepository.create warning:', err);
    }
    return docData;
  }

  async update(id: string, updates: Partial<FirestoreHiringCampaignDocument>): Promise<void> {
    if (!isFirebaseConfigured) return;
    const now = new Date().toISOString();
    try {
      const docRef = doc(db, this.collectionName, id);
      const cleanUpdates = sanitizeFirestoreData({ ...updates, updatedAt: now });
      await updateDoc(docRef, cleanUpdates);
    } catch (err) {
      console.warn('HiringCampaignRepository.update warning:', err);
    }
  }

  async delete(id: string): Promise<void> {
    if (!isFirebaseConfigured) return;
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('HiringCampaignRepository.delete warning:', err);
    }
  }

  async findById(id: string): Promise<FirestoreHiringCampaignDocument | null> {
    if (!isFirebaseConfigured) return null;
    try {
      const docRef = doc(db, this.collectionName, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as FirestoreHiringCampaignDocument;
      }
      return null;
    } catch (err) {
      console.warn('HiringCampaignRepository.findById warning:', err);
      return null;
    }
  }

  async findByEmployerId(employerId: string): Promise<FirestoreHiringCampaignDocument[]>;
  async findByEmployerId(employerId: string): Promise<FirestoreHiringCampaignDocument[]> {
    if (!isFirebaseConfigured || !employerId) return [];
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('employerId', '==', employerId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as FirestoreHiringCampaignDocument);
    } catch (err) {
      console.warn('HiringCampaignRepository.findByEmployerId warning:', err);
      return [];
    }
  }

  async listActive(limitCount: number = 20): Promise<FirestoreHiringCampaignDocument[]> {
    if (!isFirebaseConfigured) return [];
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('status', '==', 'active'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as FirestoreHiringCampaignDocument);
    } catch (err) {
      console.warn('HiringCampaignRepository.listActive warning:', err);
      return [];
    }
  }
}

export const hiringCampaignRepository = new HiringCampaignRepository();
