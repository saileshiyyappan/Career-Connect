import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { InputField } from '../../components/inputs/InputField';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { AuthCard } from '../../components/auth/AuthCard';
import { PasswordStrengthIndicator } from '../../components/auth/PasswordStrengthIndicator';
import { AuthErrorMessage } from '../../components/auth/AuthErrorMessage';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';
import { showSuccessToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const urlParams = new URLSearchParams(window.location.search);
<<<<<<< HEAD
      const oobCode = urlParams.get('oobCode');
      if (!oobCode) {
        throw new Error('This password reset link is invalid or incomplete.');
      }
=======
      const oobCode = urlParams.get('oobCode') || 'reset-token-demo';
>>>>>>> origin/main
      await authService.confirmPasswordReset(oobCode, password);
      setIsLoading(false);
      setIsSuccess(true);
      showSuccessToast('Password has been updated successfully.');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Failed to reset password. The link may be expired.');
    }
  };

  return (
    <PageContainer maxWidth="sm" className="py-12 sm:py-20">
      
      <AuthCard
        title="Set New Password"
        subtitle="Please create a strong new password for your CareerConnect account."
        icon={ShieldCheck}
      >
        <AuthErrorMessage message={errorMessage} onDismiss={() => setErrorMessage('')} />

        {isSuccess ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Password Reset Complete</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
              Your account password has been successfully changed. You can now sign in with your new credentials.
            </p>
            
            <div className="pt-2">
              <RouterLink to="/login">
                <PrimaryButton fullWidth size="lg">
                  Proceed to Sign In
                </PrimaryButton>
              </RouterLink>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <InputField
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {password && <PasswordStrengthIndicator password={password} />}

            <InputField
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              icon={Lock}
            />

            <div className="pt-2">
              <PrimaryButton
                type="submit"
                fullWidth
                size="lg"
                icon={Lock}
                isLoading={isLoading}
              >
                Reset Password
              </PrimaryButton>
            </div>
          </form>
        )}

      </AuthCard>

    </PageContainer>
  );
};
