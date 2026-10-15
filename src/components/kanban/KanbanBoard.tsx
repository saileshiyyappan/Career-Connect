import React from 'react';
import { EmployerCandidate } from '../../services/employerPortalService';
import { PipelineCard } from '../cards/PipelineCard';
import { Users, Filter } from 'lucide-react';

interface KanbanBoardProps {
  candidates: EmployerCandidate[];
  onSelectCandidate: (candidate: EmployerCandidate) => void;
  onUpdateStage: (candidateId: string, newStage: EmployerCandidate['stage']) => void;
}

const STAGES: Array<{ name: EmployerCandidate['stage']; label: string; color: string }> = [
  { name: 'Applied', label: '1. Applied', color: 'bg-slate-500' },
  { name: 'Screening', label: '2. Screening', color: 'bg-amber-500' },
  { name: 'Shortlisted', label: '3. Shortlisted', color: 'bg-blue-500' },
  { name: 'Interview', label: '4. Interview', color: 'bg-purple-500' },
  { name: 'Technical Round', label: '5. Technical', color: 'bg-indigo-500' },
  { name: 'HR Round', label: '6. HR Review', color: 'bg-cyan-500' },
  { name: 'Offer', label: '7. Offer Sent', color: 'bg-emerald-500' },
  { name: 'Hired', label: '8. Hired', color: 'bg-teal-500' },
  { name: 'Rejected', label: '9. Archived / Rejected', color: 'bg-rose-500' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  candidates,
  onSelectCandidate,
  onUpdateStage,
}) => {
  const handleMoveStage = (candidateId: string, currentStage: EmployerCandidate['stage'], direction: 'prev' | 'next') => {
    const currentIndex = STAGES.findIndex(s => s.name === currentStage);
    if (currentIndex === -1) return;

    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < STAGES.length) {
      onUpdateStage(candidateId, STAGES[targetIndex].name);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x min-h-[600px]">
      {STAGES.map((stageObj) => {
        const stageCandidates = candidates.filter(c => c.stage === stageObj.name);

        return (
          <div
            key={stageObj.name}
            className="w-72 shrink-0 snap-start bg-slate-100/80 dark:bg-slate-900/60 rounded-3xl p-3.5 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-3"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${stageObj.color}`} />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {stageObj.label}
                </h4>
              </div>

              <span className="text-[11px] font-black text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                {stageCandidates.length}
              </span>
            </div>

            {/* Candidates List */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[680px] pr-0.5">
              {stageCandidates.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-[11px] font-semibold text-slate-400">No candidates</p>
                </div>
              ) : (
                stageCandidates.map((candidate) => (
                  <PipelineCard
                    key={candidate.id}
                    candidate={candidate}
                    onSelect={onSelectCandidate}
                    onMoveStage={(candId, dir) => handleMoveStage(candId, candidate.stage, dir)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
