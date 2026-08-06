import React from 'react';
import { EmployerCandidate } from '../../services/employerPortalService';
import { Star, MapPin, Calendar, MoveRight, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

interface PipelineCardProps {
  candidate: EmployerCandidate;
  onSelect: (candidate: EmployerCandidate) => void;
  onMoveStage: (candidateId: string, direction: 'prev' | 'next') => void;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({
  candidate,
  onSelect,
  onMoveStage,
}) => {
  return (
    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 hover:border-blue-400 dark:hover:border-blue-600 transition-all group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <img
            src={candidate.avatar}
            alt={candidate.name}
            className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
          />
          <div>
            <h5
              onClick={() => onSelect(candidate)}
              className="text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
            >
              {candidate.name}
            </h5>
            <p className="text-[11px] text-slate-500 line-clamp-1">{candidate.title}</p>
          </div>
        </div>

        <span className="shrink-0 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
          {candidate.matchScore}%
        </span>
      </div>

      <div className="text-[11px] text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">
          {candidate.appliedJobTitle}
        </p>
        <p className="text-[10px] text-slate-400">{candidate.location}</p>
      </div>

      {/* Stage Navigation Arrows */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <button
          onClick={() => onMoveStage(candidate.id, 'prev')}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors"
          title="Move Back a Stage"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onSelect(candidate)}
          className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Details
        </button>

        <button
          onClick={() => onMoveStage(candidate.id, 'next')}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors"
          title="Advance Stage"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
