import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { candidatePortalService, JobPreferences } from '../../services/candidatePortalService';
import { Settings, Sliders, DollarSign, MapPin, Briefcase, CheckCircle2, Save, Globe } from 'lucide-react';

export const JobPreferencesPage: React.FC = () => {
  const [prefs, setPrefs] = useState<JobPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [rolesInput, setRolesInput] = useState('');
  const [locationsInput, setLocationsInput] = useState('');
  const [salaryMin, setSalaryMin] = useState(150000);
  const [salaryMax, setSalaryMax] = useState(210000);
  const [openToRemote, setOpenToRemote] = useState(true);
  const [availabilityNotice, setAvailabilityNotice] = useState<'Immediate' | '2 Weeks' | '1 Month' | 'Negotiable'>('2 Weeks');

  useEffect(() => {
    loadPrefs();
  }, []);

  const loadPrefs = async () => {
    setLoading(true);
    const data = await candidatePortalService.getJobPreferences();
    setPrefs(data);
    setRolesInput(data.preferredRoles.join(', '));
    setLocationsInput(data.preferredLocations.join(', '));
    setSalaryMin(data.salaryMin);
    setSalaryMax(data.salaryMax);
    setOpenToRemote(data.openToRemote);
    setAvailabilityNotice(data.availabilityNotice);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const preferredRoles = rolesInput.split(',').map(r => r.trim()).filter(Boolean);
    const preferredLocations = locationsInput.split(',').map(l => l.trim()).filter(Boolean);

    const updated = await candidatePortalService.updateJobPreferences({
      preferredRoles,
      preferredLocations,
      salaryMin,
      salaryMax,
      currency: 'USD',
      openToRemote,
      availabilityNotice,
      employmentTypes: ['Full-Time', 'Remote'],
    });

    setPrefs(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (loading || !prefs) return null;

  return (
    <PageContainer className="py-8 space-y-8 max-w-3xl">
      <SectionHeader
        title="Target Job Preferences & Expectations"
        subtitle="Specify salary requirements, preferred locations, and target engineering titles for AI job matching."
        badge="Candidate Preferences"
      />

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>Your job preferences have been saved! Matching algorithms updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 text-xs">
        
        {/* Preferred Roles */}
        <div className="space-y-1.5">
          <label className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-500" />
            Target Job Roles & Titles (Comma Separated)
          </label>
          <input
            type="text"
            value={rolesInput}
            onChange={(e) => setRolesInput(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500"
          />
          <p className="text-[11px] text-slate-400">Recruiters will see these primary role targets on your profile.</p>
        </div>

        {/* Preferred Locations */}
        <div className="space-y-1.5">
          <label className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-purple-500" />
            Target Cities & Preferred Hubs
          </label>
          <input
            type="text"
            value={locationsInput}
            onChange={(e) => setLocationsInput(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Salary Expectations */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Minimum Base Salary ($/yr)
            </label>
            <input
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Target Base Salary ($/yr)
            </label>
            <input
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-medium focus:outline-none"
            />
          </div>
        </div>

        {/* Remote & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Open to Remote Work</p>
              <p className="text-[11px] text-slate-400">Show profile in 100% remote job pools</p>
            </div>
            <input
              type="checkbox"
              checked={openToRemote}
              onChange={(e) => setOpenToRemote(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1">
            <label className="font-bold text-slate-900 dark:text-white block">Availability / Notice Period</label>
            <select
              value={availabilityNotice}
              onChange={(e) => setAvailabilityNotice(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="Immediate">Immediate Start</option>
              <option value="2 Weeks">2 Weeks Notice</option>
              <option value="1 Month">1 Month Notice</option>
              <option value="Negotiable">Flexible / Negotiable</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-right">
          <PrimaryButton icon={Save} type="submit">
            Save Preferences
          </PrimaryButton>
        </div>

      </form>
    </PageContainer>
  );
};
