import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { KanbanBoard } from '../../components/kanban/KanbanBoard';
import { employerPortalService, EmployerCandidate } from '../../services/employerPortalService';
import { useJobContext } from '../../context/JobContext';
import { SelectInput } from '../../components/inputs/SelectInput';
import { Kanban, Users, Sparkles, Filter } from 'lucide-react';

export const HiringPipelinePage: React.FC = () => {
  const { jobs } = useJobContext();
  const [candidates, setCandidates] = useState<EmployerCandidate[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<EmployerCandidate | null>(null);

  useEffect(() => {
    employerPortalService.getCandidates().then(setCandidates);
  }, []);

  const handleUpdateStage = async (candidateId: string, newStage: EmployerCandidate['stage']) => {
    const persisted = await employerPortalService.updateApplicationStage(candidateId, newStage);
    if (!persisted) return;
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: newStage } : c));
  };

  const filteredCandidates = selectedJobId === 'all'
    ? candidates
    : candidates.filter(c => c.appliedJobId === selectedJobId);

  return (
    <PageContainer className="py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Interactive Hiring Pipeline (Kanban ATS)"
          subtitle="Drag or transition candidate applications through stages from initial screening to offer extend."
          badge="Kanban ATS Workflow"
        />

        <div className="w-full sm:w-64">
          <SelectInput
            label=""
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            options={[
              { value: 'all', label: 'All Active Openings' },
              ...jobs.map(j => ({ value: j.id, label: j.title }))
            ]}
          />
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <KanbanBoard
          candidates={filteredCandidates}
          onSelectCandidate={setSelectedCandidate}
          onUpdateStage={handleUpdateStage}
        />
      </div>
    </PageContainer>
  );
};
