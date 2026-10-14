import { FirestoreApplicationDocument } from '../types';
import { applicationRepository } from '../repositories/ApplicationRepository';
import { jobRepository } from '../repositories/JobRepository';
import { notificationRepository } from '../repositories/NotificationRepository';
import { userRepository } from '../repositories/UserRepository';
import { auth } from '../config/auth';
import { isFirebaseConfigured } from '../config/firestore';

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
    const currentUser = auth.currentUser;
    if (isFirebaseConfigured && (!currentUser || currentUser.uid !== data.candidateId)) {
      throw new Error('Only the authenticated candidate can submit this application.');
    }
    const job = await jobRepository.findById(data.jobId);
    if (isFirebaseConfigured && (!job || !['published', 'active'].includes(job.status))) {
      throw new Error('This is not a valid active internal job owned by the stated employer.');
    }
    const authoritativeEmployerId = job?.employerId || data.employerId;
    if (isFirebaseConfigured && (!job?.employerId || job.employerId !== authoritativeEmployerId)) {
      throw new Error('The job does not have a valid owning employer.');
    }
    const candidate = await userRepository.findById(data.candidateId);
    if (isFirebaseConfigured && (!candidate || !['job_seeker', 'candidate'].includes(candidate.role) || candidate.accountStatus === 'suspended')) {
      throw new Error('Only an active candidate profile can submit an application.');
    }
    const existingApplications = await applicationRepository.findByCandidateId(data.candidateId);
    if (existingApplications.some((application) => application.jobId === data.jobId && application.status !== 'withdrawn')) {
      throw new Error('You have already applied to this job.');
    }
    const app = await applicationRepository.create({
      ...data,
      employerId: authoritativeEmployerId,
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
        userId: authoritativeEmployerId,
        title: 'New Job Application',
        message: `${data.candidateName} applied for ${data.jobTitle}`,
        type: 'application',
        link: `/employer/applicants`,
        read: false,
          senderId: data.candidateId,
          recipientId: authoritativeEmployerId,
        applicationId: app.id,
          jobId: data.jobId,
      }, `application_${app.id}`);
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
          link: '/applications',
          read: false,
          senderId: app.employerId,
          recipientId: app.candidateId,
          applicationId: app.id,
          jobId: app.jobId,
        }, `application_status_${app.id}_${status}`);
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
