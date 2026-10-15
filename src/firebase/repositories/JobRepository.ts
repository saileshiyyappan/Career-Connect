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
import { FirestoreJobDocument } from '../types';
import { sanitizeFirestoreData } from '../utils/sanitize';

export interface IJobRepository {
  findById(id: string): Promise<FirestoreJobDocument | null>;
  create(job: Omit<FirestoreJobDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreJobDocument>;
  update(id: string, updates: Partial<FirestoreJobDocument>): Promise<void>;
  delete(id: string): Promise<void>;
  searchJobs(queryText?: string, filters?: Record<string, unknown>): Promise<FirestoreJobDocument[]>;
  findByEmployerId(employerId: string): Promise<FirestoreJobDocument[]>;
  listAll(limitCount?: number): Promise<FirestoreJobDocument[]>;
}

export class JobRepository implements IJobRepository {
  private collectionName = 'jobs';

  async findById(id: string): Promise<FirestoreJobDocument | null> {
    if (!isFirebaseConfigured) return null;
    try {
      const docRef = doc(db, this.collectionName, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as FirestoreJobDocument;
      }
      return null;
    } catch (err) {
      console.warn('JobRepository.findById warning:', err);
<<<<<<< HEAD
      throw err;
=======
      return null;
>>>>>>> origin/main
    }
  }

  async create(jobData: Omit<FirestoreJobDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreJobDocument> {
    const now = new Date().toISOString();
    const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newJob: FirestoreJobDocument = {
      ...jobData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    if (!isFirebaseConfigured) return newJob;

    try {
      const docRef = doc(db, this.collectionName, id);
      const cleanJob = sanitizeFirestoreData(newJob);
      await setDoc(docRef, cleanJob);
      const persisted = await getDoc(docRef);
      if (!persisted.exists()) throw new Error('Job was not readable after persistence.');
      return { id: persisted.id, ...persisted.data() } as FirestoreJobDocument;
    } catch (err) {
      console.warn('JobRepository.create warning:', err);
      throw err;
    }
  }

  async update(id: string, updates: Partial<FirestoreJobDocument>): Promise<void> {
    if (!isFirebaseConfigured) return;
    const now = new Date().toISOString();
    try {
      const docRef = doc(db, this.collectionName, id);
      const cleanUpdates = sanitizeFirestoreData({ ...updates, updatedAt: now });
      await updateDoc(docRef, cleanUpdates);
    } catch (err) {
      console.warn('JobRepository.update warning:', err);
      throw err;
    }
  }

  async delete(id: string): Promise<void> {
    if (!isFirebaseConfigured) return;
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('JobRepository.delete warning:', err);
    }
  }

  async searchJobs(queryText?: string, filters?: Record<string, unknown>): Promise<FirestoreJobDocument[]> {
    if (!isFirebaseConfigured) return [];
    try {
      const colRef = collection(db, this.collectionName);
      let q = query(colRef, where('status', '==', 'published'), limit(100));

      if (filters?.type && filters.type !== 'All') {
        try {
          q = query(colRef, where('status', '==', 'published'), where('type', '==', filters.type), limit(100));
        } catch {
          q = query(colRef, where('status', '==', 'published'), limit(100));
        }
      }

      const snap = await getDocs(q);
      let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreJobDocument));

      if (queryText && queryText.trim()) {
        const lower = queryText.toLowerCase().trim();
        docs = docs.filter(
          (j) =>
            j.title?.toLowerCase().includes(lower) ||
            j.companyName?.toLowerCase().includes(lower) ||
            j.location?.toLowerCase().includes(lower) ||
            j.description?.toLowerCase().includes(lower)
        );
      }

      if (filters?.location) {
        const locLower = String(filters.location).toLowerCase();
        docs = docs.filter((j) => j.location?.toLowerCase().includes(locLower));
      }

      return docs;
    } catch (err) {
      console.warn('JobRepository.searchJobs warning:', err);
<<<<<<< HEAD
      throw err;
=======
      return [];
>>>>>>> origin/main
    }
  }

  async findByEmployerId(employerId: string): Promise<FirestoreJobDocument[]> {
    if (!isFirebaseConfigured) return [];
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('employerId', '==', employerId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreJobDocument));
    } catch (err) {
      console.warn('JobRepository.findByEmployerId warning:', err);
      return [];
    }
  }

  async listAll(limitCount: number = 100, publishedOnly: boolean = true): Promise<FirestoreJobDocument[]> {
    if (!isFirebaseConfigured) return [];
    try {
      const colRef = collection(db, this.collectionName);
      const q = publishedOnly
        ? query(colRef, where('status', '==', 'published'), limit(limitCount))
        : query(colRef, limit(limitCount));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreJobDocument));
    } catch (err) {
      console.warn('JobRepository.listAll warning:', err);
      return [];
    }
  }
}

export const jobRepository = new JobRepository();
