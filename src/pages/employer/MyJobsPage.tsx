import React from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { useJobContext } from '../../context/JobContext';
import { PlusCircle, Briefcase, Eye, Users, Calendar, MapPin, DollarSign, Trash2 } from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export const MyJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs } = useJobContext();

  const formatSalary = (salary: typeof jobs[0]['salary']) => {
    if (typeof salary === 'string') return salary;
    if (!salary) return 'Competitive';
    return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k`;
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Manage Posted Jobs"
          subtitle="View active job postings, applicant metrics, and manage vacancy status."
          badge="Recruiter Workspace"
        />
        <RouterLink to="/post-job">
          <PrimaryButton icon={PlusCircle}>Post New Position</PrimaryButton>
        </RouterLink>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-4 px-6">Job Position</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Compensation</th>
                <th className="py-4 px-6">Applicants</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{job.title}</p>
                      <p className="text-slate-500 text-[11px] flex items-center gap-2">
                        <span>{job.companyName}</span>
                        <span>•</span>
                        <span>Posted {job.postedAt}</span>
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="info" size="sm">{job.category || 'Engineering'}</Badge>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">
                    {formatSalary(job.salary)}
                  </td>
                  <td className="py-4 px-6 font-bold text-blue-600 dark:text-blue-400">
                    {job.applicantCount || 0} candidate(s)
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="accent" size="sm">Active</Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        title="View Listing"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};
