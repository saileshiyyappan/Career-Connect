import { FirestoreCompanyDocument } from '../types';
import { companyRepository } from '../repositories/CompanyRepository';

export interface IEmployerService {
  getCompanyProfile(companyId: string): Promise<FirestoreCompanyDocument | null>;
  createCompanyProfile(
    company: Omit<FirestoreCompanyDocument, 'id' | 'createdAt' | 'updatedAt' | 'verificationStatus'>
  ): Promise<FirestoreCompanyDocument>;
  updateCompanyProfile(companyId: string, updates: Partial<FirestoreCompanyDocument>): Promise<void>;
  getEmployerCompany(ownerId: string): Promise<FirestoreCompanyDocument | null>;
  listCompanies(limitCount?: number): Promise<FirestoreCompanyDocument[]>;
}

export class EmployerService implements IEmployerService {
  async getCompanyProfile(companyId: string): Promise<FirestoreCompanyDocument | null> {
    return companyRepository.findById(companyId);
  }

  async createCompanyProfile(
    company: Omit<FirestoreCompanyDocument, 'id' | 'createdAt' | 'updatedAt' | 'verificationStatus'>
  ): Promise<FirestoreCompanyDocument> {
    return companyRepository.create({
      ...company,
      verificationStatus: 'pending',
    });
  }

  async updateCompanyProfile(companyId: string, updates: Partial<FirestoreCompanyDocument>): Promise<void> {
    return companyRepository.update(companyId, updates);
  }

  async getEmployerCompany(ownerId: string): Promise<FirestoreCompanyDocument | null> {
    return companyRepository.findByOwnerId(ownerId);
  }

  async listCompanies(limitCount: number = 50): Promise<FirestoreCompanyDocument[]> {
    return companyRepository.listAll(limitCount);
  }
}

export const employerService = new EmployerService();
