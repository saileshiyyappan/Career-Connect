import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Badge } from '../../components/common/Badge';
import { adminPortalService, AdminApplication } from '../../services/adminPortalService';
import { Search, ShieldAlert, FileText, CheckCircle2, Filter, AlertTriangle, Users } from 'lucide-react';

export const ApplicationMonitoringPage: React.FC = () => {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    adminPortalService.getApplications().then(setApplications);
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    return true;
  });

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="Platform Application Flow & Security Monitoring"
        subtitle="Monitor application throughput, fraud risk flags, and candidate pipeline conversions."
        badge="Audit Engine"
      />

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name, email, job position, or employer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['all', 'Submitted', 'Under Review', 'Shortlisted', 'Interviewing', 'Offered'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Job Opening & Company</th>
                <th className="py-3.5 px-4">Applied Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Risk & Fraud Signals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-extrabold text-slate-900 dark:text-white block">{app.candidateName}</span>
                      <span className="text-[11px] text-slate-400">{app.candidateEmail}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{app.jobTitle}</span>
                      <span className="text-[11px] text-blue-600 dark:text-blue-400">{app.companyName}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">{app.appliedDate}</td>

                  <td className="py-3.5 px-4">
                    <Badge variant="info" size="sm">{app.status}</Badge>
                  </td>

                  <td className="py-3.5 px-4">
                    {app.riskFlags && app.riskFlags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {app.riskFlags.map((flag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold flex items-center gap-1 border border-rose-200 dark:border-rose-900/40"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            {flag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Clean Signal
                      </span>
                    )}
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
