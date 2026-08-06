import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db } from '../config/firestore';
import { FirestoreApplicationDocument } from '../types';

export interface IApplicationRepository {
  findById(id: string): Promise<FirestoreApplicationDocument | null>;
  create(application: Omit<FirestoreApplicationDocument, 'id' | 'appliedAt' | 'updatedAt'>): Promise<FirestoreApplicationDocument>;
  updateStatus(id: string, status: FirestoreApplicationDocument['status']): Promise<void>;
  findByCandidateId(candidateId: string): Promise<FirestoreApplicationDocument[]>;
  findByJobId(jobId: string): Promise<FirestoreApplicationDocument[]>;
  findByEmployerId(employerId: string): Promise<FirestoreApplicationDocument[]>;
  listAll(limitCount?: number): Promise<FirestoreApplicationDocument[]>;
}

export class ApplicationRepository implements IApplicationRepository {
  private collectionName = 'applications';

  async findById(id: string): Promise<FirestoreApplicationDocument | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as FirestoreApplicationDocument;
      }
      return null;
    } catch (err) {
      console.warn('ApplicationRepository.findById warning:', err);
      return null;
    }
  }

  async create(appData: Omit<FirestoreApplicationDocument, 'id' | 'appliedAt' | 'updatedAt'>): Promise<FirestoreApplicationDocument> {
    const now = new Date().toISOString();
    const id = `app_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newApp: FirestoreApplicationDocument = {
      ...appData,
      id,
      appliedAt: now,
      updatedAt: now,
    };

    try {
      const docRef = doc(db, this.collectionName, id);
      await setDoc(docRef, newApp);
    } catch (err) {
      console.warn('ApplicationRepository.create warning:', err);
    }
    return newApp;
  }

  async updateStatus(id: string, status: FirestoreApplicationDocument['status']): Promise<void> {
    const now = new Date().toISOString();
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, { status, updatedAt: now });
    } catch (err) {
      console.warn('ApplicationRepository.updateStatus warning:', err);
    }
  }

  async findByCandidateId(candidateId: string): Promise<FirestoreApplicationDocument[]> {
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('candidateId', '==', candidateId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreApplicationDocument));
    } catch (err) {
      console.warn('ApplicationRepository.findByCandidateId warning:', err);
      return [];
    }
  }

  async findByJobId(jobId: string): Promise<FirestoreApplicationDocument[]> {
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('jobId', '==', jobId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreApplicationDocument));
    } catch (err) {
      console.warn('ApplicationRepository.findByJobId warning:', err);
      return [];
    }
  }

  async findByEmployerId(employerId: string): Promise<FirestoreApplicationDocument[]> {
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('employerId', '==', employerId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreApplicationDocument));
    } catch (err) {
      console.warn('ApplicationRepository.findByEmployerId warning:', err);
      return [];
    }
  }

  async listAll(limitCount: number = 100): Promise<FirestoreApplicationDocument[]> {
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, limit(limitCount));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreApplicationDocument));
    } catch (err) {
      console.warn('ApplicationRepository.listAll warning:', err);
      return [];
    }
  }
}

export const applicationRepository = new ApplicationRepository();
