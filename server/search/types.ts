export interface NormalizedExternalJob {
  id: string;
  externalId: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  companyName: string;
  companySlug?: string;
  companyLogoUrl?: string;
  companyWebsite?: string;
  location: string;
  isRemote: boolean;
  employmentType: string;
  experienceLevel?: string;
  category: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  salaryFormatted?: string;
  description: string;
  excerpt?: string;
  responsibilities?: string[];
  requirements?: string[];
  skills?: string[];
  publishedAt: string;
  fetchedAt: string;
  applicationUrl: string;
  jobOrigin: 'external';
  score?: number;
}

export type CompanyOrigin = 
  | 'CareerConnect Verified Employer'
  | 'External Organization'
  | 'Hiring Organization'
  | 'Partner Provider'
  | 'internal'
  | 'external';

export interface NormalizedExternalCompany {
  id: string;
  externalId?: string;
  sourceId?: string;
  sourceName?: string;
  sourceUrl?: string;
  name: string;
  legalName?: string;
  logoUrl?: string;
  website?: string;
  websiteUrl?: string;
  industry?: string;
  description?: string;
  country?: string;
  city?: string;
  region?: string;
  headquarters?: string;
  companySize?: string;
  openJobsCount: number;
  verified: boolean;
  companyOrigin: CompanyOrigin;
  score?: number;
  fetchedAt?: string;
}

export interface JobSearchParams {
  query?: string;
  company?: string;
  location?: string;
  category?: string;
  type?: string;
  remoteOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface CompanySearchParams {
  query?: string;
  industry?: string;
  page?: number;
  limit?: number;
}

export interface SearchGatewayResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  cached: boolean;
  queryTimeMs: number;
  providersQueried: string[];
  relatedQueryUsed?: string;
  error?: string;
}

export interface ProviderMetrics {
  providerId: string;
  providerName: string;
  status: 'active' | 'degraded' | 'down';
  lastQueryAt?: string;
  totalQueries: number;
  successfulQueries: number;
  failedQueries: number;
  averageLatencyMs: number;
}
