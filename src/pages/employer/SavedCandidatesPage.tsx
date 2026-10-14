import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { candidateDiscoveryService } from '../../services/candidateDiscoveryService';
import { employerSavedCandidateRepository } from '../../firebase/repositories/EmployerSavedCandidateRepository';
import { EmployerSavedCandidate } from '../../types/campaign';
import { showSuccessToast, showErrorToast } from '../../context/ToastContext';
import {
  Bookmark,
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  Trash2,
  FileText,
  Edit3,
  CheckCircle2,
  Send,
  Plus,
  Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SavedCandidatesPage: React.FC = () => {
  const { user } = useAuth();
  const employerId = user?.uid || '';

  const [savedList, setSavedList] = useState<EmployerSavedCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCandidateId, setEditingCandidateId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const loadSaved = async () => {
    if (!employerId) return;
    setLoading(true);
    try {
      const data = await candidateDiscoveryService.getSavedCandidates(employerId);
      setSavedList(data);
    } catch (err) {
      console.warn('Failed to load saved candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, [employerId]);

  const handleRemove = async (candidateId: string, name: string) => {
    try {
      await candidateDiscoveryService.removeSavedCandidate(employerId, candidateId);
      setSavedList((prev) => prev.filter((c) => c.candidateId !== candidateId));
      const label = (!name || name === 'Name unavailable' || name.toLowerCase() === 'candidate') ? 'candidate' : name;
      showSuccessToast(`Removed ${label} from saved candidates.`);
    } catch (err) {
      showErrorToast('Failed to remove candidate.');
    }
  };

  const handleSaveNote = async (candidateId: string) => {
    try {
      await employerSavedCandidateRepository.updateNotes(employerId, candidateId, noteText);
      setSavedList((prev) =>
        prev.map((c) => (c.candidateId === candidateId ? { ...c, notes: noteText } : c))
      );
      setEditingCandidateId(null);
      showSuccessToast('Notes updated successfully.');
    } catch (err) {
      showErrorToast('Failed to save notes.');
    }
  };

  const filtered = savedList.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.candidateName.toLowerCase().includes(q) ||
      (c.candidateHeadline && c.candidateHeadline.toLowerCase().includes(q)) ||
      (c.candidateSkills && c.candidateSkills.some((s) => s.toLowerCase().includes(q))) ||
      (c.notes && c.notes.toLowerCase().includes(q))
    );
  });

  return (
    <PageContainer className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Saved Candidates & Talent Shortlists"
          subtitle="Manage bookmarked talent profiles, add recruiter evaluation notes, and track priority outreach."
          badge="Candidate Bookmarks"
        />

        <div className="flex items-center gap-2">
          <Link to="/employer/find-seekers">
            <PrimaryButton icon={Search} size="sm">
              Discover More Talent
            </PrimaryButton>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved candidates by name, skill, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <span className="text-xs font-bold text-slate-500 shrink-0">
          {savedList.length} candidate(s) saved
        </span>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Loading saved candidates...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar src={item.candidateAvatar} name={item.candidateName} size="md" className="rounded-xl" />
                    <div>
                      <h4 className={`font-extrabold text-sm ${
                        !item.candidateName || item.candidateName === 'Name unavailable' || item.candidateName.toLowerCase() === 'candidate'
                          ? 'text-slate-400 dark:text-slate-500 italic'
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {!item.candidateName || item.candidateName === 'Name unavailable' || item.candidateName.toLowerCase() === 'candidate'
                          ? 'Name unavailable'
                          : item.candidateName}
                      </h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold line-clamp-1">
                        {item.candidateHeadline || item.candidateTitle || 'Profile headline unavailable'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.candidateId, item.candidateName)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  {item.candidateLocation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.candidateLocation}
                    </span>
                  )}
                  {item.candidateExperienceYears !== undefined && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      {item.candidateExperienceYears} yrs
                    </span>
                  )}
                </div>

                {item.candidateSkills && item.candidateSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.candidateSkills.slice(0, 4).map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}

                {/* Recruiter Evaluation Notes */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[10px] uppercase text-slate-400 flex items-center gap-1">
                      <Edit3 className="w-3 h-3 text-blue-500" />
                      Recruiter Note
                    </span>
                    {editingCandidateId !== item.candidateId && (
                      <button
                        onClick={() => {
                          setEditingCandidateId(item.candidateId);
                          setNoteText(item.notes || '');
                        }}
                        className="text-[11px] text-blue-600 hover:underline font-bold"
                      >
                        {item.notes ? 'Edit' : 'Add Note'}
                      </button>
                    )}
                  </div>

                  {editingCandidateId === item.candidateId ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        rows={2}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add notes for hiring committee (e.g. Strong React candidate, pending interview schedule)..."
                        className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingCandidateId(null)}
                          className="px-2.5 py-1 text-[11px] text-slate-500 hover:underline"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveNote(item.candidateId)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold text-[11px]"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic">
                      {item.notes || 'No recruiter notes attached yet.'}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Saved on {item.savedAt ? new Date(item.savedAt).toLocaleDateString() : 'Recently'}</span>
                <Link
                  to="/employer/interviews"
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Schedule
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No Saved Candidates Yet"
          description="Use 'Find Seekers' or 'Candidate Database' to bookmark top talent profiles and build your hiring shortlist."
          action={
            <Link to="/employer/find-seekers">
              <PrimaryButton icon={Search} size="sm">
                Discover Candidates Now
              </PrimaryButton>
            </Link>
          }
        />
      )}
    </PageContainer>
  );
};
