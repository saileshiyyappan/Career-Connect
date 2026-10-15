import { FirestoreApplicationDocument } from '../types';
import { applicationRepository } from '../repositories/ApplicationRepository';
import { jobRepository } from '../repositories/JobRepository';
import { notificationRepository } from '../repositories/NotificationRepository';
import { userRepository } from '../repositories/UserRepository';
import { auth } from '../config/auth';
import { isFirebaseConfigured } from '../config/firestore';
import { AppError, ApplicationError, FirebaseErrorMapper } from '../utils/errors';
import { evaluateCandidateEligibility } from '../../services/candidateDiscoveryService';

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
    if (!isFirebaseConfigured) {
      throw new ApplicationError(
        'Application services are not configured. Please try again later.',
        'FIREBASE_NOT_CONFIGURED',
        503
      );
    }

    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== data.candidateId) {
      throw new ApplicationError('Please sign in again before applying.', 'UNAUTHENTICATED', 401);
    }

    let job: Awaited<ReturnType<typeof jobRepository.findById>>;
    try {
      job = await jobRepository.findById(data.jobId);
    } catch (error) {
      const mapped = FirebaseErrorMapper.map(error);
      throw new ApplicationError(mapped.message, mapped.code, mapped.statusCode);
    }

    if (!job) {
      throw new ApplicationError('The selected job could not be found.', 'JOB_NOT_FOUND', 404);
    }
    if (!['published', 'active'].includes(job.status)) {
      throw new ApplicationError('This job is no longer accepting applications.', 'JOB_NOT_ACCEPTING', 409);
    }
    if (!job.employerId || job.employerId !== data.employerId) {
      throw new ApplicationError('This job has an invalid employer assignment.', 'EMPLOYER_MISMATCH', 409);
    }

    let candidate: Awaited<ReturnType<typeof userRepository.findById>>;
    try {
      candidate = await userRepository.findById(currentUser.uid);
    } catch (error) {
      const mapped = FirebaseErrorMapper.map(error);
      throw new ApplicationError(mapped.message, mapped.code, mapped.statusCode);
    }
    if (!candidate) {
      throw new ApplicationError('Your candidate profile could not be found.', 'CANDIDATE_PROFILE_NOT_FOUND', 404);
    }
    const candidateEligibility = evaluateCandidateEligibility(candidate);
    if (!candidateEligibility.isEligible) {
      throw new ApplicationError('Only candidate accounts can submit applications.', 'CANDIDATE_ROLE_REQUIRED', 403);
    }
    if (candidate.accountStatus === 'suspended') {
      throw new ApplicationError('Suspended accounts cannot submit applications.', 'CANDIDATE_SUSPENDED', 403);
    }

    let existingApplications: FirestoreApplicationDocument[];
    try {
      existingApplications = await applicationRepository.findByCandidateId(currentUser.uid);
    } catch (error) {
      const mapped = FirebaseErrorMapper.map(error);
      throw new ApplicationError(mapped.message, mapped.code, mapped.statusCode);
    }
    if (existingApplications.some((application) => application.jobId === data.jobId && application.status !== 'withdrawn')) {
      throw new ApplicationError('You have already applied to this job.', 'DUPLICATE_APPLICATION', 409);
    }

    let app: FirestoreApplicationDocument;
    try {
      app = await applicationRepository.create({
        ...data,
        candidateId: currentUser.uid,
        employerId: job.employerId,
        status: 'submitted',
      });
    } catch (error) {
      const mapped = FirebaseErrorMapper.map(error);
      throw new ApplicationError(mapped.message, 'APPLICATION_PERSISTENCE_FAILED', mapped.statusCode);
    }

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
        userId: job.employerId,
        title: 'New Job Application',
        message: `${data.candidateName} applied for ${data.jobTitle}`,
        type: 'application',
        link: `/employer/applicants`,
        read: false,
          senderId: data.candidateId,
          recipientId: job.employerId,
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
    const app = await applicationRepository.findById(applicationId);
    if (!app) throw new AppError('Application not found.', 'APPLICATION_NOT_FOUND', 404);

    const currentUser = auth.currentUser;
    if (!currentUser) throw new AppError('Please sign in again.', 'UNAUTHENTICATED', 401);
    if (currentUser.uid !== app.employerId && currentUser.uid !== app.candidateId) {
      throw new AppError('You do not have permission to update this application.', 'PERMISSION_DENIED', 403);
    }
    if (currentUser.uid === app.candidateId && status !== 'withdrawn') {
      throw new AppError('Candidates can only withdraw their own applications.', 'INVALID_STATUS_TRANSITION', 403);
    }

    await applicationRepository.updateStatus(applicationId, status);

    // Notify Candidate
    try {
       const updatedApp = await applicationRepository.findById(applicationId);
       if (updatedApp) {
        await notificationRepository.create({
           userId: updatedApp.candidateId,
          title: 'Application Status Update',
           message: `Your application for ${updatedApp.jobTitle} at ${updatedApp.companyName} was updated to ${status.replace('_', ' ').toUpperCase()}`,
          type: 'application',
          link: '/applications',
          read: false,
           senderId: updatedApp.employerId,
           recipientId: updatedApp.candidateId,
           applicationId: updatedApp.id,
           jobId: updatedApp.jobId,
         }, `application_status_${updatedApp.id}_${status}`);
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
