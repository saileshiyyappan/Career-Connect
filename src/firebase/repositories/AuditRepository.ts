import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db } from '../config/firestore';
import { FirestoreAuditLogDocument } from '../types';

export interface IAuditRepository {
  create(log: Omit<FirestoreAuditLogDocument, 'id' | 'timestamp'>): Promise<FirestoreAuditLogDocument>;
  listLogs(limitCount?: number): Promise<FirestoreAuditLogDocument[]>;
  findByActorId(actorId: string): Promise<FirestoreAuditLogDocument[]>;
}

export class AuditRepository implements IAuditRepository {
  private collectionName = 'audit_logs';

  async create(logData: Omit<FirestoreAuditLogDocument, 'id' | 'timestamp'>): Promise<FirestoreAuditLogDocument> {
    const now = new Date().toISOString();
    const id = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newLog: FirestoreAuditLogDocument = {
      ...logData,
      id,
      timestamp: now,
    };

    try {
      const docRef = doc(db, this.collectionName, id);
      await setDoc(docRef, newLog);
    } catch (err) {
      console.warn('AuditRepository.create warning:', err);
    }
    return newLog;
  }

  async listLogs(limitCount: number = 100): Promise<FirestoreAuditLogDocument[]> {
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, limit(limitCount));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreAuditLogDocument));
    } catch (err) {
      console.warn('AuditRepository.listLogs warning:', err);
      return [];
    }
  }

  async findByActorId(actorId: string): Promise<FirestoreAuditLogDocument[]> {
    try {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('actorId', '==', actorId), limit(50));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreAuditLogDocument));
    } catch (err) {
      console.warn('AuditRepository.findByActorId warning:', err);
      return [];
    }
  }
}

export const auditRepository = new AuditRepository();
