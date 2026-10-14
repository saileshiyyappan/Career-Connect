import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useJobContext } from '../../context/JobContext';
import { candidateDiscoveryService, CandidateProfileResult } from '../../services/candidateDiscoveryService';
import { showSuccessToast, showErrorToast } from '../../context/ToastContext';
import { notificationRepository } from '../../firebase/repositories/NotificationRepository';
import {
  Search,
  Users,
  Briefcase,
  MapPin,
  GraduationCap,
  Bookmark,
  FileText,
  ExternalLink,
  Github,
  Linkedin,
  Filter,
  Sliders,
  Send,
  X,
  PlusCircle,
  Eye,
  CheckCircle2,
  Table,
  LayoutGrid
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CandidateDatabasePage: React.FC = () => {
  const { user } = useAuth();
  const { jobs } = useJobContext();
  const employerId = user?.uid || '';
  const employerJobs = jobs.filter((j) => j.employerId === employerId);
    const compName = (user as any)?.companyName || user?.displayName || 'Name unavailable';

  const [candidates, setCandidates] = useState<CandidateProfileResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [expFilter, setExpFilter] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfileResult | null>(null);

  // Invite state
  const [inviteTarget, setInviteTarget] = useState<CandidateProfileResult | null>(null);
  const [selectedJobIdForInvite, setSelectedJobIdForInvite] = useState<string>('');
  const [inviteNote, setInviteNote] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await candidateDiscoveryService.searchCandidates(employerId, {
        query: searchTerm,
        skill: skillFilter,
        experienceLevel: expFilter === 'all' ? undefined : expFilter,
      });
      setCandidates(data);
    } catch (err: any) {
      console.warn('Failed to load candidate database:', err);
      const isPermission = err?.code === 'permission-denied' || String(err?.message || '').toLowerCase().includes('permission');
      setError(isPermission ? 'Permission denied: Please ensure your account has employer privileges to view the candidate database.' : 'Failed to load candidates due to a network or service issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [employerId, expFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleToggleSave = async (candidate: CandidateProfileResult) => {
    if (!employerId) return;
    try {
      if (candidate.isSaved) {
        await candidateDiscoveryService.removeSavedCandidate(employerId, candidate.id);
        setCandidates((prev) =>
          prev.map((c) => (c.id === candidate.id ? { ...c, isSaved: false } : c))
        );
        const label = candidate.isNameUnavailable ? 'candidate' : candidate.displayName;
        showSuccessToast(`Removed ${label} from saved talent.`);
      } else {
        await candidateDiscoveryService.saveCandidate(employerId, candidate, 'Sourced from Candidate Database');
        setCandidates((prev) =>
          prev.map((c) => (c.id === candidate.id ? { ...c, isSaved: true } : c))
        );
        const label = candidate.isNameUnavailable ? 'candidate' : candidate.displayName;
        showSuccessToast(`Saved ${label} to saved candidates.`);
      }
    } catch (err) {
      showErrorToast('Failed to update candidate bookmark.');
    }
  };

  const handleSendInvite = async () => {
    if (!inviteTarget || !employerId) return;
    setIsInviting(true);
    try {
      const targetJob = employerJobs.find((j) => j.id === selectedJobIdForInvite);
      if (selectedJobIdForInvite && (!targetJob || targetJob.employerId !== employerId)) {
        throw new Error('That job is not owned by this employer.');
      }
      const targetLink = targetJob ? `/jobs/${targetJob.id}` : '/interviews';
      const compName = (user as any)?.companyName || targetJob?.companyName || user?.displayName || 'Name unavailable';
      const invitationId = `invitation_${employerId}_${inviteTarget.id}_${selectedJobIdForInvite || 'general'}`;
      const existing = await notificationRepository.findActiveInvitation(inviteTarget.id, employerId, selectedJobIdForInvite || undefined);
      if (existing) {
        showSuccessToast('An active invitation already exists for this candidate.');
        setInviteTarget(null);
        return;
      }
      await notificationRepository.create({
        userId: inviteTarget.id,
        title: targetJob ? `Interview & Role Invitation: ${targetJob.title}` : `Interview & Role Invitation from ${compName}`,
        message: inviteNote.trim() || `The recruiting team at ${compName} would like to invite you to connect regarding opportunities.`,
        type: 'invitation',
        link: targetLink,
        read: false,
        senderId: employerId,
        senderDisplayName: compName,
        recipientId: inviteTarget.id,
        jobId: selectedJobIdForInvite || undefined,
        invitationId,
        invitationStatus: 'pending',
      }, invitationId);
      const targetLabel = inviteTarget.isNameUnavailable ? 'candidate' : inviteTarget.displayName;
      showSuccessToast(`Invitation sent to ${targetLabel}!`);
      setInviteTarget(null);
      setInviteNote('');
      setSelectedJobIdForInvite('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown Firestore error';
      console.error('CandidateDatabasePage invitation failed:', err);
      showErrorToast(`Failed to send interview invitation: ${message}`);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <PageContainer className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Candidate Database & Resume Search"
          subtitle="Directly query candidate profiles, search skills and resumes, and evaluate qualifications."
          badge="Talent CRM & Resume Bank"
        />

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

          <Link to="/employer/find-seekers">
            <PrimaryButton icon={Search} size="sm">
              Find Seekers Radar
            </PrimaryButton>
          </Link>
        </div>
      </div>

      {/* Filter and Query Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates, skills, education, or resume keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Exp' },
            { id: 'Entry Level', label: '0-2 Yrs' },
            { id: 'Mid Level', label: '3-5 Yrs' },
            { id: 'Senior Level', label: '5+ Yrs' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setExpFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                expFilter === item.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <PrimaryButton onClick={loadData} size="sm">
            Filter
          </PrimaryButton>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Loading candidate database...</p>
        </div>
      ) : error ? (
        <EmptyState
          icon={Users}
          title="Candidate Database Notice"
          description={error}
          action={
            <SecondaryButton onClick={loadData}>
              Retry Load
            </SecondaryButton>
          }
        />
      ) : candidates.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar src={c.avatarUrl} name={c.displayName} size="md" className="rounded-xl" />
                      <div>
                        <h4 className={`font-bold text-sm ${c.isNameUnavailable ? 'text-slate-400 dark:text-slate-500 italic' : 'text-slate-900 dark:text-white'}`}>{c.displayName}</h4>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{c.headline}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleSave(c)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        c.isSaved ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={c.isSaved ? 'Saved' : 'Save'}
                    >
                      <Bookmark className={`w-4 h-4 ${c.isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{c.location}</span>
                    <span>•</span>
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{c.experienceYears > 0 ? `${c.experienceYears} yrs` : 'Entry'}</span>
                  </div>

                  {c.education && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span className="truncate">{c.education}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 pt-1">
                    {c.skills.slice(0, 3).map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                    {c.skills.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-400 font-bold">
                        +{c.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCandidate(c)}
                    className="flex-1 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setInviteTarget(c)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Invite
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-5">Candidate</th>
                    <th className="py-3.5 px-5">Location</th>
                    <th className="py-3.5 px-5">Experience</th>
                    <th className="py-3.5 px-5">Top Skills</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {candidates.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <Avatar src={c.avatarUrl} name={c.displayName} size="sm" className="rounded-lg" />
                          <div>
                            <p className={`font-bold ${c.isNameUnavailable ? 'text-slate-400 dark:text-slate-500 italic' : 'text-slate-900 dark:text-white'}`}>{c.displayName}</p>
                            <p className="text-[11px] text-blue-600 dark:text-blue-400">{c.headline}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 dark:text-slate-400">{c.location}</td>
                      <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">
                        {c.experienceYears > 0 ? `${c.experienceYears} Years` : 'Entry'}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {c.skills.slice(0, 3).map((sk) => (
                            <span key={sk} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedCandidate(c)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => setInviteTarget(c)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                          >
                            Invite
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <EmptyState
          icon={Users}
          title="No Candidates Found in Database"
          description="Try broadening your search query or removing experience filters."
          action={
            <SecondaryButton
              onClick={() => {
                setSearchTerm('');
                setExpFilter('all');
                loadData();
              }}
            >
              Reset Filters
            </SecondaryButton>
          }
        />
      )}

      {/* Candidate Modal Details */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar src={selectedCandidate.avatarUrl} name={selectedCandidate.displayName} size="xl" className="rounded-2xl" />
                <div>
                  <h3 className={`text-xl font-extrabold ${selectedCandidate.isNameUnavailable ? 'text-slate-400 dark:text-slate-500 italic' : 'text-slate-900 dark:text-white'}`}>
                    {selectedCandidate.displayName}
                  </h3>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {selectedCandidate.headline}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedCandidate.location} • {selectedCandidate.experienceYears} Years Exp
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedCandidate.bio && (
              <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <h5 className="text-[11px] font-extrabold uppercase text-slate-400">Bio / Summary</h5>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedCandidate.bio}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h5 className="text-[11px] font-extrabold uppercase text-slate-400">Skills & Competencies</h5>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skills.map((s) => (
                  <Badge key={s} variant="info" size="md">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedCandidate.education && (
              <div className="space-y-1">
                <h5 className="text-[11px] font-extrabold uppercase text-slate-400">Education</h5>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {selectedCandidate.education}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {selectedCandidate.portfolioUrl && (
                <a
                  href={selectedCandidate.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" /> Portfolio
                </a>
              )}
              {selectedCandidate.linkedinUrl && (
                <a
                  href={selectedCandidate.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 flex items-center gap-1.5"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn
                </a>
              )}
              {selectedCandidate.githubUrl && (
                <a
                  href={selectedCandidate.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
              )}
              {selectedCandidate.resumeUrl && (
                <a
                  href={selectedCandidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" /> Attached Resume
                </a>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <SecondaryButton onClick={() => handleToggleSave(selectedCandidate)} icon={Bookmark}>
                {selectedCandidate.isSaved ? 'Remove from Saved' : 'Save Candidate'}
              </SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  setInviteTarget(selectedCandidate);
                  setSelectedCandidate(null);
                }}
                icon={Send}
              >
                Send Invite
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {inviteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                Invite Candidate to Interview / Pipeline
              </h3>
              <button onClick={() => setInviteTarget(null)} className="p-1 rounded-xl text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Invite <strong className={`text-slate-900 dark:text-white ${inviteTarget.isNameUnavailable ? 'italic text-slate-400 dark:text-slate-500' : ''}`}>{inviteTarget.displayName}</strong> to discuss active positions.
            </p>

            {employerJobs.length > 0 && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Job Opening (Optional)
                </label>
                <select
                  value={selectedJobIdForInvite}
                  onChange={(e) => {
                    const jId = e.target.value;
                    setSelectedJobIdForInvite(jId);
                    const j = employerJobs.find((item) => item.id === jId);
                    const greetingName = inviteTarget.isNameUnavailable ? 'there' : inviteTarget.displayName;
                    if (j) {
                      setInviteNote(
                        `Hi ${greetingName}, our hiring team at ${compName} reviewed your qualifications and invites you to discuss our open ${j.title} position!`
                      );
                    } else {
                      setInviteNote(
                        `Hi ${greetingName}, our team is looking for talented professionals and would love to connect with you!`
                      );
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">General Candidate Sourcing / Interviews</option>
                  {employerJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} — {j.companyName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <textarea
              rows={4}
              value={inviteNote}
              onChange={(e) => setInviteNote(e.target.value)}
              placeholder="Tell the candidate why their background stands out for your team..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <SecondaryButton onClick={() => setInviteTarget(null)}>Cancel</SecondaryButton>
              <PrimaryButton onClick={handleSendInvite} isLoading={isInviting} icon={Send}>
                Send
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
