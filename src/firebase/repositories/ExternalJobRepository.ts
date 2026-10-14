import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firestore';
import { FirestoreExternalJobDocument } from '../types';

export interface IExternalJobRepository {
  findById(id: string): Promise<FirestoreExternalJobDocument | null>;
  listActive(limitCount?: number): Promise<FirestoreExternalJobDocument[]>;
  searchJobs(queryText?: string, filters?: Record<string, unknown>): Promise<FirestoreExternalJobDocument[]>;
}

export class ExternalJobRepository implements IExternalJobRepository {
  private collectionName = 'external_jobs';

  async findById(id: string): Promise<FirestoreExternalJobDocument | null> {
    if (!isFirebaseConfigured) return null;
    try {
      const docRef = doc(db, this.collectionName, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as FirestoreExternalJobDocument;
      }
      return null;
    } catch (err) {
      console.warn('ExternalJobRepository.findById warning:', err);
      return null;
    }
  }

  async listActive(limitCount: number = 50): Promise<FirestoreExternalJobDocument[]> {
    if (!isFirebaseConfigured) return [];
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('status', '==', 'active'), limit(limitCount));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreExternalJobDocument));
    } catch (err) {
      console.warn('ExternalJobRepository.listActive warning:', err);
      return [];
    }
  }

  async searchJobs(queryText?: string, filters?: Record<string, unknown>): Promise<FirestoreExternalJobDocument[]> {
    if (!isFirebaseConfigured) return [];
    try {
      const colRef = collection(db, this.collectionName);
      let q = query(colRef, where('status', '==', 'active'), limit(100));

      if (filters?.type && filters.type !== 'All') {
        try {
          q = query(colRef, where('status', '==', 'active'), where('employmentType', '==', filters.type), limit(100));
        } catch {
          q = query(colRef, where('status', '==', 'active'), limit(100));
        }
      }

      const snap = await getDocs(q);
      let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreExternalJobDocument));

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
      console.warn('ExternalJobRepository.searchJobs warning:', err);
      return [];
    }
  }
}

export const externalJobRepository = new ExternalJobRepository();
