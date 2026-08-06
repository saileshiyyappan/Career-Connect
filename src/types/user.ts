export type UserRole = 'guest' | 'job_seeker' | 'employer' | 'admin';

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
}

export interface AuthState {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  loginAs: (role: UserRole) => void;
  logout: () => void;
  updateRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}
