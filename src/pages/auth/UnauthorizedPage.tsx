import React from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ShieldX, ArrowLeft, Home, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  return (
    <PageContainer maxWidth="sm" className="py-16 sm:py-24 text-center">
      
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
        
        <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto ring-8 ring-rose-50 dark:ring-rose-950/20">
          <ShieldX className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
            403 - Access Denied
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Unauthorized Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            You don't have permission to access this page. This portal is restricted to specific account roles ({role === 'guest' ? 'Requires Sign In' : `Current Role: ${role}`}).
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <SecondaryButton onClick={() => navigate(-1)} icon={ArrowLeft}>
            Go Back
          </SecondaryButton>

          {role === 'guest' ? (
            <RouterLink to="/login">
              <PrimaryButton icon={LogIn}>
                Sign In Now
              </PrimaryButton>
            </RouterLink>
          ) : (
            <RouterLink to="/dashboard">
              <PrimaryButton icon={Home}>
                Return to My Dashboard
              </PrimaryButton>
            </RouterLink>
          )}
        </div>

      </div>

    </PageContainer>
  );
};
