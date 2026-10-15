import React, { useState } from 'react';
import { SavedJobAlert } from '../../services/candidatePortalService';
import { Bell, MapPin, DollarSign, Briefcase, Trash2, Check, Zap, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';

export interface JobAlertCardProps {
  alert: SavedJobAlert;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
  onTestMatch: (alert: SavedJobAlert) => void;
}

export const JobAlertCard: React.FC<JobAlertCardProps> = ({
  alert,
  onToggle,
  onDelete,
  onTestMatch,
}) => {
  return (
    <div className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all space-y-4 ${
      alert.enabled
        ? 'border-slate-200/80 dark:border-slate-800 shadow-xs'
        : 'border-slate-200/40 dark:border-slate-800/40 opacity-70 bg-slate-50/50 dark:bg-slate-900/40'
    }`}>
      
      {/* Header & Toggle */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              {alert.title}
            </h4>
            <Badge variant={alert.frequency === 'instant' ? 'purple' : alert.frequency === 'daily' ? 'info' : 'default'} size="sm" className="capitalize">
              {alert.frequency} Alert
            </Badge>
          </div>
          <p className="text-xs text-slate-500">Created {alert.createdAt} • Matches {alert.lastMatchedCount} new jobs/week</p>
        </div>

        {/* Enable / Disable Switch */}
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={alert.enabled}
            onChange={(e) => onToggle(alert.id, e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
        </label>
      </div>

      {/* Keywords Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Target Keywords:</span>
        {alert.keywords.map((kw) => (
          <span
            key={kw}
            className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200/60 dark:border-blue-900/50"
          >
            {kw}
          </span>
        ))}
      </div>

      {/* Metadata Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-400 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="truncate">{alert.location}</span>
        </div>
        <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
          <DollarSign className="w-3.5 h-3.5 shrink-0" />
          <span>${(alert.salaryMin / 1000).toFixed(0)}k - ${(alert.salaryMax / 1000).toFixed(0)}k</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-purple-500 shrink-0" />
          <span>{alert.experienceLevel}</span>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-2 flex items-center justify-between text-xs">
        <button
          onClick={() => onTestMatch(alert)}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Preview Live Matching Jobs ({alert.lastMatchedCount})
        </button>

        <button
          onClick={() => onDelete(alert.id)}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Delete Alert"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
