import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config();
// Local development may run from either the repository root or functions/.
// Deployed Functions continue to use injected environment variables.
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });

export interface EnvironmentConfig {
  jobApiId?: string;
  jobApiKey?: string;
  jobApiBaseUrl?: string;
  newsApiKey?: string;
  newsApiBaseUrl?: string;
  syncSchedule: string;
  nodeEnv: string;
  projectId?: string;
}

export function getEnvironmentConfig(): EnvironmentConfig {
  const jobApiId = process.env.JOB_APP_ID || process.env.JOB_API_ID || undefined;
  const configuredKeys = [process.env.JOB_API_KEY, process.env.JOB_APP_KEY].filter(Boolean) as string[];
  if (configuredKeys.length === 2 && configuredKeys[0] !== configuredKeys[1]) {
    throw new Error('Conflicting Adzuna credentials: configure only one of JOB_API_KEY or JOB_APP_KEY.');
  }
  let firebaseConfigProjectId: string | undefined;
  if (process.env.FIREBASE_CONFIG) {
    try {
      firebaseConfigProjectId = JSON.parse(process.env.FIREBASE_CONFIG).projectId || undefined;
    } catch {
      throw new Error('FIREBASE_CONFIG must contain valid JSON.');
    }
  }

  return {
    jobApiId,
    jobApiKey: configuredKeys[0],
    jobApiBaseUrl: process.env.JOB_API_BASE_URL || undefined,
    newsApiKey: process.env.NEWS_API_KEY || undefined,
    newsApiBaseUrl: process.env.NEWS_API_BASE_URL || undefined,
    syncSchedule: process.env.AGGREGATION_SYNC_SCHEDULE || 'every 24 hours',
    nodeEnv: process.env.NODE_ENV || 'production',
    projectId: process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || firebaseConfigProjectId || process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || undefined,
  };
}
