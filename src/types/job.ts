export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship' | 'Hybrid';

export type ExperienceLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Lead / Director' | 'Executive';

export type JobStatus = 'active' | 'draft' | 'closed' | 'archived';

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
}

export interface JobLocation {
  city: string;
  state?: string;
  country: string;
  isRemote: boolean;
}

export type Job = JobItem;
export interface JobItem {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string;
  location: JobLocation | string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salary: SalaryRange | string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  skillsRequired: string[];
  department?: string;
  status: JobStatus;
  postedAt: string;
  deadlineAt?: string;
  applicantCount?: number;
  featured?: boolean;
  employerId: string;
  category?: string;
}

export interface JobFilterParams {
  searchQuery?: string;
  location?: string;
  employmentTypes?: EmploymentType[];
  experienceLevels?: ExperienceLevel[];
  minSalary?: number;
  isRemoteOnly?: boolean;
}
