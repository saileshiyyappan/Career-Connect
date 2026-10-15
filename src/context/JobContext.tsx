import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Job, Company, JobApplication, UserProfile, ApplicationStatus } from '../types';
import { showSuccessToast, showInfoToast, showErrorToast } from './ToastContext';
import { jobService } from '../firebase/services/JobService';
import { applicationService } from '../firebase/services/ApplicationService';
import { employerService } from '../firebase/services/EmployerService';
import { jobSearchGatewayService, GatewayJob } from '../services/jobSearchGatewayService';
import { companySearchGatewayService, GatewayCompany } from '../services/companySearchGatewayService';
import { companyRepository } from '../firebase/repositories/CompanyRepository';
import { useAuth } from './AuthContext';
import { resolveCandidateName } from '../services/candidateDiscoveryService';
<<<<<<< HEAD
import { FirestoreJobDocument, FirestoreExternalJobDocument } from '../firebase/types';
import { normalizeJobCategory } from '../utils/jobCategories';
=======
>>>>>>> origin/main

interface SearchFilterState {
  query: string;
  location: string;
  category: string;
  type: string;
  remoteOnly: boolean;
}

interface JobContextType {
  jobs: Job[];
  companies: Company[];
  applications: JobApplication[];
  savedJobIds: string[];
<<<<<<< HEAD
  savedJobs: Job[];
=======
>>>>>>> origin/main
  userProfile: UserProfile;
  isLoading: boolean;
  isLoadingJobs: boolean;
  isLoadingCompanies: boolean;
  isLoadingApplications: boolean;
  isSearchingGlobal: boolean;
  isSearchingGlobalCompanies: boolean;
  globalProvidersQueried: string[];
  relatedQuerySuggestion: string | null;
  totalGlobalJobs: number;
  hasMoreGlobalJobs: boolean;
  error: string | null;
  searchFilter: SearchFilterState;
  setSearchFilter: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  searchGlobalJobs: (overrideFilter?: Partial<SearchFilterState>, page?: number) => Promise<void>;
  searchGlobalCompanies: (query?: string, industry?: string, page?: number) => Promise<void>;
  loadMoreGlobalJobs: () => Promise<void>;
  applyToJob: (jobId: string, coverLetter?: string, resumeName?: string) => Promise<boolean>;
  toggleSaveJob: (jobId: string) => Promise<void>;
  postJob: (jobData: Partial<Job>) => Promise<Job>;
  updateApplicationStatus: (appId: string, newStatus: ApplicationStatus) => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => void;
  refreshJobs: () => Promise<void>;
  refreshCompanies: () => Promise<void>;
  refreshApplications: () => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserProfile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
<<<<<<< HEAD
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
=======
>>>>>>> origin/main
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState<boolean>(false);
  const [isSearchingGlobal, setIsSearchingGlobal] = useState<boolean>(false);
  const [isSearchingGlobalCompanies, setIsSearchingGlobalCompanies] = useState<boolean>(false);
  const [globalProvidersQueried, setGlobalProvidersQueried] = useState<string[]>([]);
  const [relatedQuerySuggestion, setRelatedQuerySuggestion] = useState<string | null>(null);
  const [totalGlobalJobs, setTotalGlobalJobs] = useState<number>(0);
  const [hasMoreGlobalJobs, setHasMoreGlobalJobs] = useState<boolean>(false);
  const [currentSearchPage, setCurrentSearchPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Single Source of Truth for user profile
  const userProfile: UserProfile = useMemo(() => {
    return user || {
      uid: '',
      email: '',
      displayName: 'Name unavailable',
      role: 'guest',
      headline: '',
      location: '',
      skills: [],
    };
  }, [user]);

  const [searchFilter, setSearchFilter] = useState<SearchFilterState>({
    query: '',
    location: '',
    category: 'All',
    type: 'All',
    remoteOnly: false,
  });

  const fetchJobsData = useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      const [firestoreJobs, externalJobs, firestoreCompanies] = await Promise.all([
        jobService.searchJobs({}),
        jobService.listExternalJobs(100),
        employerService.listCompanies(100).catch(() => []),
      ]);

      const mappedInternalJobs: Job[] = firestoreJobs.map((fj) => {
        const postedDateStr = typeof fj.createdAt === 'string'
          ? fj.createdAt.split('T')[0]
          : typeof fj.createdAt === 'number'
          ? new Date(fj.createdAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

        return {
          id: fj.id,
          title: fj.title || 'Untitled Position',
          companyName: fj.companyName || 'Name unavailable',
          companyLogoUrl: fj.companyLogo,
          location: {
            city: fj.location || 'Remote',
            state: '',
            country: '',
            isRemote: fj.type === 'Remote' || fj.location?.toLowerCase().includes('remote') || false,
          },
          employmentType: (fj.type as any) || 'Full-time',
          experienceLevel: (fj.experienceLevel ? `${fj.experienceLevel} Level` : 'Mid Level') as any,
          salary: {
            min: fj.salaryMin || 0,
            max: fj.salaryMax || 0,
            currency: fj.salaryCurrency || 'USD',
            period: 'yearly',
          },
          salaryMin: fj.salaryMin,
          salaryMax: fj.salaryMax,
          description: fj.description || '',
          responsibilities: [],
          requirements: fj.requirements || [],
          skillsRequired: fj.skills || [],
          status: fj.status === 'closed' ? 'closed' : fj.status === 'draft' ? 'draft' : 'active',
          postedAt: postedDateStr,
          employerId: fj.employerId || '',
          applicantCount: fj.applicationsCount || 0,
          featured: false,
<<<<<<< HEAD
          category: normalizeJobCategory(fj.department),
=======
          category: fj.department || 'Engineering',
>>>>>>> origin/main
          jobOrigin: 'internal',
        };
      });

      const mappedExternalJobs: Job[] = externalJobs.map((ej) => {
        const postedDateStr = typeof ej.publishedAt === 'string'
          ? ej.publishedAt.split('T')[0]
          : typeof ej.createdAt === 'string'
          ? ej.createdAt.split('T')[0]
          : new Date().toISOString().split('T')[0];

        let salaryFormatted: any = 'Competitive';
        if (ej.salary?.formatted) {
          salaryFormatted = ej.salary.formatted;
        } else if (ej.salary?.min) {
          salaryFormatted = {
            min: ej.salary.min,
            max: ej.salary.max || ej.salary.min,
            currency: ej.salary.currency || 'USD',
            period: ej.salary.period || 'yearly',
          };
        }

        return {
          id: ej.id,
          title: ej.title || 'Untitled Role',
          companyName: ej.companyName || 'Name unavailable',
          companyLogoUrl: ej.companyLogo,
          location: ej.location || 'Remote',
          employmentType: (ej.employmentType as any) || 'Full-time',
          experienceLevel: (ej.experienceLevel ? `${ej.experienceLevel} Level` : 'Mid Level') as any,
          salary: salaryFormatted,
          salaryMin: ej.salary?.min,
          salaryMax: ej.salary?.max,
          description: ej.description || '',
          responsibilities: ej.responsibilities || [],
          requirements: ej.qualifications || [],
          skillsRequired: ej.skills || ej.technologyStack || [],
          status: ej.status === 'active' ? 'active' : 'closed',
          postedAt: postedDateStr,
          employerId: '',
          applicantCount: 0,
          featured: false,
<<<<<<< HEAD
          category: normalizeJobCategory(
            (ej as any).category || (ej as any).department || (ej as any).jobCategory || (ej as any).industry || `${ej.title} ${ej.description}`
          ),
=======
          category: 'Engineering',
>>>>>>> origin/main
          jobOrigin: 'external',
          sourceId: ej.sourceId,
          sourceName: ej.sourceName,
          sourceUrl: ej.sourceUrl,
          externalId: ej.externalId,
        };
      });

      const allJobs = [...mappedInternalJobs, ...mappedExternalJobs];
      setJobs(allJobs);

      // Build unified company list
      const mappedRegisteredCompanies: Company[] = firestoreCompanies.map((fc) => ({
        id: fc.id,
        name: fc.name,
        logoUrl: fc.logoUrl,
        bannerUrl: fc.bannerUrl,
        tagline: fc.tagline || '',
        customAccentColor: fc.customAccentColor,
        industry: fc.industry || 'Technology',
        companySize: fc.companySize || '1-50 employees',
        headquarters: fc.headquarters || 'Remote',
        website: fc.website || '',
        description: fc.description || '',
        benefits: fc.benefits || [],
        galleryPhotos: fc.galleryPhotos || [],
        brandAssets: fc.brandAssets || [],
        mission: fc.mission,
        vision: fc.vision,
        culture: fc.culture,
        openJobsCount: 0,
        verified: fc.verificationStatus === 'verified',
        companyOrigin: 'internal' as const,
      }));

      const companyMap = new Map<string, Company>();

      for (const rc of mappedRegisteredCompanies) {
        companyMap.set(rc.name.trim().toLowerCase(), { ...rc, openJobsCount: 0 });
      }

      for (const job of allJobs) {
        if (!job.companyName) continue;
        const normKey = job.companyName.trim().toLowerCase();
        const existing = companyMap.get(normKey);

        if (existing) {
          existing.openJobsCount += 1;
          if (!existing.logoUrl && job.companyLogoUrl) {
            existing.logoUrl = job.companyLogoUrl;
          }
          if ((!existing.headquarters || existing.headquarters === 'Remote') && job.location) {
            const locStr = typeof job.location === 'string' ? job.location : job.location.city;
            if (locStr) existing.headquarters = locStr;
          }
        } else {
          const safeId = `comp_${encodeURIComponent(normKey.replace(/[^a-z0-9]/g, '_'))}`;
          const locStr = typeof job.location === 'string' ? job.location : (job.location ? `${job.location.city}${job.location.country ? `, ${job.location.country}` : ''}` : 'Remote');
          companyMap.set(normKey, {
            id: safeId,
            name: job.companyName,
            logoUrl: job.companyLogoUrl,
            tagline: `Leading organization in ${job.category || 'Technology'}`,
            description: `Hiring organization actively recruiting for ${job.title} and related roles.`,
            industry: job.category || 'Technology',
            companySize: '50-500 employees',
            headquarters: locStr || 'Remote',
            website: job.sourceUrl || '',
            openJobsCount: 1,
            verified: false,
            companyOrigin: job.jobOrigin === 'external' ? 'external' : 'internal',
            sourceName: job.sourceName || (job.jobOrigin === 'external' ? 'Job Aggregator' : 'CareerConnect Employer'),
            sourceUrl: job.sourceUrl,
          });
        }
      }

      setCompanies(
        Array.from(companyMap.values()).sort(
          (a, b) => b.openJobsCount - a.openJobsCount || a.name.localeCompare(b.name)
        )
      );

      setError(null);
    } catch (err: any) {
      console.warn('Failed to load jobs from Firestore:', err);
      setError(err?.message || 'Failed to load jobs');
    } finally {
      setIsLoadingJobs(false);
      setIsLoadingCompanies(false);
    }
  }, []);

  /**
   * Discovers jobs dynamically across external providers using the real-time search gateway.
   */
  const searchGlobalJobs = useCallback(
    async (overrideFilter?: Partial<SearchFilterState>, page: number = 1) => {
      const activeFilter = {
        ...searchFilter,
        ...(overrideFilter || {}),
      };

      setIsSearchingGlobal(true);
      setCurrentSearchPage(page);

      try {
        const response = await jobSearchGatewayService.searchJobs({
          query: activeFilter.query,
          location: activeFilter.location,
          category: activeFilter.category,
          type: activeFilter.type,
          remoteOnly: activeFilter.remoteOnly,
          page,
          limit: 20,
        });

        if (response.success && response.data.length > 0) {
          const mappedGatewayJobs: Job[] = response.data.map((gj) => {
            const postedDateStr = typeof gj.publishedAt === 'string'
              ? gj.publishedAt.split('T')[0]
              : new Date().toISOString().split('T')[0];

            return {
              id: gj.id,
              title: gj.title,
              companyName: gj.companyName,
              companyLogoUrl: gj.companyLogoUrl,
              companyWebsite: gj.companyWebsite,
              location: gj.location || 'Remote',
              employmentType: (gj.employmentType as any) || 'Full-time',
              experienceLevel: (gj.experienceLevel ? `${gj.experienceLevel} Level` : 'Mid Level') as any,
              salary: gj.salaryFormatted || (gj.salaryMin ? {
                min: gj.salaryMin,
                max: gj.salaryMax || gj.salaryMin,
                currency: gj.salaryCurrency || 'USD',
                period: (gj.salaryPeriod as any) || 'yearly',
              } : 'Competitive'),
              salaryMin: gj.salaryMin,
              salaryMax: gj.salaryMax,
              description: gj.description,
              responsibilities: gj.responsibilities || [],
              requirements: gj.requirements || [],
              skillsRequired: gj.skills || [],
              status: 'active',
              postedAt: postedDateStr,
              employerId: '',
              applicantCount: 0,
              featured: false,
<<<<<<< HEAD
              category: normalizeJobCategory(gj.category),
=======
              category: gj.category || 'Engineering',
>>>>>>> origin/main
              jobOrigin: 'external',
              sourceId: gj.sourceId,
              sourceName: gj.sourceName,
              sourceUrl: gj.sourceUrl,
              externalId: gj.externalId,
            };
          });

          if (page === 1) {
            // Keep internal jobs at top if they match query
            setJobs((prev) => {
              const internalJobs = prev.filter((j) => j.jobOrigin === 'internal');
              return [...internalJobs, ...mappedGatewayJobs];
            });
          } else {
            setJobs((prev) => {
              const existingIds = new Set(prev.map((j) => j.id));
              const newJobs = mappedGatewayJobs.filter((j) => !existingIds.has(j.id));
              return [...prev, ...newJobs];
            });
          }

          setTotalGlobalJobs(response.total);
          setHasMoreGlobalJobs(response.hasMore);
          setGlobalProvidersQueried(response.providersQueried || []);
          setRelatedQuerySuggestion(response.relatedQueryUsed || null);
        } else {
          setTotalGlobalJobs(0);
          setHasMoreGlobalJobs(false);
          setRelatedQuerySuggestion(response.relatedQueryUsed || null);
        }
      } catch (err: any) {
        console.warn('Global search gateway error:', err);
      } finally {
        setIsSearchingGlobal(false);
      }
    },
    [searchFilter]
  );

  /**
   * Loads more jobs from current query.
   */
  const loadMoreGlobalJobs = useCallback(async () => {
    if (!hasMoreGlobalJobs || isSearchingGlobal) return;
    const nextPage = currentSearchPage + 1;
    await searchGlobalJobs(undefined, nextPage);
  }, [hasMoreGlobalJobs, isSearchingGlobal, currentSearchPage, searchGlobalJobs]);

  /**
   * Discovers organizations dynamically across external providers using the real-time search gateway.
   */
  const searchGlobalCompanies = useCallback(
    async (query?: string, industry?: string, page: number = 1) => {
      setIsSearchingGlobalCompanies(true);

      try {
        const response = await companySearchGatewayService.searchCompanies({
          query,
          industry,
          page,
          limit: 24,
        });

        if (response.success && response.data.length > 0) {
          const mappedGatewayCompanies: Company[] = response.data.map((gc) => ({
            id: gc.id,
            name: gc.name,
            logoUrl: gc.logoUrl,
            tagline: `Organization in ${gc.industry || 'Technology'}`,
            description: gc.description || `Actively hiring through ${gc.sourceName || 'connected providers'}.`,
            industry: gc.industry || 'Technology',
            companySize: gc.companySize || '50-500 employees',
            headquarters: gc.headquarters || 'Remote',
            website: gc.sourceUrl || gc.website || '',
            openJobsCount: gc.openJobsCount || 1,
            verified: gc.verified || false,
            companyOrigin: gc.companyOrigin || 'external',
            sourceName: gc.sourceName || 'Job Provider',
            sourceUrl: gc.sourceUrl,
          }));

          if (page === 1) {
            setCompanies((prev) => {
              const verified = prev.filter((c) => c.verified || c.companyOrigin === 'internal');
              const seenNames = new Set(verified.map((c) => c.name.toLowerCase()));
              const filteredNew = mappedGatewayCompanies.filter((c) => !seenNames.has(c.name.toLowerCase()));
              return [...verified, ...filteredNew];
            });
          } else {
            setCompanies((prev) => {
              const seenIds = new Set(prev.map((c) => c.id));
              const filteredNew = mappedGatewayCompanies.filter((c) => !seenIds.has(c.id));
              return [...prev, ...filteredNew];
            });
          }
        }
      } catch (err) {
        console.warn('Global company search error:', err);
      } finally {
        setIsSearchingGlobalCompanies(false);
      }
    },
    []
  );

  const fetchCompaniesData = useCallback(async () => {
    // Calling fetchJobsData automatically builds and syncs the unified company list
    await fetchJobsData();
  }, [fetchJobsData]);

  const fetchUserData = useCallback(async () => {
    if (!user?.uid) {
      setSavedJobIds([]);
<<<<<<< HEAD
      setSavedJobs([]);
=======
>>>>>>> origin/main
      setApplications([]);
      setIsLoadingApplications(false);
      return;
    }

<<<<<<< HEAD
    // Clear the previous account's private data before loading the new account.
    setSavedJobIds([]);
    setSavedJobs([]);
    setApplications([]);
    setIsLoadingApplications(true);
    try {
      const [savedIds, persistedSavedJobs, userApps] = await Promise.all([
        jobService.getSavedJobIds(user.uid),
        jobService.getSavedJobs(user.uid),
=======
    setIsLoadingApplications(true);
    try {
      const [savedIds, userApps] = await Promise.all([
        jobService.getSavedJobIds(user.uid),
>>>>>>> origin/main
        user.role === 'employer'
          ? applicationService.getEmployerApplications(user.uid)
          : applicationService.getCandidateApplications(user.uid),
      ]);

      setSavedJobIds(savedIds);
<<<<<<< HEAD
      const mappedSavedJobs: Job[] = persistedSavedJobs.map((job) => {
        const external = 'publishedAt' in job;
        return {
          id: job.id,
          title: job.title || 'Untitled Position',
          companyName: job.companyName || 'Name unavailable',
          companyLogoUrl: job.companyLogo,
          location: external ? (job.location || 'Not specified') : {
            city: job.location || 'Not specified',
            state: '',
            country: '',
            isRemote: job.type === 'Remote' || job.location?.toLowerCase().includes('remote') || false,
          },
          employmentType: (external ? job.employmentType : job.type || 'Full-time') as any,
          experienceLevel: (job.experienceLevel ? `${job.experienceLevel} Level` : 'Mid Level') as any,
          salary: external
            ? (job.salary?.formatted || (job.salary?.min != null ? { min: job.salary.min, max: job.salary.max || job.salary.min, currency: job.salary.currency || 'USD', period: job.salary.period || 'yearly' } : 'Not specified'))
            : { min: job.salaryMin || 0, max: job.salaryMax || 0, currency: job.salaryCurrency || 'USD', period: 'yearly' },
          salaryMin: external ? job.salary?.min : job.salaryMin,
          salaryMax: external ? job.salary?.max : job.salaryMax,
          description: job.description || '',
          responsibilities: external ? job.responsibilities || [] : [],
          requirements: external ? job.qualifications || [] : job.requirements || [],
          skillsRequired: external ? job.skills || job.technologyStack || [] : job.skills || [],
          status: job.status === 'closed' ? 'closed' : job.status === 'draft' ? 'draft' : 'active',
          postedAt: String(external ? job.publishedAt || job.createdAt || '' : job.createdAt || ''),
          employerId: external ? '' : job.employerId || '',
          applicantCount: external ? 0 : job.applicationsCount || 0,
          featured: false,
          category: normalizeJobCategory((job as any).category || (job as any).department || (external ? `${job.title} ${job.description}` : '')),
          jobOrigin: external ? 'external' : 'internal',
          sourceId: external ? job.sourceId : undefined,
          sourceName: external ? job.sourceName : undefined,
          sourceUrl: external ? job.sourceUrl : undefined,
          externalId: external ? job.externalId : undefined,
        };
      });
      setSavedJobs(mappedSavedJobs);
=======
>>>>>>> origin/main

      const mappedApps: JobApplication[] = userApps.map((fa) => {
        const appliedDateStr = typeof fa.appliedAt === 'string'
          ? fa.appliedAt.split('T')[0]
          : typeof fa.appliedAt === 'number'
          ? new Date(fa.appliedAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

        const updatedDateStr = typeof fa.updatedAt === 'string'
          ? fa.updatedAt.split('T')[0]
          : typeof fa.updatedAt === 'number'
          ? new Date(fa.updatedAt).toISOString().split('T')[0]
          : appliedDateStr;

        return {
          id: fa.id,
          jobId: fa.jobId,
          jobTitle: fa.jobTitle,
          companyName: fa.companyName,
          companyLogoUrl: jobs.find((j) => j.id === fa.jobId)?.companyLogoUrl,
          applicantId: fa.candidateId,
          applicantName: fa.candidateName && fa.candidateName !== 'Candidate' ? fa.candidateName : 'Name unavailable',
          applicantEmail: fa.candidateEmail,
          applicantAvatar: user.avatarUrl,
          resumeUrl: fa.resumeUrl || user.resumeUrl,
          coverLetter: fa.coverLetter || '',
          status: (fa.status as ApplicationStatus) || 'applied',
          appliedDate: appliedDateStr,
          lastUpdated: updatedDateStr,
        };
      });

      setApplications(mappedApps);
    } catch (err: any) {
      console.warn('Failed to load user applications/saved jobs:', err);
<<<<<<< HEAD
      setSavedJobs([]);
=======
>>>>>>> origin/main
    } finally {
      setIsLoadingApplications(false);
    }
  }, [user?.uid, user?.role, user?.avatarUrl, user?.resumeUrl]);

  // Initial Load & Auth-dependency synchronization
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      await Promise.all([fetchJobsData(), fetchCompaniesData()]);
      if (isMounted) {
        await fetchUserData();
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [fetchJobsData, fetchCompaniesData, fetchUserData]);

  const applyToJob = useCallback(
    async (jobId: string, coverLetter?: string, resumeName?: string) => {
      const job = jobs.find((j) => j.id === jobId);
      if (!job) {
        showErrorToast('Job not found.');
        return false;
      }

      // Guard: External jobs must NOT be processed via internal application pipeline
      if (job.jobOrigin === 'external' || !job.employerId || job.employerId.trim() === '' || job.employerId === 'emp_default') {
        if (job.sourceUrl) {
          window.open(job.sourceUrl, '_blank', 'noopener,noreferrer');
        } else {
          showInfoToast('This job posting is from an external source. Please apply via the source site.');
        }
        return false;
      }

      if (!user?.uid) {
        showInfoToast('Please sign in to apply for jobs.');
        return false;
      }

      const applicantId = user.uid;
      const { name: resolvedName, isUnavailable: isNameUnavail } = resolveCandidateName(user);
      const applicantName = !isNameUnavail ? resolvedName : (user.displayName?.trim() || 'Name unavailable');
      const applicantEmail = user.email || '';

      // Check if already applied
      const existing = applications.find((a) => a.jobId === jobId && a.applicantId === applicantId);
      if (existing) {
        showInfoToast(`You have already submitted an application for ${job.title}`);
        return false;
      }

      const newAppId = `app_${Date.now()}`;
      const nowStr = new Date().toISOString().split('T')[0];

      const newApp: JobApplication = {
        id: newAppId,
        jobId: job.id,
        jobTitle: job.title,
        companyName: job.companyName,
        companyLogoUrl: job.companyLogoUrl,
        applicantId: applicantId,
        applicantName: applicantName,
        applicantEmail: applicantEmail,
        applicantAvatar: user.avatarUrl,
        resumeUrl: resumeName || user.resumeName || user.resumeUrl,
        coverLetter: coverLetter || '',
        status: 'applied',
        appliedDate: nowStr,
        lastUpdated: nowStr,
      };

      try {
        const persistedApplication = await applicationService.submitApplication({
          jobId: job.id,
          candidateId: applicantId,
          employerId: job.employerId,
          jobTitle: job.title,
          companyName: job.companyName,
          candidateName: applicantName,
          candidateEmail: applicantEmail,
          resumeUrl: newApp.resumeUrl,
          coverLetter: coverLetter || '',
        });
        setApplications((prev) => [
          {
            ...newApp,
            id: persistedApplication.id,
            status: persistedApplication.status === 'submitted' ? 'applied' : (persistedApplication.status as ApplicationStatus),
            appliedDate: String(persistedApplication.appliedAt),
            lastUpdated: String(persistedApplication.updatedAt),
          },
          ...prev,
        ]);
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, applicantCount: (j.applicantCount || 0) + 1 } : j))
        );
        showSuccessToast(`Application submitted successfully for ${job.title}!`);
        return true;
      } catch (err: any) {
        console.warn('Submit application to Firestore failed:', err);
<<<<<<< HEAD
        const messages: Record<string, string> = {
          UNAUTHENTICATED: 'Please sign in again before applying.',
          CANDIDATE_PROFILE_NOT_FOUND: 'Complete your candidate profile before applying.',
          CANDIDATE_ROLE_REQUIRED: 'Only candidate accounts can submit applications.',
          CANDIDATE_SUSPENDED: 'Suspended accounts cannot submit applications.',
          JOB_NOT_FOUND: 'This job is no longer available.',
          JOB_NOT_ACCEPTING: 'This job is no longer accepting applications.',
          EMPLOYER_MISMATCH: 'This job has invalid employer information.',
          DUPLICATE_APPLICATION: 'You have already applied to this job.',
          PERMISSION_DENIED: 'You do not have permission to submit this application.',
          FIREBASE_NOT_CONFIGURED: 'Application services are temporarily unavailable.',
          APPLICATION_PERSISTENCE_FAILED: 'The application could not be saved. Please try again.',
        };
        showErrorToast(messages[err?.code] || 'Failed to submit application. Please try again.');
=======
        const code = err?.code ? ` (${err.code})` : '';
        showErrorToast(`Failed to submit application${code}. Please try again.`);
>>>>>>> origin/main
        return false;
      }
    },
    [jobs, applications, user]
  );

  const toggleSaveJob = useCallback(
    async (jobId: string) => {
      if (!user?.uid) {
        showInfoToast('Please sign in to bookmark jobs.');
        return;
      }
      const userId = user.uid;

<<<<<<< HEAD
      const wasSaved = savedJobIds.includes(jobId);
      setSavedJobIds((prev) => {
=======
      let wasSaved = false;
      setSavedJobIds((prev) => {
        wasSaved = prev.includes(jobId);
>>>>>>> origin/main
        if (wasSaved) {
          return prev.filter((id) => id !== jobId);
        } else {
          return [...prev, jobId];
        }
      });
<<<<<<< HEAD
      if (wasSaved) {
        setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
      } else {
        const job = jobs.find((item) => item.id === jobId);
        if (job) setSavedJobs((prev) => prev.some((item) => item.id === jobId) ? prev : [...prev, job]);
      }
=======
>>>>>>> origin/main

      if (wasSaved) {
        showInfoToast('Removed job from saved bookmarks.');
      } else {
        showSuccessToast('Saved job to your bookmarks!');
      }

      try {
        await jobService.toggleSaveJob(userId, jobId);
      } catch (err) {
        console.warn('Toggle save job failed:', err);
<<<<<<< HEAD
        setSavedJobIds((prev) => wasSaved ? [...prev, jobId] : prev.filter((id) => id !== jobId));
        if (wasSaved) {
          const job = jobs.find((item) => item.id === jobId);
          if (job) setSavedJobs((prev) => prev.some((item) => item.id === jobId) ? prev : [...prev, job]);
        } else {
          setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
        }
        showErrorToast('Unable to update saved jobs. Please try again.');
      }
    },
    [user?.uid, savedJobIds, jobs]
=======
      }
    },
    [user?.uid]
>>>>>>> origin/main
  );

  const postJob = useCallback(
    async (jobData: Partial<Job>): Promise<Job> => {
      const employerId = user?.uid || '';
      const newJobId = `job_${Date.now()}`;
      const nowStr = new Date().toISOString().split('T')[0];

      // Resolve registered company for this employer:
      // 1. Check if user already owns a company in Firestore
      // 2. Or check companies state in memory
      // 3. Or create/find their registered company record
      let targetCompanyId = '';
      let targetCompanyName = jobData.companyName || user?.companyName || 'Registered Employer';
      let targetCompanyLogo = jobData.companyLogoUrl || user?.companyLogo || undefined;

      if (employerId) {
        try {
          const registeredComp = await companyRepository.findByOwnerId(employerId);
          if (registeredComp) {
            targetCompanyId = registeredComp.id;
            targetCompanyName = registeredComp.name || targetCompanyName;
            targetCompanyLogo = targetCompanyLogo || registeredComp.logoUrl;
          } else {
            // Find in current loaded companies list
            const matchedComp = companies.find(
              (c) =>
                c.id === employerId ||
                (c.name && targetCompanyName && c.name.trim().toLowerCase() === targetCompanyName.trim().toLowerCase())
            );
            if (matchedComp && matchedComp.id && !matchedComp.id.startsWith('comp_external_')) {
              targetCompanyId = matchedComp.id;
              targetCompanyName = matchedComp.name;
              targetCompanyLogo = targetCompanyLogo || matchedComp.logoUrl;
            } else {
              // Create an authoritative company record for this employer
              const createdCompany = await companyRepository.create({
                ownerId: employerId,
                name: targetCompanyName,
                tagline: user?.headline || 'Innovative Technology Leader',
                description: user?.aboutCompany || user?.companyDescription || `${targetCompanyName} hiring organization.`,
                industry: user?.industry || jobData.category || 'Technology',
                companySize: user?.companySize || '11-50 employees',
                headquarters: user?.companyLocation || user?.location || 'Remote',
                website: user?.companyWebsite || user?.website || '',
                logoUrl: targetCompanyLogo,
                verificationStatus: 'pending',
              });
              targetCompanyId = createdCompany.id;
            }
          }
        } catch (compErr) {
          console.warn('Failed resolving registered company:', compErr);
          targetCompanyId = employerId ? `company_${employerId}` : `company_${Date.now()}`;
        }
      } else {
        targetCompanyId = `company_${Date.now()}`;
      }

      const newJob: Job = {
        id: newJobId,
        title: jobData.title || 'Untitled Role',
        companyName: targetCompanyName,
        companyLogoUrl: targetCompanyLogo,
        location: jobData.location || { city: 'San Francisco', state: 'CA', country: 'USA', isRemote: true },
        employmentType: jobData.employmentType || 'Full-time',
        experienceLevel: jobData.experienceLevel || 'Mid Level',
        salary: jobData.salary || { min: 120000, max: 160000, currency: 'USD', period: 'yearly' },
        description: jobData.description || '',
        responsibilities: jobData.responsibilities || [],
        requirements: jobData.requirements || [],
        skillsRequired: jobData.skillsRequired || ['React', 'TypeScript'],
        status: 'active',
        postedAt: nowStr,
        employerId: employerId,
        applicantCount: 0,
        featured: false,
        category: jobData.category || 'Engineering',
        jobOrigin: 'internal',
      };

      const sal = typeof newJob.salary === 'object' && newJob.salary ? newJob.salary : { min: 100000, max: 150000, currency: 'USD' };

      try {
        const createdDoc = await jobService.createJobPosting({
          employerId: employerId,
          companyId: targetCompanyId,
          companyName: newJob.companyName,
          companyLogo: newJob.companyLogoUrl,
          title: newJob.title,
          description: newJob.description,
          department: newJob.category,
          location: typeof newJob.location === 'string' ? newJob.location : `${newJob.location.city}, ${newJob.location.state}`,
          type: newJob.employmentType as any,
          experienceLevel: (newJob.experienceLevel?.split(' ')[0] as any) || 'Mid',
          salaryMin: sal.min,
          salaryMax: sal.max,
          salaryCurrency: sal.currency,
          requirements: newJob.requirements || [],
          skills: newJob.skillsRequired,
          status: 'published',
        });

        const persistedJob = { ...newJob, id: createdDoc.id, status: 'active' as const };
        setJobs((prev) => [persistedJob, ...prev]);

        showSuccessToast(`Job posting "${newJob.title}" created successfully!`);
        return persistedJob;
      } catch (err) {
        console.warn('Create job posting in Firestore failed:', err);
        throw err;
      }
    },
    [user, companies]
  );

  const updateApplicationStatus = useCallback(
    async (appId: string, newStatus: ApplicationStatus) => {
      const nowStr = new Date().toISOString().split('T')[0];
      const previousApplications = applications;

      setApplications((prev) =>
        prev.map((app) => {
          if (app.id === appId) {
            return {
              ...app,
              status: newStatus,
              lastUpdated: nowStr,
            };
          }
          return app;
        })
      );

      try {
        await applicationService.updateApplicationStatus(appId, newStatus as any);
        showSuccessToast(`Application status updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
      } catch (err) {
        console.warn('Update application status in Firestore failed:', err);
        setApplications(previousApplications);
        showErrorToast('Application status could not be saved. Please try again.');
      }
    },
    [applications]
  );

  const updateProfile = useCallback(
    (updated: Partial<UserProfile>) => {
      if (updateUserProfile) {
        updateUserProfile(updated);
      }
      showSuccessToast('Profile details updated successfully!');
    },
    [updateUserProfile]
  );

  const isLoading = isLoadingJobs || isLoadingCompanies;

  const contextValue = useMemo<JobContextType>(
    () => ({
      jobs,
      companies,
      applications,
      savedJobIds,
<<<<<<< HEAD
      savedJobs,
=======
>>>>>>> origin/main
      userProfile,
      isLoading,
      isLoadingJobs,
      isLoadingCompanies,
      isLoadingApplications,
      isSearchingGlobal,
      isSearchingGlobalCompanies,
      globalProvidersQueried,
      relatedQuerySuggestion,
      totalGlobalJobs,
      hasMoreGlobalJobs,
      error,
      searchFilter,
      setSearchFilter,
      searchGlobalJobs,
      searchGlobalCompanies,
      loadMoreGlobalJobs,
      applyToJob,
      toggleSaveJob,
      postJob,
      updateApplicationStatus,
      updateProfile,
      refreshJobs: fetchJobsData,
      refreshCompanies: fetchCompaniesData,
      refreshApplications: fetchUserData,
    }),
    [
      jobs,
      companies,
      applications,
      savedJobIds,
<<<<<<< HEAD
      savedJobs,
=======
>>>>>>> origin/main
      userProfile,
      isLoading,
      isLoadingJobs,
      isLoadingCompanies,
      isLoadingApplications,
      isSearchingGlobal,
      isSearchingGlobalCompanies,
      globalProvidersQueried,
      relatedQuerySuggestion,
      totalGlobalJobs,
      hasMoreGlobalJobs,
      error,
      searchFilter,
      setSearchFilter,
      searchGlobalJobs,
      searchGlobalCompanies,
      loadMoreGlobalJobs,
      applyToJob,
      toggleSaveJob,
      postJob,
      updateApplicationStatus,
      updateProfile,
      fetchJobsData,
      fetchCompaniesData,
      fetchUserData,
    ]
  );

  return <JobContext.Provider value={contextValue}>{children}</JobContext.Provider>;
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};
