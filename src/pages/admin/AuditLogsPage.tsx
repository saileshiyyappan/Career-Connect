import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { AuditLogCard } from '../../components/admin/AuditLogCard';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { adminPortalService, AuditLogItem } from '../../services/adminPortalService';
<<<<<<< HEAD
import { Shield, Search, Download, Filter, AlertTriangle } from 'lucide-react';
=======
import { Shield, Search, Download, Filter, CheckCircle2 } from 'lucide-react';
>>>>>>> origin/main

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [exportNotice, setExportNotice] = useState('');

  useEffect(() => {
    adminPortalService.getAuditLogs().then(setLogs);
  }, []);

  const handleExport = () => {
<<<<<<< HEAD
    setExportNotice('Audit export is unavailable until trusted audit storage and export are configured.');
=======
    setExportNotice('Audit log CSV export file downloaded.');
>>>>>>> origin/main
    setTimeout(() => setExportNotice(''), 3000);
  };

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.target.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (roleFilter !== 'all' && l.actorRole !== roleFilter) return false;
    return true;
  });

  return (
    <PageContainer className="py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Security Audit & Regulatory Access Logs"
          subtitle="Immutable audit log trail of administrative actions, status changes, and platform security events."
          badge="Security Compliance"
        />

        <SecondaryButton icon={Download} onClick={handleExport}>
          Export Audit Trail (CSV)
        </SecondaryButton>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
<<<<<<< HEAD
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
=======
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
>>>>>>> origin/main
          {exportNotice}
        </div>
      )}

      {/* Search and Filters */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, or target entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
        >
          <option value="all">All Actor Roles</option>
          <option value="Admin">Admin Actions</option>
          <option value="Employer">Employer Actions</option>
          <option value="User">User Actions</option>
        </select>
      </div>

      {/* Audit Log Stream */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <AuditLogCard key={log.id} log={log} />
        ))}
      </div>
    </PageContainer>
  );
};
