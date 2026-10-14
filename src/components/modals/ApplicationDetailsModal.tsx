import React, { useState } from 'react';
import { JobApplication } from '../../types';
import { X, Calendar, FileText, Download, Trash2, Building2, User, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { VisualTimeline } from '../common/VisualTimeline';
import { Badge } from '../common/Badge';

export interface ApplicationDetailsModalProps {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (appId: string) => void;
}

export const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  application,
  isOpen,
  onClose,
  onWithdraw,
}) => {
  const [isConfirmingWithdraw, setIsConfirmingWithdraw] = useState(false);

  if (!isOpen || !application) return null;

  const isApplicantNameUnavailable =
    !application.applicantName ||
    application.applicantName.trim().toLowerCase() === 'candidate' ||
    application.applicantName.trim().toLowerCase() === 'undefined' ||
    application.applicantName.trim().toLowerCase() === 'null' ||
    application.applicantName.trim().toLowerCase() === 'name unavailable';
  const displayApplicantName = isApplicantNameUnavailable ? 'Name unavailable' : application.applicantName.trim();

  const handleDownloadSummary = () => {
    // Simulated PDF summary text download
    const content = `CARRIER CONNECT JOB APPLICATION SUMMARY
========================================
Application ID: ${application.id}
Job Title: ${application.jobTitle}
Company: ${application.companyName}
Status: ${application.status.toUpperCase()}
Applied Date: ${application.appliedDate}
Applicant Name: ${displayApplicantName}
Applicant Email: ${application.applicantEmail}

Cover Letter:
----------------------------------------
${application.coverLetter || 'N/A'}

Timeline Status History:
- Applied on ${application.appliedDate}
- Profile Reviewed by Talent Team
- Current Status: ${application.status}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Application_${application.jobTitle.replace(/\s+/g, '_')}_${application.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3.5">
            {application.companyLogoUrl ? (
              <img
                src={application.companyLogoUrl}
                alt={application.companyName}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 font-extrabold flex items-center justify-center text-lg">
                {application.companyName.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{application.companyName}</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                {application.jobTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              setIsConfirmingWithdraw(false);
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Visual Step Progress Timeline */}
          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <VisualTimeline
              currentStatus={application.status}
              appliedDate={application.appliedDate}
              updatedDate={application.updatedDate}
            />
          </div>

          {/* Submission Metadata */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Applicant Profile</span>
              <p className={`font-bold ${isApplicantNameUnavailable ? 'text-slate-400 dark:text-slate-500 italic' : 'text-slate-900 dark:text-white'}`}>{displayApplicantName}</p>
              <p className="text-slate-500 text-[11px] truncate">{application.applicantEmail}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Application Reference</span>
              <p className="font-bold text-slate-900 dark:text-white">#{application.id.slice(-8)}</p>
              <p className="text-slate-500 text-[11px]">Submitted: {application.appliedDate}</p>
            </div>
          </div>

          {/* Submitted Cover Letter */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Submitted Cover Letter
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 leading-relaxed italic">
              "{application.coverLetter || 'No cover letter attached for this application.'}"
            </div>
          </div>

          {/* Attached Document Placeholder */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-purple-500" />
              Attached Resume Document
            </h4>
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                  PDF
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs">
                    {application.resumeUrl ? 'Candidate_Resume_Primary.pdf' : 'Default_Profile_Resume.pdf'}
                  </p>
                  <p className="text-[11px] text-slate-400">1.4 MB • Parsed by Recruiter System</p>
                </div>
              </div>
              <button
                onClick={handleDownloadSummary}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          {/* Withdraw Warning Banner */}
          {isConfirmingWithdraw && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold">
                <AlertTriangle className="w-4 h-4" />
                Are you sure you want to withdraw this application?
              </div>
              <p className="text-[11px] text-rose-600 dark:text-rose-400">
                Withdrawing is permanent. You will lose your position in the interview pipeline and the employer will be notified.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onWithdraw(application.id);
                    setIsConfirmingWithdraw(false);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                >
                  Confirm Withdraw
                </button>
                <button
                  onClick={() => setIsConfirmingWithdraw(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          {application.status !== 'withdrawn' && application.status !== 'rejected' ? (
            <button
              onClick={() => setIsConfirmingWithdraw(true)}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Withdraw Application
            </button>
          ) : (
            <span className="text-[11px] text-slate-400 italic">Application Closed</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSummary}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              Export Summary
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
