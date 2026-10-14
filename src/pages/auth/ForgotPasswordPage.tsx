import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { InputField } from '../../components/inputs/InputField';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { AuthCard } from '../../components/auth/AuthCard';
import { AuthErrorMessage } from '../../components/auth/AuthErrorMessage';
import { Link as RouterLink } from 'react-router-dom';
import { KeyRound, Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { showSuccessToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.sendPasswordResetEmail(email);
      setIsLoading(false);
      setIsSubmitted(true);
      showSuccessToast(`Password reset link sent to ${email}`);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Failed to send reset link. Please check your email and try again.');
    }
  };

  return (
    <PageContainer maxWidth="sm" className="py-12 sm:py-20">
      
      <AuthCard
        title="Reset Password"
        subtitle="Enter your email address and we'll send you instructions to reset your password."
        icon={KeyRound}
      >
        <AuthErrorMessage message={errorMessage} onDismiss={() => setErrorMessage('')} />

        {isSubmitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Check Your Inbox</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              We have dispatched a password reset link to <strong>{email}</strong>. Please click the link inside the email to choose your new password.
            </p>
            
            <div className="pt-2 flex flex-col gap-2">
              <RouterLink to="/reset-password">
                <PrimaryButton fullWidth size="md">
                  Simulate Opening Reset Link
                </PrimaryButton>
              </RouterLink>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold py-2 cursor-pointer"
              >
                Didn't receive email? Try again
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email Address"
              type="email"
              placeholder="sailesh@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={Mail}
            />

            <div className="pt-2">
              <PrimaryButton
                type="submit"
                fullWidth
                size="lg"
                icon={Send}
                isLoading={isLoading}
              >
                Send Password Reset Link
              </PrimaryButton>
            </div>
          </form>
        )}

        {/* Back to Login Link */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
          <RouterLink
            to="/login"
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </RouterLink>
        </div>

      </AuthCard>

    </PageContainer>
  );
};
