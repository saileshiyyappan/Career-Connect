import { FirestoreJobDocument, FirestoreExternalJobDocument } from '../types';
import { jobRepository } from '../repositories/JobRepository';
import { externalJobRepository } from '../repositories/ExternalJobRepository';
import { savedJobRepository } from '../repositories/SavedJobRepository';

export interface IJobService {
  getJobDetails(jobId: string): Promise<FirestoreJobDocument | FirestoreExternalJobDocument | null>;
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
  listExternalJobs(limitCount?: number): Promise<FirestoreExternalJobDocument[]>;
  incrementViewCount(jobId: string): Promise<void>;
  getJobsByEmployer(employerId: string): Promise<FirestoreJobDocument[]>;
  toggleSaveJob(userId: string, jobId: string): Promise<boolean>;
  getSavedJobIds(userId: string): Promise<string[]>;
<<<<<<< HEAD
  getSavedJobs(userId: string): Promise<Array<FirestoreJobDocument | FirestoreExternalJobDocument>>;
=======
>>>>>>> origin/main
}

export class JobService implements IJobService {
  async getJobDetails(jobId: string): Promise<FirestoreJobDocument | FirestoreExternalJobDocument | null> {
<<<<<<< HEAD
    try {
      const internalJob = await jobRepository.findById(jobId);
      if (internalJob) return internalJob;
    } catch (err) {
      console.warn('Internal job lookup failed; trying external source:', err);
    }
=======
    const internalJob = await jobRepository.findById(jobId);
    if (internalJob) return internalJob;
>>>>>>> origin/main
    return externalJobRepository.findById(jobId);
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

  async listExternalJobs(limitCount: number = 50): Promise<FirestoreExternalJobDocument[]> {
    return externalJobRepository.listActive(limitCount);
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
<<<<<<< HEAD

  async getSavedJobs(userId: string): Promise<Array<FirestoreJobDocument | FirestoreExternalJobDocument>> {
    const savedRecords = await savedJobRepository.getSavedJobsByUser(userId);
    const resolved = await Promise.all(savedRecords.map((record) => this.getJobDetails(record.jobId)));
    return resolved.filter((job): job is FirestoreJobDocument | FirestoreExternalJobDocument => job !== null);
  }
=======
>>>>>>> origin/main
}

export const jobService = new JobService();

