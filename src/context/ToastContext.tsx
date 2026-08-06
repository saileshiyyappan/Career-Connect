import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    style: {
      borderRadius: '12px',
      background: 'var(--toast-bg, #1e293b)',
      color: '#f8fafc',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '14px',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#ffffff',
    },
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    style: {
      borderRadius: '12px',
      background: 'var(--toast-bg, #1e293b)',
      color: '#f8fafc',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '14px',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#ffffff',
    },
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      borderRadius: '12px',
      background: 'var(--toast-bg, #1e293b)',
      color: '#f8fafc',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '14px',
    },
  });
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};
