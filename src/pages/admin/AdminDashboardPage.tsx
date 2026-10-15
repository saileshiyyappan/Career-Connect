import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { AdminStatCard } from '../../components/admin/AdminStatCard';
import { SystemHealthCard } from '../../components/admin/SystemHealthCard';
import { ModerationCard } from '../../components/admin/ModerationCard';
import { VerificationCard } from '../../components/admin/VerificationCard';
import {
  adminPortalService,
  PlatformStatistics,
  SystemHealthItem,
  ModerationReport,
  AdminEmployer,
  AuditLogItem,
} from '../../services/adminPortalService';
import {
  Users,
  Briefcase,
  Building,
  CheckCircle2,
  FileText,
  Calendar,
  Gift,
  Award,
  ShieldCheck,
  TrendingUp,
  Activity,
  Megaphone,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<PlatformStatistics | null>(null);
  const [health, setHealth] = useState<SystemHealthItem[]>([]);
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [employers, setEmployers] = useState<AdminEmployer[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLogItem[]>([]);

  useEffect(() => {
    adminPortalService.getPlatformStatistics().then(setStats);
    adminPortalService.getSystemHealth().then(setHealth);
    adminPortalService.getModerationReports().then(setReports);
    adminPortalService.getEmployers().then(setEmployers);
    adminPortalService.getAuditLogs().then(setRecentLogs);
  }, []);

  const handleResolveReport = async (id: string) => {
    await adminPortalService.resolveReport(id);
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Resolved' } : r)));
  };

  const handleDismissReport = async (id: string) => {
    await adminPortalService.dismissReport(id);
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Dismissed' } : r)));
  };

  const handleVerifyEmployer = async (id: string, status: AdminEmployer['status']) => {
    await adminPortalService.verifyEmployer(id, status);
    setEmployers((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  if (!stats) {
    return (
      <PageContainer className="py-12 text-center">
        <p className="text-xs font-semibold text-slate-400">Loading platform administration overview...</p>
      </PageContainer>
    );
  }

  const pendingVerificationEmployers = employers.filter((e) => e.status === 'Pending');
  const pendingReports = reports.filter((r) => r.status === 'Pending');
  const placementRate = stats.applicationsSubmitted > 0
    ? `${((stats.successfulHires / stats.applicationsSubmitted) * 100).toFixed(1)}%`
    : '0.0%';

  return (
    <PageContainer className="py-8 space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="CareerConnect Platform Command Center"
          subtitle="Real-time operations, user governance, employer compliance, and platform system metrics."
          badge="Super Admin Portal"
        />

        <div className="flex items-center gap-2">
          <Link to="/admin/announcements">
            <SecondaryButton icon={Megaphone} size="sm">
              New Announcement
            </SecondaryButton>
          </Link>
          <Link to="/admin/moderation">
            <PrimaryButton icon={AlertTriangle} size="sm">
              Review Reports ({pendingReports.length})
            </PrimaryButton>
          </Link>
        </div>
      </div>

      {/* Primary Key Performance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle={`${stats.activeJobSeekers.toLocaleString()} Seekers • ${stats.employers.toLocaleString()} Employers`}
          icon={Users}
          trend={stats.userGrowthRate}
          trendType="neutral"
          color="purple"
        />
        <AdminStatCard
          title="Active Job Openings"
          value={stats.activeJobs}
          subtitle={`Out of ${stats.jobsPosted.toLocaleString()} total posted`}
          icon={Briefcase}
          trend={stats.jobGrowthRate}
          trendType="neutral"
          color="blue"
        />
        <AdminStatCard
          title="Verified Enterprises"
          value={stats.verifiedCompanies}
          subtitle={`${pendingVerificationEmployers.length} Pending Review`}
          icon={Building}
          trend={`${pendingVerificationEmployers.length} pending review`}
          trendType="neutral"
          color="emerald"
        />
        <AdminStatCard
          title="Applications Processed"
          value={stats.applicationsSubmitted}
          subtitle={`${stats.successfulHires.toLocaleString()} Hires Confirmed`}
          icon={Award}
          trend={`${stats.successfulHires} confirmed hires`}
          trendType="neutral"
          color="indigo"
        />
      </div>

      {/* Secondary Metrics Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        <div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Interviews Scheduled
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
            {stats.interviewsScheduled.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Offers Issued
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
            {stats.offersSent.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Closed Positions
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
            {stats.closedJobs.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Placement Rate
          </span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {placementRate}
          </span>
        </div>
      </div>

      {/* Verification Requests & Moderation Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Pending Employer Verifications
            </h3>
            <Link to="/admin/employers" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </Link>
          </div>

          {pendingVerificationEmployers.length > 0 ? (
            <div className="space-y-4">
              {pendingVerificationEmployers.map((emp) => (
                <VerificationCard key={emp.id} employer={emp} onVerify={handleVerifyEmployer} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">All Employer Requests Verified</p>
              <p className="text-[11px] text-slate-400">No pending verification documents in queue.</p>
            </div>
          )}
        </div>

        {/* Priority Moderation Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Urgent Moderation Reports
            </h3>
            <Link to="/admin/moderation" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              View Moderation Center
            </Link>
          </div>

          <div className="space-y-4">
            {pendingReports.slice(0, 2).map((report) => (
              <ModerationCard
                key={report.id}
                report={report}
                onResolve={handleResolveReport}
                onDismiss={handleDismissReport}
              />
            ))}
          </div>
        </div>
      </div>

      {/* System Infrastructure Health */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            Infrastructure & Firebase Operational Health
          </h3>
          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
            All Systems Operational (99.98% Uptime)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {health.map((h, i) => (
            <SystemHealthCard key={i} health={h} />
          ))}
        </div>
      </div>

      {/* Recent Audit Log Feed */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Security Audit Logs</h3>
          <Link to="/admin/audit-logs" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            View Full Audit Logs
          </Link>
        </div>

        <div className="space-y-2">
          {recentLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {log.actorName} ({log.actorRole}): <span className="text-purple-600 dark:text-purple-400">{log.action}</span>
              </span>
              <span className="text-slate-400 text-[11px]">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};
