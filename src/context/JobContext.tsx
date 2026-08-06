import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Job, Company, JobApplication, UserProfile, ApplicationStatus } from '../types';
import { INITIAL_JOBS, INITIAL_COMPANIES, INITIAL_APPLICATIONS } from '../data/mockData';
import { showSuccessToast, showInfoToast } from './ToastContext';
import { jobService } from '../firebase/services/JobService';
import { applicationService } from '../firebase/services/ApplicationService';
import { employerService } from '../firebase/services/EmployerService';
import { useAuth } from './AuthContext';

interface JobContextType {
  jobs: Job[];
  companies: Company[];
  applications: JobApplication[];
  savedJobIds: string[];
  userProfile: UserProfile;
  searchFilter: {
    query: string;
    location: string;
    category: string;
    type: string;
    remoteOnly: boolean;
  };
  setSearchFilter: React.Dispatch<React.SetStateAction<{
    query: string;
    location: string;
    category: string;
    type: string;
    remoteOnly: boolean;
  }>>;
  applyToJob: (jobId: string, coverLetter?: string, resumeName?: string) => void;
  toggleSaveJob: (jobId: string) => void;
  postJob: (jobData: Partial<Job>) => Job;
  updateApplicationStatus: (appId: string, newStatus: ApplicationStatus) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserProfile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  // Single Source of Truth for user profile
  const userProfile: UserProfile = useMemo(() => {
    return user || {
      uid: '',
      email: '',
      displayName: 'Guest User',
      role: 'guest',
      headline: 'Complete your profile',
      location: 'Not Provided',
      skills: [],
    };
  }, [user]);

  const [searchFilter, setSearchFilter] = useState({
    query: '',
    location: '',
    category: 'All',
    type: 'All',
    remoteOnly: false,
  });

  // Sync with Firestore on mount or user change
  useEffect(() => {
    let isMounted = true;

    async function loadFirestoreData() {
      try {
        // Load Jobs
        const firestoreJobs = await jobService.searchJobs({});
        if (isMounted && firestoreJobs.length > 0) {
          const mappedJobs: Job[] = firestoreJobs.map((fj) => ({
            id: fj.id,
            title: fj.title,
            companyName: fj.companyName,
            companyLogoUrl: fj.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
            location: { city: fj.location, state: '', country: '', isRemote: fj.type === 'Remote' },
            employmentType: fj.type as any,
            experienceLevel: fj.experienceLevel as any,
            salary: { min: fj.salaryMin || 80000, max: fj.salaryMax || 130000, currency: fj.salaryCurrency || 'USD', period: 'yearly' },
            description: fj.description,
            responsibilities: [],
            requirements: fj.requirements || [],
            skillsRequired: fj.skills || [],
            status: fj.status === 'closed' ? 'closed' : fj.status === 'draft' ? 'draft' : 'active',
            postedAt: typeof fj.createdAt === 'string' ? fj.createdAt.split('T')[0] : '2026-08-01',
            employerId: fj.employerId,
            applicantCount: fj.applicationsCount || 0,
            featured: false,
            category: fj.department || 'Engineering',
          }));
          setJobs((prev) => {
            const combined = [...mappedJobs];
            prev.forEach((pj) => {
              if (!combined.some((m) => m.id === pj.id)) combined.push(pj);
            });
            return combined;
          });
        }

        // Load Companies
        const firestoreCompanies = await employerService.listCompanies(50);
        if (isMounted && firestoreCompanies.length > 0) {
          const mappedCompanies: Company[] = firestoreCompanies.map((fc) => ({
            id: fc.id,
            name: fc.name,
            logoUrl: fc.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
            tagline: fc.tagline || 'Innovative Solutions',
            industry: fc.industry || 'Technology',
            companySize: fc.companySize || '100-500 employees',
            headquarters: fc.headquarters || 'San Francisco, CA',
            website: fc.website || 'https://example.com',
            description: fc.description || '',
            openJobsCount: 1,
            verified: fc.verificationStatus === 'verified',
          }));
          setCompanies((prev) => {
            const combined = [...mappedCompanies];
            prev.forEach((pc) => {
              if (!combined.some((m) => m.id === pc.id)) combined.push(pc);
            });
            return combined;
          });
        }

        if (user?.uid) {
          // Load User Saved Jobs
          const savedIds = await jobService.getSavedJobIds(user.uid);
          if (isMounted) {
            setSavedJobIds(savedIds);
          }

          // Load Applications
          const userApps = await applicationService.getCandidateApplications(user.uid);
          if (isMounted) {
            const mappedApps: JobApplication[] = userApps.map((fa) => ({
              id: fa.id,
              jobId: fa.jobId,
              jobTitle: fa.jobTitle,
              companyName: fa.companyName,
              companyLogoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
              applicantId: fa.candidateId,
              applicantName: fa.candidateName,
              applicantEmail: fa.candidateEmail,
              applicantAvatar: user.avatarUrl,
              resumeUrl: fa.resumeUrl || user.resumeUrl || 'Resume.pdf',
              coverLetter: fa.coverLetter || '',
              status: fa.status as ApplicationStatus,
              appliedDate: typeof fa.appliedAt === 'string' ? fa.appliedAt.split('T')[0] : '2026-08-01',
              lastUpdated: typeof fa.updatedAt === 'string' ? fa.updatedAt.split('T')[0] : '2026-08-01',
            }));
            setApplications(mappedApps);
          }
        } else {
          if (isMounted) {
            setSavedJobIds([]);
            setApplications([]);
          }
        }
      } catch (err) {
        console.warn('Syncing with Firestore fallback mode:', err);
      }
    }

    loadFirestoreData();

    return () => {
      isMounted = false;
    };
  }, [user?.uid, user?.role, user?.avatarUrl, user?.resumeUrl]);

