import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config/firestore';
import { auth } from '../firebase/config/auth';
import { notificationRepository } from '../firebase/repositories/NotificationRepository';
import { interviewRepository } from '../firebase/repositories/InterviewRepository';
import { userRepository } from '../firebase/repositories/UserRepository';
import { applicationRepository } from '../firebase/repositories/ApplicationRepository';
import { jobRepository } from '../firebase/repositories/JobRepository';
import { FirestoreInterviewDocument } from '../firebase/types';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface SavedJobAlert {
  id: string;
  title: string;
  keywords: string[];
  location: string;
  salaryMin: number;
  salaryMax: number;
  experienceLevel: string;
  remoteOnly: boolean;
  frequency: 'daily' | 'weekly' | 'instant';
  enabled: boolean;
  createdAt: string;
  lastMatchedCount: number;
}

export interface CandidateNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'applications' | 'interviews' | 'job_matches' | 'recruiter_messages' | 'system';
  read: boolean;
  targetLink?: string;
  actionText?: string;
  rawType?: string;
  invitationStatus?: 'pending' | 'accepted' | 'declined';
}

export interface UpcomingInterview {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogoUrl?: string;
  interviewDate: string; // ISO date string or formatted
  interviewTime: string;
  interviewType: 'Phone Screening' | 'Technical Round' | 'System Design' | 'HR & Culture' | 'Final Executive';
  interviewerName: string;
  interviewerRole: string;
  meetingLink: string;
  preparationChecklist: { id: string; text: string; completed: boolean }[];
  notes?: string;
}

export interface CandidateResume {
  id: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  isPrimary: boolean;
  downloadUrl: string;
  parsedSkills: string[];
}

export interface JobPreferences {
  preferredRoles: string[];
  preferredLocations: string[];
  salaryMin: number;
  salaryMax: number;
  currency: string;
  openToRemote: boolean;
  availabilityNotice: 'Immediate' | '2 Weeks' | '1 Month' | 'Negotiable';
  employmentTypes: ('Full-Time' | 'Part-Time' | 'Contract' | 'Remote')[];
}

export interface CareerInsightData {
  profileStrength: number;
  profileStrengthTips: string[];
  skillsDemand: { skill: string; demandScore: number; growth: string }[];
  recommendedSkills: { name: string; relevance: string; difficulty: string }[];
  applicationSuccessRate: number; // e.g. 35%
  recruiterViewsThisMonth: number;
  recentViews: { recruiterName: string; company: string; date: string }[];
  weeklyActivity: { day: string; applications: number; views: number }[];
}

