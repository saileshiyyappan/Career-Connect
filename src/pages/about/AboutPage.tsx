import React from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Badge } from '../../components/common/Badge';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { Target, Users, ShieldCheck, Heart, Sparkles, Globe, Award, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { CareerConnectLogo } from '../../components/common/CareerConnectLogo';

export const AboutPage: React.FC = () => {
  return (
    <PageContainer className="py-10 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center space-y-5 max-w-3xl mx-auto flex flex-col items-center">
        <CareerConnectLogo variant="mark" size="xl" />
        <Badge variant="accent" size="sm">Our Story & Mission</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Empowering Talent & Connecting World-Class Teams
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          CareerConnect was founded with a singular purpose: to remove friction from tech recruitment and give candidates transparent, high-impact career opportunities.
        </p>
      </div>

      {/* Core Principles: Mission, Vision, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            To democratize access to top-tier technical roles by providing candidates with transparent salary data, verified job vacancies, and direct recruiter communication channels.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Vision</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            A global hiring ecosystem where technical talent and remote engineering teams connect effortlessly, regardless of geographic boundaries or corporate bureaucracy.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Our Values</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Uncompromising data privacy, upfront salary transparency, equal opportunity hiring, and continuous innovation in talent acquisition workflows.
          </p>
        </div>
      </div>

      {/* Platform Features Grid */}
      <div className="space-y-8">
        <SectionHeader
          title="Key Platform Features"
          subtitle="Built from the ground up to solve real-world recruitment bottlenecks."
          badge="Platform Highlights"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <CheckCircle2 className="w-6 h-6 text-blue-500" />
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Instant 1-Click Applications</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Apply to active job vacancies immediately using your stored resume and pre-configured candidate preferences.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Recruiter Dashboard & Pipeline</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Employers can post job listings, review applicant profiles, filter by qualifications, and update hiring statuses seamlessly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <CheckCircle2 className="w-6 h-6 text-purple-500" />
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Verified Company Profiles</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Comprehensive employer company profiles showcasing tech stacks, perks, culture, leadership, and active open roles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <CheckCircle2 className="w-6 h-6 text-amber-500" />
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Real-Time Application Alerts</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Stay informed as hiring managers view your application, request interviews, or issue feedback.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <CheckCircle2 className="w-6 h-6 text-indigo-500" />
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Advanced Filter Engine</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Refine your job search by remote availability, salary bounds, experience levels, and technology tags.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <CheckCircle2 className="w-6 h-6 text-rose-500" />
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Responsive & Accessible</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Designed with dark and light theme controls, full mobile responsiveness, and high-contrast typography standards.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold">Ready to take the next step in your career?</h3>
          <p className="text-xs text-slate-400 mt-1">Explore active job listings or connect with top hiring managers now.</p>
        </div>
        <RouterLink to="/jobs">
          <PrimaryButton icon={ArrowRight} iconPosition="right" size="lg">
            Explore Open Jobs
          </PrimaryButton>
        </RouterLink>
      </div>

    </PageContainer>
  );
};
