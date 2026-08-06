import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { InterviewCard } from '../../components/cards/InterviewCard';
import { EmptyState } from '../../components/common/EmptyState';
import { candidatePortalService, UpcomingInterview } from '../../services/candidatePortalService';
import { Calendar, Video, CheckCircle2, Sparkles, BookOpen, Clock, Users, Lightbulb } from 'lucide-react';

export const InterviewCenterPage: React.FC = () => {
  const [interviews, setInterviews] = useState<UpcomingInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    setLoading(true);
    const data = await candidatePortalService.getInterviews();
    setInterviews(data);
    setLoading(false);
  };

  const handleToggleChecklist = async (interviewId: string, itemId: string) => {
    const updated = await candidatePortalService.toggleChecklistItem(interviewId, itemId);
    if (updated) {
      setInterviews(prev => prev.map(i => i.id === interviewId ? updated : i));
    }
  };

  return (
    <PageContainer className="py-8 space-y-8 max-w-5xl">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Interview Command Center"
          subtitle="Prepare for technical rounds, track scheduled video calls, and complete prep checklists."
          badge="Candidate Workspace"
        />

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setTab('upcoming')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'upcoming'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Upcoming ({interviews.length})
          </button>
          <button
            onClick={() => setTab('past')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'past'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Past History (3)
          </button>
        </div>
      </div>

      {/* Quick Prep Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase">
              Pro Candidate Strategy
            </span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <h3 className="text-lg font-black">
            The STAR Method for Technical & Behavioral Interviews
          </h3>
          <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
            Structure your answers around: <strong>Situation</strong> (Context), <strong>Task</strong> (Goal), <strong>Action</strong> (Your specific technical contribution), and <strong>Result</strong> (Quantifiable metric outcome).
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-center">
            <p className="text-xl font-black">100%</p>
            <p className="text-[10px] text-blue-100 font-medium">Video Ready</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {tab === 'upcoming' ? (
        interviews.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No upcoming interviews"
            description="When recruiters schedule a technical or HR round, your meeting invitation and preparation checklist will appear here."
          />
        ) : (
          <div className="space-y-6">
            {interviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interview={interview}
                onToggleChecklist={handleToggleChecklist}
              />
            ))}
          </div>
        )
      ) : (
        /* Past History Placeholder */
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400">Completed on 2026-07-28</span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Technical Screening - Stripe
                </h4>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                Passed & Advanced
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Covered React 19 concurrent rendering, state management at scale, and API integration.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400">Completed on 2026-07-14</span>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  HR & Culture Fit - Vercel
                </h4>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                Passed
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Discussed remote collaboration, open source work, and product mindset.
            </p>
          </div>
        </div>
      )}

    </PageContainer>
  );
};