  const applyToJob = useCallback((jobId: string, coverLetter?: string, resumeName?: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    if (!user?.uid) {
      showInfoToast('Please sign in to apply for jobs.');
      return;
    }

    const applicantId = user.uid;
    const applicantName = user.displayName;
    const applicantEmail = user.email;

    // Check if already applied
    const existing = applications.find((a) => a.jobId === jobId && a.applicantId === applicantId);
    if (existing) {
      showInfoToast(`You have already submitted an application for ${job.title}`);
      return;
    }

    const newApp: JobApplication = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      companyLogoUrl: job.companyLogoUrl,
      applicantId: applicantId,
      applicantName: applicantName,
      applicantEmail: applicantEmail,
      applicantAvatar: user.avatarUrl,
      resumeUrl: resumeName || user.resumeName || user.resumeUrl || 'Applicant_Resume.pdf',
      coverLetter: coverLetter || '',
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    setApplications((prev) => [newApp, ...prev]);

    // Update job applicant count
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantCount: (j.applicantCount || 0) + 1 } : j))
    );

    // Save to Firestore
    applicationService
      .submitApplication({
        jobId: job.id,
        candidateId: applicantId,
        employerId: job.employerId || 'emp_default',
        jobTitle: job.title,
        companyName: job.companyName,
        candidateName: applicantName,
        candidateEmail: applicantEmail,
        resumeUrl: newApp.resumeUrl,
        coverLetter: coverLetter || '',
      })
      .catch((err) => console.warn('Submit application to Firestore failed:', err));

    showSuccessToast(`Application submitted successfully for ${job.title}!`);
  }, [jobs, applications, user]);

  const toggleSaveJob = useCallback((jobId: string) => {
    if (!user?.uid) {
      showInfoToast('Please sign in to bookmark jobs.');
      return;
    }
    const userId = user.uid;

    let wasSaved = false;
    setSavedJobIds((prev) => {
      wasSaved = prev.includes(jobId);
      if (wasSaved) {
        return prev.filter((id) => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });

    if (wasSaved) {
      showInfoToast('Removed job from saved bookmarks.');
    } else {
      showSuccessToast('Saved job to your bookmarks!');
    }

    if (userId) {
      jobService.toggleSaveJob(userId, jobId).catch((err) => console.warn('Toggle save job failed:', err));
    }
  }, [user?.uid]);

  const postJob = useCallback((jobData: Partial<Job>): Job => {
    const employerId = user?.uid || 'emp_default';
    const newJob: Job = {
      id: `job_${Date.now()}`,
      title: jobData.title || 'Untitled Role',
      companyName: jobData.companyName || user?.companyName || 'Company Solutions',
      companyLogoUrl:
        jobData.companyLogoUrl ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      location: jobData.location || { city: 'San Francisco', state: 'CA', country: 'USA', isRemote: true },
      employmentType: jobData.employmentType || 'Full-time',
      experienceLevel: jobData.experienceLevel || 'Mid Level',
      salary: jobData.salary || { min: 120000, max: 160000, currency: 'USD', period: 'yearly' },
      description: jobData.description || '',
      responsibilities: jobData.responsibilities || [],
      requirements: jobData.requirements || [],
      skillsRequired: jobData.skillsRequired || ['React', 'TypeScript'],
      status: 'active',
      postedAt: new Date().toISOString().split('T')[0],
      employerId: employerId,
      applicantCount: 0,
      featured: false,
      category: jobData.category || 'Engineering',
    };

    setJobs((prev) => [newJob, ...prev]);

    // Save to Firestore
    const sal = typeof newJob.salary === 'object' && newJob.salary ? newJob.salary : { min: 100000, max: 150000, currency: 'USD' };

    jobService
      .createJobPosting({
        employerId: employerId,
        companyId: 'comp_default',
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
        requirements: newJob.requirements,
        skills: newJob.skillsRequired,
        status: 'published',
      })
      .catch((err) => console.warn('Create job posting in Firestore failed:', err));

    showSuccessToast(`Job posting "${newJob.title}" created successfully!`);
    return newJob;
  }, [user]);

  const updateApplicationStatus = useCallback((appId: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: newStatus,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return app;
      })
    );

    applicationService
      .updateApplicationStatus(appId, newStatus as any)
      .catch((err) => console.warn('Update application status in Firestore failed:', err));

    showSuccessToast(`Application status updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
  }, []);

  const updateProfile = useCallback((updated: Partial<UserProfile>) => {
    if (updateUserProfile) {
      updateUserProfile(updated);
    }
    showSuccessToast('Profile details updated successfully!');
  }, [updateUserProfile]);

  const contextValue = useMemo(
    () => ({
      jobs,
      companies,
      applications,
      savedJobIds,
      userProfile,
      searchFilter,
      setSearchFilter,
      applyToJob,
      toggleSaveJob,
      postJob,
      updateApplicationStatus,
      updateProfile,
    }),
    [
      jobs,
      companies,
      applications,
      savedJobIds,
      userProfile,
      searchFilter,
      applyToJob,
      toggleSaveJob,
      postJob,
      updateApplicationStatus,
      updateProfile,
    ]
  );

  return (
    <JobContext.Provider value={contextValue}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};


