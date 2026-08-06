import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { RecruitmentStatCard } from '../../components/cards/RecruitmentStatCard';
import { CandidateCard } from '../../components/cards/CandidateCard';
import { employerPortalService, EmployerCandidate, EmployerAnalyticsData } from '../../services/employerPortalService';
import { useJobContext } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Users,
  Calendar,
  Gift,
  PlusCircle,
  TrendingUp,
  Eye,
  Building2,
  ArrowRight,
  CheckCircle2,
  Bell,
  UserPlus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const EmployerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs } = useJobContext();
  const [candidates, setCandidates] = useState<EmployerCandidate[]>([]);
  const [analytics, setAnalytics] = useState<EmployerAnalyticsData | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<EmployerCandidate | null>(null);

  useEffect(() => {
    employerPortalService.getCandidates().then(setCandidates);
    employerPortalService.getEmployerAnalytics().then(setAnalytics);
  }, []);

  return (
    <PageContainer className="py-8 space-y-8">
      {/* Welcome & Top Action Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="accent" size="sm">Recruiter Command Center</Badge>
            <span className="text-xs text-blue-300 font-medium">{user?.companyName || 'Verified Organization'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.displayName || 'Employer'}! 👋
          </h1>
          <p className="text-sm text-slate-300">
            You have <strong className="text-blue-400">12 new applicant submissions</strong> and <strong className="text-emerald-400">2 interviews</strong> scheduled for today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <Link to="/post-job">
            <PrimaryButton icon={PlusCircle}>Post New Role</PrimaryButton>
          </Link>
          <Link to="/employer/pipeline">
            <SecondaryButton className="bg-white/10 hover:bg-white/20 border-white/20 text-white">
              View Kanban Pipeline
            </SecondaryButton>
          </Link>
        </div>

        {/* Decorative ambient background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Stat Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RecruitmentStatCard
          title="Active Job Postings"
          value={jobs.length}
          subtitle="Positions accepting applicants"
          icon={Briefcase}
          trend="+2 this week"
          trendType="positive"
          color="blue"
        />
        <RecruitmentStatCard
          title="Total Candidates"
          value={analytics?.applicationsReceived || 148}
          subtitle="Applicants in pipeline"
          icon={Users}
          trend="+18% vs last month"
          trendType="positive"
          color="purple"
        />
        <RecruitmentStatCard
          title="Interviews Scheduled"
          value={4}
          subtitle="Upcoming this week"
          icon={Calendar}
          trend="2 today"
          trendType="neutral"
          color="emerald"
        />
        <RecruitmentStatCard
          title="Pending Offers"
          value={1}
          subtitle="Staff UI/UX Architect"
          icon={Gift}
          trend="Expires Aug 15"
          trendType="positive"
          color="amber"
        />
      </div>

      {/* Main Grid: Active Openings & Recent Applicants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Open Vacancies */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <SectionHeader
              title="Active Vacancies & Metrics"
              subtitle="Monitor conversion rate and applicant count per opening."
            />
            <Link
              to="/my-jobs"
              className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View All Jobs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-5">Role Title</th>
                    <th className="py-3.5 px-5">Department</th>
                    <th className="py-3.5 px-5">Applicants</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{job.title}</p>
                          <p className="text-[11px] text-slate-500">{job.location.city}, {job.location.state}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-5">
                        <Badge variant="info" size="sm">{job.category || 'Engineering'}</Badge>
                      </td>
                      <td className="py-3.5 px-5 font-bold text-blue-600 dark:text-blue-400">
                        {job.applicantCount || 0} candidate(s)
                      </td>
                      <td className="py-3.5 px-5">
                        <Badge variant="success" size="sm">Active</Badge>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => navigate(`/employer/candidates?jobId=${job.id}`)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                        >
                          Review Applicants
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pipeline Funnel Quick Preview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Hiring Pipeline Overview
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
                <span className="text-[10px] uppercase font-extrabold text-blue-600 dark:text-blue-400">Screening</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">64</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50">
                <span className="text-[10px] uppercase font-extrabold text-purple-600 dark:text-purple-400">Shortlisted</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">32</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                <span className="text-[10px] uppercase font-extrabold text-indigo-600 dark:text-indigo-400">Interviewing</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">20</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                <span className="text-[10px] uppercase font-extrabold text-emerald-600 dark:text-emerald-400">Offered / Hired</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">11</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Top Talent Feed & Quick Tools */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Recent Candidate Activity
            </h3>
            <Link to="/employer/candidates" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {candidates.slice(0, 3).map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onSelect={(c) => navigate('/employer/candidates')}
              />
            ))}
          </div>

          {/* Quick Actions Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-lg">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-400">
              Quick Recruiter Tools
            </h4>

            <div className="space-y-2 text-xs">
              <Link
                to="/post-job"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <span className="font-bold flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-blue-400" />
                  Post New Role
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/employer/interviews"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <span className="font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Schedule Interview
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/employer/offers"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <span className="font-bold flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-400" />
                  Draft Offer Package
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/employer/team"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <span className="font-bold flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-purple-400" />
                  Invite Teammates
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
};
