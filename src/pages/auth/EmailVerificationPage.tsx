import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { AuthCard } from '../../components/auth/AuthCard';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
<<<<<<< HEAD
import { showErrorToast, showSuccessToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { auth } from '../../firebase/config/auth';
=======
import { showSuccessToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
>>>>>>> origin/main

export const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);

  const email = user?.email || 'your account email';

  const handleResend = async () => {
    setIsResending(true);
    try {
      await authService.sendEmailVerification(email);
      setIsResending(false);
      showSuccessToast(`Verification link sent to ${email}`);
    } catch (err) {
      setIsResending(false);
<<<<<<< HEAD
      showErrorToast('Unable to resend the verification email. Please try again.');
    }
  };

  const handleCheckVerification = async () => {
    try {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        showSuccessToast('Email verified successfully!');
        navigate('/verify-success');
      } else {
        showErrorToast('Your email is not verified yet. Please use the link in your inbox.');
      }
    } catch {
      showErrorToast('Unable to check verification status. Please try again.');
    }
=======
      showSuccessToast(`Verification link sent to ${email}`);
    }
  };

  const handleSimulateVerification = () => {
    showSuccessToast('Email verified successfully!');
    navigate('/verify-success');
>>>>>>> origin/main
  };

  return (
    <PageContainer maxWidth="sm" className="py-12 sm:py-20">
      
      <AuthCard
        title="Verify Your Email Address"
        subtitle={`We've sent a verification link to your registered email address.`}
        icon={Mail}
      >
        <div className="text-center space-y-6 py-2">
          
          <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto ring-8 ring-blue-50/50 dark:ring-blue-900/20">
            <Mail className="w-10 h-10 animate-pulse" />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-bold text-slate-900 dark:text-white">{email}</p>
            <p className="text-[11px] text-slate-500">Please check your spam or junk folder if you don't see it in your inbox.</p>
          </div>

          <div className="space-y-3 pt-2">
            <PrimaryButton
<<<<<<< HEAD
              onClick={handleCheckVerification}
=======
              onClick={handleSimulateVerification}
>>>>>>> origin/main
              fullWidth
              size="lg"
              icon={CheckCircle2}
            >
              Confirm Verification
            </PrimaryButton>

            <SecondaryButton
              onClick={handleResend}
              disabled={isResending}
              fullWidth
              size="md"
              icon={RefreshCw}
            >
              {isResending ? 'Resending Link...' : 'Resend Verification Email'}
            </SecondaryButton>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <RouterLink to="/onboarding" className="font-semibold text-blue-600 hover:underline">
              Skip for now →
            </RouterLink>
            <RouterLink to="/login" className="hover:underline">
              Sign in with another account
            </RouterLink>
          </div>

        </div>
      </AuthCard>

    </PageContainer>
  );
};
