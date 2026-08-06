import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { useJobContext } from '../../context/JobContext';
import { Job } from '../../types';
import {
  PlusCircle,
  Eye,
  Users,
  Copy,
  Archive,
  XCircle,
  Trash2,
  Edit3,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  BarChart3
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const ManageJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, postJob } = useJobContext();
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'drafts' | 'closed' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobForPreview, setSelectedJobForPreview] = useState<Job | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const formatSalary = (salary: Job['salary']) => {
    if (typeof salary === 'string') return salary;
    if (!salary) return 'Competitive';
    return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k`;
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          j.category?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterTab === 'all') return true;
    if (filterTab === 'active') return true; // all in context are active currently
    return true;
  });

  const handleDuplicateJob = (jobToDup: Job) => {
    postJob({
      ...jobToDup,
      title: `${jobToDup.title} (Copy)`,
    });
    setActionSuccessMsg(`Duplicated "${jobToDup.title}" successfully.`);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  return (
    <PageContainer className="py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Advanced Job Postings Management"
          subtitle="Publish, edit, duplicate, archive, or close job openings across your organization."
          badge="ATS Job Center"
        />
        <Link to="/post-job">
          <PrimaryButton icon={PlusCircle}>Post New Opening</PrimaryButton>
        </Link>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {actionSuccessMsg}
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Postings' },
            { id: 'active', label: 'Active & Published' },
            { id: 'drafts', label: 'Drafts' },
            { id: 'closed', label: 'Closed' },
            { id: 'archived', label: 'Archived' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filterTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Job Table */}
      <div className="overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-4 px-6">Job Position</th>
                <th className="py-4 px-6">Category / Type</th>
                <th className="py-4 px-6">Compensation</th>
                <th className="py-4 px-6">Applicants</th>
                <th className="py-4 px-6">Views</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{job.title}</p>
                      <p className="text-slate-500 text-[11px]">
                        Posted {job.postedAt} • {job.location.city}, {job.location.state}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 space-y-1">
                    <Badge variant="info" size="sm">{job.category || 'Engineering'}</Badge>
                    <p className="text-[10px] text-slate-400 font-semibold">{job.employmentType}</p>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">
                    {formatSalary(job.salary)}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => navigate(`/employer/candidates?jobId=${job.id}`)}
                      className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      {job.applicantCount || 0} candidate(s)
                    </button>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">
                    {job.viewsCount || 340} views
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="success" size="sm">Active</Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedJobForPreview(job)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        title="Preview Listing Modal"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDuplicateJob(job)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        title="Duplicate Posting"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedJobForPreview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <Badge variant="info" size="sm">Job Posting Preview</Badge>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedJobForPreview.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedJobForPreview.companyName} • {selectedJobForPreview.location.city}, {selectedJobForPreview.location.state}
                </p>
              </div>
              <button
                onClick={() => setSelectedJobForPreview(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                  Description
                </h4>
                <p className="leading-relaxed">{selectedJobForPreview.description}</p>
              </div>

              {selectedJobForPreview.skillsRequired && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJobForPreview.skillsRequired.map((s) => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <SecondaryButton onClick={() => setSelectedJobForPreview(null)}>
                Close Preview
              </SecondaryButton>
              <PrimaryButton onClick={() => {
                const id = selectedJobForPreview.id;
                setSelectedJobForPreview(null);
                navigate(`/jobs/${id}`);
              }}>
                Open Public Listing
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
