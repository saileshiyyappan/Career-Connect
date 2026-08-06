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
  const { role } = useAuth();
  const { jobs, applications, savedJobIds, userProfile, updateApplicationStatus, toggleSaveJob } = useJobContext();
  const navigate = useNavigate();

  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState<UpcomingInterview[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<CandidateNotification[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    if (role === 'job_seeker' || role === 'guest') {
      candidatePortalService.getInterviews().then(setUpcomingInterviews);
      candidatePortalService.getNotifications().then(setRecentNotifications);
    }
  }, [role]);

  const savedJobs = jobs.filter(j => savedJobIds.includes(j.id));
  const myApplications = applications.filter(a => a.applicantId === userProfile.uid);
  const recommendedJobs = jobs.slice(0, 3);
  const recentlyViewedJobs = jobs.slice(1, 4);

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
                Welcome back, {userProfile.displayName || 'Candidate'}!
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                You have <strong className="text-white">{myApplications.length} active applications</strong>, <strong className="text-white">{upcomingInterviews.length} upcoming interview</strong> scheduled, and <strong className="text-amber-300">12 new job matches</strong> tailored to your React & TypeScript skills.
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
                {userProfile.completionPercentage ?? 80}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${userProfile.completionPercentage ?? 80}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {(userProfile.completionPercentage ?? 80) < 100
                ? 'Complete remaining profile details to stand out to top recruiters.'
                : 'Your profile is 100% complete and visible to top employers!'}
            </p>
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
                {upcomingInterviews.length || 1}
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
                <p className="text-slate-500 text-[11px]">Recommended before TechCorp Technical Round</p>
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

  // Employer View
  if (role === 'employer') {
    return (
      <PageContainer className="py-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Recruiter & Employer Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage open job postings, candidate submissions, and interview pipelines.
            </p>
          </div>
          <RouterLink to="/post-job">
            <PrimaryButton icon={Plus}>Post New Job Listing</PrimaryButton>
          </RouterLink>
        </div>

        {/* Employer Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Postings</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{jobs.length}</p>
            <p className="text-[11px] text-slate-400">Published Listings</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Applicants</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">114</p>
            <p className="text-[11px] text-slate-400">Across all roles</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Interviews</span>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">18</p>
            <p className="text-[11px] text-slate-400">Scheduled this week</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Offers Extended</span>
            <p className="text-2xl font-black text-emerald-500">4</p>
            <p className="text-[11px] text-emerald-600 font-semibold">Pending candidate acceptance</p>
          </div>
        </div>

        {/* Applicant Management Pipeline Table */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Recent Candidate Submissions
          </h2>

          <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Applied Position</th>
                    <th className="py-3.5 px-4">Date Submitted</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 font-bold flex items-center justify-center shrink-0">
                            {app.applicantName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{app.applicantName}</p>
                            <p className="text-[11px] text-slate-400">{app.applicantEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {app.jobTitle}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{app.appliedDate}</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="applied">Applied</option>
                          <option value="under_review">Under Review</option>
                          <option value="interviewing">Interviewing</option>
                          <option value="offered">Offered</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate('/applications')}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </PageContainer>
    );
  }

  // Admin View Fallback
  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="Administrator Portal"
        subtitle="Platform health, user compliance, and moderation metrics."
        badge="System Admin"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase">Registered Users</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">14,280</p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase">Active Jobs</p>
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">12,500</p>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400 uppercase">Verified Organizations</p>
          <p className="text-3xl font-black text-emerald-500 mt-1">2,800</p>
        </div>
      </div>
    </PageContainer>
  );
};
