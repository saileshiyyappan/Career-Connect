import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

interface AuthErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const AuthErrorMessage: React.FC<AuthErrorMessageProps> = ({
  message,
  onDismiss,
  className = '',
}) => {
  if (!message) return null;

  return (
    <div className={`p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 text-rose-800 dark:text-rose-200 flex items-start gap-3 text-xs shadow-xs ${className}`}>
      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-bold text-rose-900 dark:text-rose-100">Authentication Error</p>
        <p className="mt-0.5 text-rose-700 dark:text-rose-300 leading-relaxed">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 cursor-pointer"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
