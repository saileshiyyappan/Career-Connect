import { FirestoreJobDocument } from '../types';
import { jobRepository } from '../repositories/JobRepository';
import { savedJobRepository } from '../repositories/SavedJobRepository';

export interface IJobService {
  getJobDetails(jobId: string): Promise<FirestoreJobDocument | null>;
  createJobPosting(
    job: Omit<FirestoreJobDocument, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'applicationsCount'>
  ): Promise<FirestoreJobDocument>;
  updateJobPosting(jobId: string, updates: Partial<FirestoreJobDocument>): Promise<void>;
  deleteJobPosting(jobId: string): Promise<void>;
  searchJobs(params: {
    keyword?: string;
    location?: string;
    type?: string;
    experienceLevel?: string;
  }): Promise<FirestoreJobDocument[]>;
  incrementViewCount(jobId: string): Promise<void>;
  getJobsByEmployer(employerId: string): Promise<FirestoreJobDocument[]>;
  toggleSaveJob(userId: string, jobId: string): Promise<boolean>;
  getSavedJobIds(userId: string): Promise<string[]>;
}

export class JobService implements IJobService {
  async getJobDetails(jobId: string): Promise<FirestoreJobDocument | null> {
    return jobRepository.findById(jobId);
  }

  async createJobPosting(
    job: Omit<FirestoreJobDocument, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'applicationsCount'>
  ): Promise<FirestoreJobDocument> {
    return jobRepository.create({
      ...job,
      viewsCount: 0,
      applicationsCount: 0,
      status: job.status || 'published',
    });
  }

  async updateJobPosting(jobId: string, updates: Partial<FirestoreJobDocument>): Promise<void> {
    return jobRepository.update(jobId, updates);
  }

  async deleteJobPosting(jobId: string): Promise<void> {
    return jobRepository.delete(jobId);
  }

  async searchJobs(params: {
    keyword?: string;
    location?: string;
    type?: string;
    experienceLevel?: string;
  }): Promise<FirestoreJobDocument[]> {
    return jobRepository.searchJobs(params.keyword, params);
  }

  async incrementViewCount(jobId: string): Promise<void> {
    const job = await jobRepository.findById(jobId);
    if (job) {
      const currentViews = job.viewsCount || 0;
      await jobRepository.update(jobId, { viewsCount: currentViews + 1 });
    }
  }

  async getJobsByEmployer(employerId: string): Promise<FirestoreJobDocument[]> {
    return jobRepository.findByEmployerId(employerId);
  }

  async toggleSaveJob(userId: string, jobId: string): Promise<boolean> {
    const existing = await savedJobRepository.getSavedJobIdsByUser(userId);
    if (existing.includes(jobId)) {
      await savedJobRepository.removeSavedJob(userId, jobId);
      return false; // unsaved
    } else {
      await savedJobRepository.saveJob(userId, jobId);
      return true; // saved
    }
  }

  async getSavedJobIds(userId: string): Promise<string[]> {
    return savedJobRepository.getSavedJobIdsByUser(userId);
  }
}

export const jobService = new JobService();
