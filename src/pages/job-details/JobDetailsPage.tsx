import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { SecondaryButton } from '../../components/common/SecondaryButton';
import { Badge } from '../../components/common/Badge';
import { JobCard } from '../../components/cards/JobCard';
import { EmptyState } from '../../components/common/EmptyState';
import { ApplyJobModal } from '../../components/modals/ApplyJobModal';
import { useJobContext } from '../../context/JobContext';
import { showSuccessToast } from '../../context/ToastContext';
import { jobService } from '../../firebase/services/JobService';
import { Job } from '../../types';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Building, 
  Calendar, 
  Users, 
  Bookmark, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  Globe, 
  Clock, 
  ShieldCheck,
  Send,
  ExternalLink,
  Loader2
} from 'lucide-react';

export const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, companies, savedJobIds, toggleSaveJob, isLoadingJobs } = useJobContext();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [fetchedJob, setFetchedJob] = useState<Job | null>(null);
  const [isFetchingDirect, setIsFetchingDirect] = useState(false);

  // Find target job in memory
  const memoryJob = jobs.find((j) => j.id === id);

  useEffect(() => {
    let isMounted = true;

    if (!memoryJob && id) {
      setIsFetchingDirect(true);
      jobService
        .getJobDetails(id)
        .then((doc) => {
          if (!isMounted) return;
          if (doc) {
            const isExternal = 'externalId' in doc;
            const jobData: Job = isExternal
              ? {
                  id: doc.id,
                  title: doc.title,
                  companyName: doc.companyName,
                  companyLogoUrl: doc.companyLogo,
                  location: doc.location,
                  employmentType: doc.employmentType as any,
                  experienceLevel: doc.experienceLevel ? (`${doc.experienceLevel} Level` as any) : 'Mid Level',
                  salary: doc.salary?.formatted || (doc.salary?.min ? { min: doc.salary.min, max: doc.salary.max || doc.salary.min, currency: doc.salary.currency || 'USD', period: doc.salary.period || 'yearly' } : 'Competitive'),
                  salaryMin: doc.salary?.min,
                  salaryMax: doc.salary?.max,
                  description: doc.description,
                  responsibilities: doc.responsibilities || [],
                  requirements: doc.qualifications || [],
                  skillsRequired: doc.skills || doc.technologyStack || [],
                  status: doc.status === 'active' ? 'active' : 'closed',
                  postedAt: typeof doc.publishedAt === 'string' ? doc.publishedAt.split('T')[0] : (typeof doc.createdAt === 'string' ? doc.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
                  employerId: '',
                  applicantCount: 0,
                  featured: false,
                  category: 'Engineering',
                  jobOrigin: 'external',
                  sourceId: doc.sourceId,
                  sourceName: doc.sourceName,
                  sourceUrl: doc.sourceUrl,
                  externalId: doc.externalId,
                }
              : {
                  id: doc.id,
                  title: doc.title,
                  companyName: doc.companyName,
                  companyLogoUrl: doc.companyLogo,
                  location: { city: doc.location, state: '', country: '', isRemote: doc.type === 'Remote' },
                  employmentType: doc.type as any,
                  experienceLevel: doc.experienceLevel ? (`${doc.experienceLevel} Level` as any) : 'Mid Level',
                  salary: { min: doc.salaryMin || 0, max: doc.salaryMax || 0, currency: doc.salaryCurrency || 'USD', period: 'yearly' },
                  salaryMin: doc.salaryMin,
                  salaryMax: doc.salaryMax,
                  description: doc.description,
                  responsibilities: [],
                  requirements: doc.requirements || [],
                  skillsRequired: doc.skills || [],
                  status: doc.status === 'closed' ? 'closed' : doc.status === 'draft' ? 'draft' : 'active',
                  postedAt: typeof doc.createdAt === 'string' ? doc.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
                  employerId: doc.employerId,
                  applicantCount: doc.applicationsCount || 0,
                  featured: false,
                  category: doc.department || 'Engineering',
                  jobOrigin: 'internal',
                };
            setFetchedJob(jobData);
          } else {
            setFetchedJob(null);
          }
          setIsFetchingDirect(false);
        })
        .catch(() => {
          if (isMounted) {
            setIsFetchingDirect(false);
            setFetchedJob(null);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [id, memoryJob]);

  const job = memoryJob || fetchedJob;
  const company = job ? companies.find((c) => c.name.toLowerCase() === job.companyName.toLowerCase()) : null;
  const isSaved = job ? savedJobIds.includes(job.id) : false;

  if (isLoadingJobs || isFetchingDirect) {
    return (
      <PageContainer className="py-16 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Loading job posting details...
        </p>
      </PageContainer>
    );
  }

  if (!job) {
    return (
      <PageContainer className="py-16">
        <EmptyState
          icon={Briefcase}
          title="Job Posting Not Found"
          description="The requested position is either expired, removed, or does not exist."
          actionLabel="Browse Available Jobs"
          onAction={() => navigate('/jobs')}
        />
      </PageContainer>
    );
  }

  const formatSalary = (salary: typeof job.salary) => {
    if (typeof salary === 'string') return salary;
    if (!salary || (salary.min === 0 && salary.max === 0)) return 'Competitive Compensation';
    return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k / ${salary.period || 'yearly'}`;
  };

  const formatLocation = (loc: typeof job.location) => {
    if (typeof loc === 'string') return loc;
    if (!loc) return 'Remote';
    return `${loc.city}${loc.state ? `, ${loc.state}` : ''} ${loc.isRemote ? '(Remote)' : ''}`;
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showSuccessToast('Job link copied to clipboard!');
    }
  };

  const relatedJobs = jobs.filter(
    (j) => j.id !== job.id && (j.category === job.category || j.companyName === job.companyName)
  ).slice(0, 2);

  return (
    <PageContainer className="py-8 space-y-8">
      {/* Back Link */}
      <div>
        <RouterLink
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Listings
        </RouterLink>
      </div>

      {/* Main Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            {job.companyLogoUrl ? (
              <img
                src={job.companyLogoUrl}
                alt={job.companyName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-800 shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black text-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                {job.companyName.charAt(0)}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent" size="sm">
                  {job.employmentType}
                </Badge>
                {job.featured && <Badge variant="warning" size="sm">Featured Role</Badge>}
                <Badge variant="info" size="sm">{job.category || 'Engineering'}</Badge>
                {job.jobOrigin === 'external' && job.sourceName && (
                  <Badge variant="default" size="sm">
                    Source: {job.sourceName}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <Building className="w-4 h-4 text-slate-400" />
                  {job.companyName}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {formatLocation(job.location)}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <DollarSign className="w-4 h-4" />
                  {formatSalary(job.salary)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Posted {job.postedAt}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleSaveJob(job.id)}
              className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Save Job'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Share Link"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {job.jobOrigin === 'external' && job.sourceUrl ? (
              <a
                href={job.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                <span>Apply on {job.sourceName || 'Source'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <PrimaryButton size="lg" icon={Send} onClick={() => setIsApplyModalOpen(true)}>
                Apply Now
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job Description details */}
        <main className="lg:col-span-2 space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-8 shadow-xs">
            {/* Overview Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Role Overview</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                {job.description || 'No detailed description provided for this listing.'}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Key Responsibilities</h3>
                <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Qualifications & Skills</h3>
                <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack Skills Required */}
            {job.skillsRequired && job.skillsRequired.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Required Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar: Company Info + Job Facts */}
        <aside className="space-y-6">
          {/* Company Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              About the Employer
            </h4>

            <div className="flex items-center gap-3">
              {job.companyLogoUrl ? (
                <img
                  src={job.companyLogoUrl}
                  alt={job.companyName}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-lg">
                  {job.companyName.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {company?.name || job.companyName}
                </h3>
                <p className="text-xs text-slate-500">{company?.industry || 'Technology'}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {company?.description || company?.tagline || 'Leading technology and talent innovation.'}
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Headquarters</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {company?.headquarters || (typeof job.location === 'string' ? job.location : job.location?.city || 'Remote')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Company Size</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {company?.companySize || 'Verified Organization'}
                </span>
              </div>
              {company?.openJobsCount !== undefined && (
                <div className="flex items-center justify-between">
                  <span>Active Listings</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {company.openJobsCount} open roles
                  </span>
                </div>
              )}
            </div>

            {company?.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                Visit Company Website
              </a>
            )}
          </div>

          {/* Job Overview Facts */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Job Snapshot
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Experience Level</span>
                <span className="font-bold text-slate-900 dark:text-white">{job.experienceLevel}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Employment Type</span>
                <span className="font-bold text-slate-900 dark:text-white">{job.employmentType}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Origin</span>
                <span className="font-bold capitalize text-slate-900 dark:text-white">
                  {job.jobOrigin || 'Internal'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Total Applicants</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {job.applicantCount || 0} applied
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Job ID</span>
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[120px]">
                  {job.id}
                </span>
              </div>
            </div>

            <div className="pt-2">
              {job.jobOrigin === 'external' && job.sourceUrl ? (
                <a
                  href={job.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <span>Apply on External Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <PrimaryButton fullWidth icon={Send} onClick={() => setIsApplyModalOpen(true)}>
                  Apply for this Position
                </PrimaryButton>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Similar Jobs Section */}
      {relatedJobs.length > 0 && (
        <div className="pt-12 space-y-6 border-t border-slate-200/80 dark:border-slate-800">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Similar Open Positions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedJobs.map((relJob) => (
              <JobCard
                key={relJob.id}
                job={relJob}
                isSaved={savedJobIds.includes(relJob.id)}
                onClick={() => navigate(`/jobs/${relJob.id}`)}
                onBookmark={(id) => toggleSaveJob(id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Application Modal */}
      <ApplyJobModal job={job} isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} />
    </PageContainer>
  );
};
