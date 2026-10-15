import React from 'react';
import { SystemHealthItem } from '../../services/adminPortalService';
import { Server, Activity, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface SystemHealthCardProps {
  health: SystemHealthItem;
}

export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({ health }) => {
  const isHealthy = health.status === 'Healthy';
  const isDegraded = health.status === 'Degraded';

  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl border ${
          isHealthy
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
            : isDegraded
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
        }`}>
          <Server className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
            {health.serviceName}
          </h4>
          <p className="text-[10px] text-slate-500 font-medium">
            Latency: {health.latencyMs}ms • Uptime: {health.uptimePercentage}%
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-500 animate-pulse' : isDegraded ? 'bg-amber-500' : 'bg-rose-500'}`} />
        <span className={isHealthy ? 'text-emerald-600 dark:text-emerald-400' : isDegraded ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}>
          {health.status}
        </span>
      </div>
    </div>
  );
};