// Helpers
function formatRelativeTime(timestamp: string | number): string {
  if (!timestamp) return 'Recently';
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ============================================================================
// CANDIDATE PORTAL SERVICE IMPLEMENTATION
// ============================================================================

export const candidatePortalService = {
  // JOB ALERTS
  async getJobAlerts(): Promise<SavedJobAlert[]> {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || !isFirebaseConfigured) {
      return [];
    }

    try {
      const colRef = collection(db, 'job_alerts');
      const q = query(colRef, where('userId', '==', currentUid));
      const snap = await getDocs(q);
      return snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || 'Job Alert',
          keywords: data.keywords || [],
          location: data.location || 'Any Location',
          salaryMin: data.salaryMin || 0,
          salaryMax: data.salaryMax || 0,
          experienceLevel: data.experienceLevel || 'Any',
          remoteOnly: !!data.remoteOnly,
          frequency: data.frequency || 'daily',
          enabled: data.enabled !== undefined ? data.enabled : true,
          createdAt: data.createdAt || new Date().toISOString().split('T')[0],
          lastMatchedCount: data.lastMatchedCount || 0,
        } as SavedJobAlert;
      });
    } catch (err) {
      console.warn('candidatePortalService.getJobAlerts error:', err);
      return [];
    }
  },

  async createJobAlert(
    alertData: Omit<SavedJobAlert, 'id' | 'createdAt' | 'lastMatchedCount'>
  ): Promise<SavedJobAlert> {
    const currentUid = auth.currentUser?.uid;
    const now = new Date().toISOString().split('T')[0];
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newAlert: SavedJobAlert = {
      ...alertData,
      id: alertId,
      createdAt: now,
      lastMatchedCount: 0,
    };

    if (currentUid && isFirebaseConfigured) {
      try {
        const docRef = doc(db, 'job_alerts', alertId);
        await setDoc(docRef, {
          ...newAlert,
          userId: currentUid,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('candidatePortalService.createJobAlert error:', err);
      }
    }

    return newAlert;
  },

  async deleteJobAlert(alertId: string): Promise<boolean> {
    if (!isFirebaseConfigured) return true;
    try {
      const docRef = doc(db, 'job_alerts', alertId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn('candidatePortalService.deleteJobAlert error:', err);
      return false;
    }
  },

  async toggleJobAlert(alertId: string, enabled: boolean): Promise<boolean> {
    if (!isFirebaseConfigured) return true;
    try {
      const docRef = doc(db, 'job_alerts', alertId);
      await updateDoc(docRef, { enabled, updatedAt: new Date().toISOString() });
      return true;
    } catch (err) {
      console.warn('candidatePortalService.toggleJobAlert error:', err);
      return false;
    }
  },

  // NOTIFICATIONS
  async getNotifications(): Promise<CandidateNotification[]> {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || !isFirebaseConfigured) {
      return [];
    }

    try {
      const rawNotifs = await notificationRepository.findByUserId(currentUid);
      return rawNotifs.map((n) => {
        let category: CandidateNotification['category'] = 'system';
        if (n.type === 'application') category = 'applications';
        else if (n.type === 'interview') category = 'interviews';
        else if (n.type === 'job_alert') category = 'job_matches';
        else if (n.type === 'invitation' || n.type === 'invitation_response') category = 'recruiter_messages';

        return {
          id: n.id,
          title: n.title,
          message: n.message,
          timestamp: formatRelativeTime(n.createdAt),
          category,
          read: n.read,
          targetLink: (n.link && n.link.startsWith('/candidate/applications') ? '/applications' : (n.link || '/applications')),
          actionText: 'View Details',
          rawType: n.type,
          invitationStatus: n.invitationStatus,
        };
      });
    } catch (err) {
      console.warn('candidatePortalService.getNotifications error:', err);
      return [];
    }
  },

  async respondToInvitation(id: string, status: 'accepted' | 'declined'): Promise<boolean> {
    try {
      await notificationRepository.updateInvitationStatus(id, status);
      return true;
    } catch (err) {
      console.warn('candidatePortalService.respondToInvitation error:', err);
      return false;
    }
  },

  async markNotificationRead(id: string): Promise<boolean> {
    try {
      await notificationRepository.markAsRead(id);
      return true;
    } catch (err) {
      console.warn('candidatePortalService.markNotificationRead error:', err);
      return false;
    }
  },

  async markAllNotificationsRead(): Promise<boolean> {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return true;
    try {
      await notificationRepository.markAllAsRead(currentUid);
      return true;
    } catch (err) {
      console.warn('candidatePortalService.markAllNotificationsRead error:', err);
      return false;
    }
  },

  async deleteNotification(id: string): Promise<boolean> {
    try {
      await notificationRepository.delete(id);
      return true;
    } catch (err) {
      console.warn('candidatePortalService.deleteNotification error:', err);
      return false;
    }
  },

  // INTERVIEWS
  async getInterviews(): Promise<UpcomingInterview[]> {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || !isFirebaseConfigured) {
      return [];
    }

    try {
      const interviewDocs = await interviewRepository.findByCandidateId(currentUid);
      const results: UpcomingInterview[] = [];

      for (const intDoc of interviewDocs) {
        let jobTitle = (intDoc as any).jobTitle || 'Upcoming Interview';
        let companyName = (intDoc as any).companyName || 'Hiring Organization';
        let companyLogoUrl = (intDoc as any).companyLogoUrl;

        // Populate job details if missing
        if (intDoc.jobId && (!jobTitle || jobTitle === 'Upcoming Interview')) {
          try {
            const job = await jobRepository.findById(intDoc.jobId);
            if (job) {
              jobTitle = job.title;
              companyName = job.companyName;
              companyLogoUrl = job.companyLogo;
            }
          } catch (e) {
            // ignore
          }
        }

        const scheduledDate = intDoc.scheduledAt ? new Date(intDoc.scheduledAt) : new Date();
        const interviewDate = scheduledDate.toISOString().split('T')[0];
        const interviewTime = scheduledDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

        results.push({
          id: intDoc.id,
          jobId: intDoc.jobId || '',
          jobTitle,
          companyName,
          companyLogoUrl,
          interviewDate,
          interviewTime: `${interviewTime} (${intDoc.durationMinutes || 45} mins)`,
          interviewType: ((intDoc as any).interviewType || 'Technical Round') as UpcomingInterview['interviewType'],
          interviewerName: (intDoc as any).interviewerName || 'Hiring Manager',
          interviewerRole: (intDoc as any).interviewerRole || 'Interviewer',
          meetingLink: intDoc.locationOrUrl || 'https://meet.google.com',
          preparationChecklist: (intDoc as any).preparationChecklist || [
            { id: 'c1', text: 'Review position requirements and project highlights', completed: false },
            { id: 'c2', text: 'Test microphone, video, and quiet space setup', completed: false },
          ],
          notes: intDoc.notes || '',
        });
      }

      return results;
    } catch (err) {
      console.warn('candidatePortalService.getInterviews error:', err);
      return [];
    }
  },

  async toggleChecklistItem(
    interviewId: string,
    checklistItemId: string
  ): Promise<UpcomingInterview | null> {
    if (!isFirebaseConfigured) return null;
    try {
      const interviewDoc = await interviewRepository.findById(interviewId);
      if (!interviewDoc) return null;

      const checklist = (interviewDoc as any).preparationChecklist || [];
      const updatedChecklist = checklist.map((item: any) =>
        item.id === checklistItemId ? { ...item, completed: !item.completed } : item
      );

      await interviewRepository.update(interviewId, {
        preparationChecklist: updatedChecklist,
      } as any);

      const all = await this.getInterviews();
      return all.find((i) => i.id === interviewId) || null;
    } catch (err) {
      console.warn('candidatePortalService.toggleChecklistItem error:', err);
      return null;
    }
  },

  // RESUME MANAGEMENT
  async getResumes(): Promise<CandidateResume[]> {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || !isFirebaseConfigured) {
      return [];
    }

    try {
      const user = await userRepository.findById(currentUid);
      if (!user) return [];

      const storedResumes = (user as any).resumes as CandidateResume[] | undefined;
      if (storedResumes && storedResumes.length > 0) {
        return storedResumes;
      }

      // If user has a single resumeUrl/resumeName in their profile document
      if (user.resumeUrl || (user as any).resumeName) {
        return [
          {
            id: `res-${currentUid}`,
            fileName: (user as any).resumeName || '',
            fileSize: '1.2 MB',
            uploadDate: (user as any).resumeUpdatedAt
              ? String((user as any).resumeUpdatedAt).split('T')[0]
              : new Date(user.createdAt || Date.now()).toISOString().split('T')[0],
            isPrimary: true,
            downloadUrl: user.resumeUrl || '#',
            parsedSkills: user.skills || [],
          },
        ];
      }

      return [];
    } catch (err) {
      console.warn('candidatePortalService.getResumes error:', err);
      return [];
    }
  },

  async uploadResume(fileName: string, fileSize: string): Promise<CandidateResume> {
    const currentUid = auth.currentUser?.uid;
    const now = new Date().toISOString();
    const resumeId = `res_${Date.now()}`;

    const newResume: CandidateResume = {
      id: resumeId,
      fileName,
      fileSize,
      uploadDate: now.split('T')[0],
      isPrimary: true,
      downloadUrl: '#',
      parsedSkills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    };

    if (currentUid && isFirebaseConfigured) {
      try {
        const user = await userRepository.findById(currentUid);
        const existingResumes = (user as any)?.resumes || [];
        const updatedResumes = [
          newResume,
          ...existingResumes.map((r: CandidateResume) => ({ ...r, isPrimary: false })),
        ];

        await userRepository.update(currentUid, {
          resumeName: fileName,
          resumeUrl: newResume.downloadUrl,
          resumeUpdatedAt: now,
          resumes: updatedResumes,
        } as any);
      } catch (err) {
        console.warn('candidatePortalService.uploadResume error:', err);
      }
    }

    return newResume;
  },

  async deleteResume(id: string): Promise<boolean> {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || !isFirebaseConfigured) return true;

    try {
      const user = await userRepository.findById(currentUid);
      if (!user) return true;

      const existingResumes = (user as any).resumes as CandidateResume[] | undefined;
      if (!existingResumes) {
        await userRepository.update(currentUid, {
          resumeName: '',
          resumeUrl: '',
          resumes: [],
        } as any);
        return true;
      }

      const filtered = existingResumes.filter((r) => r.id !== id);
      if (filtered.length > 0 && !filtered.some((r) => r.isPrimary)) {
        filtered[0].isPrimary = true;
      }

      await userRepository.update(currentUid, {
        resumes: filtered,
        resumeName: filtered[0]?.fileName || '',
        resumeUrl: filtered[0]?.downloadUrl || '',
      } as any);
      return true;
    } catch (err) {
      console.warn('candidatePortalService.deleteResume error:', err);
      return false;
    }
  },

  async setPrimaryResume(id: string): Promise<boolean> {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || !isFirebaseConfigured) return true;

    try {
      const user = await userRepository.findById(currentUid);
      if (!user) return true;

      const existingResumes = (user as any).resumes as CandidateResume[] | undefined;
      if (!existingResumes) return true;

      const updated = existingResumes.map((r) => ({
        ...r,
        isPrimary: r.id === id,
      }));

      const primary = updated.find((r) => r.isPrimary);

      await userRepository.update(currentUid, {
        resumes: updated,
        resumeName: primary?.fileName || user.resumeName,
        resumeUrl: primary?.downloadUrl || user.resumeUrl,
      } as any);
      return true;
    } catch (err) {
      console.warn('candidatePortalService.setPrimaryResume error:', err);
      return false;
    }
  },

  // PREFERENCES
  async getJobPreferences(): Promise<JobPreferences> {
    const currentUid = auth.currentUser?.uid;
    const defaultPreferences: JobPreferences = {
      preferredRoles: [],
      preferredLocations: [],
      salaryMin: 0,
      salaryMax: 0,
      currency: 'USD',
      openToRemote: true,
      availabilityNotice: 'Immediate',
      employmentTypes: ['Full-Time'],
    };

    if (!currentUid || !isFirebaseConfigured) {
      return defaultPreferences;
    }

    try {
      const user = await userRepository.findById(currentUid);
      if (user && (user as any).candidatePreferences) {
        return {
          ...defaultPreferences,
          ...(user as any).candidatePreferences,
        };
      }
      return defaultPreferences;
    } catch (err) {
      console.warn('candidatePortalService.getJobPreferences error:', err);
      return defaultPreferences;
    }
  },

  async updateJobPreferences(newPrefs: JobPreferences): Promise<JobPreferences> {
    const currentUid = auth.currentUser?.uid;
    if (currentUid && isFirebaseConfigured) {
      try {
        await userRepository.update(currentUid, {
          candidatePreferences: newPrefs,
        } as any);
      } catch (err) {
        console.warn('candidatePortalService.updateJobPreferences error:', err);
      }
    }
    return { ...newPrefs };
  },

  // CAREER INSIGHTS
  async getCareerInsights(): Promise<CareerInsightData> {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || !isFirebaseConfigured) {
      return {
        profileStrength: 0,
        profileStrengthTips: [
          'Complete your professional profile headline and bio to increase discovery.',
          'Add your core technical skills and upload a verified resume to unlock priority matching.',
        ],
        skillsDemand: [
          { skill: 'React 19 & Next.js App Router', demandScore: 95, growth: '+24% this quarter' },
          { skill: 'TypeScript & Type Systems', demandScore: 92, growth: '+18% this quarter' },
          { skill: 'Cloud Architecture & APIs', demandScore: 88, growth: '+15% this quarter' },
        ],
        recommendedSkills: [
          { name: 'TypeScript & React', relevance: 'High Match for Tech Roles', difficulty: 'Intermediate' },
          { name: 'Cloud & System Design', relevance: 'High Demand for Senior Roles', difficulty: 'Advanced' },
        ],
        applicationSuccessRate: 0,
        recruiterViewsThisMonth: 0,
        recentViews: [],
        weeklyActivity: [
          { day: 'Mon', applications: 0, views: 0 },
          { day: 'Tue', applications: 0, views: 0 },
          { day: 'Wed', applications: 0, views: 0 },
          { day: 'Thu', applications: 0, views: 0 },
          { day: 'Fri', applications: 0, views: 0 },
          { day: 'Sat', applications: 0, views: 0 },
          { day: 'Sun', applications: 0, views: 0 },
        ],
      };
    }

    try {
      const [user, applications] = await Promise.all([
        userRepository.findById(currentUid),
        applicationRepository.findByCandidateId(currentUid),
      ]);

      let filledCount = 0;
      const checkFields = ['displayName', 'email', 'headline', 'location', 'bio', 'skills', 'resumeUrl'];
      checkFields.forEach((field) => {
        const val = (user as any)?.[field];
        if (val && (Array.isArray(val) ? val.length > 0 : String(val).trim() !== '')) {
          filledCount++;
        }
      });
      const profileStrength = Math.round((filledCount / checkFields.length) * 100);

      const tips: string[] = [];
      if (!user?.skills || user.skills.length === 0) {
        tips.push('Add your technical skills to your profile to match with top engineering openings.');
      }
      if (!user?.resumeUrl) {
        tips.push('Upload an updated resume to enable one-click applications.');
      }
      if (!user?.bio) {
        tips.push('Add a concise summary in your bio to help recruiters understand your domain expertise.');
      }
      if (tips.length === 0) {
        tips.push('Your profile is comprehensive and verified for recruiter discovery.');
      }

      const totalApps = applications.length;
      const offersOrInterviews = applications.filter(
        (a) => a.status === 'interviewing' || a.status === 'offered' || a.status === 'shortlisted'
      ).length;
      const applicationSuccessRate = totalApps > 0 ? Math.round((offersOrInterviews / totalApps) * 100) : 0;

      const userSkills = user?.skills || [];
      const skillsDemand = userSkills.length > 0
        ? userSkills.slice(0, 5).map((skill, idx) => ({
            skill,
            demandScore: 95 - idx * 4,
            growth: `+${18 - idx * 2}% this quarter`,
          }))
        : [
            { skill: 'React & Frontend Frameworks', demandScore: 94, growth: '+22% this quarter' },
            { skill: 'TypeScript & JavaScript', demandScore: 92, growth: '+18% this quarter' },
            { skill: 'Node.js & Backend APIs', demandScore: 88, growth: '+15% this quarter' },
          ];

      return {
        profileStrength,
        profileStrengthTips: tips,
        skillsDemand,
        recommendedSkills: [
          { name: 'Modern Full-Stack Architecture', relevance: 'High Match for Tech Openings', difficulty: 'Intermediate' },
          { name: 'System Design & APIs', relevance: 'In Demand for Lead Roles', difficulty: 'Advanced' },
        ],
        applicationSuccessRate,
        recruiterViewsThisMonth: totalApps * 3,
        recentViews: [],
        weeklyActivity: [
          { day: 'Mon', applications: Math.min(totalApps, 1), views: totalApps * 2 },
          { day: 'Tue', applications: 0, views: totalApps },
          { day: 'Wed', applications: Math.min(totalApps, 2), views: totalApps * 3 },
          { day: 'Thu', applications: 0, views: totalApps },
          { day: 'Fri', applications: 0, views: 0 },
          { day: 'Sat', applications: 0, views: 0 },
          { day: 'Sun', applications: 0, views: 0 },
        ],
      };
    } catch (err) {
      console.warn('candidatePortalService.getCareerInsights error:', err);
      return {
        profileStrength: 50,
        profileStrengthTips: ['Update your profile to receive tailored insights.'],
        skillsDemand: [],
        recommendedSkills: [],
        applicationSuccessRate: 0,
        recruiterViewsThisMonth: 0,
        recentViews: [],
        weeklyActivity: [],
      };
    }
  },
};
