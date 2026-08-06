import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ModerationCard } from '../../components/admin/ModerationCard';
import { adminPortalService, ModerationReport } from '../../services/adminPortalService';
import { ShieldAlert, CheckCircle2, AlertTriangle, Filter, MessageSquare } from 'lucide-react';

export const ReportsModerationPage: React.FC = () => {
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('Pending');
  const [actionNotice, setActionNotice] = useState('');

  useEffect(() => {
    adminPortalService.getModerationReports().then(setReports);
  }, []);

  const handleResolve = async (id: string) => {
    await adminPortalService.resolveReport(id);
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Resolved' } : r)));
    setActionNotice(`Report #${id} resolved successfully.`);
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleDismiss = async (id: string) => {
    await adminPortalService.dismissReport(id);
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Dismissed' } : r)));
    setActionNotice(`Report #${id} dismissed.`);
    setTimeout(() => setActionNotice(''), 3000);
  };

  const filteredReports = reports.filter((r) => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="Content Moderation & Safety Center"
        subtitle="Evaluate reported users, abusive job posts, suspicious employers, and platform flag queues."
        badge="Safety & Trust"
      />

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {actionNotice}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'job', label: 'Reported Jobs' },
            { id: 'user', label: 'Reported Users' },
            { id: 'company', label: 'Reported Companies' },
            { id: 'message', label: 'Messages (Placeholder)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                typeFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['Pending', 'Resolved', 'Dismissed', 'all'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {st === 'all' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Moderation Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <ModerationCard
            key={report.id}
            report={report}
            onResolve={handleResolve}
            onDismiss={handleDismiss}
          />
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h4 className="text-sm font-black text-slate-900 dark:text-white">Moderation Queue Clear</h4>
          <p className="text-xs text-slate-400">No reports found matching the selected filters.</p>
        </div>
      )}
    </PageContainer>
  );
};
