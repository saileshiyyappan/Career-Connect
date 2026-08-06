import { SalaryRange } from '../types/job';
import { ApplicationStatus } from '../types/application';

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatSalaryRange = (salary?: SalaryRange | string): string => {
  if (!salary) return 'Salary Negotiable';
  if (typeof salary === 'string') return salary;
  
  const min = formatCurrency(salary.min, salary.currency);
  const max = formatCurrency(salary.max, salary.currency);
  const periodLabel = salary.period === 'yearly' ? '/yr' : salary.period === 'monthly' ? '/mo' : '/hr';
  
  return `${min} - ${max} ${periodLabel}`;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const getStatusBadgeStyle = (status: ApplicationStatus | string): { bg: string; text: string; border: string } => {
  switch (status.toLowerCase()) {
    case 'applied':
      return { bg: 'bg-blue-500/10 dark:bg-blue-950/50', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-900' };
    case 'under_review':
      return { bg: 'bg-amber-500/10 dark:bg-amber-950/50', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-900' };
    case 'shortlisted':
    case 'interviewing':
      return { bg: 'bg-purple-500/10 dark:bg-purple-950/50', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-900' };
    case 'offered':
    case 'active':
      return { bg: 'bg-emerald-500/10 dark:bg-emerald-950/50', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-900' };
    case 'rejected':
    case 'closed':
      return { bg: 'bg-rose-500/10 dark:bg-rose-950/50', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-900' };
    default:
      return { bg: 'bg-slate-500/10 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' };
  }
};
