import { NotificationDispatchPayload } from '../types/notification';

export class NotificationTemplates {
  /**
   * Template for new job alerts matching candidate preferences.
   */
  static jobAlert(userId: string, jobTitle: string, companyName: string, jobId: string): NotificationDispatchPayload {
    return {
      userId,
      title: 'New Matching Job Found',
      message: `${companyName} just posted a new role: "${jobTitle}". Review the posting now.`,
      type: 'job_alert',
      link: `/jobs/${jobId}`,
      metadata: { jobId, jobTitle, companyName },
    };
  }

  /**
   * Template for job posting from a followed company.
   */
  static companyJobPosted(userId: string, companyName: string, jobTitle: string, jobId: string): NotificationDispatchPayload {
    return {
      userId,
      title: `${companyName} posted a new opportunity`,
      message: `${companyName} is hiring for ${jobTitle}. Be among the first to apply!`,
      type: 'company_update',
      link: `/jobs/${jobId}`,
      metadata: { jobId, jobTitle, companyName },
    };
  }

  /**
   * Template for application status changes.
   */
  static applicationStatusUpdated(
    userId: string,
    jobTitle: string,
    companyName: string,
    statusText: string,
    applicationId: string
  ): NotificationDispatchPayload {
    return {
      userId,
      title: `Application Update: ${jobTitle}`,
      message: `Your application at ${companyName} has been updated to "${statusText}".`,
      type: 'application',
      link: `/dashboard`,
      metadata: { applicationId, jobTitle, companyName, statusText },
    };
  }

  /**
   * Template for interview scheduled or rescheduled.
   */
  static interviewScheduled(
    userId: string,
    jobTitle: string,
    companyName: string,
    scheduledDate: string,
    interviewId: string
  ): NotificationDispatchPayload {
    return {
      userId,
      title: `Interview Scheduled with ${companyName}`,
      message: `An interview for ${jobTitle} has been scheduled for ${scheduledDate}.`,
      type: 'interview',
      link: `/dashboard`,
      metadata: { interviewId, jobTitle, companyName, scheduledDate },
    };
  }

  /**
   * Template for system notifications.
   */
  static systemNotice(userId: string, title: string, message: string, link?: string): NotificationDispatchPayload {
    return {
      userId,
      title,
      message,
      type: 'system',
      link,
    };
  }
}
