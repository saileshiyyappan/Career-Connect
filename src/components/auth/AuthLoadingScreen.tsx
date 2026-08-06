import React from 'react';
import { Briefcase } from 'lucide-react';

interface AuthLoadingScreenProps {
  message?: string;
}

export const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({
  message = 'Verifying credentials and setting up session...',
}) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-lg animate-bounce">
          <Briefcase className="w-8 h-8" />
        </div>
        <div className="absolute -inset-2 rounded-full border-2 border-blue-500/30 animate-ping -z-10" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">CareerConnect</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">{message}</p>
    </div>
  );
};
