export type UserRole = 'guest' | 'job_seeker' | 'employer' | 'admin';

export type EmployerPosition =
  | 'HR'
  | 'HR Manager'
  | 'Recruiter'
  | 'Talent Acquisition'
  | 'Hiring Manager'
  | 'Manager'
  | 'Team Lead'
  | 'Founder / Owner'
  | 'Company Representative'
  | 'Other';

export const EMPLOYER_POSITIONS: EmployerPosition[] = [
  'HR',
  'HR Manager',
  'Recruiter',
  'Talent Acquisition',
  'Hiring Manager',
  'Manager',
  'Team Lead',
  'Founder / Owner',
  'Company Representative',
  'Other',
];

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  photoURL?: string;
  headline?: string;
  phone?: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  resumeUrl?: string;
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeName?: string;
  resumeUpdatedAt?: string;
  experienceYears?: number;
  createdAt?: string;
  updatedAt?: string;
  firstName?: string;
  lastName?: string;
  education?: string | any[];
  experience?: string | any[];
  profileCompleted?: boolean;
  completionPercentage?: number;
  verificationStatus?: string;
  isEmailVerified?: boolean;
  // Employer / Recruiter Specific Profile Fields
  employerPosition?: EmployerPosition | string;
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
  currentHiringStatus?: 'Actively Hiring' | 'Selective' | 'Paused' | string;
  workModePreference?: 'Remote' | 'Hybrid' | 'On-site' | 'Flexible' | string;
  talentSourcePreferences?: string[];
}

export interface AuthState {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  loginAs: (role: UserRole) => void;
  logout: () => Promise<void>;
  updateRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}
