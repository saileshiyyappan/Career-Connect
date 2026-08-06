import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';

export const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();
