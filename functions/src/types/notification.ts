export type ServerNotificationType = 'application' | 'interview' | 'system' | 'job_alert' | 'company_update';

export interface ServerNotificationDocument {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: ServerNotificationType;
  link?: string;
  read: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string; // ISO 8601 string
}

export interface NotificationDispatchPayload {
  userId: string;
  title: string;
  message: string;
  type: ServerNotificationType;
  link?: string;
  metadata?: Record<string, unknown>;
}
