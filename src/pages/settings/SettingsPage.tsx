import React from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { useTheme } from '../../context/ThemeContext';
import { ACCENT_CONFIGS } from '../../constants/designSystem';
import { AccentColor, ThemeMode } from '../../types/theme';
import { ToggleSwitch } from '../../components/inputs/ToggleSwitch';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { Badge } from '../../components/common/Badge';
import { StatusChip } from '../../components/common/StatusChip';
import { Moon, Sun, Monitor, Palette, CheckCircle, Bell, Shield, Sliders } from 'lucide-react';
import { showSuccessToast } from '../../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { theme, resolvedTheme, setTheme, accent, setAccent, accentConfig } = useTheme();

  const themeOptions: { mode: ThemeMode; label: string; icon: React.ElementType; description: string }[] = [
    { mode: 'light', label: 'Light Theme', icon: Sun, description: 'Clean crisp light canvas for bright environments' },
    { mode: 'dark', label: 'Dark Theme', icon: Moon, description: 'Eye-safe high-contrast dark layout' },
    { mode: 'system', label: 'System Default', icon: Monitor, description: 'Automatically matches your device settings' },
  ];

  return (
    <PageContainer className="py-8 space-y-8 max-w-4xl">
      <SectionHeader
        title="Settings & Customization"
        subtitle="Customize your visual theme, accent colors, and portal display preferences."
        badge="Preferences"
      />

      {/* Theme Selection Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Appearance & Theme Mode</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Choose between light, dark, or system preference mode.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.mode;

            return (
              <button
                key={opt.mode}
                onClick={() => {
                  setTheme(opt.mode);
                  showSuccessToast(`Applied ${opt.label}`);
                }}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-slate-900 dark:border-white ring-2 ring-blue-500/30 bg-slate-50 dark:bg-slate-800/80'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{opt.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">{opt.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color Palette Selection */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Custom Accent Colors</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Select your preferred accent brand highlight for buttons, links, and badges.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(ACCENT_CONFIGS) as AccentColor[]).map((key) => {
            const cfg = ACCENT_CONFIGS[key];
            const isSelected = accent === key;

            return (
              <button
                key={key}
                onClick={() => {
                  setAccent(key);
                  showSuccessToast(`Accent color updated to ${cfg.name}`);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-slate-900 dark:border-white ring-2 ring-blue-500/30 bg-slate-50 dark:bg-slate-800'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full shadow-xs" style={{ backgroundColor: cfg.primaryHex }} />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{cfg.name}</span>
                </div>
                {isSelected && <CheckCircle className="w-4 h-4 text-emerald-500" />}
              </button>
            );
          })}
        </div>

        {/* Live Accent Preview Box */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live Component Preview</span>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Active Theme: {accentConfig.name} ({resolvedTheme.toUpperCase()})</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="accent">Accent Badge</Badge>
            <StatusChip status="interviewing" />
            <PrimaryButton size="sm">Primary Action</PrimaryButton>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure real-time alerts and email digests.</p>
          </div>
        </div>

        <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
          <ToggleSwitch
            checked={true}
            onChange={() => showSuccessToast('Updated notification settings')}
            label="Email Alerts for New Job Recommendations"
            description="Receive curated daily recommendations based on your profile skills."
            className="pt-2"
          />

          <ToggleSwitch
            checked={true}
            onChange={() => showSuccessToast('Updated application alerts')}
            label="Application Status Changes"
            description="Get notified immediately when an employer updates your application status."
            className="pt-4"
          />
        </div>
      </div>

    </PageContainer>
  );
};
