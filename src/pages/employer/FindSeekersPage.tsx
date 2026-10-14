import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { InputField } from '../../components/inputs/InputField';
import { SelectInput } from '../../components/inputs/SelectInput';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Avatar } from '../../components/common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useJobContext } from '../../context/JobContext';
import { candidateDiscoveryService, CandidateProfileResult } from '../../services/candidateDiscoveryService';
import { showSuccessToast, showErrorToast } from '../../context/ToastContext';
import {
  Search,
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  Bookmark,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  FileText,
  Mail,
  CheckCircle2,
  X,
  Filter,
  SlidersHorizontal,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { notificationRepository } from '../../firebase/repositories/NotificationRepository';

export const FindSeekersPage: React.FC = () => {
  const { user } = useAuth();
  const { jobs } = useJobContext();
  const employerId = user?.uid || '';
  const employerJobs = jobs.filter((j) => j.employerId === employerId);

  const [candidates, setCandidates] = useState<CandidateProfileResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Selected candidate detail drawer/modal
  const [activeCandidate, setActiveCandidate] = useState<CandidateProfileResult | null>(null);
  const [inviteModalCandidate, setInviteModalCandidate] = useState<CandidateProfileResult | null>(null);
  const [selectedJobIdForInvite, setSelectedJobIdForInvite] = useState<string>('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await candidateDiscoveryService.searchCandidates(employerId, {
        query: searchQuery,
        skill: selectedSkill,
        location: selectedLocation,
        experienceLevel: selectedExperience === 'All' ? undefined : selectedExperience,
        remoteOnly,
      });
      setCandidates(results);
    } catch (err: any) {
      console.warn('Failed to load candidates:', err);
      const isPermission = err?.code === 'permission-denied' || String(err?.message || '').toLowerCase().includes('permission');
      setError(isPermission ? 'Permission denied: Please ensure your account has employer privileges to search candidates.' : 'Failed to load candidates due to a network or service issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [employerId, selectedExperience, remoteOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCandidates();
  };

  const handleToggleSave = async (candidate: CandidateProfileResult) => {
    if (!employerId) return;
    try {
      if (candidate.isSaved) {
        await candidateDiscoveryService.removeSavedCandidate(employerId, candidate.id);
        setCandidates((prev) =>
          prev.map((c) => (c.id === candidate.id ? { ...c, isSaved: false } : c))
        );
        showSuccessToast(`Removed ${candidate.displayName} from saved talent.`);
      } else {
        await candidateDiscoveryService.saveCandidate(employerId, candidate, 'Sourced via Find Seekers');
        setCandidates((prev) =>
          prev.map((c) => (c.id === candidate.id ? { ...c, isSaved: true } : c))
        );
        showSuccessToast(`Saved ${candidate.displayName} to your talent pipeline!`);
      }
    } catch (err) {
      showErrorToast('Failed to update saved status.');
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteModalCandidate || !employerId) return;
    setIsSendingInvite(true);
    try {
      const targetJob = employerJobs.find((j) => j.id === selectedJobIdForInvite);
      const targetLink = targetJob ? `/jobs/${targetJob.id}` : '/jobs';
      if (selectedJobIdForInvite && (!targetJob || targetJob.employerId !== employerId)) {
        throw new Error('That job is not owned by this employer.');
      }
      const compName = (user as any)?.companyName || targetJob?.companyName || user?.displayName || 'Name unavailable';
      const invitationId = `invitation_${employerId}_${inviteModalCandidate.id}_${selectedJobIdForInvite || 'general'}`;
      const existing = await notificationRepository.findActiveInvitation(inviteModalCandidate.id, employerId, selectedJobIdForInvite || undefined);
      if (existing) {
        showSuccessToast('An active invitation already exists for this candidate.');
        setInviteModalCandidate(null);
        return;
      }
      await notificationRepository.create({
        userId: inviteModalCandidate.id,
        title: targetJob ? `Invitation to Apply: ${targetJob.title}` : `Hiring Invitation from ${compName}`,
        message: inviteMessage.trim() || `The talent acquisition team at ${compName} reviewed your profile and invites you to explore active openings.`,
        type: 'invitation',
        link: targetLink,
        read: false,
        senderId: employerId,
        senderDisplayName: compName,
        recipientId: inviteModalCandidate.id,
        jobId: selectedJobIdForInvite || undefined,
        invitationId,
        invitationStatus: 'pending',
      }, invitationId);
      showSuccessToast(`Invitation sent to ${inviteModalCandidate.displayName}!`);
      setInviteModalCandidate(null);
      setInviteMessage('');
      setSelectedJobIdForInvite('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown Firestore error';
      console.error('FindSeekersPage invitation failed:', err);
      showErrorToast(`Failed to send invitation: ${message}`);
    } finally {
      setIsSendingInvite(false);
    }
  };

  return (
    <PageContainer className="py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SectionHeader
          title="Find Seekers & Candidate Discovery"
          subtitle="Explore verified candidate profiles, review qualifications, and recruit talent directly into your pipeline."
          badge="Candidate Sourcing Radar"
        />

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link to="/employer/saved-candidates">
            <SecondaryButton icon={Bookmark} size="sm">
              Saved Candidates
            </SecondaryButton>
          </Link>
          <Link to="/employer/talent-sources">
            <SecondaryButton icon={GraduationCap} size="sm">
              Talent Sources
            </SecondaryButton>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Keywords (e.g. React, Full Stack, Python)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="City, Country, or Remote..."
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <SelectInput
            label=""
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            options={[
              { value: 'All', label: 'All Experience Levels' },
              { value: 'Entry Level', label: 'Entry Level (0 - 2 yrs)' },
              { value: 'Mid Level', label: 'Mid Level (3 - 5 yrs)' },
              { value: 'Senior Level', label: 'Senior Level (5+ yrs)' },
            ]}
          />

          <div className="flex items-center gap-2">
            <PrimaryButton type="submit" icon={Search} className="flex-1">
              Search Talent
            </PrimaryButton>
            <button
              type="button"
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                remoteOnly
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              Remote
            </button>
          </div>
        </form>

        {/* Popular Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Quick Tags:
          </span>
          {['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Go', 'Docker', 'Next.js'].map((sk) => (
            <button
              key={sk}
              type="button"
              onClick={() => {
                setSelectedSkill(selectedSkill === sk ? '' : sk);
                fetchCandidates();
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                selectedSkill === sk
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {sk}
            </button>
          ))}
          {(selectedSkill || searchQuery || selectedLocation || remoteOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSkill('');
                setSelectedLocation('');
                setSelectedExperience('All');
                setRemoteOnly(false);
                fetchCandidates();
              }}
              className="text-xs text-rose-500 hover:underline font-bold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Candidate Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Scanning candidate database...</p>
        </div>
      ) : error ? (
        <EmptyState
          icon={Users}
          title="Candidate Search Notice"
          description={error}
          action={
            <SecondaryButton onClick={fetchCandidates}>
              Retry Search
            </SecondaryButton>
          }
        />
      ) : candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={candidate.avatarUrl}
                      name={candidate.displayName}
                      size="lg"
                      className="rounded-2xl"
                    />
                    <div>
                      <h3 className={`font-extrabold text-sm ${candidate.isNameUnavailable ? 'text-slate-400 dark:text-slate-500 italic' : 'text-slate-900 dark:text-white'}`}>
                        {candidate.displayName}
                      </h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold line-clamp-1">
                        {candidate.headline}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleSave(candidate)}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      candidate.isSaved
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-500'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={candidate.isSaved ? 'Remove from Saved' : 'Save Candidate'}
                  >
                    <Bookmark className={`w-4 h-4 ${candidate.isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {candidate.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {candidate.experienceYears > 0 ? `${candidate.experienceYears} yrs exp` : 'Entry Level'}
                  </span>
                </div>

                {candidate.bio && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {candidate.bio}
                  </p>
                )}

                {/* Skills Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {candidate.skills.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                  {candidate.skills.length > 4 && (
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-400">
                      +{candidate.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setActiveCandidate(candidate)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    setInviteModalCandidate(candidate);
                    const greetingName = candidate.isNameUnavailable ? 'there' : candidate.displayName;
                    setInviteMessage(`Hi ${greetingName}, our team is looking for a ${candidate.headline || 'talented professional'} and we'd love to connect with you!`);
                  }}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Invite</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No Matching Candidates Found"
          description="Try broadening your keyword search, clearing location filters, or exploring talent pools in Talent Sources."
          action={
            <SecondaryButton
              onClick={() => {
                setSearchQuery('');
                setSelectedSkill('');
                setSelectedLocation('');
                setSelectedExperience('All');
                setRemoteOnly(false);
                fetchCandidates();
              }}
            >
              Reset Search Filters
            </SecondaryButton>
          }
        />
      )}

      {/* Detailed Candidate Profile Modal */}
      {activeCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar
                  src={activeCandidate.avatarUrl}
                  name={activeCandidate.displayName}
                  size="xl"
                  className="rounded-2xl"
                />
                <div>
                  <h2 className={`text-xl font-extrabold ${activeCandidate.isNameUnavailable ? 'text-slate-400 dark:text-slate-500 italic' : 'text-slate-900 dark:text-white'}`}>
                    {activeCandidate.displayName}
                  </h2>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {activeCandidate.headline}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {activeCandidate.location} • {activeCandidate.experienceYears} Years Exp
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveCandidate(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Bio */}
            {activeCandidate.bio && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Professional Summary
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                  {activeCandidate.bio}
                </p>
              </div>
            )}

            {/* Skills & Competencies */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Skills & Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeCandidate.skills.map((s) => (
                  <Badge key={s} variant="info" size="md">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Education */}
            {activeCandidate.education && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Education & Background
                </h4>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-3 text-xs">
                  <GraduationCap className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {activeCandidate.education}
                  </span>
                </div>
              </div>
            )}

            {/* Public Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {activeCandidate.portfolioUrl && (
                <a
                  href={activeCandidate.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" /> Portfolio
                </a>
              )}
              {activeCandidate.linkedinUrl && (
                <a
                  href={activeCandidate.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 flex items-center gap-1.5"
                >
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn
                </a>
              )}
              {activeCandidate.githubUrl && (
                <a
                  href={activeCandidate.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" /> GitHub
                </a>
              )}
              {activeCandidate.resumeUrl && (
                <a
                  href={activeCandidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" /> Attached Resume
                </a>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <SecondaryButton onClick={() => handleToggleSave(activeCandidate)} icon={Bookmark}>
                {activeCandidate.isSaved ? 'Remove from Saved' : 'Save Candidate'}
              </SecondaryButton>
              <PrimaryButton
                onClick={() => {
                  setInviteModalCandidate(activeCandidate);
                  setInviteMessage(`Hi ${activeCandidate.displayName}, our team would love to speak with you about opportunities!`);
                  setActiveCandidate(null);
                }}
                icon={Send}
              >
                Send Direct Invitation
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {inviteModalCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                Invite Candidate to Apply
              </h3>
              <button
                onClick={() => setInviteModalCandidate(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Send an invitation to <strong className={`text-slate-900 dark:text-white ${inviteModalCandidate.isNameUnavailable ? 'italic text-slate-400 dark:text-slate-500' : ''}`}>{inviteModalCandidate.displayName}</strong> ({inviteModalCandidate.headline}).
            </p>

            {employerJobs.length > 0 && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Target Opening (Optional)
                </label>
                <select
                  value={selectedJobIdForInvite}
                  onChange={(e) => {
                    const jobId = e.target.value;
                    setSelectedJobIdForInvite(jobId);
                    const j = employerJobs.find((item) => item.id === jobId);
                    if (j) {
                      setInviteMessage(
                        `Hi ${inviteModalCandidate.displayName}, our team reviewed your profile and would love to invite you to apply for our open ${j.title} position!`
                      );
                    } else {
                      setInviteMessage(
                        `Hi ${inviteModalCandidate.displayName}, our team is looking for a ${inviteModalCandidate.headline} and we'd love to connect with you!`
                      );
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">General Invitation / All Openings</option>
                  {employerJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} — {j.companyName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Personalized Message / Opportunity
              </label>
              <textarea
                rows={4}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Include details about the role, team, and why you are interested in their profile..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <SecondaryButton onClick={() => setInviteModalCandidate(null)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleSendInvitation} isLoading={isSendingInvite} icon={Send}>
                Send Invitation
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
