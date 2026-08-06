import React from 'react';
import { EmployerCandidate } from '../../services/employerPortalService';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { MapPin, Briefcase, Star, FileText, Calendar, ExternalLink, ChevronRight, CheckCircle2 } from 'lucide-react';

interface CandidateCardProps {
  candidate: EmployerCandidate;
  onSelect: (candidate: EmployerCandidate) => void;
  onAdvanceStage?: (candidateId: string, currentStage: EmployerCandidate['stage']) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onSelect,
  onAdvanceStage,
}) => {
  const getStageBadgeColor = (stage: EmployerCandidate['stage']) => {
    switch (stage) {
      case 'Applied': return 'info';
      case 'Screening': return 'warning';
      case 'Shortlisted': return 'purple';
      case 'Interview':
      case 'Technical Round':
      case 'HR Round': return 'accent';
      case 'Offer': return 'success';
      case 'Hired': return 'success';
      case 'Rejected': return 'secondary';
      default: return 'info';
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition-all group">
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={candidate.avatar}
            name={candidate.name}
            size="lg"
            className="rounded-2xl"
          />
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {candidate.name}
            </h4>
            <p className="text-xs text-slate-500 font-medium">{candidate.title}</p>
          </div>
        </div>

        <Badge variant={getStageBadgeColor(candidate.stage)} size="sm">
          {candidate.stage}
        </Badge>
      </div>

      {/* Details Row */}
      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-blue-500" />
            Applied for: <strong className="text-slate-700 dark:text-slate-200">{candidate.appliedJobTitle}</strong>
          </span>
          <span>{candidate.appliedDate}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5" />
            {candidate.location}
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            {candidate.matchScore}% Match
          </span>
        </div>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {candidate.skills.slice(0, 4).map((sk) => (
          <span
            key={sk}
            className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300"
          >
            {sk}
          </span>
        ))}
        {candidate.skills.length > 4 && (
          <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-400">
            +{candidate.skills.length - 4} more
          </span>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={() => onSelect(candidate)}
          className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Profile & Resume</span>
        </button>

        {onAdvanceStage && candidate.stage !== 'Hired' && candidate.stage !== 'Rejected' && (
          <button
            onClick={() => onAdvanceStage(candidate.id, candidate.stage)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Advance Stage"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
