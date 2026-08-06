import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { AuthCard } from '../../components/auth/AuthCard';
import { InputField } from '../../components/inputs/InputField';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Clock, Lock, Mail, LogIn, ShieldAlert } from 'lucide-react';
import { showSuccessToast } from '../../context/ToastContext';

export const SessionExpiredPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showSuccessToast('Session restored successfully.');
      navigate('/jobs');
    }, 500);
  };

  return (
    <PageContainer maxWidth="sm" className="py-12 sm:py-20">
      
      <AuthCard
        title="Session Expired"
        subtitle="For security reasons, your active session timed out due to inactivity."
        icon={Clock}
      >
        <div className="space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Please re-enter your password to unlock your workspace and resume where you left off.
          </p>

          <form onSubmit={handleReLogin} className="space-y-4 text-left">
            <InputField
              label="Email Address"
              type="email"
              value={user?.email || ''}
              disabled
              icon={Mail}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="Enter password to unlock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={Lock}
            />

            <div className="pt-2">
              <PrimaryButton
                type="submit"
                fullWidth
                size="lg"
                icon={LogIn}
                isLoading={isLoading}
              >
                Re-Authenticate Session
              </PrimaryButton>
            </div>
          </form>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            Need to sign in as a different user?{' '}
            <RouterLink to="/login" className="font-bold text-blue-600 hover:underline">
              Switch Account
            </RouterLink>
          </div>

        </div>
      </AuthCard>

    </PageContainer>
  );
};
