import { 
  initializeFirestore, 
  getFirestore,
  Firestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  persistentSingleTabManager,
  memoryLocalCache,
  setLogLevel,
} from 'firebase/firestore';
import { app } from './firebaseApp';
import { isFirebaseConfigured } from './firebaseConfig';

// In development, preserve debug/warn diagnostics; in production, keep error logging active
// without silencing genuine production diagnostics.
try {
  if (import.meta.env.DEV) {
    setLogLevel('warn');
  } else {
    setLogLevel('error');
  }
} catch {
  // Ignore unsupported log level invocations
}

// Initialize Firestore with experimentalForceLongPolling enabled to ensure reliable,
// immediate HTTP connections across sandboxed network proxies and iframe environments,
// avoiding WebChannel stream dropouts/reconnect warnings.
let firestoreInstance: Firestore;

try {
  firestoreInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch {
  try {
    firestoreInstance = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      localCache: persistentLocalCache({
        tabManager: persistentSingleTabManager({}),
      }),
    });
  } catch {
    try {
      firestoreInstance = initializeFirestore(app, {
        experimentalForceLongPolling: true,
        localCache: memoryLocalCache({}),
      });
    } catch {
      firestoreInstance = getFirestore(app);
    }
  }
}

export const db: Firestore = firestoreInstance;
export { isFirebaseConfigured };

