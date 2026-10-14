import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { JobCard } from '../../components/cards/JobCard';
import { CompanyCard } from '../../components/cards/CompanyCard';
import { NewsCard } from '../../components/cards/NewsCard';
import { NewsCardSkeleton } from '../../components/common/LoadingSkeleton';
import { ApplyJobModal } from '../../components/modals/ApplyJobModal';
import { useJobContext } from '../../context/JobContext';
import { useTheme } from '../../context/ThemeContext';
import { Job } from '../../types';
import { CareerNewsItem } from '../../types/news';
import { careerNewsService } from '../../services/careerNewsService';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  Globe2, 
  Code2, 
  BrainCircuit, 
  Palette, 
  Cloud, 
  BarChart3, 
  PlusCircle,
  UserCheck,
  Zap,
  Star,
  Quote,
  Clock,
  Send,
  Newspaper
} from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EmployerDashboardPage } from '../employer/EmployerDashboardPage';
import { PublicLandingPage } from './PublicLandingPage';

const AuthenticatedHomePage: React.FC = () => {
  const { jobs, companies, searchFilter, setSearchFilter, toggleSaveJob, savedJobIds } = useJobContext();
  const { accentConfig } = useTheme();
  const navigate = useNavigate();

  const [queryInput, setQueryInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);

  // Top career news for homepage
  const [homeNews, setHomeNews] = useState<CareerNewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState<boolean>(true);

  React.useEffect(() => {
    let isMounted = true;
    careerNewsService.getTopNews(3)
      .then((items) => {
        if (isMounted) {
          setHomeNews(items);
          setNewsLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Notice fetching homepage news:', err);
        if (isMounted) setNewsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilter(prev => ({
      ...prev,
      query: queryInput,
      location: locationInput,
    }));
    navigate('/jobs');
  };

  const featuredJobs = jobs.filter(j => j.featured).slice(0, 4);

  const categories = [
    { title: 'Engineering & Code', count: '1,420+ Jobs', icon: Code2, catKey: 'Engineering' },
    { title: 'AI & Machine Learning', count: '850+ Jobs', icon: BrainCircuit, catKey: 'Data & AI' },
    { title: 'Design & Creative', count: '640+ Jobs', icon: Palette, catKey: 'Design' },
    { title: 'Cloud & DevOps', count: '920+ Jobs', icon: Cloud, catKey: 'DevOps & Cloud' },
    { title: 'Product & Project', count: '510+ Jobs', icon: BarChart3, catKey: 'Product' },
    { title: 'Marketing & Sales', count: '380+ Jobs', icon: TrendingUp, catKey: 'Marketing' },
  ];

  const testimonials = [
    {
      quote: "CareerConnect streamlined my job search completely. Within two weeks of creating my profile, I landed a Senior Frontend Developer role at a top AI startup.",
      name: "Sophia Chen",
      role: "Senior Frontend Engineer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      company: "Starlight AI",
      rating: 5
    },
    {
      quote: "As a hiring manager, finding qualified cloud engineers was a huge bottleneck. CareerConnect's recruiter pipeline helped us hire 4 devs in under a month.",
      name: "Marcus Vance",
      role: "Head of Talent Acquisition",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      company: "CloudScale Systems",
      rating: 5
    },
    {
      quote: "The upfront salary transparency and remote filter options saved me dozens of hours. I never had to guess compensation ranges during initial screening.",
      name: "Elena Rostova",
      role: "Lead UX Researcher",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
      company: "PixelCraft Studios",
      rating: 5
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-800">
        
        {/* Glow Accent Circles */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[120px] opacity-25 pointer-events-none"
          style={{ backgroundColor: accentConfig.primaryHex }}
        />

        <PageContainer className="relative z-10 space-y-8 text-center max-w-5xl">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Over 12,500+ Verified Tech & Enterprise Jobs Available Today</span>
          </div>

          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.1]">
            Find Your Next <span style={{ color: accentConfig.primaryHex }}>Dream Role</span> in Tech
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Connecting exceptional talent with world-class tech companies, AI labs, and high-growth startups. Transparent salaries, remote roles, and instant application tracking.
          </p>

          {/* Interactive Hero Search Form */}
          <form 
            onSubmit={handleHeroSearch}
            className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center gap-3 text-slate-900 dark:text-white"
          >
            <div className="flex items-center gap-3 px-3 py-2.5 w-full md:w-1/2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title, skill, or company (e.g. React, Engineer)..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 px-3 py-2.5 w-full md:w-1/3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="City, state, or 'Remote'..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <PrimaryButton type="submit" size="lg" icon={Search} className="w-full md:w-auto shrink-0 py-3.5">
              Search Jobs
            </PrimaryButton>
          </form>

          {/* Popular Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300 mr-1">Popular searches:</span>
            {['React', 'AI Scientist', 'Remote', 'DevOps', 'Figma', 'Product Manager', 'Full Stack'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchFilter(prev => ({ ...prev, query: tag }));
                  navigate('/jobs');
                }}
                className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 hover:border-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

        </PageContainer>
      </section>

      <PageContainer className="space-y-16">

        {/* Career Statistics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-center space-y-1">
            <p className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white" style={{ color: accentConfig.primaryHex }}>12,500+</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Job Listings</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">2,800+</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Verified Companies</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">98.4%</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Placement Rate</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">$145k</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Average Tech Salary</p>
          </div>
        </div>

        {/* How It Works (3 Simple Steps) */}
        <section className="space-y-8">
          <SectionHeader
            title="How CareerConnect Works"
            subtitle="Land your next career opportunity or hire premier talent in three straightforward steps."
            badge="Simple Workflow"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-black text-xl flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-500" />
                Create Candidate Profile
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Build a professional profile, upload your latest resume, highlight your technical expertise, and set desired salary preferences.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-black text-xl flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-500" />
                Discover & Filter Roles
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Filter verified job vacancies by category, technology stack, experience level, remote availability, and transparent compensation ranges.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs relative space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-black text-xl flex items-center justify-center">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-500" />
                Apply & Track Progress
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Submit 1-click applications directly to hiring managers and track real-time application updates from your personal candidate dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeader
              title="Featured Job Opportunities"
              subtitle="Hand-picked roles from top enterprise companies and verified remote startups."
              badge="Hot Roles"
            />
            <RouterLink to="/jobs">
              <SecondaryButton icon={ArrowRight} iconPosition="right" size="sm">
                View All Jobs
              </SecondaryButton>
            </RouterLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
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

        {/* Popular Categories */}
        <section className="space-y-8">
          <SectionHeader
            title="Explore by Industry & Skill"
            subtitle="Discover open positions categorized by specialization."
            badge="Categories"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchFilter(prev => ({ ...prev, category: cat.catKey }));
                    navigate('/jobs');
                  }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left group cursor-pointer space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center transition-transform group-hover:scale-105">
                    <Icon className="w-6 h-6" style={{ color: accentConfig.primaryHex }} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cat.count}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Top Hiring Companies */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeader
              title="Top Hiring Companies"
              subtitle="Connect with verified employers building breakthrough technology."
              badge="Employers"
            />
            <RouterLink to="/companies">
              <SecondaryButton icon={ArrowRight} iconPosition="right" size="sm">
                Explore Companies Directory
              </SecondaryButton>
            </RouterLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.slice(0, 3).map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onClick={(id) => navigate(`/company/${id}`)}
              />
            ))}
          </div>
        </section>

        {/* Latest Career News & Market Insights */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeader
              title="Career & Tech Industry News"
              subtitle="Stay ahead with real-time hiring trends, tech market shifts, and career guidance."
              badge="Live Intelligence"
            />
            <RouterLink to="/news">
              <SecondaryButton icon={ArrowRight} iconPosition="right" size="sm">
                View All Career News
              </SecondaryButton>
            </RouterLink>
          </div>

          {newsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </div>
          ) : homeNews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeNews.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
              <Newspaper className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Aggregating the latest career headlines...
              </p>
              <RouterLink to="/news" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-block">
                Visit Career News Center →
              </RouterLink>
            </div>
          )}
        </section>

        {/* Why Choose CareerConnect */}
        <section className="space-y-8">
          <SectionHeader
            title="Why Professionals & Companies Choose CareerConnect"
            subtitle="Designed for speed, transparency, and high-impact technical career growth."
            badge="Why Us"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Verified Listings</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Every job posting is authenticated to eliminate ghost roles and spam recruiters.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Upfront Compensation</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Clear salary ranges and equity stakes listed on every single position.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                <Globe2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Global & Remote</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Access thousands of remote work-from-anywhere positions across North America, Europe & Asia.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Recruiter Direct Access</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Bypass traditional ATS black holes and get your resume directly to team leads.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="space-y-8">
          <SectionHeader
            title="Trusted by Candidates & Recruiters Worldwide"
            subtitle="Read how tech professionals and talent acquisition leads use CareerConnect daily."
            badge="Success Stories"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.role} • <span className="font-semibold text-blue-600">{t.company}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call To Action Banner */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-xl">
            <Badge variant="accent" size="sm">Get Started Today</Badge>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready to Accelerate Your Career or Build Your Engineering Team?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Join thousands of job seekers and hiring teams on CareerConnect. Free account setup for candidates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <RouterLink to="/register" className="w-full sm:w-auto">
              <PrimaryButton size="lg" icon={ArrowRight} iconPosition="right" className="w-full">
                Create Free Candidate Profile
              </PrimaryButton>
            </RouterLink>
            <RouterLink to="/post-job" className="w-full sm:w-auto">
              <SecondaryButton size="lg" icon={PlusCircle} className="w-full text-white border-slate-700 bg-slate-800/80 hover:bg-slate-700">
                Post a Job Vacancy
              </SecondaryButton>
            </RouterLink>
          </div>
        </section>

      </PageContainer>

      {/* Application Submission Modal */}
      <ApplyJobModal
        job={selectedJobToApply}
        isOpen={!!selectedJobToApply}
        onClose={() => setSelectedJobToApply(null)}
      />
    </div>
  );
};

export const HomePage: React.FC = () => {
  const { user, role, isLoading } = useAuth();
  const effectiveRole = user?.role || role;
  const isEmployer = effectiveRole === 'employer' || user?.email?.toLowerCase() === 'jr.research25@gmail.com';

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Restoring session...</p>
      </div>
    );
  }

  if (!user) {
    return <PublicLandingPage />;
  }

  if (isEmployer) {
    return <EmployerDashboardPage />;
  }

  return <AuthenticatedHomePage />;
};
