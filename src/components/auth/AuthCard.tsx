import React from 'react';
import { CareerConnectLogo } from '../common/CareerConnectLogo';

interface AuthCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ElementType;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  children,
  title,
  subtitle,
  icon: Icon,
  className = '',
}) => {
  return (
    <div className={`p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 ${className}`}>
      {title && (
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center mx-auto">
            {Icon ? (
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Icon className="w-6 h-6" />
              </div>
            ) : (
              <CareerConnectLogo variant="mark" size="lg" />
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
