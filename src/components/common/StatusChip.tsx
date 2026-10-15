import React from 'react';
import { getStatusBadgeStyle } from '../../utils/formatters';
import { cn } from '../../utils/cn';

export interface StatusChipProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  size = 'md',
  className,
}) => {
  const styles = getStatusBadgeStyle(status);

  const formattedLabel = status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border capitalize tracking-tight',
        styles.bg,
        styles.text,
        styles.border,
        sizeClasses[size],
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {formattedLabel}
    </span>
  );
};
