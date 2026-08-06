import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'slate';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const colorMap = {
    primary: 'border-current border-t-transparent text-blue-600 dark:text-blue-400',
    white: 'border-white border-t-transparent text-white',
    slate: 'border-slate-400 border-t-transparent text-slate-500',
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'animate-spin rounded-full inline-block',
        sizeMap[size],
        colorMap[color],
        className
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
