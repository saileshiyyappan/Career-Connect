import { serverNotificationRepository } from '../repositories/ServerNotificationRepository';
import { NotificationTemplates } from '../notifications/templates';
import { NotificationDispatchPayload } from '../types/notification';
import { logger } from '../utils/logger';

export class ServerNotificationService {
  /**
   * Emits a notification to a specific user.
   */
  async notifyUser(payload: NotificationDispatchPayload): Promise<boolean> {
    try {
      const res = await serverNotificationRepository.createNotification(payload);
      return res !== null;
    } catch (error) {
      logger.error('ServerNotificationService.notifyUser error', error, { userId: payload.userId });
      return false;
    }
  }

  /**
   * Emits new matching job alert.
   */
  async notifyJobAlert(userId: string, jobTitle: string, companyName: string, jobId: string): Promise<boolean> {
    const payload = NotificationTemplates.jobAlert(userId, jobTitle, companyName, jobId);
    return this.notifyUser(payload);
  }

  /**
   * Emits company job posting update.
   */
  async notifyCompanyFollowers(userIds: string[], companyName: string, jobTitle: string, jobId: string): Promise<number> {
    if (!userIds.length) return 0;
    const payloads: NotificationDispatchPayload[] = userIds.map((userId) =>
      NotificationTemplates.companyJobPosted(userId, companyName, jobTitle, jobId)
    );
    return serverNotificationRepository.createBatchNotifications(payloads);
  }

  /**
   * Emits application status update.
   */
  async notifyApplicationStatus(
    candidateId: string,
    jobTitle: string,
    companyName: string,
    statusText: string,
    applicationId: string
  ): Promise<boolean> {
    const payload = NotificationTemplates.applicationStatusUpdated(
      candidateId,
      jobTitle,
      companyName,
      statusText,
      applicationId
    );
    return this.notifyUser(payload);
  }

  /**
   * Emits interview event.
   */
  async notifyInterviewScheduled(
    candidateId: string,
    jobTitle: string,
    companyName: string,
    scheduledDate: string,
    interviewId: string
  ): Promise<boolean> {
    const payload = NotificationTemplates.interviewScheduled(
      candidateId,
      jobTitle,
      companyName,
      scheduledDate,
      interviewId
    );
    return this.notifyUser(payload);
  }
}

export const serverNotificationService = new ServerNotificationService();
