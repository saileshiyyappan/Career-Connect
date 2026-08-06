import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { candidatePortalService, CareerInsightData } from '../../services/candidatePortalService';
import { TrendingUp, Award, Eye, CheckCircle2, Sparkles, BarChart2, ShieldCheck, ArrowUpRight, Zap, Target } from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const CareerInsightsPage: React.FC = () => {
  const [data, setData] = useState<CareerInsightData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await candidatePortalService.getCareerInsights();
    setData(result);
    setLoading(false);
  };

  if (loading || !data) {
    return (
      <PageContainer className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/3" />
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Career Market Insights & Skills Radar"
          subtitle="Real-time analytics on recruiter demand, skill valuation, and profile visibility."
          badge="Market Intelligence"
        />
      </div>

      {/* Top Banner Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Profile Strength */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Profile Score</span>
            <Target className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{data.profileStrength}%</p>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${data.profileStrength}%` }} />
          </div>
        </div>

        {/* Recruiter Views */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Recruiter Views</span>
            <Eye className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{data.recruiterViewsThisMonth}</p>
          <p className="text-[11px] text-purple-600 font-bold">+34% vs last month</p>
        </div>

        {/* Application Success Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Interview Rate</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{data.applicationSuccessRate}%</p>
          <p className="text-[11px] text-emerald-600 font-bold">Top 5% of candidates</p>
        </div>

        {/* Priority Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">ATS Rank</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white">Tier 1 Elite</p>
          <Badge variant="accent" size="sm">Verified Candidate</Badge>
        </div>

      </div>

      {/* Skills Demand Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Skills Demand List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              High-Demand Tech Skills in Your Industry
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Skills recruiters are filtering for most frequently in tech postings this quarter.
            </p>
          </div>

          <div className="space-y-4">
            {data.skillsDemand.map((item) => (
              <div key={item.skill} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{item.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold">{item.demandScore}/100 Demand Score</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px]">
                      {item.growth}
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{ width: `${item.demandScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recommended Skills */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Recommended Upskilling
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Acquiring these skills can increase your target salary by up to +$25k/yr.
            </p>
          </div>

          <div className="space-y-3">
            {data.recommendedSkills.map((sk) => (
              <div key={sk.name} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{sk.name}</h4>
                  <Badge variant="purple" size="sm">{sk.difficulty}</Badge>
                </div>
                <p className="text-[11px] text-slate-500">{sk.relevance}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recruiter Views History */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-500" />
          Recent Recruiter Profile Activity
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium">
          {data.recentViews.map((rv, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 font-bold flex items-center justify-center">
                  {rv.recruiterName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{rv.recruiterName}</p>
                  <p className="text-slate-500 text-[11px]">Senior Talent Partner @ {rv.company}</p>
                </div>
              </div>
              <span className="text-slate-400 text-[11px]">{rv.date}</span>
            </div>
          ))}
        </div>
      </div>

    </PageContainer>
  );
};
