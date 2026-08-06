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
import { FirestoreCompanyDocument } from '../types';

export interface ICompanyRepository {
  findById(id: string): Promise<FirestoreCompanyDocument | null>;
  findByOwnerId(ownerId: string): Promise<FirestoreCompanyDocument | null>;
  create(company: Omit<FirestoreCompanyDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreCompanyDocument>;
  update(id: string, updates: Partial<FirestoreCompanyDocument>): Promise<void>;
  verifyCompany(id: string, status: FirestoreCompanyDocument['verificationStatus']): Promise<void>;
  listAll(limitCount?: number): Promise<FirestoreCompanyDocument[]>;
}

export class CompanyRepository implements ICompanyRepository {
  private collectionName = 'companies';

  async findById(id: string): Promise<FirestoreCompanyDocument | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as FirestoreCompanyDocument;
      }
      return null;
    } catch (err) {
      console.warn('CompanyRepository.findById warning:', err);
      return null;
    }
  }

  async findByOwnerId(ownerId: string): Promise<FirestoreCompanyDocument | null> {
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('ownerId', '==', ownerId), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        return { id: d.id, ...d.data() } as FirestoreCompanyDocument;
      }
      return null;
    } catch (err) {
      console.warn('CompanyRepository.findByOwnerId warning:', err);
      return null;
    }
  }

  async create(companyData: Omit<FirestoreCompanyDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreCompanyDocument> {
    const now = new Date().toISOString();
    const id = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newCompany: FirestoreCompanyDocument = {
      ...companyData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const docRef = doc(db, this.collectionName, id);
      await setDoc(docRef, newCompany);
    } catch (err) {
      console.warn('CompanyRepository.create warning:', err);
    }
    return newCompany;
  }

  async update(id: string, updates: Partial<FirestoreCompanyDocument>): Promise<void> {
    const now = new Date().toISOString();
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, { ...updates, updatedAt: now });
    } catch (err) {
      console.warn('CompanyRepository.update warning:', err);
    }
  }

  async verifyCompany(id: string, status: FirestoreCompanyDocument['verificationStatus']): Promise<void> {
    const now = new Date().toISOString();
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, { verificationStatus: status, updatedAt: now });
    } catch (err) {
      console.warn('CompanyRepository.verifyCompany warning:', err);
    }
  }

  async listAll(limitCount: number = 50): Promise<FirestoreCompanyDocument[]> {
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, limit(limitCount));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreCompanyDocument));
    } catch (err) {
      console.warn('CompanyRepository.listAll warning:', err);
      return [];
    }
  }
}

export const companyRepository = new CompanyRepository();
