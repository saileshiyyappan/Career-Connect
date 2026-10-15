import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

const effectiveConfig = isFirebaseConfigured
  ? firebaseConfig
  : {
      apiKey: 'AIzaSyPlaceholderKeyForMockEnvironment000',
      authDomain: 'careerconnect-demo.firebaseapp.com',
      projectId: 'careerconnect-demo',
      storageBucket: 'careerconnect-demo.appspot.com',
      messagingSenderId: '123456789012',
      appId: '1:123456789012:web:abcdef1234567890',
    };

export const app: FirebaseApp = !getApps().length
  ? initializeApp(effectiveConfig)
  : getApp();
