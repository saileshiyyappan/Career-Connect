import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { RecruitmentStatCard } from '../../components/cards/RecruitmentStatCard';
import { CandidateCard } from '../../components/cards/CandidateCard';
import {
  employerPortalService,
  EmployerCandidate,
  EmployerAnalyticsData,
  ScheduledInterview,
  JobOffer,
  EmployerNotification
} from '../../services/employerPortalService';
import { candidateDiscoveryService, CandidateProfileResult } from '../../services/candidateDiscoveryService';
import { HiringCampaign } from '../../types/campaign';
import { useJobContext } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Users,
  Calendar,
  Gift,
  PlusCircle,
  TrendingUp,
  Building2,
  ArrowRight,
  CheckCircle2,
  Bell,
  Search,
  Megaphone,
  UserCheck,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const EmployerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const employerId = user?.uid || '';
  const { jobs } = useJobContext();

  const [candidates, setCandidates] = useState<EmployerCandidate[]>([]);
  const [interviews, setInterviews] = useState<ScheduledInterview[]>([]);
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [campaigns, setCampaigns] = useState<HiringCampaign[]>([]);
  const [notifications, setNotifications] = useState<EmployerNotification[]>([]);
  const [recommendations, setRecommendations] = useState<CandidateProfileResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employerId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      employerPortalService.getCandidates(),
      employerPortalService.getInterviews(),
      employerPortalService.getOffers(),
      employerPortalService.getCampaigns(),
      employerPortalService.getNotifications(),
      candidateDiscoveryService.searchCandidates(employerId, {}, 3),
    ])
      .then(([cands, ints, offs, camps, notifs, recs]) => {
        setCandidates(cands);
        setInterviews(ints);
        setOffers(offs);
        setCampaigns(camps);
        setNotifications(notifs);
        setRecommendations(recs);
      })
      .catch((err) => {
        console.warn('EmployerDashboardPage load warning:', err);
      })
      .finally(() => setLoading(false));
  }, [employerId]);

  const todayStr = new Date().toISOString().split('T')[0];
  const activeJobsCount = jobs.filter((j) => j.status === 'active' || j.status === 'draft').length;
  const newApplicantsCount = candidates.filter((c) => c.stage === 'Applied').length;
  const shortlistedCount = candidates.filter((c) => c.stage === 'Shortlisted').length;
  const interviewsTodayCount = interviews.filter((i) => i.date === todayStr && i.status === 'Scheduled').length;
  const upcomingInterviewsCount = interviews.filter((i) => i.status === 'Scheduled').length;
  const pendingOffersCount = offers.filter((o) => o.status === 'Pending').length;
  const hiresCount = candidates.filter((c) => c.stage === 'Hired' || c.stage === 'Offer').length;
  const activeCampaignsCount = campaigns.filter((c) => c.status === 'active').length;

  return (
    <PageContainer className="py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="accent" size="sm">Recruiter Command Center</Badge>
            <span className="text-xs text-blue-300 font-medium">
              {(user as any)?.companyName || 'Enterprise Workspace'} • {(user as any)?.employerPosition || 'Hiring Team'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.displayName || 'Recruiter'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            You have <strong className="text-blue-400">{candidates.length} active applicant(s)</strong>, <strong className="text-emerald-400">{upcomingInterviewsCount} scheduled interview(s)</strong>, and <strong className="text-amber-400">{activeCampaignsCount} active hiring campaign(s)</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <Link to="/post-job">
            <PrimaryButton icon={PlusCircle}>Post a Job</PrimaryButton>
          </Link>
          <Link to="/employer/find-seekers">
            <SecondaryButton icon={Search} className="bg-white/10 hover:bg-white/20 border-white/20 text-white">
              Find Seekers
            </SecondaryButton>
          </Link>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Incomplete Employer Profile Prompt Card */}
      {(!user?.companyName || !(user as any)?.employerPosition || !(user as any)?.companyLocation) && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/25 dark:border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Complete Your Employer & Company Profile
                </h3>
                <Badge variant="accent" size="sm">Action Required</Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Add your organization details, recruiter position, and hiring requirements to activate verified company branding.
              </p>
            </div>
          </div>
          <Link to="/employer/profile" className="shrink-0">
            <PrimaryButton size="sm" icon={ArrowRight}>
              Complete Employer Profile
            </PrimaryButton>
          </Link>
        </div>
      )}

      {/* 8-Metric Command Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <RecruitmentStatCard
          title="Active Jobs"
          value={activeJobsCount}
          subtitle="Positions accepting candidates"
          icon={Briefcase}
          trend={`${activeJobsCount} published`}
          trendType="neutral"
          color="blue"
        />
        <RecruitmentStatCard
          title="New Applicants"
          value={newApplicantsCount}
          subtitle="Awaiting initial screening"
          icon={Users}
          trend={`${newApplicantsCount} new`}
          trendType="neutral"
          color="purple"
        />
        <RecruitmentStatCard
          title="Shortlisted"
          value={shortlistedCount}
          subtitle="Candidates passed initial review"
          icon={UserCheck}
          trend={`${shortlistedCount} ready`}
          trendType="neutral"
          color="indigo"
        />
        <RecruitmentStatCard
          title="Interviews Today"
          value={interviewsTodayCount}
          subtitle="Sessions on your schedule today"
          icon={Calendar}
          trend={`${interviewsTodayCount} today`}
          trendType="neutral"
          color="emerald"
        />
        <RecruitmentStatCard
          title="Upcoming Interviews"
          value={upcomingInterviewsCount}
          subtitle="Scheduled across all rounds"
          icon={Clock}
          trend={`${upcomingInterviewsCount} total`}
          trendType="neutral"
          color="blue"
        />
        <RecruitmentStatCard
          title="Pending Offers"
          value={pendingOffersCount}
          subtitle="Awaiting candidate signature"
          icon={Gift}
          trend={`${pendingOffersCount} offers`}
          trendType="neutral"
          color="amber"
        />
        <RecruitmentStatCard
          title="Total Hired"
          value={hiresCount}
          subtitle="Accepted offers & hires"
          icon={CheckCircle2}
          trend={`${hiresCount} hires`}
          trendType="neutral"
          color="emerald"
        />
        <RecruitmentStatCard
          title="Active Campaigns"
          value={activeCampaignsCount}
          subtitle="Public recruitment drives"
          icon={Megaphone}
          trend={`${activeCampaignsCount} active`}
          trendType="neutral"
          color="purple"
        />
      </div>

      {/* Main Sections: Left (2 cols) and Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Job Posts */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <SectionHeader
                title="Active Job Postings"
                subtitle="Review applicant counts and manage your current openings."
              />
              <Link to="/my-jobs" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                Manage All Jobs ({jobs.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {jobs.length > 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="py-3.5 px-5">Role Title</th>
                        <th className="py-3.5 px-5">Department</th>
                        <th className="py-3.5 px-5">Applicants</th>
                        <th className="py-3.5 px-5">Status</th>
                        <th className="py-3.5 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {jobs.slice(0, 5).map((job) => (
                        <tr key={job.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-5">
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{job.title}</p>
                            <p className="text-[11px] text-slate-500">{typeof job.location === 'object' ? `${job.location.city}, ${job.location.country}` : job.location}</p>
                          </td>
                          <td className="py-3.5 px-5">
                            <Badge variant="info" size="sm">{job.category || 'General'}</Badge>
                          </td>
                          <td className="py-3.5 px-5 font-bold text-blue-600 dark:text-blue-400">
                            {job.applicantCount || 0} candidate(s)
                          </td>
                          <td className="py-3.5 px-5">
                            <Badge variant="success" size="sm">Active</Badge>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <button
                              onClick={() => navigate(`/employer/applicants?jobId=${job.id}`)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No Openings Posted Yet"
                description="Create and publish your first job listing to start receiving qualified applicant resumes."
                action={
                  <Link to="/post-job">
                    <PrimaryButton icon={PlusCircle} size="sm">
                      Post Your First Job
                    </PrimaryButton>
                  </Link>
                }
              />
            )}
          </section>

          {/* Recent Applicants */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <SectionHeader
                title="Recent Applicants Pipeline"
                subtitle="Applicants who recently submitted qualifications for your open roles."
              />
              <Link to="/employer/applicants" className="text-xs font-bold text-blue-600 hover:underline">
                View Full Pipeline →
              </Link>
            </div>

            {candidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidates.slice(0, 4).map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onSelect={() => navigate('/employer/applicants')}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No Applicants in Pipeline"
                description="When candidates apply to your job listings, their resumes and contact details will appear here."
              />
            )}
          </section>

          {/* Hiring Campaign Activity */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <SectionHeader
                title="Active Hiring Campaigns"
                subtitle="Public announcements broadcasting current talent recruitment sprees."
              />
              <Link to="/employer/campaigns" className="text-xs font-bold text-blue-600 hover:underline">
                Manage Campaigns →
              </Link>
            </div>

            {campaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.slice(0, 2).map((camp) => (
                  <div
                    key={camp.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={camp.status === 'active' ? 'success' : 'neutral'} size="sm">
                        {camp.status}
                      </Badge>
                      <span className="text-[11px] text-slate-400 font-bold">{camp.startDate}</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{camp.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{camp.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {camp.positions.slice(0, 2).map((pos) => (
                        <span key={pos} className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 text-[10px] font-bold">
                          {pos}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Megaphone}
                title="No Campaigns Active"
                description="Launch a targeted hiring campaign to attract senior or specialized talent pools."
                action={
                  <Link to="/employer/campaigns">
                    <PrimaryButton icon={PlusCircle} size="sm">
                      Create Campaign
                    </PrimaryButton>
                  </Link>
                }
              />
            )}
          </section>

        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-8">
          
          {/* Upcoming Interviews */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                Upcoming Interviews
              </h3>
              <Link to="/employer/interviews" className="text-xs font-bold text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            {interviews.length > 0 ? (
              <div className="space-y-3">
                {interviews.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {item.candidateName}
                      </span>
                      <Badge variant="info" size="sm">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{item.jobTitle}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>{item.date} • {item.time}</span>
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                      >
                        Join Call <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center space-y-2">
                <Calendar className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Upcoming Interviews</p>
                <p className="text-[11px] text-slate-400">Review applicants to schedule rounds.</p>
              </div>
            )}
          </section>

          {/* Candidate Recommendations */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Candidate Matches
              </h3>
              <Link to="/employer/find-seekers" className="text-xs font-bold text-blue-600 hover:underline">
                Search All
              </Link>
            </div>

            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{rec.displayName}</p>
                      <span className="text-[10px] text-slate-400 font-bold">{rec.location}</span>
                    </div>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400">{rec.headline}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rec.skills.slice(0, 3).map((sk) => (
                        <span key={sk} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-semibold">
                          {sk}
                        </span>
                      ))}
                    </div>
                    <Link
                      to="/employer/find-seekers"
                      className="block text-right text-[11px] font-bold text-blue-600 hover:underline pt-1"
                    >
                      View in Radar →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No candidates registered yet.</p>
            )}
          </section>

          {/* Recent Recruiter Notifications */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-500" />
                Recent Alerts
              </h3>
              <Link to="/employer/notifications" className="text-xs font-bold text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1 text-xs"
                  >
                    <p className="font-bold text-slate-900 dark:text-white">{notif.title}</p>
                    <p className="text-[11px] text-slate-500">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 font-bold block pt-1">{notif.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-400">
                All caught up! No unread notifications.
              </div>
            )}
          </section>

        </div>

      </div>
    </PageContainer>
  );
};
