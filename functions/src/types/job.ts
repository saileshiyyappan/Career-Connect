export type ExternalJobStatus = 'active' | 'expired' | 'removed' | 'error';

export interface ExternalJobSalary {
  min?: number;
  max?: number;
  currency: string;
  period?: 'yearly' | 'monthly' | 'hourly';
  formatted?: string;
}

export interface ExternalJobDocument {
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
  salary?: ExternalJobSalary;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
  technologyStack: string[];
  remote: boolean;
  jobOrigin: 'external';
  publishedAt: string; // ISO 8601 string
  fetchedAt: string;    // ISO 8601 string
  expiresAt?: string;   // ISO 8601 string
  status: ExternalJobStatus;
  contentHash: string;
  createdAt: string;    // ISO 8601 string
  updatedAt: string;    // ISO 8601 string
}

export type JobSourceType = 'api' | 'rss' | 'feed' | 'custom';
export type JobSourceStatus = 'active' | 'paused' | 'error';

export interface JobSourceDocument {
  id: string;
  name: string;
  type: JobSourceType;
  baseUrl: string;
  feedUrl?: string;
  enabled: boolean;
  lastSuccessfulSync?: string;
  lastAttemptedSync?: string;
  status: JobSourceStatus;
  rateLimitPerMinute?: number;
  authHeaderName?: string;
  cursorParamName?: string;
  maxPagesPerRun?: number;
  limitPerPage?: number;
  createdAt: string;
  updatedAt: string;
}

export interface RawExternalJobInput {
  // Common & Generic fields
  externalId?: string | number;
  id?: string | number;
  title?: string;
  jobTitle?: string;
  job_title?: string;
  company?: string | { name?: string; display_name?: string; logo?: string };
  company_name?: string;
  companyName?: string;
  companySlug?: string;
  company_logo?: string;
  companyLogo?: string;
  location?: string | { display_name?: string; area?: string[]; city?: string; country?: string };
  locationRestrictions?: string[];
  timezoneRestrictions?: number[];
  employment_type?: string;
  employmentType?: string;
  job_type?: string | string[];
  jobType?: string | string[];
  experience_level?: string;
  experienceLevel?: string;
  seniority?: string[] | string;
  jobLevel?: string;
  salary_min?: number | string;
  salary_max?: number | string;
  minSalary?: number | string;
  maxSalary?: number | string;
  salary_currency?: string;
  currency?: string;
  salaryCurrency?: string;
  salary_period?: string;
  salaryPeriod?: string;
  annualSalaryMin?: number | string;
  annualSalaryMax?: number | string;
  salary?: string | number | { min?: number; max?: number; currency?: string; period?: string };
  description?: string;
  jobDescription?: string;
  body?: string;
  content?: string;
  excerpt?: string;
  jobExcerpt?: string;
  responsibilities?: string[] | string;
  qualifications?: string[] | string;
  requirements?: string[] | string;
  skills?: string[] | string;
  tags?: string[];
  categories?: string[];
  parentCategories?: string[];
  jobIndustry?: string[] | string;
  technology_stack?: string[] | string;
  technologyStack?: string[] | string;
  remote?: boolean | string;
  is_remote?: boolean | string;
  jobGeo?: string;
  published_at?: string | number;
  pubDate?: string | number;
  created_at?: string | number;
  date_posted?: string | number;
  expiry_date?: string | number;
  expiryDate?: string | number;
  expires_at?: string | number;
  redirect_url?: string;
  url?: string;
  link?: string;
  source_url?: string;
  applicationLink?: string;
  guid?: string;
  jobSlug?: string;
}
