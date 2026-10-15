import { getApps, initializeApp, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { logger } from '../utils/logger';
import { getEnvironmentConfig } from './environment';

function getFirebaseAdminApp(): App {
  const currentApps = getApps();
  if (currentApps.length > 0) {
    return currentApps[0];
  }

  try {
    const projectId = getEnvironmentConfig().projectId;
    return initializeApp(projectId ? { projectId } : undefined);
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK default app', error);
    throw error;
  }
}

export const adminApp: App = getFirebaseAdminApp();
export const adminDb: Firestore = getFirestore(adminApp);
export const adminAuth: Auth = getAuth(adminApp);
