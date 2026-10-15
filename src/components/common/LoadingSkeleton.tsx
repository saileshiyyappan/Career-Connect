import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg',
        className
      )}
    />
  );
};

export const JobCardSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="w-40 h-5" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>

      <Skeleton className="w-full h-12 rounded-lg" />

      <div className="flex gap-2 pt-2">
        <Skeleton className="w-20 h-6 rounded-md" />
        <Skeleton className="w-20 h-6 rounded-md" />
        <Skeleton className="w-20 h-6 rounded-md" />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-24 h-9 rounded-xl" />
      </div>
    </div>
  );
};

export const NewsCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between">
      <div>
        <Skeleton className="aspect-video w-full rounded-none" />
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-4/5 h-6" />
          <div className="space-y-1.5 pt-1">
            <Skeleton className="w-full h-3.5" />
            <Skeleton className="w-full h-3.5" />
            <Skeleton className="w-2/3 h-3.5" />
          </div>
        </div>
      </div>
      <div className="p-5 pt-0 flex items-center justify-between">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-24 h-4" />
      </div>
    </div>
  );
};

export const NewsHeroSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col lg:flex-row">
      <div className="lg:w-1/2 min-h-[260px] sm:min-h-[300px]">
        <Skeleton className="w-full h-full rounded-none min-h-[260px]" />
      </div>
      <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-28 h-5 rounded-md" />
            <Skeleton className="w-20 h-4" />
          </div>
          <Skeleton className="w-full h-8" />
          <Skeleton className="w-3/4 h-8" />
          <div className="space-y-2 pt-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-4/5 h-4" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <Skeleton className="w-24 h-5" />
          <Skeleton className="w-36 h-10 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="w-36 h-4" />
              <Skeleton className="w-24 h-3" />
            </div>
          </div>
          <Skeleton className="w-20 h-6 rounded-md" />
          <Skeleton className="w-24 h-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
};
