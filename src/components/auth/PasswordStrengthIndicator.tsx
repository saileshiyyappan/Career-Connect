import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  className = '',
}) => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const passedCriteria = [hasMinLength, hasUppercase, hasNumber, hasSpecialChar].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (!password) return { label: 'Empty', color: 'bg-slate-200 dark:bg-slate-700' };
    if (passedCriteria <= 1) return { label: 'Weak', color: 'bg-rose-500' };
    if (passedCriteria === 2) return { label: 'Fair', color: 'bg-amber-500' };
    if (passedCriteria === 3) return { label: 'Good', color: 'bg-blue-500' };
    return { label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getStrengthLabel();

  return (
    <div className={`space-y-2 text-xs ${className}`}>
      {/* Strength Bar */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          Password Strength:
        </span>
        <span
          className={`text-[11px] font-bold ${
            passedCriteria >= 3
              ? 'text-emerald-600 dark:text-emerald-400'
              : passedCriteria === 2
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-rose-500'
          }`}
        >
          {password ? strength.label : 'None'}
        </span>
      </div>

      {/* Segmented Progress Bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        <div
          className={`rounded-full transition-colors ${
            passedCriteria >= 1 ? strength.color : 'bg-slate-200 dark:bg-slate-800'
          }`}
        />
        <div
          className={`rounded-full transition-colors ${
            passedCriteria >= 2 ? strength.color : 'bg-slate-200 dark:bg-slate-800'
          }`}
        />
        <div
          className={`rounded-full transition-colors ${
            passedCriteria >= 3 ? strength.color : 'bg-slate-200 dark:bg-slate-800'
          }`}
        />
        <div
          className={`rounded-full transition-colors ${
            passedCriteria >= 4 ? strength.color : 'bg-slate-200 dark:bg-slate-800'
          }`}
        />
      </div>

      {/* Checklists */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-1 text-[11px]">
        <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
          {hasMinLength ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
          <span>At least 8 characters</span>
        </div>

        <div className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
          {hasUppercase ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
          <span>Uppercase letter</span>
        </div>

        <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
          {hasNumber ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
          <span>At least one number</span>
        </div>

        <div className={`flex items-center gap-1 ${hasSpecialChar ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
          {hasSpecialChar ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0" />}
          <span>Special character</span>
        </div>
      </div>
    </div>
  );
};
