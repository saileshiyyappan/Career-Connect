import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, isFirebaseConfigured } from '../firebase/config/firestore';
import { onSnapshotsInSync, doc, getDocFromServer } from 'firebase/firestore';

export type FirestoreConnectionState =
  | 'INITIALIZING'
  | 'ONLINE'
  | 'OFFLINE'
  | 'RECOVERING'
  | 'ERROR'
  | 'UNCONFIGURED';

interface FirestoreConnectionContextType {
  status: FirestoreConnectionState;
  isOnline: boolean;
  isConfigured: boolean;
  lastCheckedAt: number | null;
  errorMessage: string | null;
  checkConnection: () => Promise<void>;
}

const FirestoreConnectionContext = createContext<FirestoreConnectionContextType>({
  status: 'INITIALIZING',
  isOnline: true,
  isConfigured: false,
  lastCheckedAt: null,
  errorMessage: null,
  checkConnection: async () => {},
});

export const FirestoreConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<FirestoreConnectionState>(() => {
    if (!isFirebaseConfigured) return 'UNCONFIGURED';
    if (!navigator.onLine) return 'OFFLINE';
    return 'INITIALIZING';
  });
  const [lastCheckedAt, setLastCheckedAt] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkConnection = useCallback(async () => {
    if (!isFirebaseConfigured) {
      setStatus('UNCONFIGURED');
      return;
    }

    if (!navigator.onLine) {
      setStatus('OFFLINE');
      return;
    }

    try {
      setStatus((prev) => (prev === 'OFFLINE' ? 'RECOVERING' : prev));
      // Ping Firestore server with bounded timeout
      const pingPromise = getDocFromServer(doc(db, '_connection_test', 'ping'));
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Connection check timeout')), 4000)
      );

      await Promise.race([pingPromise, timeoutPromise]).catch((err) => {
        // A 'permission-denied' or 'not-found' still confirms Firestore server connection
        if (err && (err.code === 'permission-denied' || err.code === 'not-found')) {
          return;
        }
        if (err && err.message && err.message.includes('offline')) {
          throw err;
        }
      });

      setStatus('ONLINE');
      setErrorMessage(null);
      setLastCheckedAt(Date.now());
    } catch (err: any) {
      if (!navigator.onLine || (err.message && err.message.includes('offline'))) {
        setStatus('OFFLINE');
      } else {
        setStatus('ERROR');
        setErrorMessage(err?.message || 'Database connection error');
      }
      setLastCheckedAt(Date.now());
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setStatus('UNCONFIGURED');
      return;
    }

    // Handle browser network online/offline events
    const handleOnline = () => {
      setStatus('RECOVERING');
      checkConnection();
    };

    const handleOffline = () => {
      setStatus('OFFLINE');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    checkConnection();

    // Firestore sync listener
    let unsubscribeSync: (() => void) | undefined;
    try {
      unsubscribeSync = onSnapshotsInSync(db, () => {
        if (navigator.onLine) {
          setStatus((prev) => (prev === 'OFFLINE' || prev === 'INITIALIZING' ? 'ONLINE' : prev));
        }
      });
    } catch (err) {
      console.warn('Firestore onSnapshotsInSync listener warning:', err);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (unsubscribeSync) unsubscribeSync();
    };
  }, [checkConnection]);

  return (
    <FirestoreConnectionContext.Provider
      value={{
        status,
        isOnline: status === 'ONLINE',
        isConfigured: isFirebaseConfigured,
        lastCheckedAt,
        errorMessage,
        checkConnection,
      }}
    >
      {children}
    </FirestoreConnectionContext.Provider>
  );
};

export const useFirestoreConnection = () => useContext(FirestoreConnectionContext);
