import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firestore';
import { FirestoreSavedJobDocument } from '../types';

export interface ISavedJobRepository {
  saveJob(userId: string, jobId: string): Promise<FirestoreSavedJobDocument>;
  removeSavedJob(userId: string, jobId: string): Promise<void>;
  getSavedJobsByUser(userId: string): Promise<FirestoreSavedJobDocument[]>;
  getSavedJobIdsByUser(userId: string): Promise<string[]>;
}

export class SavedJobRepository implements ISavedJobRepository {
  private collectionName = 'saved_jobs';

  async saveJob(userId: string, jobId: string): Promise<FirestoreSavedJobDocument> {
    const id = `${userId}_${jobId}`;
    const now = new Date().toISOString();
    const docData: FirestoreSavedJobDocument = {
      id,
      userId,
      jobId,
      savedAt: now,
    };

    if (!isFirebaseConfigured) return docData;

    try {
      const docRef = doc(db, this.collectionName, id);
      await setDoc(docRef, docData);
    } catch (err) {
      console.error('SavedJobRepository.saveJob failed:', err);
      throw err;
    }
    return docData;
  }

  async removeSavedJob(userId: string, jobId: string): Promise<void> {
    if (!isFirebaseConfigured) return;
    const id = `${userId}_${jobId}`;
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('SavedJobRepository.removeSavedJob failed:', err);
      throw err;
    }
  }

  async getSavedJobsByUser(userId: string): Promise<FirestoreSavedJobDocument[]> {
    if (!isFirebaseConfigured) return [];
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as FirestoreSavedJobDocument);
    } catch (err) {
      console.error('SavedJobRepository.getSavedJobsByUser failed:', err);
      throw err;
    }
  }

  async getSavedJobIdsByUser(userId: string): Promise<string[]> {
    if (!isFirebaseConfigured) return [];
    const saved = await this.getSavedJobsByUser(userId);
    return saved.map((s) => s.jobId);
  }
}

export const savedJobRepository = new SavedJobRepository();
