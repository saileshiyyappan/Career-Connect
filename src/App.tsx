import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { FirestoreConnectionProvider } from './context/FirestoreConnectionContext';
import { ToastProvider } from './context/ToastContext';
import { JobProvider } from './context/JobContext';
import { AppRoutes } from './routes/AppRoutes';
import { ConnectionBanner } from './components/common/ConnectionBanner';

function AppContent() {
  return (
    <>
      <ConnectionBanner />
      <AppRoutes />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <FirestoreConnectionProvider>
          <AuthProvider>
            <ToastProvider>
              <JobProvider>
                <AppContent />
              </JobProvider>
            </ToastProvider>
          </AuthProvider>
        </FirestoreConnectionProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}


