import React from 'react';
import { ModerationReport } from '../../services/adminPortalService';
import { Badge } from '../common/Badge';
import { ShieldAlert, CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface ModerationCardProps {
  report: ModerationReport;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const ModerationCard: React.FC<ModerationCardProps> = ({
  report,
  onResolve,
  onDismiss,
}) => {
  const getSeverityBadge = (severity: ModerationReport['severity']) => {
    switch (severity) {
      case 'Critical': return <Badge variant="danger" size="sm">Critical</Badge>;
      case 'High': return <Badge variant="warning" size="sm">High Severity</Badge>;
      case 'Medium': return <Badge variant="info" size="sm">Medium</Badge>;
      default: return <Badge variant="secondary" size="sm">Low</Badge>;
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Report #{report.id} ({report.type.toUpperCase()})
          </h4>
          {getSeverityBadge(report.severity)}
        </div>
        <span className="text-[11px] text-slate-400 font-medium">{report.createdAt}</span>
      </div>

      <div className="space-y-1 text-xs">
        <p className="font-bold text-slate-800 dark:text-slate-200">
          Target: <span className="text-blue-600 dark:text-blue-400">{report.targetName}</span>
        </p>
        <p className="text-slate-500">Reporter: {report.reporterName}</p>
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
          "{report.reason}"
        </div>
      </div>

      {report.status === 'Pending' ? (
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={() => onDismiss(report.id)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            Dismiss Report
          </button>
          <button
            onClick={() => onResolve(report.id)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Take Action & Resolve
          </button>
        </div>
      ) : (
        <div className="pt-2 flex justify-between items-center text-xs">
          <span className={`font-bold ${report.status === 'Resolved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
            Status: {report.status}
          </span>
        </div>
      )}
    </div>
  );
};
