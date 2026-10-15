import React from 'react';
import { CareerConnectLogo } from '../common/CareerConnectLogo';

interface AuthLoadingScreenProps {
  message?: string;
}

export const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({
  message = 'Verifying credentials and setting up session...',
}) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="relative">
        <CareerConnectLogo variant="mark" size="lg" className="animate-pulse" />
      </div>
      <CareerConnectLogo variant="vertical" size="sm" showTagline={false} />
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">{message}</p>
    </div>
  );
};
