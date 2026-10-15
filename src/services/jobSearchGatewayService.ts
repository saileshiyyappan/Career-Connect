import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export interface GatewayJob {
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

export interface JobGatewaySearchParams {
  query?: string;
  company?: string;
  location?: string;
  category?: string;
  type?: string;
  remoteOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface JobGatewayResponse {
  success: boolean;
  data: GatewayJob[];
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

class JobSearchGatewayService {
  /**
   * Discovers and queries live global jobs from external providers via API gateway.
   */
  async searchJobs(params: JobGatewaySearchParams): Promise<JobGatewayResponse> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.set('query', params.query);
    if (params.company) searchParams.set('company', params.company);
    if (params.location) searchParams.set('location', params.location);
    if (params.category && params.category !== 'All') searchParams.set('category', params.category);
    if (params.type && params.type !== 'All') searchParams.set('type', params.type);
    if (params.remoteOnly) searchParams.set('remoteOnly', 'true');
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const url = `/api/search/jobs?${searchParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        return (await response.json()) as JobGatewayResponse;
      }
    } catch {
      // Fallback to Firebase Callable if Express API is unreachable
    }

    try {
      const searchCallable = httpsCallable<JobGatewaySearchParams, JobGatewayResponse>(
        functions,
        'searchJobsGateway'
      );
      const callableRes = await searchCallable(params);
      return callableRes.data;
    } catch (callableErr) {
      console.warn('Gateway search fallback error:', callableErr);
      return {
        success: false,
        data: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 20,
        hasMore: false,
        cached: false,
        queryTimeMs: 0,
        providersQueried: [],
        error: 'Unable to reach search gateway.',
      };
    }
  }
}

export const jobSearchGatewayService = new JobSearchGatewayService();
