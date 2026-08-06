import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Badge } from '../../components/common/Badge';
import { employerPortalService, EmployerNotification } from '../../services/employerPortalService';
import { Bell, CheckCircle2, Calendar, Gift, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmployerNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<EmployerNotification[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    employerPortalService.getNotifications().then(setNotifications);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.category === filter);

  const getCategoryIcon = (category: EmployerNotification['category']) => {
    switch (category) {
      case 'application': return <Users className="w-4 h-4 text-blue-500" />;
      case 'interview': return <Calendar className="w-4 h-4 text-emerald-500" />;
      case 'offer': return <Gift className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <PageContainer className="py-8 space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Employer Alerts & Notifications"
          subtitle="Real-time alerts on candidate applications, interview confirmations, and offer responses."
          badge="Notifications Hub"
        />

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'application', label: 'Applications' },
          { id: 'interview', label: 'Interviews' },
          { id: 'offer', label: 'Offers' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
              n.read
                ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-80'
                : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                {getCategoryIcon(n.category)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {n.title}
                  </h4>
                  {!n.read && <Badge variant="info" size="sm">New</Badge>}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {n.message}
                </p>
                <span className="text-[10px] text-slate-400 font-semibold block">{n.timestamp}</span>
              </div>
            </div>

            {n.link && (
              <Link
                to={n.link}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </PageContainer>
  );
};
