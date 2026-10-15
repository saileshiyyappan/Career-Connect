import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { cn } from '../../utils/cn';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section. Please try again.',
  onRetry,
  className,
}) => {
  return (
    <div className={cn('p-6 sm:p-8 rounded-2xl bg-rose-500/5 border border-rose-200 dark:border-rose-950 text-center flex flex-col items-center justify-center', className)}>
      <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-4">{message}</p>
      {onRetry && (
        <PrimaryButton size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </PrimaryButton>
      )}
    </div>
  );
};
