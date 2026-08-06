import React from 'react';
import { ModerationReport } from '../../services/adminPortalService';
import { Badge } from '../common/Badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ReportCardProps {
  report: ModerationReport;
  onResolve: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onResolve, onDismiss }) => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-500">Item: {report.targetName}</span>
        <Badge variant={report.severity === 'Critical' || report.severity === 'High' ? 'danger' : 'warning'} size="sm">
          {report.severity}
        </Badge>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
        "{report.reason}"
      </p>

      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
        <span>Reporter: {report.reporterName}</span>
        {report.status === 'Pending' ? (
          <div className="flex gap-2">
            <button
              onClick={() => onDismiss(report.id)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200"
            >
              Dismiss
            </button>
            <button
              onClick={() => onResolve(report.id)}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700"
            >
              Resolve
            </button>
          </div>
        ) : (
          <span className="font-bold text-emerald-600">{report.status}</span>
        )}
      </div>
    </div>
  );
};
