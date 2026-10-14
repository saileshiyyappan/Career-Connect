import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { CandidateCard } from '../../components/cards/CandidateCard';
import { employerPortalService, EmployerCandidate } from '../../services/employerPortalService';
import {
  Search,
  Filter,
  Users,
  Star,
  FileText,
  MessageSquare,
  Send,
  Download,
  ExternalLink,
  ChevronRight,
  Briefcase,
  MapPin,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const CandidateManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialJobFilter = searchParams.get('jobId') || 'all';

  const [candidates, setCandidates] = useState<EmployerCandidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<EmployerCandidate | null>(null);

  // New Note state
  const [newNoteText, setNewNoteText] = useState('');

  useEffect(() => {
    employerPortalService.getCandidates().then(setCandidates);
  }, []);

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (stageFilter !== 'all' && c.stage !== stageFilter) return false;

    return true;
  });

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

  const handleUpdateStage = async (candidateId: string, newStage: EmployerCandidate['stage']) => {
    await employerPortalService.updateApplicationStage(candidateId, newStage);
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: newStage } : c));
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate(prev => prev ? { ...prev, stage: newStage } : null);
    }
  };

  const handleAdvanceStage = async (candidateId: string, currentStage: EmployerCandidate['stage']) => {
    const stages: EmployerCandidate['stage'][] = [
      'Applied', 'Screening', 'Shortlisted', 'Interview', 'Technical Round', 'HR Round', 'Offer', 'Hired'
    ];
    const currIdx = stages.indexOf(currentStage);
    if (currIdx !== -1 && currIdx < stages.length - 1) {
      const nextStage = stages[currIdx + 1];
      await handleUpdateStage(candidateId, nextStage);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !newNoteText.trim()) return;

    const authorName = `${user?.displayName || 'Hiring Manager'} (Hiring Team)`;
    await employerPortalService.addCandidateNote(selectedCandidate.id, newNoteText.trim(), authorName);
    const updated = await employerPortalService.getCandidateDetails(selectedCandidate.id);
    if (updated) {
      setSelectedCandidate(updated);
      setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
    }
    setNewNoteText('');
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="Candidate Management & Talent Search"
        subtitle="Search, evaluate, and manage candidates across all open positions."
        badge="Recruitment Pool"
      />

      {/* Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates by name, title, or skills (e.g. React, PyTorch)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Stages' },
            { id: 'Applied', label: 'Applied' },
            { id: 'Screening', label: 'Screening' },
            { id: 'Shortlisted', label: 'Shortlisted' },
            { id: 'Technical Round', label: 'Technical' },
            { id: 'Offer', label: 'Offer' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStageFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                stageFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Grid */}
      {filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onSelect={setSelectedCandidate}
              onAdvanceStage={handleAdvanceStage}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No Applicants in this Stage"
          description="Candidates who apply to your posted jobs will appear here as they progress through your hiring pipeline."
        />
      )}

      {/* Candidate Profile Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-lg font-black ${
                      !selectedCandidate.name || selectedCandidate.name.trim().toLowerCase() === 'candidate' || selectedCandidate.name.trim().toLowerCase() === 'name unavailable'
                        ? 'text-slate-400 dark:text-slate-500 italic'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {!selectedCandidate.name || selectedCandidate.name.trim().toLowerCase() === 'candidate' || selectedCandidate.name.trim().toLowerCase() === 'name unavailable'
                        ? 'Name unavailable'
                        : selectedCandidate.name}
                    </h3>
                    <Badge variant={getStageBadgeColor(selectedCandidate.stage)} size="sm">{selectedCandidate.stage}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedCandidate.title} • {selectedCandidate.location}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Candidate Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
              <h4 className="font-extrabold uppercase text-[10px] text-slate-400">Professional Summary</h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedCandidate.summary}</p>
            </div>

            {/* Resume Placeholder */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white">Curriculum Vitae / Resume.pdf</p>
                  <p className="text-[10px] text-slate-500">Verified Document • PDF Format</p>
                </div>
              </div>
              <a
                href={selectedCandidate.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1 hover:bg-blue-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Resume
              </a>
            </div>

            {/* Experience & Education */}
            <div className="space-y-4 text-xs">
              <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Work Experience History
              </h4>
              <div className="space-y-3">
                {selectedCandidate.experienceHistory && selectedCandidate.experienceHistory.length > 0 ? (
                  selectedCandidate.experienceHistory.map((exp, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>{exp.role} — {exp.company}</span>
                        <span className="text-slate-400 text-[11px]">{exp.duration}</span>
                      </div>
                      {exp.description && <p className="text-slate-600 dark:text-slate-400">{exp.description}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 italic p-2">No previous work experience recorded.</p>
                )}
              </div>

              <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] pt-2">
                Education & Credentials
              </h4>
              <div className="space-y-3">
                {selectedCandidate.education && selectedCandidate.education.length > 0 ? (
                  selectedCandidate.education.map((edu, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>{edu.degree}</span>
                        <span className="text-slate-400 text-[11px]">{edu.year}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{edu.institution}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 dark:text-slate-500 italic p-2">No educational history recorded.</p>
                )}
              </div>
            </div>

            {/* Recruiter Evaluation Notes */}
            <div className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
              <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Internal Interviewer Notes
              </h4>

              <div className="space-y-2">
                {selectedCandidate.notes.map((n) => (
                  <div key={n.id} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 space-y-1">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      <span>{n.author}</span>
                      <span className="text-slate-400">{n.createdAt}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{n.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add private evaluation note for team..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post Note
                </button>
              </form>
            </div>

            {/* Hiring Pipeline Stage Management & Direct Status Updates */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Hiring Pipeline Stage
                </h4>
                <Badge variant={getStageBadgeColor(selectedCandidate.stage)} size="sm">
                  Current: {selectedCandidate.stage}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value={selectedCandidate.stage}
                  onChange={(e) => handleUpdateStage(selectedCandidate.id, e.target.value as EmployerCandidate['stage'])}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Applied">Applied (Initial Submission)</option>
                  <option value="Screening">Screening (Profile & Qualifications)</option>
                  <option value="Shortlisted">Shortlisted for Review</option>
                  <option value="Interview">Interview Scheduled</option>
                  <option value="Technical Round">Technical Round</option>
                  <option value="HR Round">HR Round</option>
                  <option value="Offer">Offer Extended</option>
                  <option value="Hired">Hired (Candidate Accepted)</option>
                  <option value="Rejected">Rejected</option>
                </select>

                {selectedCandidate.stage !== 'Hired' && selectedCandidate.stage !== 'Rejected' && (
                  <button
                    onClick={() => handleAdvanceStage(selectedCandidate.id, selectedCandidate.stage)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Advance Stage</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {selectedCandidate.stage !== 'Rejected' && (
                  <button
                    onClick={() => handleUpdateStage(selectedCandidate.id, 'Rejected')}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <SecondaryButton onClick={() => setSelectedCandidate(null)}>
                Close Window
              </SecondaryButton>

              {selectedCandidate.stage !== 'Hired' && selectedCandidate.stage !== 'Rejected' && (
                <PrimaryButton
                  onClick={() => handleAdvanceStage(selectedCandidate.id, selectedCandidate.stage)}
                  icon={ChevronRight}
                >
                  Advance to Next Stage
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
