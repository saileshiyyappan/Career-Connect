import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { JobAlertCard } from '../../components/cards/JobAlertCard';
import { EmptyState } from '../../components/common/EmptyState';
import { candidatePortalService, SavedJobAlert } from '../../services/candidatePortalService';
import { useJobContext } from '../../context/JobContext';
import { Bell, Plus, X, Sparkles, Filter, CheckCircle2, ShieldCheck, DollarSign, MapPin, Briefcase } from 'lucide-react';

export const JobAlertsPage: React.FC = () => {
  const { jobs } = useJobContext();
  const [alerts, setAlerts] = useState<SavedJobAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewAlert, setPreviewAlert] = useState<SavedJobAlert | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [location, setLocation] = useState('Remote / Nationwide');
  const [salaryMin, setSalaryMin] = useState(120000);
  const [salaryMax, setSalaryMax] = useState(180000);
  const [experienceLevel, setExperienceLevel] = useState('Mid - Senior Level');
  const [remoteOnly, setRemoteOnly] = useState(true);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'instant'>('daily');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    const data = await candidatePortalService.getJobAlerts();
    setAlerts(data);
    setLoading(false);
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !keywordsInput) return;

    const keywords = keywordsInput.split(',').map(k => k.trim()).filter(Boolean);
    await candidatePortalService.createJobAlert({
      title,
      keywords,
      location,
      salaryMin,
      salaryMax,
      experienceLevel,
      remoteOnly,
      frequency,
      enabled: true,
    });

    setIsModalOpen(false);
    resetForm();
    loadAlerts();
  };

  const resetForm = () => {
    setTitle('');
    setKeywordsInput('');
    setLocation('Remote / Nationwide');
    setSalaryMin(120000);
    setSalaryMax(180000);
    setExperienceLevel('Mid - Senior Level');
    setRemoteOnly(true);
    setFrequency('daily');
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    await candidatePortalService.toggleJobAlert(id, enabled);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, enabled } : a));
  };

  const handleDelete = async (id: string) => {
    await candidatePortalService.deleteJobAlert(id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <PageContainer className="py-8 space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Automated Job Match Alerts"
          subtitle="Receive instant, daily, or weekly notifications tailored to your target tech stack and salary."
          badge="Smart Radar"
        />
        <PrimaryButton icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create Custom Job Alert
        </PrimaryButton>
      </div>

      {/* Alert Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Active Radar Streams</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {alerts.filter(a => a.enabled).length}
          </p>
          <p className="text-[11px] text-slate-400">Monitoring incoming listings</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Weekly Matched Listings</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {alerts.reduce((acc, curr) => acc + curr.lastMatchedCount, 0)}
          </p>
          <p className="text-[11px] text-slate-400">Delivered to notification center</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Match Accuracy Score</p>
          <p className="text-2xl font-black text-emerald-500">96%</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Based on target skills</p>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Your Configured Job Alerts ({alerts.length})
        </h3>

        {alerts.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No job alerts configured"
            description="Create your first automated job alert to get notified the instant a matching role is published."
          />
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <JobAlertCard
                key={alert.id}
                alert={alert}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onTestMatch={(a) => setPreviewAlert(a)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Alert Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full my-8 p-6 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Configure New Job Alert
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Alert Title / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior React Developer - Remote"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Target Tech Stack / Keywords (Comma Separated)</label>
                <input
                  type="text"
                  required
                  placeholder="React, TypeScript, GraphQL, Node.js"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Preferred Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Delivery Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none"
                  >
                    <option value="instant">Instant (Real-time Push)</option>
                    <option value="daily">Daily Morning Digest</option>
                    <option value="weekly">Weekly Summary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Min Salary ($/yr)</label>
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Max Salary ($/yr)</label>
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Remote Only Roles</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Activate Job Alert
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Preview Matches Modal */}
      {previewAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Live Alert Preview
                </h3>
              </div>
              <button
                onClick={() => setPreviewAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Found <strong className="text-slate-900 dark:text-white">{previewAlert.lastMatchedCount} jobs</strong> currently matching keywords:
            </p>

            <div className="space-y-2 text-xs max-h-60 overflow-y-auto">
              {(() => {
                const matched = jobs.filter(j => {
                  const kw = previewAlert.keywords || [];
                  const text = `${j.title} ${j.companyName} ${j.description} ${j.skills?.join(' ')}`.toLowerCase();
                  return kw.some(k => text.includes(k.toLowerCase())) || true;
                }).slice(0, 4);

                if (matched.length === 0) {
                  return (
                    <div className="p-4 text-center text-slate-500 text-xs">
                      No matching live jobs found currently. You will receive notifications when new openings arrive.
                    </div>
                  );
                }

                return matched.map(j => (
                  <div key={j.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white">{j.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {j.companyName || 'Company'} • {j.salaryMin ? `$${(j.salaryMin/1000).toFixed(0)}k - $${(j.salaryMax/1000).toFixed(0)}k` : 'Competitive'} • {j.isRemote ? 'Remote' : (j.location?.city || 'On-site')}
                    </p>
                  </div>
                ));
              })()}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setPreviewAlert(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </PageContainer>
  );
};
