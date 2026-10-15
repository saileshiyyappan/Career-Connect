import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { RecruitmentStatCard } from '../../components/cards/RecruitmentStatCard';
import { employerPortalService, EmployerAnalyticsData } from '../../services/employerPortalService';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Award,
  Filter,
  Eye,
  CheckCircle2,
  PieChart,
  ArrowUpRight
} from 'lucide-react';

export const EmployerAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<EmployerAnalyticsData | null>(null);

  useEffect(() => {
    employerPortalService.getEmployerAnalytics().then(setData);
  }, []);

  if (!data) {
    return (
      <PageContainer className="py-12 text-center">
        <p className="text-xs font-semibold text-slate-400">Loading analytics metrics...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="Employer Recruitment Analytics"
        subtitle="Insights on talent acquisition throughput, funnel conversions, and source attribution."
        badge="Analytics Engine"
      />

      {/* Top Key Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RecruitmentStatCard
          title="Total Applications"
          value={data.applicationsReceived}
          subtitle="Across all job listings"
          icon={Users}
          trend="+24% vs last period"
          trendType="positive"
          color="blue"
        />
        <RecruitmentStatCard
          title="Avg. Time to Hire"
          value={`${data.avgTimeToHireDays} Days`}
          subtitle="From application to offer"
          icon={Clock}
          trend="4 days faster than industry"
          trendType="positive"
          color="emerald"
        />
        <RecruitmentStatCard
          title="Offer Acceptance Rate"
          value={`${data.offerAcceptanceRate}%`}
          subtitle="Candidate offer conversions"
          icon={Award}
          trend="+5% improvement"
          trendType="positive"
          color="purple"
        />
        <RecruitmentStatCard
          title="Total Listing Views"
          value={data.viewsPerJob.toLocaleString()}
          subtitle="Unique candidate impressions"
          icon={Eye}
          trend="+310 this week"
          trendType="positive"
          color="amber"
        />
      </div>

      {/* Recruitment Funnel & Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pipeline Conversion Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Recruitment Funnel Conversion
            </h3>
            <span className="text-xs font-bold text-slate-400">Total: {data.applicationsReceived}</span>
          </div>

          <div className="space-y-3 text-xs">
            {data.pipelineConversion.map((step) => {
              const percentage = Math.round((step.count / data.applicationsReceived) * 100);
              return (
                <div key={step.stage} className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{step.stage}</span>
                    <span>{step.count} candidates ({percentage}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source Attribution & Conversion */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-500" />
              Candidate Source Attribution
            </h3>
            <span className="text-xs font-bold text-slate-400">Sourced Channels</span>
          </div>

          <div className="space-y-4 text-xs">
            {data.sourceAttribution.map((src) => (
              <div
                key={src.source}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <p className="font-extrabold text-slate-900 dark:text-white">{src.source}</p>
                  <p className="text-[10px] text-slate-400">Verified recruitment link</p>
                </div>
                <span className="text-base font-black text-purple-600 dark:text-purple-400">
                  {src.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top Performing Jobs Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Top Performing Job Openings
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Position</th>
                <th className="py-3.5 px-5">Total Views</th>
                <th className="py-3.5 px-5">Applications</th>
                <th className="py-3.5 px-5">Conversion Rate</th>
                <th className="py-3.5 px-5">Hires Made</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {data.topPerformingJobs.map((j) => {
                const conversion = ((j.applications / j.views) * 100).toFixed(1);
                return (
                  <tr key={j.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">{j.title}</td>
                    <td className="py-3.5 px-5 font-semibold text-slate-600 dark:text-slate-300">{j.views}</td>
                    <td className="py-3.5 px-5 font-bold text-blue-600 dark:text-blue-400">{j.applications}</td>
                    <td className="py-3.5 px-5 font-bold text-emerald-600 dark:text-emerald-400">{conversion}%</td>
                    <td className="py-3.5 px-5 font-bold text-purple-600 dark:text-purple-400">{j.hires} hires</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};
