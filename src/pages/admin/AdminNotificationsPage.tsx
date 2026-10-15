import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { adminPortalService, AdminNotificationItem } from '../../services/adminPortalService';
import { Bell, CheckCircle2, ShieldAlert, UserPlus, FileCheck, Server } from 'lucide-react';

export const AdminNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);

  useEffect(() => {
    adminPortalService.getNotifications().then(setNotifications);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: AdminNotificationItem['type']) => {
    switch (type) {
      case 'verification':
        return <FileCheck className="w-4 h-4 text-emerald-500" />;
      case 'report':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'registration':
        return <UserPlus className="w-4 h-4 text-purple-500" />;
      default:
        return <Server className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Administrative System Notifications"
          subtitle="Real-time alerts for employer verifications, critical moderation reports, and infrastructure updates."
          badge="Alert Center"
        />

        <SecondaryButton icon={CheckCircle2} onClick={handleMarkAllRead}>
          Mark All as Read
        </SecondaryButton>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkAsRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                !n.read
                  ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/40'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                    {n.message}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                {n.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};
