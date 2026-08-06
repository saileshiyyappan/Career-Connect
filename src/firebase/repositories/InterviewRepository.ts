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
import { FirestoreInterviewDocument } from '../types';

export interface IInterviewRepository {
  findById(id: string): Promise<FirestoreInterviewDocument | null>;
  create(interview: Omit<FirestoreInterviewDocument, 'id' | 'createdAt'>): Promise<FirestoreInterviewDocument>;
  update(id: string, updates: Partial<FirestoreInterviewDocument>): Promise<void>;
  findByCandidateId(candidateId: string): Promise<FirestoreInterviewDocument[]>;
  findByEmployerId(employerId: string): Promise<FirestoreInterviewDocument[]>;
  listAll(limitCount?: number): Promise<FirestoreInterviewDocument[]>;
}

export class InterviewRepository implements IInterviewRepository {
  private collectionName = 'interviews';

  async findById(id: string): Promise<FirestoreInterviewDocument | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as FirestoreInterviewDocument;
      }
      return null;
    } catch (err) {
      console.warn('InterviewRepository.findById warning:', err);
      return null;
    }
  }

  async create(interviewData: Omit<FirestoreInterviewDocument, 'id' | 'createdAt'>): Promise<FirestoreInterviewDocument> {
    const now = new Date().toISOString();
    const id = `int_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newInterview: FirestoreInterviewDocument = {
      ...interviewData,
      id,
      createdAt: now,
    };

    try {
      const docRef = doc(db, this.collectionName, id);
      await setDoc(docRef, newInterview);
    } catch (err) {
      console.warn('InterviewRepository.create warning:', err);
    }
    return newInterview;
  }

  async update(id: string, updates: Partial<FirestoreInterviewDocument>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, updates);
    } catch (err) {
      console.warn('InterviewRepository.update warning:', err);
    }
  }

  async findByCandidateId(candidateId: string): Promise<FirestoreInterviewDocument[]> {
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('candidateId', '==', candidateId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreInterviewDocument));
    } catch (err) {
      console.warn('InterviewRepository.findByCandidateId warning:', err);
      return [];
    }
  }

  async findByEmployerId(employerId: string): Promise<FirestoreInterviewDocument[]> {
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('employerId', '==', employerId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreInterviewDocument));
    } catch (err) {
      console.warn('InterviewRepository.findByEmployerId warning:', err);
      return [];
    }
  }

  async listAll(limitCount: number = 50): Promise<FirestoreInterviewDocument[]> {
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, limit(limitCount));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreInterviewDocument));
    } catch (err) {
      console.warn('InterviewRepository.listAll warning:', err);
      return [];
    }
  }
}

export const interviewRepository = new InterviewRepository();
