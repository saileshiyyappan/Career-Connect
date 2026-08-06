import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';
import { LoadingSpinner } from './LoadingSpinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  size = 'md',
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const { accentConfig } = useTheme();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg font-medium gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl font-semibold gap-2',
    lg: 'px-6 py-3.5 text-base rounded-xl font-semibold gap-2.5',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white active:scale-[0.98]',
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      style={{
        backgroundColor: accentConfig.primaryHex,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.backgroundColor = accentConfig.hoverHex;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          e.currentTarget.style.backgroundColor = accentConfig.primaryHex;
        }
      }}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner size={size === 'sm' ? 'sm' : 'sm'} color="white" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
        </>
      )}
    </button>
  );
};
