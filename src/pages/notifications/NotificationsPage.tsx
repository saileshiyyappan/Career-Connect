import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Badge } from '../../components/common/Badge';
import { candidatePortalService, CandidateNotification } from '../../services/candidatePortalService';
import { Bell, CheckCircle2, Briefcase, Calendar, MessageSquare, ArrowRight, Trash2, CheckCheck, Sparkles, Filter } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationRepository } from '../../firebase/repositories/NotificationRepository';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<CandidateNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [listenerError, setListenerError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadNotifications();
    if (!user?.uid) return;
    return notificationRepository.subscribeByUserId(user.uid, (items) => {
      setListenerError(null);
      setNotifications(items.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        timestamp: new Date(n.createdAt).toLocaleString(),
        category: n.type === 'application' ? 'applications' : n.type === 'interview' ? 'interviews' : n.type === 'job_alert' ? 'job_matches' : n.type === 'invitation' || n.type === 'invitation_response' ? 'recruiter_messages' : 'system',
        read: n.read,
        targetLink: n.link,
        actionText: n.type === 'invitation' ? 'Review invitation' : 'View details',
        rawType: n.type,
        invitationStatus: n.invitationStatus,
      })));
    }, (error) => {
      console.warn('Notifications listener failed:', error);
      setListenerError((error as Error & { code?: string }).code === 'permission-denied' ? 'You do not have permission to read these notifications.' : 'Live notifications are temporarily unavailable.');
    });
  }, [user?.uid]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await candidatePortalService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.warn('Notifications load failed:', error);
      setListenerError('Notifications could not be loaded.');
    }
    setLoading(false);
  };

  const markAllRead = async () => {
    await candidatePortalService.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleMarkRead = async (id: string) => {
    await candidatePortalService.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleDelete = async (id: string) => {
    await candidatePortalService.deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleInvitationResponse = async (id: string, status: 'accepted' | 'declined') => {
    const ok = await candidatePortalService.respondToInvitation(id, status);
    if (ok) {
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, invitationStatus: status, read: true } : n));
    }
  };

  const filteredNotifications = categoryFilter === 'all'
    ? notifications
    : notifications.filter(n => n.category === categoryFilter);

  const categories = [
    { key: 'all', label: 'All Notifications' },
    { key: 'applications', label: 'Applications' },
    { key: 'interviews', label: 'Interview Updates' },
    { key: 'job_matches', label: 'Job Matches' },
    { key: 'recruiter_messages', label: 'Recruiter Messages' },
    { key: 'system', label: 'System' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <PageContainer className="py-8 space-y-8 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Notification Center & Radar Logs"
          subtitle="Real-time alerts for application progress, recruiter interview invites, and job matches."
          badge="Activity Stream"
        />

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all read ({unreadCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategoryFilter(cat.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              categoryFilter === cat.key
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {listenerError && <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">{listenerError}</div>}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No notifications in this category</h3>
            <p className="text-xs text-slate-500">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 ${
                notif.read
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs'
                  : 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 shadow-xs ring-1 ring-blue-500/10'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{notif.message}</p>
                  <p className="text-[11px] text-slate-400">{notif.timestamp}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-1">
                {notif.rawType === 'invitation' && notif.invitationStatus === 'pending' && (
                  <>
                    <button onClick={() => handleInvitationResponse(notif.id, 'accepted')} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">Accept</button>
                    <button onClick={() => handleInvitationResponse(notif.id, 'declined')} className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold">Decline</button>
                  </>
                )}
                {notif.targetLink && (
                  <RouterLink to={notif.targetLink} onClick={() => handleMarkRead(notif.id)}>
                    <button className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 cursor-pointer">
                      <span>{notif.actionText || 'View'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </RouterLink>
                )}

                <button
                  onClick={() => handleDelete(notif.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </PageContainer>
  );
};
