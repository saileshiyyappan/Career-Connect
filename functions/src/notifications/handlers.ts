import { serverNotificationRepository } from '../repositories/ServerNotificationRepository';
import { NotificationTemplates } from './templates';
import { logger } from '../utils/logger';

export class NotificationHandlers {
  /**
   * Dispatches job alert notification to a specific candidate.
   */
  static async sendJobAlert(userId: string, jobTitle: string, companyName: string, jobId: string): Promise<boolean> {
    try {
      const payload = NotificationTemplates.jobAlert(userId, jobTitle, companyName, jobId);
      const res = await serverNotificationRepository.createNotification(payload);
      return res !== null;
    } catch (error) {
      logger.error('NotificationHandlers.sendJobAlert error', error, { userId, jobId });
      return false;
    }
  }

  /**
   * Dispatches an application status update notification to the candidate.
   */
  static async sendApplicationStatusUpdate(
    candidateId: string,
    jobTitle: string,
    companyName: string,
    statusText: string,
    applicationId: string
  ): Promise<boolean> {
    try {
      const payload = NotificationTemplates.applicationStatusUpdated(
        candidateId,
        jobTitle,
        companyName,
        statusText,
        applicationId
      );
      const res = await serverNotificationRepository.createNotification(payload);
      return res !== null;
    } catch (error) {
      logger.error('NotificationHandlers.sendApplicationStatusUpdate error', error, { candidateId, applicationId });
      return false;
    }
  }

  /**
   * Dispatches interview scheduled notification.
   */
  static async sendInterviewScheduledNotice(
    candidateId: string,
    jobTitle: string,
    companyName: string,
    scheduledDate: string,
    interviewId: string
  ): Promise<boolean> {
    try {
      const payload = NotificationTemplates.interviewScheduled(
        candidateId,
        jobTitle,
        companyName,
        scheduledDate,
        interviewId
      );
      const res = await serverNotificationRepository.createNotification(payload);
      return res !== null;
    } catch (error) {
      logger.error('NotificationHandlers.sendInterviewScheduledNotice error', error, { candidateId, interviewId });
      return false;
    }
  }
}
