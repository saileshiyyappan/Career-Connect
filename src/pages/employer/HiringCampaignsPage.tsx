import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { InputField } from '../../components/inputs/InputField';
import { SelectInput } from '../../components/inputs/SelectInput';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { employerPortalService } from '../../services/employerPortalService';
import { HiringCampaign } from '../../types/campaign';
import { showSuccessToast, showErrorToast } from '../../context/ToastContext';
import {
  Megaphone,
  PlusCircle,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Trash2,
  ExternalLink,
  Sparkles,
  X,
  Building2,
  Clock
} from 'lucide-react';

export const HiringCampaignsPage: React.FC = () => {
  const { user } = useAuth();
  const employerId = user?.uid || '';

  const [campaigns, setCampaigns] = useState<HiringCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [positions, setPositions] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Senior Level');
  const [location, setLocation] = useState(user?.location || '');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site' | 'Flexible'>('Remote');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Contract' | 'Part-time' | 'Internship'>('Full-time');
  const [destination, setDestination] = useState('/jobs');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await employerPortalService.getCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.warn('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, [employerId]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !positions.trim()) {
      showErrorToast('Please enter a campaign title and target positions.');
      return;
    }

    setIsSubmitting(true);
    try {
      const positionsArr = positions.split(',').map((s) => s.trim()).filter(Boolean);
      const skillsArr = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);

      const created = await employerPortalService.createCampaign({
        employerId,
        companyName: (user as any)?.companyName || 'Verified Organization',
        companyLogo: (user as any)?.companyLogo || user?.photoURL,
        title: title.trim(),
        description: description.trim(),
        positions: positionsArr,
        requiredSkills: skillsArr,
        experienceLevel,
        location,
        workMode,
        employmentType,
        applicationDestination: destination || '/jobs',
        status: 'active',
        startDate,
        endDate: endDate || undefined,
        applicantCount: 0,
      });

      setCampaigns((prev) => [created, ...prev]);
      setIsCreateModalOpen(false);
      // Reset
      setTitle('');
      setDescription('');
      setPositions('');
      setRequiredSkills('');
      showSuccessToast('Hiring campaign launched successfully!');
    } catch (err: any) {
      showErrorToast(err?.message || 'Failed to create campaign.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (camp: HiringCampaign) => {
    const nextStatus = camp.status === 'active' ? 'paused' : 'active';
    try {
      await employerPortalService.updateCampaign(camp.id, { status: nextStatus });
      setCampaigns((prev) =>
        prev.map((c) => (c.id === camp.id ? { ...c, status: nextStatus } : c))
      );
      showSuccessToast(`Campaign marked as ${nextStatus}.`);
    } catch (err) {
      showErrorToast('Failed to update campaign status.');
    }
  };

  const handleDelete = async (id: string, campTitle: string) => {
    try {
      await employerPortalService.deleteCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      showSuccessToast(`Campaign "${campTitle}" deleted.`);
    } catch (err) {
      showErrorToast('Failed to delete campaign.');
    }
  };

  return (
    <PageContainer className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Hiring Campaigns & Talent Drives"
          subtitle="Publish high-impact recruitment announcements (e.g. 'We are hiring Engineers') and attract priority applicants."
          badge="Hiring Announcements"
        />

        <PrimaryButton onClick={() => setIsCreateModalOpen(true)} icon={PlusCircle}>
          Launch New Campaign
        </PrimaryButton>
      </div>

      {/* Campaigns List */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Loading your campaigns...</p>
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={camp.status === 'active' ? 'success' : camp.status === 'paused' ? 'warning' : 'neutral'}
                      size="sm"
                      className="capitalize"
                    >
                      {camp.status}
                    </Badge>
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Started {camp.startDate}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {camp.companyName}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleStatus(camp)}
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title={camp.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
                  >
                    {camp.status === 'active' ? (
                      <PauseCircle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <PlayCircle className="w-4 h-4 text-emerald-500" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(camp.id, camp.title)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {camp.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl">
                  {camp.description}
                </p>
              )}

              {/* Positions Wanted */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Target Positions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {camp.positions.map((pos) => (
                    <span
                      key={pos}
                      className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-900/40"
                    >
                      {pos}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills Wanted */}
              {camp.requiredSkills.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Required Stack & Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {camp.requiredSkills.map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta details */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {camp.location} ({camp.workMode})
                  </span>
                  <span>•</span>
                  <span>{camp.employmentType}</span>
                </div>

                <span className="font-bold text-slate-900 dark:text-white">
                  {camp.experienceLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Megaphone}
          title="No Hiring Campaigns Active"
          description="Create your first hiring campaign to broadcast bulk engineering drives, graduate hiring sprees, or specialized team expansions."
          action={
            <PrimaryButton onClick={() => setIsCreateModalOpen(true)} icon={PlusCircle}>
              Launch Your First Campaign
            </PrimaryButton>
          }
        />
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Launch Hiring Campaign
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <InputField
                label="Campaign Title"
                placeholder="e.g. Fall 2026 Engineering Drive: Frontend & Platform Roles"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Roles / Positions (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer, Staff DevOps, Full Stack Lead"
                  value={positions}
                  onChange={(e) => setPositions(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Required Core Stack & Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Next.js, Node.js, AWS, Kubernetes"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectInput
                  label="Experience Level"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  options={[
                    { value: 'Entry Level', label: 'Entry Level (0-2 Yrs)' },
                    { value: 'Mid Level', label: 'Mid Level (2-5 Yrs)' },
                    { value: 'Senior Level', label: 'Senior Level (5+ Yrs)' },
                    { value: 'Lead / Executive', label: 'Lead / Director / Staff' },
                  ]}
                />

                <SelectInput
                  label="Work Mode"
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as any)}
                  options={[
                    { value: 'Remote', label: '100% Remote' },
                    { value: 'Hybrid', label: 'Hybrid' },
                    { value: 'On-site', label: 'On-site' },
                    { value: 'Flexible', label: 'Flexible' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Hiring Location"
                  placeholder="e.g. San Francisco, CA & Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />

                <SelectInput
                  label="Employment Type"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value as any)}
                  options={[
                    { value: 'Full-time', label: 'Full-time' },
                    { value: 'Contract', label: 'Contract' },
                    { value: 'Part-time', label: 'Part-time' },
                    { value: 'Internship', label: 'Internship' },
                  ]}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Campaign Description & Candidate Value Proposition
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell candidates what makes this hiring push special, team growth roadmap, and perks..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <SecondaryButton onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" isLoading={isSubmitting} icon={Megaphone}>
                  Publish Hiring Campaign
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
