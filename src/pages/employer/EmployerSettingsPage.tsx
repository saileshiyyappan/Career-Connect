import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { InputField } from '../../components/inputs/InputField';
import { SelectInput } from '../../components/inputs/SelectInput';
import { CheckCircle2, Settings, Shield, Bell, Building2, Sliders } from 'lucide-react';

export const EmployerSettingsPage: React.FC = () => {
  const [autoReply, setAutoReply] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [allowPublicApplications, setAllowPublicApplications] = useState(true);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <PageContainer className="py-8 space-y-8 max-w-4xl">
      <SectionHeader
        title="Employer Workspace Settings"
        subtitle="Configure default recruitment workflows, automated applicant notifications, and security rules."
        badge="Recruiter Preferences"
      />

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Employer settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Automated Candidate Workflows */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-500" />
            Recruitment & Applicant Automation
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white">Auto-Acknowledge New Applications</p>
                <p className="text-slate-500">Send an instant email receipt to applicants upon submission.</p>
              </div>
              <input
                type="checkbox"
                checked={autoReply}
                onChange={(e) => setAutoReply(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white">Daily Recruiter Digest Email</p>
                <p className="text-slate-500">Receive a 09:00 AM summary of new candidate applications and scheduled interviews.</p>
              </div>
              <input
                type="checkbox"
                checked={dailySummary}
                onChange={(e) => setDailySummary(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white">Public Listing Indexing</p>
                <p className="text-slate-500">Allow job positions to appear in search engine feeds and public job boards.</p>
              </div>
              <input
                type="checkbox"
                checked={allowPublicApplications}
                onChange={(e) => setAllowPublicApplications(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Currency & Compensation defaults */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-500" />
            Default Organization Currency
          </h3>

          <SelectInput
            label="Base Offer Currency"
            value={defaultCurrency}
            onChange={(e) => setDefaultCurrency(e.target.value)}
            options={[
              { value: 'USD', label: 'USD ($) — United States Dollar' },
              { value: 'EUR', label: 'EUR (€) — Euro' },
              { value: 'GBP', label: 'GBP (£) — British Pound' },
              { value: 'CAD', label: 'CAD ($) — Canadian Dollar' },
            ]}
          />
        </div>

        <div className="flex justify-end">
          <PrimaryButton type="submit" icon={CheckCircle2}>
            Save Workspace Settings
          </PrimaryButton>
        </div>
      </form>
    </PageContainer>
  );
};
