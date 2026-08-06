import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface RecruitmentStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  color?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'cyan';
}

export const RecruitmentStatCard: React.FC<RecruitmentStatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'positive',
  color = 'blue',
}) => {
  const colorStyles = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-200 dark:border-blue-900/50',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-200 dark:border-purple-900/50',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-200 dark:border-emerald-900/50',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-200 dark:border-amber-900/50',
    rose: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-200 dark:border-rose-900/50',
    cyan: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-200 dark:border-cyan-900/50',
  };

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2.5 rounded-2xl border ${colorStyles[color]} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-0.5">
        <div className="flex items-baseline gap-2">
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                trendType === 'positive'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trendType === 'negative'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-500'
              }`}
            >
              {trendType === 'positive' && <TrendingUp className="w-3.5 h-3.5" />}
              {trendType === 'negative' && <TrendingDown className="w-3.5 h-3.5" />}
              {trend}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
