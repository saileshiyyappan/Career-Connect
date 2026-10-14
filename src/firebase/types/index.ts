export interface FirestoreUserDocument {
  uid: string;
  email: string;
  role: 'job_seeker' | 'candidate' | 'employer' | 'admin';
  displayName?: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  emailVerified: boolean;
  profileCompleted: boolean;
  accountStatus: 'active' | 'suspended' | 'pending';
  status?: 'active' | 'suspended' | 'pending';
  createdAt: string | number;
  updatedAt: string | number;
  lastLogin?: string | number;
  provider?: string;
  headline?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  resumeUrl?: string;
  companyName?: string;
  companyWebsite?: string;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  website?: string;
  education?: string | any[];
  experienceYears?: number;
  resumeName?: string;
  resumeUpdatedAt?: string;
  industry?: string;
  companySize?: string;
  employerPosition?: string;
  department?: string;
  professionalTitle?: string;
  companyLogo?: string;
  companyDescription?: string;
  companyLocation?: string;
  foundedYear?: number;
  companyAchievements?: string;
  aboutCompany?: string;
  hiringLocations?: string[];
  departments?: string[];
  commonlyHiredSkills?: string[];
  currentHiringStatus?: string;
  workModePreference?: string;
  talentSourcePreferences?: string[];
}

export interface FirestoreJobDocument {
  id: string;
  employerId: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  department?: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  requirements: string[];
  skills: string[];
  status: 'draft' | 'published' | 'closed' | 'flagged';
  viewsCount: number;
  applicationsCount: number;
  createdAt: string | number;
  updatedAt: string | number;
}

export interface FirestoreApplicationDocument {
  id: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  jobTitle: string;
  companyName: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';
  appliedAt: string | number;
  updatedAt: string | number;
  notes?: string[];
}

export interface FirestoreCompanyDocument {
  id: string;
  ownerId: string;
  name: string;
  logoUrl?: string;
  bannerUrl?: string;
  tagline?: string;
  description: string;
  website?: string;
  industry: string;
  companySize: string;
  headquarters: string;
  foundedYear?: number;
  socialLinks?: Record<string, string>;
  customAccentColor?: string;
  brandAssets?: Array<{ id: string; name: string; url: string; type: string; size?: string; category?: string; uploadedAt: string }>;
  galleryPhotos?: string[];
  mission?: string;
  vision?: string;
  culture?: string;
  benefits?: string[];
  phone?: string;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  createdAt: string | number;
  updatedAt: string | number;
}

export interface FirestoreNotificationDocument {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application' | 'interview' | 'system' | 'job_alert' | 'invitation' | 'invitation_response';
  link?: string;
  read: boolean;
  createdAt: string | number;
  senderId?: string;
  senderDisplayName?: string;
  recipientId?: string;
  applicationId?: string;
  jobId?: string;
  invitationId?: string;
  invitationStatus?: 'pending' | 'accepted' | 'declined';
  responseAt?: string | number;
}

export interface FirestoreInterviewDocument {
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  employerId: string;
  scheduledAt: string | number;
  durationMinutes: number;
  locationOrUrl: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  createdAt: string | number;
}

export interface FirestoreAnnouncementDocument {
  id: string;
  authorId: string;
  title: string;
  content: string;
  targetRole?: 'all' | 'candidate' | 'employer';
  published: boolean;
  createdAt: string | number;
  updatedAt: string | number;
}

export interface FirestoreAuditLogDocument {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string | number;
}

export interface FirestoreSavedJobDocument {
  id: string;
  userId: string;
  jobId: string;
  savedAt: string | number;
}

export interface FirestoreExternalJobDocument {
  id: string;
  externalId: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship' | 'Hybrid' | 'Other';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive' | 'Not Specified';
  salary?: {
    min?: number;
    max?: number;
    currency: string;
    period?: 'yearly' | 'monthly' | 'hourly';
    formatted?: string;
  };
  description: string;
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
  technologyStack: string[];
  remote: boolean;
  publishedAt: string;
  fetchedAt: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'removed' | 'error';
  contentHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface FirestoreCareerNewsDocument {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  summary: string;
  thumbnailUrl?: string;
  category: string;
  author?: string;
  publishedAt: string;
  fetchedAt: string;
  contentHash: string;
  status: 'active' | 'archived' | 'error';
  tags?: string[];
  readingTimeMinutes?: number;
  createdAt: string;
  updatedAt: string;
  relevanceScore?: number;
  isRelevant?: boolean;
}

export interface FirestoreJobSourceDocument {
  id: string;
  name: string;
  type: 'api' | 'rss' | 'feed' | 'custom';
  baseUrl: string;
  feedUrl?: string;
  enabled: boolean;
  lastSuccessfulSync?: string;
  lastAttemptedSync?: string;
  status: 'active' | 'paused' | 'error';
}

export interface FirestoreNewsSourceDocument {
  id: string;
  name: string;
  type: 'rss' | 'atom' | 'api' | 'custom';
  feedUrl: string;
  enabled: boolean;
  categories: string[];
  lastSuccessfulSync?: string;
  lastAttemptedSync?: string;
  status: 'active' | 'paused' | 'error';
}

export interface FirestoreSyncLogDocument {
  id: string;
  sourceId: string;
  sourceType: 'job' | 'news';
  startedAt: string;
  completedAt: string;
  status: 'success' | 'partial' | 'failure';
  fetchedCount: number;
  insertedCount: number;
  updatedCount: number;
  duplicateCount: number;
  expiredCount: number;
  errorCount: number;
  errors: Array<{
    recordId?: string;
    sourceUrl?: string;
    phase: 'fetch' | 'parse' | 'normalize' | 'validate' | 'persist';
    message: string;
    timestamp: string;
  }>;
  executionId: string;
  durationMs: number;
}

export interface FirestoreHiringCampaignDocument {
  id: string;
  employerId: string;
  companyId?: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  positions: string[];
  requiredSkills: string[];
  experienceLevel: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';
  employmentType: 'Full-time' | 'Contract' | 'Part-time' | 'Internship';
  applicationDestination: string;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  applicantCount?: number;
  createdAt: string | number;
  updatedAt: string | number;
}

export interface FirestoreEmployerSavedCandidateDocument {
  id: string;
  employerId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  candidateTitle?: string;
  candidateHeadline?: string;
  candidateSkills?: string[];
  candidateLocation?: string;
  candidateAvatar?: string;
  candidateExperienceYears?: number;
  candidateEducation?: string;
  notes?: string;
  tags?: string[];
  status?: 'saved' | 'shortlisted' | 'contacted';
  savedAt: string | number;
}

