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
import { FirestoreEmployerSavedCandidateDocument } from '../types';
import { sanitizeFirestoreData } from '../utils/sanitize';

export interface IEmployerSavedCandidateRepository {
  saveCandidate(data: Omit<FirestoreEmployerSavedCandidateDocument, 'savedAt'>): Promise<FirestoreEmployerSavedCandidateDocument>;
  removeCandidate(employerId: string, candidateId: string): Promise<void>;
  updateNotes(employerId: string, candidateId: string, notes: string, tags?: string[]): Promise<void>;
  findByEmployerId(employerId: string): Promise<FirestoreEmployerSavedCandidateDocument[]>;
  isCandidateSaved(employerId: string, candidateId: string): Promise<boolean>;
}

export class EmployerSavedCandidateRepository implements IEmployerSavedCandidateRepository {
  private collectionName = 'employer_saved_candidates';

  private getDocId(employerId: string, candidateId: string): string {
    return `${employerId}_${candidateId}`;
  }

  async saveCandidate(
    data: Omit<FirestoreEmployerSavedCandidateDocument, 'savedAt'>
  ): Promise<FirestoreEmployerSavedCandidateDocument> {
    const id = this.getDocId(data.employerId, data.candidateId);
    const now = new Date().toISOString();
    const docData: FirestoreEmployerSavedCandidateDocument = {
      ...data,
      id,
      savedAt: now,
    };

    if (!isFirebaseConfigured) return docData;

    try {
      const docRef = doc(db, this.collectionName, id);
      const cleanData = sanitizeFirestoreData(docData);
      await setDoc(docRef, cleanData, { merge: true });
    } catch (err) {
      console.warn('EmployerSavedCandidateRepository.saveCandidate warning:', err);
    }
    return docData;
  }

  async removeCandidate(employerId: string, candidateId: string): Promise<void> {
    if (!isFirebaseConfigured) return;
    const id = this.getDocId(employerId, candidateId);
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('EmployerSavedCandidateRepository.removeCandidate warning:', err);
    }
  }

  async updateNotes(employerId: string, candidateId: string, notes: string, tags?: string[]): Promise<void> {
    if (!isFirebaseConfigured) return;
    const id = this.getDocId(employerId, candidateId);
    try {
      const docRef = doc(db, this.collectionName, id);
      const updates: Record<string, any> = { notes };
      if (tags) updates.tags = tags;
      await updateDoc(docRef, sanitizeFirestoreData(updates));
    } catch (err) {
      console.warn('EmployerSavedCandidateRepository.updateNotes warning:', err);
    }
  }

  async findByEmployerId(employerId: string): Promise<FirestoreEmployerSavedCandidateDocument[]> {
    if (!isFirebaseConfigured || !employerId) return [];
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('employerId', '==', employerId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => d.data() as FirestoreEmployerSavedCandidateDocument);
    } catch (err) {
      console.warn('EmployerSavedCandidateRepository.findByEmployerId warning:', err);
      return [];
    }
  }

  async isCandidateSaved(employerId: string, candidateId: string): Promise<boolean> {
    if (!isFirebaseConfigured) return false;
    const id = this.getDocId(employerId, candidateId);
    try {
      const docRef = doc(db, this.collectionName, id);
      const snap = await getDoc(docRef);
      return snap.exists();
    } catch (err) {
      console.warn('EmployerSavedCandidateRepository.isCandidateSaved warning:', err);
      return false;
    }
  }
}

export const employerSavedCandidateRepository = new EmployerSavedCandidateRepository();
