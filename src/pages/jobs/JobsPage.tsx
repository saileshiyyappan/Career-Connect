import React, { useState, useMemo } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { SearchBar } from '../../components/inputs/SearchBar';
import { JobCard } from '../../components/cards/JobCard';
import { ApplyJobModal } from '../../components/modals/ApplyJobModal';
import { Badge } from '../../components/common/Badge';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { EmptyState } from '../../components/common/EmptyState';
import { useJobContext } from '../../context/JobContext';
import { Job } from '../../types';
import { 
  Briefcase, 
  Filter, 
  Sparkles, 
  RotateCcw, 
  Grid, 
  List, 
  Check, 
  MapPin, 
  DollarSign,
  SlidersHorizontal
} from 'lucide-react';

export const JobsPage: React.FC = () => {
  const { jobs, searchFilter, setSearchFilter, savedJobIds, toggleSaveJob } = useJobContext();

  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(searchFilter.category || 'All');
  const [selectedType, setSelectedType] = useState<string>(searchFilter.type || 'All');
  const [selectedExpLevel, setSelectedExpLevel] = useState<string>('All');
  const [remoteOnly, setRemoteOnly] = useState<boolean>(searchFilter.remoteOnly || false);

  const categories = ['All', 'Engineering', 'Data & AI', 'Design', 'DevOps & Cloud', 'Product', 'Marketing'];
  const employmentTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels = ['All', 'Entry Level', 'Mid Level', 'Senior Level', 'Director / Lead'];

  // Filter jobs dynamically
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search Query Filter
      if (searchFilter.query) {
        const q = searchFilter.query.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = job.companyName.toLowerCase().includes(q);
        const matchSkills = job.skillsRequired?.some(s => s.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchSkills) return false;
      }

      // Location Filter
      if (searchFilter.location) {
        const locStr = typeof job.location === 'string' 
          ? job.location.toLowerCase() 
          : `${job.location.city} ${job.location.state || ''} ${job.location.country}`.toLowerCase();
        if (!locStr.includes(searchFilter.location.toLowerCase())) return false;
      }

      // Category Filter
      if (selectedCategory !== 'All' && job.category !== selectedCategory) {
        return false;
      }

      // Type Filter
      if (selectedType !== 'All' && job.employmentType !== selectedType) {
        return false;
      }

      // Experience Filter
      if (selectedExpLevel !== 'All' && job.experienceLevel !== selectedExpLevel) {
        return false;
      }

      // Remote Filter
      if (remoteOnly) {
        const isRemote = typeof job.location === 'object' ? job.location.isRemote : job.location.toLowerCase().includes('remote');
        if (!isRemote) return false;
      }

      return true;
    });
  }, [jobs, searchFilter, selectedCategory, selectedType, selectedExpLevel, remoteOnly]);

  const handleResetFilters = () => {
    setSearchFilter({ query: '', location: '', category: 'All', type: 'All', remoteOnly: false });
    setSelectedCategory('All');
    setSelectedType('All');
    setSelectedExpLevel('All');
    setRemoteOnly(false);
  };

  return (
    <PageContainer className="py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <SectionHeader
          title="Explore Career Opportunities"
          subtitle="Search, filter, and apply for thousands of verified software, design, product, and remote positions."
          badge="Job Directory"
        />
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl border transition-colors ${
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
            className={`p-2 rounded-xl border transition-colors ${
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
        onSearch={(title, loc) => {
          setSearchFilter(prev => ({ ...prev, query: title, location: loc }));
        }}
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
                onClick={() => setRemoteOnly(!remoteOnly)}
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
                    onClick={() => setSelectedCategory(cat)}
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
                    onClick={() => setSelectedType(type)}
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

          </div>
        </aside>

        {/* Job Listings Column */}
        <main className="lg:col-span-3 space-y-6">
          
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredJobs.length}</strong> available positions
            </span>
            {(searchFilter.query || searchFilter.location || selectedCategory !== 'All' || selectedType !== 'All' || remoteOnly) && (
              <Badge variant="info" size="sm">Filters Applied</Badge>
            )}
          </div>

          {filteredJobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs matched your criteria"
              description="Try adjusting your keyword search, removing location restrictions, or resetting your filter criteria."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedJobIds.includes(job.id)}
                  onApply={() => setSelectedJobToApply(job)}
                  onBookmark={(id) => toggleSaveJob(id)}
                />
              ))}
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
