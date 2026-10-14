import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

export interface GatewayCompany {
  id: string;
  externalId?: string;
  sourceId?: string;
  sourceName?: string;
  sourceUrl?: string;
  name: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  description?: string;
  headquarters?: string;
  companySize?: string;
  openJobsCount: number;
  verified: boolean;
  companyOrigin: 'internal' | 'external';
  score?: number;
}

export interface CompanyGatewaySearchParams {
  query?: string;
  industry?: string;
  page?: number;
  limit?: number;
}

export interface CompanyGatewayResponse {
  success: boolean;
  data: GatewayCompany[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  cached: boolean;
  queryTimeMs: number;
  providersQueried: string[];
  error?: string;
}

class CompanySearchGatewayService {
  /**
   * Discovers organizations dynamically across external providers via API gateway.
   */
  async searchCompanies(params: CompanyGatewaySearchParams): Promise<CompanyGatewayResponse> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.set('query', params.query);
    if (params.industry && params.industry !== 'All') searchParams.set('industry', params.industry);
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));

    const url = `/api/search/companies?${searchParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        return (await response.json()) as CompanyGatewayResponse;
      }
    } catch {
      // Fallback to Firebase Callable if Express API is unreachable
    }

    try {
      const searchCallable = httpsCallable<CompanyGatewaySearchParams, CompanyGatewayResponse>(
        functions,
        'searchCompaniesGateway'
      );
      const callableRes = await searchCallable(params);
      return callableRes.data;
    } catch (callableErr) {
      console.warn('Company gateway search fallback error:', callableErr);
      return {
        success: false,
        data: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 24,
        hasMore: false,
        cached: false,
        queryTimeMs: 0,
        providersQueried: [],
        error: 'Unable to reach company search gateway.',
      };
    }
  }
}

export const companySearchGatewayService = new CompanySearchGatewayService();
