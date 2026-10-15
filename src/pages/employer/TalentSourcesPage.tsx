import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { candidateDiscoveryService } from '../../services/candidateDiscoveryService';
import { TalentSourcePool } from '../../types/campaign';
import {
  GraduationCap,
  MapPin,
  Sparkles,
  Users,
  Search,
  ArrowRight,
  Briefcase,
  Layers,
  Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TalentSourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [pools, setPools] = useState<TalentSourcePool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    candidateDiscoveryService.getTalentSources().then((data) => {
      setPools(data);
      setLoading(false);
    });
  }, []);

  const categories = ['All', 'University', 'Location', 'Skill Pool'];

  const filteredPools = pools.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.topSkills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'University':
        return GraduationCap;
      case 'Location':
        return MapPin;
      case 'Skill Pool':
        return Sparkles;
      default:
        return Compass;
    }
  };

  return (
    <PageContainer className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Talent Sources & Verified Candidate Pools"
          subtitle="Discover specialized talent clusters aggregated from real candidate profiles across top universities, locations, and technology domains."
          badge="Talent Radar & Sourcing Pools"
        />

        <SecondaryButton
          onClick={() => navigate('/employer/find-seekers')}
          icon={Search}
          size="sm"
        >
          Open Candidate Search
        </SecondaryButton>
      </div>

      {/* Category Pills & Search */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search talent pools or institutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Sources Grid */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Aggregating talent pools from database...</p>
        </div>
      ) : filteredPools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPools.map((pool) => {
            const Icon = getCategoryIcon(pool.category);
            return (
              <div
                key={pool.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="info" size="sm">
                      {pool.category}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {pool.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {pool.description || 'Verified candidate group'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Available Candidates:</span>
                    <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                      {pool.candidateCount} candidate{pool.candidateCount === 1 ? '' : 's'}
                    </span>
                  </div>

                  {pool.topSkills && pool.topSkills.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">
                        Dominant Skills
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {pool.topSkills.map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => navigate(`/employer/find-seekers?query=${encodeURIComponent(pool.name)}`)}
                    className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Inspect Candidates in Pool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No Talent Sources Found"
          description={
            pools.length === 0
              ? 'No candidate profiles currently exist in the database with university or location metadata. Real candidate pools will automatically populate here as job seekers register and complete their education or location fields.'
              : 'No talent pools match your current search query. Try choosing "All" or a different keyword.'
          }
          action={
            <SecondaryButton onClick={() => navigate('/employer/find-seekers')}>
              Explore All Candidates
            </SecondaryButton>
          }
        />
      )}
    </PageContainer>
  );
};
