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
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  createdAt: string | number;
  updatedAt: string | number;
}

export interface FirestoreNotificationDocument {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application' | 'interview' | 'system' | 'job_alert';
  link?: string;
  read: boolean;
  createdAt: string | number;
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
