import React from 'react';
import { Check, Clock, AlertCircle, Sparkles, X } from 'lucide-react';
import { ApplicationStatus } from '../../types';

export interface TimelineStep {
  key: string;
  label: string;
  description: string;
}

export const TIMELINE_STEPS: TimelineStep[] = [
  { key: 'applied', label: 'Applied', description: 'Application received by company portal' },
  { key: 'viewed', label: 'Recruiter Viewed', description: 'Profile & resume opened by talent team' },
  { key: 'shortlisted', label: 'Shortlisted', description: 'Selected for team screening' },
  { key: 'under_review', label: 'Under Review', description: 'Hiring manager evaluating candidate submission' },
  { key: 'interviewing', label: 'Interview Scheduled', description: 'Technical & HR rounds in progress' },
  { key: 'offered', label: 'Offer Received', description: 'Formal offer letter extended' },
  { key: 'hired', label: 'Hired', description: 'Offer accepted & onboarding initiated' },
];

export interface VisualTimelineProps {
  currentStatus: ApplicationStatus | string;
  appliedDate?: string;
  updatedDate?: string;
  className?: string;
}

export const VisualTimeline: React.FC<VisualTimelineProps> = ({
  currentStatus,
  appliedDate,
  updatedDate,
  className = '',
}) => {
  const isRejected = currentStatus === 'rejected';
  const isWithdrawn = currentStatus === 'withdrawn';

  // Map status string to index in TIMELINE_STEPS
  const getActiveIndex = () => {
    if (isRejected || isWithdrawn) return -1;
    switch (currentStatus) {
      case 'applied':
        return 0;
      case 'viewed':
        return 1;
      case 'shortlisted':
        return 2;
      case 'under_review':
        return 3;
      case 'interviewing':
        return 4;
      case 'offered':
        return 5;
      case 'hired':
        return 6;
      default:
        return 0;
    }
  };

  const activeIndex = getActiveIndex();

  if (isRejected || isWithdrawn) {
    return (
      <div className={`p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center gap-3 text-rose-700 dark:text-rose-300 ${className}`}>
        <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
          <X className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <p className="font-bold">
            Application {isRejected ? 'Declined / Rejected' : 'Withdrawn by Candidate'}
          </p>
          <p className="text-rose-600/80 dark:text-rose-400/80 text-[11px] mt-0.5">
            {isRejected
              ? 'The employer has closed this hiring process for your candidate profile.'
              : 'You voluntarily withdrew your application from this role.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Application Pipeline Progress</span>
        {appliedDate && (
          <span>Submitted on <strong className="text-slate-800 dark:text-slate-200">{appliedDate}</strong></span>
        )}
      </div>

      {/* Step Nodes Bar */}
      <div className="relative flex items-center justify-between w-full">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 z-0 rounded-full" />
        
        {/* Active Connecting Line Fill */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-blue-600 dark:bg-blue-500 z-0 rounded-full transition-all duration-500"
          style={{ width: `${(activeIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
        />

        {TIMELINE_STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-blue-600 text-white ring-4 ring-blue-50 dark:ring-blue-950'
                    : isCurrent
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100 dark:ring-amber-950/60 animate-pulse'
                    : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Tooltip on Hover */}
              <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                <div className="bg-slate-900 text-white dark:bg-slate-800 text-[10px] font-semibold py-1 px-2.5 rounded-lg shadow-xl whitespace-nowrap text-center">
                  <p className="font-bold">{step.label}</p>
                  <p className="text-slate-300 font-normal text-[9px]">{step.description}</p>
                </div>
                <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 -mt-1" />
              </div>

              <span className={`text-[10px] font-bold mt-1.5 hidden sm:block text-center max-w-[64px] line-clamp-1 ${
                isCurrent
                  ? 'text-amber-600 dark:text-amber-400 font-black'
                  : isCompleted
                  ? 'text-slate-800 dark:text-slate-200'
                  : 'text-slate-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {updatedDate && (
        <p className="text-[11px] text-slate-400 text-right">
          Last status update: {updatedDate}
        </p>
      )}
    </div>
  );
};
