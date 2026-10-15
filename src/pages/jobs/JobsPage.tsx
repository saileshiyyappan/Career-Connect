import React, { useState, useMemo, useEffect } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { SearchBar } from '../../components/inputs/SearchBar';
import { JobCard } from '../../components/cards/JobCard';
import { ApplyJobModal } from '../../components/modals/ApplyJobModal';
import { Badge } from '../../components/common/Badge';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { EmptyState } from '../../components/common/EmptyState';
import { useJobContext } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import { Job } from '../../types';
import { JOB_CATEGORIES } from '../../utils/jobCategories';
import { 
  Briefcase, 
  Sparkles, 
  RotateCcw, 
  Grid, 
  List, 
  Check, 
  SlidersHorizontal, 
  Loader2, 
  Globe2, 
  TrendingUp,
  Building,
} from 'lucide-react';

export const JobsPage: React.FC = () => {
  const { role, user } = useAuth();
  const isEmp = user?.role === 'employer' || role === 'employer';
  const effectiveRole = isEmp ? 'employer' : (user?.role || role);
  const { 
    jobs, 
    searchFilter, 
    setSearchFilter, 
    savedJobIds, 
    toggleSaveJob,
    searchGlobalJobs,
    loadMoreGlobalJobs,
    isSearchingGlobal,
    globalProvidersQueried,
    relatedQuerySuggestion,
    hasMoreGlobalJobs,
    totalGlobalJobs
  } = useJobContext();

  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(searchFilter.category || 'All');
  const [selectedType, setSelectedType] = useState<string>(searchFilter.type || 'All');
  const [selectedExpLevel, setSelectedExpLevel] = useState<string>('All');
  const [remoteOnly, setRemoteOnly] = useState<boolean>(searchFilter.remoteOnly || false);

  const categories = ['All', ...JOB_CATEGORIES];
  const employmentTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels = ['All', 'Entry Level', 'Mid Level', 'Senior Level', 'Director / Lead'];

  // Handle Search Submission
  const handleSearchTrigger = (query: string, location: string) => {
    setSearchFilter((prev) => ({ ...prev, query, location }));
    searchGlobalJobs({ query, location, category: selectedCategory, type: selectedType, remoteOnly }, 1);
  };

  // Sync category change with search
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSearchFilter((prev) => ({ ...prev, category: cat }));
    searchGlobalJobs({ category: cat }, 1);
  };

  // Sync type change with search
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSearchFilter((prev) => ({ ...prev, type }));
    searchGlobalJobs({ type }, 1);
  };

  // Sync remote change with search
  const handleRemoteToggle = () => {
    const nextRemote = !remoteOnly;
    setRemoteOnly(nextRemote);
    setSearchFilter((prev) => ({ ...prev, remoteOnly: nextRemote }));
    searchGlobalJobs({ remoteOnly: nextRemote }, 1);
  };

  // Filter jobs based on local criteria
  const exactFilteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Category Filter
      if (selectedCategory !== 'All' && job.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Type Filter
      if (selectedType !== 'All' && job.employmentType?.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }

      // Experience Filter
      if (selectedExpLevel !== 'All' && job.experienceLevel?.toLowerCase() !== selectedExpLevel.toLowerCase()) {
        return false;
      }

      // Remote Filter
      if (remoteOnly) {
        const isRemote = typeof job.location === 'object' ? job.location.isRemote : job.location?.toLowerCase().includes('remote');
        if (!isRemote) return false;
      }

      return true;
    });
  }, [jobs, selectedCategory, selectedType, selectedExpLevel, remoteOnly]);

  const handleResetFilters = () => {
    setSearchFilter({ query: '', location: '', category: 'All', type: 'All', remoteOnly: false });
    setSelectedCategory('All');
    setSelectedType('All');
    setSelectedExpLevel('All');
    setRemoteOnly(false);
    searchGlobalJobs({ query: '', location: '', category: 'All', type: 'All', remoteOnly: false }, 1);
  };

  return (
    <PageContainer className="py-8 space-y-8">
      
      {/* Employer Workspace Guidance Banner */}
      {effectiveRole === 'employer' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Badge variant="info" size="sm">
              <Building className="w-3 h-3 mr-1" />
              Employer Portal Active
            </Badge>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              You are signed in as an Employer. Looking to manage jobs, candidate pipeline, or applications?
            </span>
          </div>
          <RouterLink
            to="/employer/dashboard"
            className="inline-flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors"
          >
            Go to Employer Dashboard →
          </RouterLink>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <SectionHeader
          title="Explore Career Opportunities"
          subtitle="Real-time global data discovery across verified employers and connected hiring networks (Himalayas, Jobicy, Remotive, Arbeitnow)."
          badge="Live Job Gateway"
        />
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              viewMode === 'grid' 
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              viewMode === 'list' 
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Search Bar Component */}
      <SearchBar
        initialTitle={searchFilter.query}
        initialLocation={searchFilter.location}
        onSearch={handleSearchTrigger}
      />

      {/* Layout Grid: Sidebar Filters + Job List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filter Sidebar */}
        <aside className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xs">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-500" />
                Filter Jobs
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Remote Only Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Remote Jobs Only
              </span>
              <button
                type="button"
                onClick={handleRemoteToggle}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  remoteOnly ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                    remoteOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Category
              </label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Employment Type */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Job Type
              </label>
              <div className="space-y-1">
                {employmentTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedType === type
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{type}</span>
                    {selectedType === type && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Experience Level
              </label>
              <div className="space-y-1">
                {experienceLevels.map((exp) => (
                  <button
                    key={exp}
                    onClick={() => setSelectedExpLevel(exp)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedExpLevel === exp
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{exp}</span>
                    {selectedExpLevel === exp && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Connected Providers Info */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Globe2 className="w-3.5 h-3.5 text-blue-500" />
                Live Data Feeds
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Himalayas', 'Jobicy', 'Remotive', 'Arbeitnow'].map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {p}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Job Listings Column */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <div className="flex items-center gap-2">
              {isSearchingGlobal ? (
                <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Querying live global feeds across providers...
                </span>
              ) : (
                <span>
                  Showing <strong className="text-slate-900 dark:text-white">{exactFilteredJobs.length}</strong> {exactFilteredJobs.length === 1 ? 'position' : 'positions'}
                  {totalGlobalJobs > 0 && ` (${totalGlobalJobs} available globally)`}
                </span>
              )}
            </div>

            {(searchFilter.query || searchFilter.location || selectedCategory !== 'All' || selectedType !== 'All' || remoteOnly) && (
              <Badge variant="info" size="sm">Search Active</Badge>
            )}
          </div>

          {/* Related Roles Fallback Banner */}
          {relatedQuerySuggestion && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
                  Related search results displayed for "{relatedQuerySuggestion}"
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                  Showing high-relevance matches across active engineering feeds.
                </p>
              </div>
            </div>
          )}

          {exactFilteredJobs.length === 0 && !isSearchingGlobal ? (
            <EmptyState
              icon={Briefcase}
              title={searchFilter.query ? `No live jobs found matching "${searchFilter.query}"` : 'No jobs matched your criteria'}
              description="Try searching with different keywords, removing location restrictions, or resetting your filter criteria."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="space-y-6">
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                {exactFilteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobIds.includes(job.id)}
                    onApply={() => setSelectedJobToApply(job)}
                    onBookmark={(id) => toggleSaveJob(id)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMoreGlobalJobs && (
                <div className="flex justify-center pt-4">
                  <PrimaryButton
                    onClick={loadMoreGlobalJobs}
                    disabled={isSearchingGlobal}
                    className="px-8 py-2.5 cursor-pointer flex items-center gap-2"
                  >
                    {isSearchingGlobal ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading Opportunities...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4" />
                        Discover More Positions
                      </>
                    )}
                  </PrimaryButton>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Application Submission Modal */}
      <ApplyJobModal
        job={selectedJobToApply}
        isOpen={!!selectedJobToApply}
        onClose={() => setSelectedJobToApply(null)}
      />

    </PageContainer>
  );
};
