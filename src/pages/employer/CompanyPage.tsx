import React, { useState, useMemo } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { CompanyCard } from '../../components/cards/CompanyCard';
import { JobCard } from '../../components/cards/JobCard';
import { ApplyJobModal } from '../../components/modals/ApplyJobModal';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { useJobContext } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { Job, Company } from '../../types';
import { 
  Search, 
  Building2, 
  MapPin, 
  Globe, 
  Users, 
  ArrowLeft, 
  Briefcase, 
  ExternalLink,
  ShieldCheck,
  X,
  RotateCcw,
  Loader2,
  Globe2,
  Edit3,
  FolderOpen,
  FileText,
  Download,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const CompanyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    companies, 
    jobs, 
    savedJobIds, 
    toggleSaveJob,
    searchGlobalCompanies,
    isSearchingGlobalCompanies
  } = useJobContext();
  
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);

  // Extract unique industries from available companies
  const availableIndustries = useMemo(() => {
    const set = new Set<string>();
    companies.forEach((c) => {
      if (c.industry) set.add(c.industry);
    });
    return ['All', ...Array.from(set).sort()];
  }, [companies]);

  // Keep every hook above the detail/list branch. Navigating between
  // /companies and /company/:id must not change this component's hook order.
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (appliedSearchQuery) {
        const q = appliedSearchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchInd = c.industry?.toLowerCase().includes(q);
        const matchHq = c.headquarters?.toLowerCase().includes(q);
        const matchTag = c.tagline?.toLowerCase().includes(q);
        if (!matchName && !matchInd && !matchHq && !matchTag) return false;
      }

      if (selectedIndustry !== 'All' && c.industry?.toLowerCase() !== selectedIndustry.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [companies, appliedSearchQuery, selectedIndustry]);

  // If ID is provided, show company detail view
  if (id) {
    const targetKey = decodeURIComponent(id).trim().toLowerCase();
    const company: Company | undefined = companies.find((c) => 
      String(c.id || '').toLowerCase() === targetKey ||
      String(c.name || '').toLowerCase() === targetKey ||
      String(c.id || '').toLowerCase() === `comp_${targetKey.replace(/[^a-z0-9]/g, '_')}` ||
      String(c.id || '').toLowerCase() === `org_him_${targetKey.replace(/[^a-z0-9]/g, '_')}` ||
      String(c.id || '').toLowerCase() === `org_jbc_${targetKey.replace(/[^a-z0-9]/g, '_')}` ||
      String(c.id || '').toLowerCase() === `org_rem_${targetKey.replace(/[^a-z0-9]/g, '_')}` ||
      String(c.id || '').toLowerCase() === `org_arb_${targetKey.replace(/[^a-z0-9]/g, '_')}`
    );

    // Filter jobs for this company
    const effectiveCompanyName = company ? String(company.name || '').toLowerCase() : targetKey;
    const companyJobs = jobs.filter((j) => String(j.companyName || '').toLowerCase() === effectiveCompanyName);

    if (!company && companyJobs.length === 0) {
      return (
        <PageContainer className="py-12 space-y-8">
          <div>
            <RouterLink
              to="/companies"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Companies Directory
            </RouterLink>
          </div>
          <EmptyState
            icon={Building2}
            title="Company profile not found"
            description="The requested company could not be located in our directory or active job listings."
            actionLabel="Return to Companies Directory"
            onAction={() => navigate('/companies')}
          />
        </PageContainer>
      );
    }

    const displayCompany: Company = company || {
      id: id,
      name: companyJobs[0]?.companyName || id,
      logoUrl: companyJobs[0]?.companyLogoUrl,
      tagline: `Hiring organization on CareerConnect`,
      description: `Active employer with ${companyJobs.length} open position(s).`,
      industry: companyJobs[0]?.category || 'Technology',
      companySize: '50+ Employees',
      headquarters: typeof companyJobs[0]?.location === 'string' ? companyJobs[0].location : companyJobs[0]?.location?.city || 'Remote',
      website: companyJobs[0]?.sourceUrl || '',
      openJobsCount: companyJobs.length,
      verified: false,
      companyOrigin: companyJobs[0]?.jobOrigin || 'external',
      sourceName: companyJobs[0]?.sourceName || 'Job Network',
      sourceUrl: companyJobs[0]?.sourceUrl,
    };

    return (
      <PageContainer className="py-8 space-y-8">
        
        {/* Back Link */}
        <div>
          <RouterLink
            to="/companies"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Companies Directory
          </RouterLink>
        </div>

        {/* Company Header Banner */}
        <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {displayCompany.bannerUrl && (
            <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={displayCompany.bannerUrl}
                alt={`${displayCompany.name} Cover Banner`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            </div>
          )}

          <div className={`p-6 sm:p-8 relative z-10 ${displayCompany.bannerUrl ? '-mt-16 sm:-mt-20' : ''}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
              <div className="flex items-end gap-4">
                {displayCompany.logoUrl ? (
                  <img
                    src={displayCompany.logoUrl}
                    alt={displayCompany.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-white dark:bg-slate-800 p-1 border-2 border-white dark:border-slate-700 shadow-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-50 dark:bg-slate-800 border-2 border-white dark:border-slate-700 flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-400 shadow-md flex-shrink-0">
                    {displayCompany.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className={`text-xl sm:text-2xl font-bold ${displayCompany.bannerUrl ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {displayCompany.name}
                    </h1>
                    {displayCompany.verified && (
                      <span title="Verified Employer">
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                      </span>
                    )}
                  </div>
                  <p className={`text-xs sm:text-sm mt-1 ${displayCompany.bannerUrl ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                    {displayCompany.tagline || `${displayCompany.industry} Organization`}
                  </p>
                  <div className={`flex flex-wrap items-center gap-3 mt-3 text-xs ${displayCompany.bannerUrl ? 'text-slate-300' : 'text-slate-500'}`}>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {displayCompany.headquarters || 'Remote'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {displayCompany.companySize || '50+ Employees'}
                    </span>
                    {displayCompany.sourceName && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                          {displayCompany.companyOrigin === 'internal' ? 'Direct Platform' : `Via ${displayCompany.sourceName}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                {user?.role === 'employer' && (
                  <RouterLink
                    to="/employer/company"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 transition-colors shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Company Profile
                  </RouterLink>
                )}

                {displayCompany.website && (
                  <a
                    href={displayCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors shadow-xs"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Details Column */}
          <main className="lg:col-span-2 space-y-6">
            
            {/* About Section */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                About {displayCompany.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {displayCompany.description || `${displayCompany.name} is an organization operating in the ${displayCompany.industry} sector, actively listing career opportunities.`}
              </p>

              {(displayCompany.mission || displayCompany.culture) && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  {displayCompany.mission && (
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white">Mission: </span>
                      {displayCompany.mission}
                    </div>
                  )}
                  {displayCompany.culture && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                      <span className="font-bold text-slate-700 dark:text-slate-300 not-italic">Culture: </span>
                      {displayCompany.culture}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Brand Media Gallery & Source Files Section */}
            {displayCompany.brandAssets && displayCompany.brandAssets.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-purple-500" />
                  Brand Media & Source Files ({displayCompany.brandAssets.length})
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {displayCompany.brandAssets.map((asset) => {
                    const isImg = asset.type.startsWith('image/') || asset.url.startsWith('data:image/');
                    return (
                      <div
                        key={asset.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 overflow-hidden flex flex-col justify-between group"
                      >
                        {isImg ? (
                          <div className="relative h-28 overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                        ) : (
                          <div className="h-28 flex flex-col items-center justify-center p-3 text-slate-400 text-center">
                            <FileText className="w-7 h-7 text-purple-500 mb-1" />
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">{asset.name}</span>
                          </div>
                        )}

                        <div className="p-2.5 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-bold text-slate-800 dark:text-white truncate max-w-[100px]">{asset.name}</span>
                          <a
                            href={asset.url}
                            download={asset.name}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                            title="Download / View"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Open Positions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-500" />
                  Active Job Openings ({companyJobs.length})
                </h3>
              </div>

              {companyJobs.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500">
                  <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No active job listings published right now.</p>
                  <p className="text-xs text-slate-500 mt-1">Check back soon for new hiring updates.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {companyJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedJobIds.includes(job.id)}
                      onApply={() => setSelectedJobToApply(job)}
                      onBookmark={(jid) => toggleSaveJob(jid)}
                    />
                  ))}
                </div>
              )}
            </div>

          </main>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Company Details</h4>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Industry</span>
                  <span className="font-bold text-slate-900 dark:text-white">{displayCompany.industry}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Headquarters</span>
                  <span className="font-bold text-slate-900 dark:text-white">{displayCompany.headquarters}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Company Size</span>
                  <span className="font-bold text-slate-900 dark:text-white">{displayCompany.companySize || '50+ Employees'}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Provenance</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {displayCompany.sourceName || (displayCompany.companyOrigin === 'internal' ? 'Direct Platform' : 'Partner Feed')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Verification</span>
                  <span className={`font-bold flex items-center gap-1 ${displayCompany.verified ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {displayCompany.verified ? 'Verified Employer' : 'Standard Listing'}
                  </span>
                </div>
              </div>
            </div>
          </aside>

        </div>

        {/* Application Submission Modal */}
        <ApplyJobModal
          job={selectedJobToApply}
          isOpen={!!selectedJobToApply}
          onClose={() => setSelectedJobToApply(null)}
        />
      </PageContainer>
    );
  }

  // Handle explicit form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    setAppliedSearchQuery(query);
    searchGlobalCompanies(query, selectedIndustry, 1);
  };

  const handleIndustryChange = (ind: string) => {
    setSelectedIndustry(ind);
    searchGlobalCompanies(appliedSearchQuery, ind, 1);
  };

  const handleResetSearch = () => {
    setSearchInput('');
    setAppliedSearchQuery('');
    setSelectedIndustry('All');
    searchGlobalCompanies('', 'All', 1);
  };

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="Top Hiring Organizations"
        subtitle="Explore verified employers and actively hiring global companies discovered in real-time across connected provider networks."
        badge="Live Company Directory"
      />

      {/* Explicit Search Bar Form */}
      <form onSubmit={handleSearchSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="relative flex-1 flex items-center w-full px-3 py-1.5">
            <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
            <input
              type="text"
              placeholder="Search company by name, industry, or headquarters location (e.g., GitLab, Automattic, Stripe)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto px-2 pb-2 sm:pb-0">
            <PrimaryButton type="submit" size="md" className="w-full sm:w-auto px-6 cursor-pointer">
              {isSearchingGlobalCompanies ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </PrimaryButton>
            {(appliedSearchQuery || selectedIndustry !== 'All') && (
              <button
                type="button"
                onClick={handleResetSearch}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Reset Search"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Industry Quick Filter Chips */}
        {availableIndustries.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap pl-1 mr-1">
              Filter by Industry:
            </span>
            {availableIndustries.map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => handleIndustryChange(ind)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedIndustry === ind
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-2">
          {isSearchingGlobalCompanies ? (
            <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Discovering organizations across connected networks...
            </span>
          ) : (
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredCompanies.length}</strong> hiring organizations
            </span>
          )}
        </div>
        {(appliedSearchQuery || selectedIndustry !== 'All') && (
          <Badge variant="info" size="sm">Search Active</Badge>
        )}
      </div>

      {/* Companies Grid or Empty State */}
      {filteredCompanies.length === 0 && !isSearchingGlobalCompanies ? (
        <EmptyState
          icon={Building2}
          title={appliedSearchQuery ? `No companies found matching "${appliedSearchQuery}"` : 'No companies found'}
          description={
            appliedSearchQuery
              ? 'Try searching with different company keywords, clearing industry filters, or checking your spelling.'
              : 'No organization profiles currently match the selected criteria.'
          }
          actionLabel="Reset Search & Filters"
          onAction={handleResetSearch}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onClick={(cid) => navigate(`/company/${encodeURIComponent(cid)}`)}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
};
