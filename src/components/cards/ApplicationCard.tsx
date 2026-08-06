import React, { useState } from 'react';
import { JobApplication } from '../../types';
import { StatusChip } from '../common/StatusChip';
import { Building2, Calendar, FileText, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

export interface ApplicationCardProps {
  application: JobApplication;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-4">
      <div className="space-y-4">
        
        {/* Header: Logo, Job Title, Company Name */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {application.companyLogoUrl ? (
              <img
                src={application.companyLogoUrl}
                alt={application.companyName}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 font-bold flex items-center justify-center text-lg border border-blue-200 dark:border-blue-800">
                {application.companyName.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{application.companyName}</p>
              <RouterLink
                to={`/jobs/${application.jobId}`}
                className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
              >
                {application.jobTitle}
              </RouterLink>
            </div>
          </div>

          <StatusChip status={application.status} />
        </div>

        {/* Candidate / Applied Meta */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Applicant: <strong className="text-slate-900 dark:text-white">{application.applicantName}</strong>
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Submitted {application.appliedDate}
            </span>
            <span>Ref ID: #{application.id.slice(-6)}</span>
          </div>
        </div>

        {/* Cover Letter Accordion */}
        {application.coverLetter && (
          <div className="space-y-2">
            <button
              onClick={() => setShowCoverLetter(!showCoverLetter)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showCoverLetter ? 'Hide Cover Letter' : 'Read Cover Letter'}</span>
              {showCoverLetter ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showCoverLetter && (
              <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal italic">
                "{application.coverLetter}"
              </div>
            )}
          </div>
        )}

      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-[11px]">
          Updated {application.updatedDate || application.appliedDate}
        </span>
        <RouterLink
          to={`/jobs/${application.jobId}`}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          View Role →
        </RouterLink>
      </div>

    </div>
  );
};
