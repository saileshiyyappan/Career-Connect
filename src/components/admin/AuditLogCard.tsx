import React from 'react';
import { AuditLogItem } from '../../services/adminPortalService';
import { Shield, Clock, HardDrive, UserCheck } from 'lucide-react';

interface AuditLogCardProps {
  log: AuditLogItem;
}

export const AuditLogCard: React.FC<AuditLogCardProps> = ({ log }) => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/40 shrink-0">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 dark:text-white">{log.actorName}</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
              {log.actorRole}
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-semibold mt-0.5">
            {log.action} — <span className="text-purple-600 dark:text-purple-400">{log.target}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-slate-400 text-[11px] font-medium shrink-0">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {log.timestamp}
        </span>
        <span className="hidden md:inline text-slate-400">IP: {log.ipAddress}</span>
      </div>
    </div>
  );
};
