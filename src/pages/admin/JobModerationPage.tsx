import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Badge } from '../../components/common/Badge';
import { adminPortalService, AdminJob } from '../../services/adminPortalService';
import {
  Search,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Archive,
  Trash2,
  MapPin,
  Clock,
  Building,
} from 'lucide-react';

export const JobModerationPage: React.FC = () => {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    adminPortalService.getJobs().then(setJobs);
  }, []);

  const handleUpdateStatus = async (jobId: string, status: AdminJob['status']) => {
    await adminPortalService.updateJobStatus(jobId, status);
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status } : j)));
    setSuccessMsg(`Job listing status updated to ${status}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && j.status !== statusFilter) return false;
    return true;
  });

  const reportedJobs = jobs.filter((j) => j.status === 'Reported' || j.reportsCount > 0);

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="Platform-Wide Job Moderation & Listings"
        subtitle="Review posted jobs, clear reported listings, approve new submissions, and enforce compliance."
        badge="Listing Operations"
      />

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {successMsg}
        </div>
      )}

      {/* Reported Jobs Section */}
      {reportedJobs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Reported Job Postings Require Attention ({reportedJobs.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportedJobs.map((j) => (
              <div
                key={j.id}
                className="p-5 rounded-3xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">{j.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {j.companyName} • {j.location}
                    </p>
                  </div>
                  <Badge variant="danger" size="sm">
                    {j.reportsCount} User Reports
                  </Badge>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-rose-200/60 dark:border-rose-900/40">
                  <button
                    onClick={() => handleUpdateStatus(j.id, 'Active')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                  >
                    Clear Flags (Approve)
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(j.id, 'Rejected')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer"
                  >
                    Reject & Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search listings by title, employer, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['all', 'Active', 'Pending', 'Reported', 'Expired', 'Archived'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Job Title & Employer</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Salary</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Applicants</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-extrabold text-slate-900 dark:text-white block">{job.title}</span>
                      <span className="text-[11px] text-slate-400">{job.companyName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{job.location}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-bold">{job.salary}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        job.status === 'Active'
                          ? 'success'
                          : job.status === 'Pending'
                          ? 'warning'
                          : job.status === 'Reported'
                          ? 'danger'
                          : 'secondary'
                      }
                      size="sm"
                    >
                      {job.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                    {job.applicationsCount} applicants
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      {job.status !== 'Active' && (
                        <button
                          onClick={() => handleUpdateStatus(job.id, 'Active')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-100"
                        >
                          Approve
                        </button>
                      )}
                      {job.status !== 'Archived' && (
                        <button
                          onClick={() => handleUpdateStatus(job.id, 'Archived')}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
                        >
                          Archive
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(job.id, 'Rejected')}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-100"
                      >
                        Reject
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
