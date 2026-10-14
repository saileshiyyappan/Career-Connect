import React from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { AnalyticsCard } from '../../components/admin/AnalyticsCard';
import { useJobContext } from '../../context/JobContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Building,
  Award,
  PieChart,
  Activity,
  ArrowUpRight,
  Globe,
  Star,
} from 'lucide-react';

export const SystemAnalyticsPage: React.FC = () => {
  const { jobs, companies } = useJobContext();

  // Dynamically compute hiring companies
  const companyCounts = companies.slice(0, 4).map((c, i) => {
    const openings = jobs.filter(j => j.companyId === c.id || j.companyName?.toLowerCase() === c.name.toLowerCase()).length;
    return {
      name: c.name,
      rating: c.rating ? `${c.rating}/5` : '4.8/5',
      openings: openings || (c.openRolesCount || 1),
      hires: 10 + (i * 12),
    };
  });
  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="CareerConnect System Analytics & Intelligence"
        subtitle="Platform trajectory, engagement breakdown, DAU/MAU ratios, top skills, and employer retention."
        badge="Platform Telemetry"
      />

      {/* Top Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-slate-400 font-extrabold uppercase">Daily Active Users (DAU)</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">4,850</p>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs last week
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-slate-400 font-extrabold uppercase">Monthly Active Users (MAU)</span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400">14,820</p>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% month-over-month
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-slate-400 font-extrabold uppercase">Application Rate / Day</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">1,630</p>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> High Traffic Peak
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-slate-400 font-extrabold uppercase">Placement Conversion</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">75.1%</p>
          <span className="text-slate-400 font-medium">Offers converted to hires</span>
        </div>
      </div>

      {/* Growth Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User & Job Growth Visualizer */}
        <AnalyticsCard
          title="Monthly Registration & Listing Growth"
          subtitle="Comparative volume between job seekers and active openings"
          badge="Growth Velocity"
        >
          <div className="space-y-4 text-xs">
            {[
              { month: 'Apr 2026', seekers: 8200, jobs: 1100 },
              { month: 'May 2026', seekers: 9400, jobs: 1350 },
              { month: 'Jun 2026', seekers: 10100, jobs: 1550 },
              { month: 'Jul 2026', seekers: 11250, jobs: 1850 },
            ].map((row) => (
              <div key={row.month} className="space-y-1">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>{row.month}</span>
                  <span>{row.seekers.toLocaleString()} Seekers / {row.jobs.toLocaleString()} Jobs</span>
                </div>
                <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full bg-purple-600 rounded-l-full"
                    style={{ width: `${(row.seekers / 12000) * 80}%` }}
                  />
                  <div
                    className="h-full bg-blue-500 rounded-r-full"
                    style={{ width: `${(row.jobs / 2000) * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Most Popular Categories */}
        <AnalyticsCard
          title="Top Demanded Job Categories"
          subtitle="Share of applications submitted per industry discipline"
          badge="Demand Index"
        >
          <div className="space-y-3 text-xs">
            {[
              { category: 'Software Engineering & AI', share: '42%', count: '20,540' },
              { category: 'Product & UI/UX Design', share: '24%', count: '11,740' },
              { category: 'Data Science & Analytics', share: '18%', count: '8,800' },
              { category: 'Cybersecurity & Infrastructure', share: '16%', count: '7,840' },
            ].map((cat) => (
              <div
                key={cat.category}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
              >
                <span className="font-extrabold text-slate-900 dark:text-white">{cat.category}</span>
                <span className="font-black text-purple-600 dark:text-purple-400">
                  {cat.share} ({cat.count} apps)
                </span>
              </div>
            ))}
          </div>
        </AnalyticsCard>
      </div>

      {/* Top Hiring Companies & Popular Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Hiring Companies */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-500" />
            Top Hiring Companies on Platform
          </h3>

          <div className="space-y-3 text-xs">
            {companyCounts.map((company) => (
              <div
                key={company.name}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white">{company.name}</p>
                  <p className="text-[10px] text-slate-400">{company.openings} open listings • Rated {company.rating}</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold">
                  {company.hires} Hires
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Popular Candidate Skills */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Most In-Demand Candidate Skills
          </h3>

          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { skill: 'React / Next.js', count: '1,420 postings' },
              { skill: 'Python / PyTorch', count: '1,190 postings' },
              { skill: 'TypeScript', count: '980 postings' },
              { skill: 'Kubernetes & Docker', count: '840 postings' },
              { skill: 'Figma UI/UX', count: '760 postings' },
              { skill: 'GraphQL / Node.js', count: '690 postings' },
              { skill: 'SQL & PostgreSQL', count: '650 postings' },
            ].map((s) => (
              <div
                key={s.skill}
                className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-slate-800 dark:text-slate-200"
              >
                <span className="font-bold block">{s.skill}</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
