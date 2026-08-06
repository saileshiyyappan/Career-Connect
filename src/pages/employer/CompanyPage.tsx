import React, { useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { SectionHeader } from '../../components/common/SectionHeader';
import { CompanyCard } from '../../components/cards/CompanyCard';
import { JobCard } from '../../components/cards/JobCard';
import { ApplyJobModal } from '../../components/modals/ApplyJobModal';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { useJobContext } from '../../context/JobContext';
import { Job } from '../../types';
import { 
  Search, 
  Building2, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  Users, 
  ArrowLeft, 
  Briefcase, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const CompanyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { companies, jobs, savedJobIds, toggleSaveJob } = useJobContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobToApply, setSelectedJobToApply] = useState<Job | null>(null);

  // If ID is provided, show company detail view
  if (id) {
    const company = companies.find(c => c.id === id) || companies[0];
    const companyJobs = jobs.filter(j => j.companyName.toLowerCase() === company.name.toLowerCase());

    return (
      <PageContainer className="py-8 space-y-8">
        {/* Back Link */}
        <div>
          <RouterLink
            to="/companies"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Companies Directory
          </RouterLink>
        </div>

        {/* Company Header Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            
            <div className="flex items-start gap-5">
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-800 shadow-xs"
              />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="info" size="sm">{company.industry}</Badge>
                  <Badge variant="accent" size="sm">{company.companySize || '500+ Employees'}</Badge>
                  <Badge variant="warning" size="sm">Verified Employer</Badge>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {company.name}
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {company.tagline || 'Pioneering technology and modern engineering.'}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {company.headquarters}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    {companyJobs.length} Active Openings
                  </span>
                </div>
              </div>
            </div>

            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-xs"
              >
                <Globe className="w-4 h-4" />
                Visit Official Website
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            )}

          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info & Jobs */}
          <main className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">About {company.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {company.description}
              </p>
            </div>

            {/* Open Vacancies */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Open Roles at {company.name} ({companyJobs.length})
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
                      onBookmark={(id) => toggleSaveJob(id)}
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
                  <span className="font-bold text-slate-900 dark:text-white">{company.industry}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Headquarters</span>
                  <span className="font-bold text-slate-900 dark:text-white">{company.headquarters}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Company Size</span>
                  <span className="font-bold text-slate-900 dark:text-white">{company.companySize || '500+ Employees'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Verification</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
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

  // Directory List View
  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.headquarters.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer className="py-8 space-y-8">
      <SectionHeader
        title="Top Hiring Organizations"
        subtitle="Explore verified technology companies, startups, and enterprise employers hiring software, product, and design professionals."
        badge="Company Directory"
      />

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search company by name, industry, or headquarters location (e.g., NexaAI, San Francisco)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            onClick={(cid) => navigate(`/company/${cid}`)}
          />
        ))}
      </div>
    </PageContainer>
  );
};
