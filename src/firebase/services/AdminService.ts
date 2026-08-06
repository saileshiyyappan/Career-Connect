import {
  collection,
  getDocs,
  limit,
  query,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firestore';
import {
  FirestoreUserDocument,
  FirestoreCompanyDocument,
  FirestoreAuditLogDocument,
} from '../types';
import { companyRepository } from '../repositories/CompanyRepository';
import { jobRepository } from '../repositories/JobRepository';
import { auditRepository } from '../repositories/AuditRepository';

export interface IAdminService {
  getAllUsers(limitCount?: number): Promise<FirestoreUserDocument[]>;
  updateUserRole(userId: string, role: FirestoreUserDocument['role']): Promise<void>;
  setUserStatus(userId: string, status: 'active' | 'suspended' | 'pending'): Promise<void>;
  verifyCompany(companyId: string, status: FirestoreCompanyDocument['verificationStatus']): Promise<void>;
  moderateJob(jobId: string, action: 'approve' | 'flag' | 'delete'): Promise<void>;
  getAuditLogs(limitCount?: number): Promise<FirestoreAuditLogDocument[]>;
}

export class AdminService implements IAdminService {
  async getAllUsers(limitCount: number = 100): Promise<FirestoreUserDocument[]> {
    try {
      const colRef = collection(db, 'users');
      const q = query(colRef, limit(limitCount));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ uid: d.id, ...d.data() } as FirestoreUserDocument));
    } catch (err) {
      console.warn('AdminService.getAllUsers warning:', err);
      return [];
    }
  }

  async updateUserRole(userId: string, role: FirestoreUserDocument['role']): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, { role, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('AdminService.updateUserRole warning:', err);
    }
  }

  async setUserStatus(userId: string, status: 'active' | 'suspended' | 'pending'): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        accountStatus: status,
        status: status,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('AdminService.setUserStatus warning:', err);
    }
  }

  async verifyCompany(
    companyId: string,
    status: FirestoreCompanyDocument['verificationStatus']
  ): Promise<void> {
    return companyRepository.verifyCompany(companyId, status);
  }

  async moderateJob(jobId: string, action: 'approve' | 'flag' | 'delete'): Promise<void> {
    if (action === 'delete') {
      return jobRepository.delete(jobId);
    } else if (action === 'approve') {
      return jobRepository.update(jobId, { status: 'published' });
    } else if (action === 'flag') {
      return jobRepository.update(jobId, { status: 'flagged' });
    }
  }

  async getAuditLogs(limitCount: number = 100): Promise<FirestoreAuditLogDocument[]> {
    return auditRepository.listLogs(limitCount);
  }
}

export const adminService = new AdminService();
