import { FirestoreApplicationDocument } from '../types';
import { applicationRepository } from '../repositories/ApplicationRepository';
import { jobRepository } from '../repositories/JobRepository';
import { notificationRepository } from '../repositories/NotificationRepository';

export interface IApplicationService {
  submitApplication(
    data: Omit<FirestoreApplicationDocument, 'id' | 'appliedAt' | 'updatedAt' | 'status'>
  ): Promise<FirestoreApplicationDocument>;
  getCandidateApplications(candidateId: string): Promise<FirestoreApplicationDocument[]>;
  getJobApplications(jobId: string): Promise<FirestoreApplicationDocument[]>;
  getEmployerApplications(employerId: string): Promise<FirestoreApplicationDocument[]>;
  updateApplicationStatus(
    applicationId: string,
    status: FirestoreApplicationDocument['status']
  ): Promise<void>;
  withdrawApplication(applicationId: string): Promise<void>;
}

export class ApplicationService implements IApplicationService {
  async submitApplication(
    data: Omit<FirestoreApplicationDocument, 'id' | 'appliedAt' | 'updatedAt' | 'status'>
  ): Promise<FirestoreApplicationDocument> {
    const app = await applicationRepository.create({
      ...data,
      status: 'submitted',
    });

    // Increment job application count
    try {
      const job = await jobRepository.findById(data.jobId);
      if (job) {
        await jobRepository.update(data.jobId, {
          applicationsCount: (job.applicationsCount || 0) + 1,
        });
      }
    } catch (err) {
      console.warn('Failed to update job application count:', err);
    }

    // Notify Employer
    try {
      await notificationRepository.create({
        userId: data.employerId,
        title: 'New Job Application',
        message: `${data.candidateName} applied for ${data.jobTitle}`,
        type: 'application',
        link: `/employer/applications`,
        read: false,
      });
    } catch (err) {
      console.warn('Failed to notify employer:', err);
    }

    return app;
  }

  async getCandidateApplications(candidateId: string): Promise<FirestoreApplicationDocument[]> {
    return applicationRepository.findByCandidateId(candidateId);
  }

  async getJobApplications(jobId: string): Promise<FirestoreApplicationDocument[]> {
    return applicationRepository.findByJobId(jobId);
  }

  async getEmployerApplications(employerId: string): Promise<FirestoreApplicationDocument[]> {
    return applicationRepository.findByEmployerId(employerId);
  }

  async updateApplicationStatus(
    applicationId: string,
    status: FirestoreApplicationDocument['status']
  ): Promise<void> {
    await applicationRepository.updateStatus(applicationId, status);

    // Notify Candidate
    try {
      const app = await applicationRepository.findById(applicationId);
      if (app) {
        await notificationRepository.create({
          userId: app.candidateId,
          title: 'Application Status Update',
          message: `Your application for ${app.jobTitle} at ${app.companyName} was updated to ${status.replace('_', ' ').toUpperCase()}`,
          type: 'application',
          link: `/candidate/applications`,
          read: false,
        });
      }
    } catch (err) {
      console.warn('Failed to notify candidate on status update:', err);
    }
  }

  async withdrawApplication(applicationId: string): Promise<void> {
    await applicationRepository.updateStatus(applicationId, 'withdrawn');
  }
}

export const applicationService = new ApplicationService();
