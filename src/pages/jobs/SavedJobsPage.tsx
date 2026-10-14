import React, { useState } from 'react';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { JobCard } from '../../components/cards/JobCard';
import { EmptyState } from '../../components/common/EmptyState';
import { JobComparisonModal } from '../../components/modals/JobComparisonModal';
import { ApplyJobModal } from '../../components/modals/ApplyJobModal';
import { useJobContext } from '../../context/JobContext';
import { Job } from '../../types';
import { Bookmark, Search, ArrowUpDown, Zap, CheckSquare, Trash2 } from 'lucide-react';

export const SavedJobsPage: React.FC = () => {
  const { jobs, savedJobIds, toggleSaveJob } = useJobContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'salary' | 'title'>('date');
  const [selectedJobIdsForCompare, setSelectedJobIdsForCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState<Job | null>(null);

  const bookmarkedJobs = jobs.filter(j => savedJobIds.includes(j.id));

  // Filter & Sort
  const filteredJobs = bookmarkedJobs
    .filter((j) => {
      const locStr = typeof j.location === 'string' ? j.location : `${j.location?.city || ''} ${j.location?.state || ''}`;
      return (
        j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locStr.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'salary') return (b.salaryMax || 0) - (a.salaryMax || 0);
      return (b.postedDaysAgo || 0) - (a.postedDaysAgo || 0);
    });

  const toggleSelectForCompare = (id: string) => {
    if (selectedJobIdsForCompare.includes(id)) {
      setSelectedJobIdsForCompare(prev => prev.filter(i => i !== id));
    } else {
      if (selectedJobIdsForCompare.length >= 3) return; // Limit to 3 max
      setSelectedJobIdsForCompare(prev => [...prev, id]);
    }
  };

  const selectedJobsForCompare = bookmarkedJobs.filter(j => selectedJobIdsForCompare.includes(j.id));

  return (
    <PageContainer className="py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionHeader
          title="Saved Opportunities & Bookmarks"
          subtitle="Compare salary, perks, and requirements across saved job postings."
          badge="Candidate Workspace"
        />

        {selectedJobIdsForCompare.length >= 2 && (
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs shadow-md hover:from-amber-600 hover:to-amber-700 transition-all flex items-center gap-2 cursor-pointer shrink-0 animate-bounce"
          >
            <Zap className="w-4 h-4" />
            <span>Compare Selected ({selectedJobIdsForCompare.length}/3)</span>
          </button>
        )}
      </div>

      {/* Controls Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved jobs by title, company, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Sort & Selection Helper */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="date">Recently Saved</option>
              <option value="salary">Highest Salary</option>
              <option value="title">Job Title (A-Z)</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            {bookmarkedJobs.length} Saved
          </span>
        </div>

      </div>

      {/* Selection helper bar */}
      {bookmarkedJobs.length > 1 && (
        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>
              Select 2 or 3 job cards to compare salary, work policy, and key tech stack side by side.
            </span>
          </div>
          {selectedJobIdsForCompare.length > 0 && (
            <button
              onClick={() => setSelectedJobIdsForCompare([])}
              className="text-xs font-bold underline hover:text-amber-700 cursor-pointer"
            >
              Clear Selection
            </button>
          )}
        </div>
      )}

      {/* Bookmarked Job Grid */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs found"
          description={searchTerm ? "No bookmarked roles match your search term." : "You haven't bookmarked any jobs yet. Browse available roles and click the bookmark icon."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => {
            const isSelected = selectedJobIdsForCompare.includes(job.id);
            return (
              <div key={job.id} className="relative group">
                {/* Checkbox badge overlay */}
                <div className="absolute top-4 left-4 z-20">
                  <label className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectForCompare(job.id)}
                      className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                    />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {isSelected ? 'Selected' : 'Compare'}
                    </span>
                  </label>
                </div>

                <JobCard
                  job={job}
                  isSaved={true}
                  onApply={() => setJobToApply(job)}
                  onBookmark={(id) => toggleSaveJob(id)}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison Modal */}
      <JobComparisonModal
        jobs={selectedJobsForCompare}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onApply={(job) => setJobToApply(job)}
      />

      {/* Apply Modal */}
      <ApplyJobModal
        job={jobToApply}
        isOpen={!!jobToApply}
        onClose={() => setJobToApply(null)}
      />

    </PageContainer>
  );
};
