import React, { useState } from 'react';
import { Modal } from './Modal';
import { Job } from '../../types';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';
import { TextareaInput } from '../inputs/TextareaInput';
import { InputField } from '../inputs/InputField';
import { Badge } from '../common/Badge';
import { Upload, CheckCircle2, FileText, Send, Building, MapPin, DollarSign } from 'lucide-react';
import { useJobContext } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { resolveCandidateName } from '../../services/candidateDiscoveryService';

interface ApplyJobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ job, isOpen, onClose }) => {
  const { applyToJob, userProfile } = useJobContext();
  const { role, user } = useAuth();

  const resolved = resolveCandidateName(user || userProfile);
  const applicantDisplayName = !resolved.isUnavailable ? resolved.name : (userProfile.displayName || 'Name unavailable');

  const [coverLetter, setCoverLetter] = useState('');
  const [selectedResume, setSelectedResume] = useState(userProfile.resumeName || userProfile.resumeUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard: External jobs must direct to external portal
    if (job.jobOrigin === 'external') {
      if (job.sourceUrl) {
        window.open(job.sourceUrl, '_blank', 'noopener,noreferrer');
      }
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      const submitted = await applyToJob(job.id, coverLetter, selectedResume);
      if (submitted) setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsSubmitted(false);
    setCoverLetter('');
    onClose();
  };

  const formatSalary = (salary: Job['salary']) => {
    if (typeof salary === 'string') return salary;
    if (!salary) return 'Competitive';
    return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k / ${salary.period}`;
  };

  const formatLocation = (loc: Job['location']) => {
    if (typeof loc === 'string') return loc;
    if (!loc) return 'Remote';
    return `${loc.city}${loc.state ? `, ${loc.state}` : ''} ${loc.isRemote ? '(Remote)' : ''}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title={isSubmitted ? "Application Submitted!" : `Apply for ${job.title}`}>
      {isSubmitted ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Your application was sent to {job.companyName}!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            The recruiting team will review your profile and resume. You can track your application status anytime in your Candidate Workspace.
          </p>
          <div className="pt-4 flex justify-center">
            <PrimaryButton onClick={handleModalClose}>
              Done & Return
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Job Summary Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5">
            {job.companyLogoUrl && (
              <img
                src={job.companyLogoUrl}
                alt={job.companyName}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
              />
            )}
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{job.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                <span>{job.companyName}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{formatLocation(job.location)}</span>
              </p>
              <Badge variant="accent" size="sm" className="mt-1">
                <DollarSign className="w-3 h-3 mr-0.5" />
                {formatSalary(job.salary)}
              </Badge>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Full Name"
              placeholder="Your Full Name"
              value={applicantDisplayName}
              disabled
            />
            <InputField
              label="Email Address"
              placeholder="your.email@example.com"
              value={userProfile.email}
              disabled
            />
          </div>

          {/* Resume Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Resume / CV Attachment
            </label>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {selectedResume}
                  </p>
                  <p className="text-[11px] text-slate-500">Updated {userProfile.resumeUpdatedAt || 'recently'}</p>
                </div>
              </div>

              <label className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Replace</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedResume(e.target.files[0].name);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Cover Letter Input */}
          <TextareaInput
            label="Cover Letter / Intro Note (Optional)"
            placeholder="Tell the hiring team why you are a great fit for this position..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={4}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <SecondaryButton type="button" onClick={onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" icon={Send} isLoading={isSubmitting}>
              Submit Application
            </PrimaryButton>
          </div>
        </form>
      )}
    </Modal>
  );
};
