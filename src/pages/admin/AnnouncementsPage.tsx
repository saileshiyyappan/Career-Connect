import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { InputField } from '../../components/inputs/InputField';
import { SelectInput } from '../../components/inputs/SelectInput';
import { TextareaInput } from '../../components/inputs/TextareaInput';
import { AnnouncementCard } from '../../components/admin/AnnouncementCard';
import { adminPortalService, AnnouncementItem } from '../../services/adminPortalService';
import { Megaphone, PlusCircle, Pin, CheckCircle2 } from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<AnnouncementItem['targetAudience']>('all');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    adminPortalService.getAnnouncements().then(setAnnouncements);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    const newItem = await adminPortalService.createAnnouncement({
      title: title.trim(),
      content: content.trim(),
      targetAudience,
      isPinned,
      status: 'Published',
    });

    setAnnouncements([newItem, ...announcements]);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setIsPinned(false);
    setSuccessMsg('Announcement broadcast published successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDelete = async (id: string) => {
    await adminPortalService.deleteAnnouncement(id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Platform Announcement Broadcast Manager"
          subtitle="Publish systemic announcements, feature releases, and scheduled maintenance notices to platform users."
          badge="Broadcast Center"
        />

        <PrimaryButton icon={PlusCircle} onClick={() => setIsModalOpen(true)}>
          Create New Announcement
        </PrimaryButton>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {successMsg}
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <AnnouncementCard key={ann.id} announcement={ann} onDelete={handleDelete} />
        ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Create System Announcement
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer text-lg font-bold"
              >
                ×
              </button>
            </div>

            <InputField label="Announcement Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

            <TextareaInput label="Announcement Content Body" rows={4} value={content} onChange={(e) => setContent(e.target.value)} required />

            <SelectInput
              label="Target Audience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as any)}
              options={[
                { value: 'all', label: 'All Users (Seekers & Employers)' },
                { value: 'job_seekers', label: 'Job Seekers Only' },
                { value: 'employers', label: 'Employers Only' },
              ]}
            />

            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                id="pinned"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 cursor-pointer"
              />
              <label htmlFor="pinned" className="font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                Pin Announcement to Top Banner
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <SecondaryButton type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" isLoading={isSubmitting} icon={Megaphone}>
                Publish Broadcast
              </PrimaryButton>
            </div>
          </form>
        </div>
      )}
    </PageContainer>
  );
};
