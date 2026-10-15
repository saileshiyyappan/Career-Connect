import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { 
  Users, 
  Search, 
  LayoutGrid, 
  Bookmark, 
  GraduationCap, 
  Sparkles,
  Briefcase,
  Layers,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { CandidateManagementPage } from './CandidateManagementPage';
import { FindSeekersPage } from './FindSeekersPage';
import { CandidateDatabasePage } from './CandidateDatabasePage';
import { SavedCandidatesPage } from './SavedCandidatesPage';
import { TalentSourcesPage } from './TalentSourcesPage';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { Link } from 'react-router-dom';

export type ApplicantsHubTab = 'applicants' | 'find-seekers' | 'database' | 'saved' | 'sources';

interface TabItem {
  id: ApplicantsHubTab;
  label: string;
  badgeLabel?: string;
  icon: React.ElementType;
  description: string;
}

const TABS: TabItem[] = [
  {
    id: 'applicants',
    label: 'Applicant Pipeline',
    badgeLabel: 'Active',
    icon: Users,
    description: 'Track active job applicants across screening, interviews, offers, and hiring stages',
  },
  {
    id: 'find-seekers',
    label: 'Find Seekers',
    badgeLabel: 'Live Talent',
    icon: Search,
    description: 'Discover verified tech candidates and invite them directly to open roles',
  },
  {
    id: 'database',
    label: 'Candidate Database',
    badgeLabel: 'All Profiles',
    icon: LayoutGrid,
    description: 'Search, filter, and inspect complete candidate profiles in grid or table view',
  },
  {
    id: 'saved',
    label: 'Saved Candidates',
    badgeLabel: 'Shortlist',
    icon: Bookmark,
    description: 'Access bookmarked high-potential talent with custom notes and recruiter tags',
  },
  {
    id: 'sources',
    label: 'Talent Sources',
    badgeLabel: 'Pools',
    icon: GraduationCap,
    description: 'Tap university pipelines, regional talent clusters, and specialized skill pools',
  },
];

interface ApplicantsHubPageProps {
  defaultTab?: ApplicantsHubTab;
}

export const ApplicantsHubPage: React.FC<ApplicantsHubPageProps> = (props) => {
  const defaultTab: ApplicantsHubTab = props.defaultTab || 'applicants';
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read tab from query string or prop
  const tabParam = searchParams.get('tab');
  let activeTab: ApplicantsHubTab = defaultTab;
  if (tabParam === 'applicants') activeTab = 'applicants';
  else if (tabParam === 'find-seekers') activeTab = 'find-seekers';
  else if (tabParam === 'database') activeTab = 'database';
  else if (tabParam === 'saved') activeTab = 'saved';
  else if (tabParam === 'sources') activeTab = 'sources';

  const handleTabChange = (tabId: ApplicantsHubTab) => {
    setSearchParams({ tab: tabId });
  };

  const currentTabObj = TABS.find(t => t.id === activeTab) || TABS[0];

  return (
    <div className="space-y-0">
      {/* Unified Applicants & Talent Intelligence Command Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <PageContainer className="pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">Talent Intelligence</span>
                <span aria-hidden="true">·</span>
                <span>5 Integrated Sourcing Modules</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Applicants
              </h1>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                {currentTabObj.description}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link to="/post-job">
                <PrimaryButton size="sm">
                  <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                  Post a Job
                </PrimaryButton>
              </Link>
            </div>
          </div>

          {/* Dual-Page / Sub-Navigation Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-800/80">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer relative ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badgeLabel && (
                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-semibold ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {tab.badgeLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </PageContainer>
      </div>

      {/* Active Sub-Page Content */}
      <div className="transition-opacity duration-200">
        {activeTab === 'applicants' && <CandidateManagementPage />}
        {activeTab === 'find-seekers' && <FindSeekersPage />}
        {activeTab === 'database' && <CandidateDatabasePage />}
        {activeTab === 'saved' && <SavedCandidatesPage />}
        {activeTab === 'sources' && <TalentSourcesPage />}
      </div>
    </div>
  );
};

export const ApplicantsPage = ApplicantsHubPage;
