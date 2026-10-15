import React from 'react';
import { Job } from '../../types';
import { X, Check, DollarSign, MapPin, Briefcase, Award, Zap } from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';
import { Badge } from '../common/Badge';

export interface JobComparisonModalProps {
  jobs: Job[];
  isOpen: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
}

export const JobComparisonModal: React.FC<JobComparisonModalProps> = ({
  jobs,
  isOpen,
  onClose,
  onApply,
}) => {
  if (!isOpen) return null;

  const formatSalary = (job: Job) => {
    if (typeof job.salary === 'string') return job.salary || 'Not specified';
    if (job.salaryMin == null && job.salaryMax == null) return 'Not specified';
    const currency = job.salary.currency || 'USD';
    const format = (value?: number) => value == null ? '' : `${currency} ${value.toLocaleString()}`;
    if (job.salaryMin != null && job.salaryMax != null) return `${format(job.salaryMin)} - ${format(job.salaryMax)}`;
    return format(job.salaryMin ?? job.salaryMax);
  };

  const formatLocation = (job: Job) => {
    if (typeof job.location === 'string') return job.location || 'Not specified';
    return [job.location.city, job.location.state, job.location.country].filter(Boolean).join(', ') || 'Not specified';
  };

  const comparableJobs = jobs.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-5xl w-full my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Side-by-Side Job Comparison
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparing {comparableJobs.length} bookmarked opportunities to help you decide where to apply first.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table Grid */}
        <div className="p-6 overflow-x-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-3 w-1/4 text-slate-400 uppercase font-bold text-[11px]">Feature</th>
                {comparableJobs.map((job) => (
                  <th key={job.id} className="py-4 px-4 w-1/3 min-w-[220px]">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        {job.companyLogoUrl ? (
                          <img
                            src={job.companyLogoUrl}
                            alt={job.companyName}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 font-bold flex items-center justify-center text-sm">
                            {job.companyName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-slate-500 font-medium">{job.companyName}</p>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">{job.title}</h4>
                        </div>
                      </div>
                      <PrimaryButton
                        size="sm"
                        className="w-full mt-2 text-xs py-1.5"
                        onClick={() => {
                          onClose();
                          onApply(job);
                        }}
                      >
                        Apply Now
                      </PrimaryButton>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {/* Salary Row */}
              <tr>
                <td className="py-3.5 px-3 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  Salary Range
                </td>
                {comparableJobs.map((job) => (
                  <td key={job.id} className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {formatSalary(job)}
                  </td>
                ))}
              </tr>

              {/* Location & Remote Row */}
              <tr>
                <td className="py-3.5 px-3 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  Location & Work Mode
                </td>
                {comparableJobs.map((job) => (
                  <td key={job.id} className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    <p className="font-semibold">{formatLocation(job)}</p>
                    <Badge variant={job.isRemote ? 'success' : 'default'} size="sm" className="mt-1">
                      {job.isRemote ? 'Remote Friendly' : 'On-Site / Hybrid'}
                    </Badge>
                  </td>
                ))}
              </tr>

              {/* Experience Level Row */}
              <tr>
                <td className="py-3.5 px-3 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-500" />
                  Experience & Role Level
                </td>
                {comparableJobs.map((job) => (
                  <td key={job.id} className="py-3.5 px-4 text-slate-700 dark:text-slate-300 capitalize">
                    {job.experienceLevel || 'Not specified'} ({job.employmentType || 'Not specified'})
                  </td>
                ))}
              </tr>

              {/* Required Skills Row */}
              <tr>
                <td className="py-3.5 px-3 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Key Tech Stack
                </td>
                {comparableJobs.map((job) => (
                  <td key={job.id} className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1.5">
                      {job.skillsRequired?.length ? job.skillsRequired.map((skill) => (
                        <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                          {skill}
                        </span>
                      )) : <span className="text-slate-500">Not specified</span>}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Benefits & Perks */}
              <tr>
                <td className="py-3.5 px-3 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Included Perks
                </td>
                {comparableJobs.map((job) => (
                  <td key={job.id} className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Not specified
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
