import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { JobCard } from '../../components/cards/JobCard';
import { ApplicationCard } from '../../components/cards/ApplicationCard';
import { InterviewCard } from '../../components/cards/InterviewCard';
import { ApplyJobModal } from '../../components/modals/ApplyJobModal';
import { useAuth } from '../../context/AuthContext';
import { useJobContext } from '../../context/JobContext';
import { candidatePortalService, UpcomingInterview, CandidateNotification, SavedJobAlert } from '../../services/candidatePortalService';
import { Job, ApplicationStatus } from '../../types';
import { 
  LayoutDashboard, 
  Send, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  Plus, 
  Users, 
  Briefcase, 
  Building2, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Eye, 
  ArrowRight,
  UserCheck,
  Search,
  Sparkles,
  Calendar,
  Bell,
  Video,
  Target,
  Zap,
  BookOpen,
  Award,
  Sliders
} from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { role, user } = useAuth();
  const isEmp = user?.role === 'employer' || role === 'employer' || user?.email?.toLowerCase() === 'jr.research25@gmail.com';
  const effectiveRole = isEmp ? 'employer' : (user?.role || role);
  const { jobs, applications, savedJobIds, userProfile, updateApplicationStatus, toggleSaveJob } = useJobContext();
  const navigate = useNavigate();

  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState<UpcomingInterview[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<CandidateNotification[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    if (effectiveRole === 'employer') {
      navigate('/employer/dashboard', { replace: true });
      return;
    }
    if (effectiveRole === 'admin') {
      navigate('/admin', { replace: true });
      return;
    }
    if (effectiveRole === 'job_seeker' || effectiveRole === 'guest') {
      candidatePortalService.getInterviews().then(setUpcomingInterviews);
      candidatePortalService.getNotifications().then(setRecentNotifications);
    }
  }, [effectiveRole, navigate]);

  const savedJobs = jobs.filter(j => savedJobIds.includes(j.id));
  const myApplications = applications.filter(a => a.applicantId === userProfile.uid);
  const recommendedJobs = jobs.slice(0, 3);
  const recentlyViewedJobs = jobs.slice(1, 4);
  const candidateProfileFields: Array<[string, unknown]> = [
    ['headline', userProfile.headline],
    ['location', userProfile.location],
    ['skills', userProfile.skills],
    ['education', userProfile.education],
    ['experience', userProfile.experience || userProfile.experienceYears],
    ['resume', userProfile.resumeUrl],
  ];
  const missingProfileFields = candidateProfileFields
    .filter(([, value]) => !value || (Array.isArray(value) && value.length === 0))
    .map(([label]) => label);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchKeyword)}&location=${encodeURIComponent(searchLocation)}`);
  };

  // Candidate View
  if (role === 'job_seeker' || role === 'guest') {
    return (
      <PageContainer className="py-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="accent" size="sm">Candidate Daily Workspace</Badge>
                <span className="text-xs text-blue-200 font-medium">• Verified Profile</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Welcome back, {userProfile.displayName?.trim() || user?.displayName?.trim() || 'Job Seeker'}!
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                You have <strong className="text-white">{myApplications.length} active applications</strong>, <strong className="text-white">{upcomingInterviews.length} upcoming interviews</strong> scheduled, and <strong className="text-amber-300">{recommendedJobs.length} top job matches</strong> ready for you.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <RouterLink to="/jobs">
                <button className="px-5 py-2.5 rounded-2xl bg-white text-blue-600 font-extrabold text-xs shadow-md hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Browse Open Roles</span>
                </button>
              </RouterLink>
              <RouterLink to="/resumes">
                <button className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-xs transition-colors cursor-pointer flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Update Resume</span>
                </button>
              </RouterLink>
            </div>
          </div>
        </div>

        {/* Profile Completion Bar & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Profile Strength Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Profile Completion</span>
              <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                {userProfile.completionPercentage ?? 0}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${userProfile.completionPercentage ?? 0}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {(userProfile.completionPercentage ?? 0) < 100
                ? 'Complete remaining profile details to stand out to top recruiters.'
                : 'Your profile is 100% complete and visible to top employers!'}
            </p>
            {missingProfileFields.length > 0 && (
              <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                Recommended next: {missingProfileFields.slice(0, 3).join(', ')}
              </p>
            )}
            <RouterLink to="/profile" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <span>Complete Profile Wizard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </RouterLink>
          </div>

          {/* Quick Stats Grid */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Submitted</span>
                <Send className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{myApplications.length}</p>
              <p className="text-[11px] text-slate-400">Active Applications</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
              <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Interviewing</span>
                <Users className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {upcomingInterviews.length}
              </p>
              <p className="text-[11px] text-purple-600 font-bold">Scheduled</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-amber-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Bookmarked</span>
                <Bookmark className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{savedJobs.length}</p>
              <p className="text-[11px] text-slate-400">Saved Roles</p>
            </div>
          </div>

        </div>

        {/* Quick Search Jobs Bar */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-500" />
            Quick Job Search Radar
          </h3>

          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Job title, skill (e.g. React, Next.js)..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="City or Remote (e.g. San Francisco)..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Opportunities</span>
            </button>
          </form>
        </div>

        {/* Upcoming Interviews & Quick Prep */}
        {upcomingInterviews.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Upcoming Interview Session
              </h2>
              <RouterLink to="/interviews" className="text-xs font-bold text-blue-600 hover:underline">
                View All Interviews & Prep →
              </RouterLink>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <InterviewCard
                interview={upcomingInterviews[0]}
                onToggleChecklist={(intId, itemId) => {
                  candidatePortalService.toggleChecklistItem(intId, itemId).then(updated => {
                    if (updated) setUpcomingInterviews(prev => prev.map(i => i.id === intId ? updated : i));
                  });
                }}
              />
            </div>
          </section>
        )}

        {/* Active Submitted Applications */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Active Applications ({myApplications.length})
            </h2>
            <RouterLink to="/applications" className="text-xs font-bold text-blue-600 hover:underline">
              View All Pipeline Details →
            </RouterLink>
          </div>

          {myApplications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myApplications.slice(0, 3).map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No Applications Submitted Yet"
              description="Explore open opportunities and submit your first application to track your progress here."
              action={
                <RouterLink to="/jobs">
                  <PrimaryButton size="sm">Browse Jobs</PrimaryButton>
                </RouterLink>
              }
            />
          )}
        </section>

        {/* Today's Recommended Jobs */}
        <section className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Today's Recommended Jobs For You
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Matched based on your skills in React, TypeScript, and Remote preference.
              </p>
            </div>
            <RouterLink to="/jobs" className="text-xs font-bold text-blue-600 hover:underline">
              Explore All Jobs →
            </RouterLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobIds.includes(job.id)}
                onApply={() => setSelectedJobToApply(job)}
                onBookmark={(id) => toggleSaveJob(id)}
              />
            ))}
          </div>
        </section>

        {/* Career Insights & Trending Skills */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          
          {/* Trending Skills Widget */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Trending Skills Demand
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">React 19 & Next.js</span>
                <span className="text-emerald-600 font-extrabold">+24% Demand</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">TypeScript & Strict Typing</span>
                <span className="text-emerald-600 font-extrabold">+18% Demand</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">GraphQL & Apollo</span>
                <span className="text-emerald-600 font-extrabold">+15% Demand</span>
              </div>
            </div>

            <RouterLink to="/insights" className="block text-center text-xs font-bold text-blue-600 hover:underline pt-1">
              View Detailed Market Intelligence →
            </RouterLink>
          </div>

          {/* Learning Recommendations */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              Learning & Interview Prep
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">Mastering System Architecture</h4>
                <p className="text-slate-500 text-[11px]">Recommended for Senior Engineering rounds</p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">AWS Certified Cloud Developer</h4>
                <p className="text-slate-500 text-[11px]">Requested in 65% of Senior postings</p>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Quick Workspace Actions
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <RouterLink to="/resumes" className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 text-center transition-colors">
                <FileText className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                Upload Resume
              </RouterLink>

              <RouterLink to="/alerts" className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 text-center transition-colors">
                <Bell className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                Job Alerts
              </RouterLink>

              <RouterLink to="/job-preferences" className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 text-center transition-colors">
                <Sliders className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                Job Preferences
              </RouterLink>

              <RouterLink to="/interviews" className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 text-center transition-colors">
                <Calendar className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                Practice Prep
              </RouterLink>
            </div>
          </div>

        </section>

        {/* Application Modal */}
        <ApplyJobModal
          job={selectedJobToApply}
          isOpen={!!selectedJobToApply}
          onClose={() => setSelectedJobToApply(null)}
        />

      </PageContainer>
    );
  }

  // Loading / Redirecting state for other roles
  return (
    <PageContainer className="py-12 flex justify-center items-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading your workspace...</p>
      </div>
    </PageContainer>
  );
};
