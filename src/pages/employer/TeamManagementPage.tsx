import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { InputField } from '../../components/inputs/InputField';
import { SelectInput } from '../../components/inputs/SelectInput';
import { TeamMemberCard } from '../../components/cards/TeamMemberCard';
import { employerPortalService, EmployerTeamMember } from '../../services/employerPortalService';
import { UserPlus, Shield, CheckCircle2 } from 'lucide-react';

export const TeamManagementPage: React.FC = () => {
  const [members, setMembers] = useState<EmployerTeamMember[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<EmployerTeamMember['role']>('Senior Recruiter');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    employerPortalService.getTeamMembers().then(setMembers);
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    const newMember = await employerPortalService.inviteTeamMember(name, email, role);
    setMembers([...members, newMember]);
    setIsSubmitting(false);
    setIsInviteModalOpen(false);
    setName('');
    setEmail('');
    setSuccessMsg(`Invitation sent to ${email}!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleRemoveMember = async (id: string) => {
    await employerPortalService.removeTeamMember(id);
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Team Management & Role Delegation"
          subtitle="Manage recruiters, hiring managers, and interview panel members with explicit permissions."
          badge="Hiring Team"
        />

        <PrimaryButton icon={UserPlus} onClick={() => setIsInviteModalOpen(true)}>
          Invite New Teammate
        </PrimaryButton>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {successMsg}
        </div>
      )}

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            onRemove={handleRemoveMember}
          />
        ))}
      </div>

      {/* Invite Teammate Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleInviteSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Invite Teammate to Employer Workspace
              </h3>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer text-lg font-bold"
              >
                ×
              </button>
            </div>

            <InputField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <InputField label="Work Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <SelectInput
              label="Assigned Role"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              options={[
                { value: 'Senior Recruiter', label: 'Senior Recruiter (Post jobs, schedule interviews)' },
                { value: 'Hiring Manager', label: 'Hiring Manager (Review candidates, approve offers)' },
                { value: 'Interviewer', label: 'Interviewer (Conduct interviews & post notes)' },
              ]}
            />

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <SecondaryButton type="button" onClick={() => setIsInviteModalOpen(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" isLoading={isSubmitting} icon={UserPlus}>
                Send Workspace Invite
              </PrimaryButton>
            </div>
          </form>
        </div>
      )}
    </PageContainer>
  );
};
