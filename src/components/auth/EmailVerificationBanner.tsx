import React, { useState } from 'react';
import { Mail, ArrowRight, X, Send } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { showSuccessToast } from '../../context/ToastContext';

interface EmailVerificationBannerProps {
  email?: string;
  onDismiss?: () => void;
  className?: string;
}

export const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({
  email = '',
  onDismiss,
  className = '',
}) => {
  const [isSending, setIsSending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleResend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      showSuccessToast(`Verification link sent to ${email}`);
    }, 600);
  };

  return (
    <div className={`p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
          <Mail className="w-4 h-4" />
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">Please verify your email address</p>
          <p className="text-[11px] text-amber-800 dark:text-amber-300">
            A confirmation link was sent to <strong className="underline">{email}</strong>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <button
          onClick={handleResend}
          disabled={isSending}
          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
        >
          <Send className="w-3 h-3" />
          {isSending ? 'Sending...' : 'Resend Link'}
        </button>

        <RouterLink to="/verify-email">
          <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer flex items-center gap-1 text-slate-800 dark:text-slate-200">
            Verify Page
            <ArrowRight className="w-3 h-3" />
          </button>
        </RouterLink>

        {onDismiss && (
          <button
            onClick={() => {
              setDismissed(true);
              onDismiss();
            }}
            className="p-1 rounded-lg hover:bg-amber-200/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 cursor-pointer ml-1"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
