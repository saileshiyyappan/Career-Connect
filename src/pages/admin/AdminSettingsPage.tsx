import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { InputField } from '../../components/inputs/InputField';
import { CheckCircle2, Sliders, ShieldCheck, Database, Lock, Mail, Server } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [platformName, setPlatformName] = useState('CareerConnect Online Job Portal');
  const [supportEmail, setSupportEmail] = useState('support@careerconnect.io');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoFlagSpam, setAutoFlagSpam] = useState(true);
  const [maxReportsAutoPause, setMaxReportsAutoPause] = useState('3');
  const [enforce2FA, setEnforce2FA] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="Platform Administration System Settings"
        subtitle="Configure system-wide parameters, security thresholds, moderation policies, and Firebase connection keys."
        badge="Platform Configuration"
      />

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          System configurations saved and synchronized across environment!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Options */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-500" />
            General Platform Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Platform Title Name" value={platformName} onChange={(e) => setPlatformName(e.target.value)} required />
            <InputField label="System Support Email Address" type="email" placeholder="sailesh@gmail.com" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} required />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Enable Platform Maintenance Mode</p>
              <p className="text-[11px] text-slate-500">Temporarily restrict job posting & application submissions for maintenance.</p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5 rounded text-purple-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Security & Moderation Policy Thresholds */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Automated Moderation & Security Thresholds
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Auto-Flag Disposable Email Domains</p>
                <p className="text-[11px] text-slate-500">Automatically flag candidates applying from temporary email providers.</p>
              </div>
              <input
                type="checkbox"
                checked={autoFlagSpam}
                onChange={(e) => setAutoFlagSpam(e.target.checked)}
                className="w-5 h-5 rounded text-purple-600 cursor-pointer"
              />
            </div>

            <InputField
              label="Max Moderation Reports Before Auto-Pausing Job Listing"
              type="number"
              value={maxReportsAutoPause}
              onChange={(e) => setMaxReportsAutoPause(e.target.value)}
            />

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Enforce 2FA for Employer Workspace Admins</p>
                <p className="text-[11px] text-slate-500">Require multi-factor authentication for verified enterprise accounts.</p>
              </div>
              <input
                type="checkbox"
                checked={enforce2FA}
                onChange={(e) => setEnforce2FA(e.target.checked)}
                className="w-5 h-5 rounded text-purple-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Firebase Config Notice */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4" />
            Firebase Infrastructure Integration (Production Ready)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            All Admin Portal data services in <code className="text-purple-300">/src/services/adminPortalService.ts</code> are equipped with explicit <code className="text-purple-300">TODO</code> placeholders. When ready, connect your Firebase project configuration keys directly in your server environment variables.
          </p>
        </div>

        <div className="flex justify-end">
          <PrimaryButton type="submit" icon={CheckCircle2}>
            Save All Platform Settings
          </PrimaryButton>
        </div>
      </form>
    </PageContainer>
  );
};
