import { ISearchProvider } from './providers/ProviderBase';
import { HimalayasProvider } from './providers/HimalayasProvider';
import { JobicyProvider } from './providers/JobicyProvider';
import { RemotiveProvider } from './providers/RemotiveProvider';
import { ArbeitnowProvider } from './providers/ArbeitnowProvider';
import { NormalizedExternalJob, JobSearchParams, SearchGatewayResponse, ProviderMetrics } from './types';
import { SearchNormalizer } from './normalizer';
import { SearchDeduplicator } from './deduplicator';
import { SearchRanking } from './ranking';
import { searchCache } from './cache';

export class JobSearchService {
  private providers: ISearchProvider[] = [
    new HimalayasProvider(),
    new JobicyProvider(),
    new RemotiveProvider(),
    new ArbeitnowProvider(),
  ];

  async searchJobs(params: JobSearchParams): Promise<SearchGatewayResponse<NormalizedExternalJob>> {
    const startTime = Date.now();
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 20, 1), 100);

    const normQuery = params.query ? SearchNormalizer.normalizeQuery(params.query) : '';
    const normLocation = params.location ? params.location.trim().toLowerCase() : '';
    const normCompany = params.company ? params.company.trim().toLowerCase() : '';

    const cacheKey = `jobs:${normQuery}:${normCompany}:${normLocation}:${params.category || 'all'}:${params.type || 'all'}:${params.remoteOnly ? '1' : '0'}:${page}:${limit}`;

    const cached = searchCache.get<SearchGatewayResponse<NormalizedExternalJob>>(cacheKey);
    if (cached) {
      return {
        ...cached.data,
        cached: true,
        queryTimeMs: Date.now() - startTime,
      };
    }

    const providerPromises = this.providers.map(async (provider) => {
      try {
        const metricsBefore = provider.getMetrics();
        const jobs = await provider.searchJobs({
          query: normQuery,
          company: normCompany,
          location: normLocation,
          category: params.category,
          type: params.type,
          remoteOnly: params.remoteOnly,
          page,
          limit: 50,
        });
        const metricsAfter = provider.getMetrics();
        if (metricsAfter.failedQueries > metricsBefore.failedQueries) {
          return { providerId: provider.id, jobs: [], error: 'Provider request failed' };
        }
        return { providerId: provider.id, jobs, error: null };
      } catch (err) {
        return {
          providerId: provider.id,
          jobs: [],
          error: err instanceof Error ? err.message : String(err),
        };
      }
    });

    const providerResults = await Promise.all(providerPromises);
    const queriedProviderIds = providerResults.map((r) => r.providerId);
    const failedProviderCount = providerResults.filter((result) => result.error).length;

    let rawAggregated: NormalizedExternalJob[] = [];
    for (const res of providerResults) {
      rawAggregated.push(...res.jobs);
    }

    let uniqueJobs = SearchDeduplicator.deduplicateJobs(rawAggregated);

    // 5. Apply Param Filters & Strict Query Matching
    const filterJob = (job: NormalizedExternalJob, queryStr?: string): boolean => {
      // Query Term Filter
      if (queryStr) {
        const terms = queryStr.toLowerCase().split(/\s+/).filter(Boolean);
        if (terms.length > 0) {
          const text = `${job.title} ${job.companyName} ${job.category} ${(job.skills || []).join(' ')} ${job.location} ${job.excerpt || ''} ${job.description || ''}`.toLowerCase();
          const allTermsMatch = terms.every((t) => text.includes(t));
          if (!allTermsMatch) return false;
        }
      }

      // Company Filter
      if (normCompany && !job.companyName.toLowerCase().includes(normCompany)) {
        return false;
      }

      // Location Filter
      if (normLocation) {
        const locStr = job.location.toLowerCase();
        if (normLocation.includes('remote') && !job.isRemote && !locStr.includes('remote') && !locStr.includes('worldwide')) {
          return false;
        } else if (!normLocation.includes('remote') && !locStr.includes(normLocation)) {
          return false;
        }
      }

      // Remote only Filter
      if (params.remoteOnly && !job.isRemote && !job.location.toLowerCase().includes('remote') && !job.location.toLowerCase().includes('worldwide')) {
        return false;
      }

      // Category Filter
      if (params.category && params.category !== 'All' && job.category.toLowerCase() !== params.category.toLowerCase()) {
        return false;
      }

      // Type Filter
      if (params.type && params.type !== 'All' && job.employmentType.toLowerCase() !== params.type.toLowerCase()) {
        return false;
      }

      return true;
    };

    uniqueJobs = uniqueJobs.filter((j) => filterJob(j, normQuery));
    let relatedQueryUsed: string | undefined = undefined;

    if (uniqueJobs.length === 0 && normQuery) {
      const relatedCandidates = SearchNormalizer.getRelatedQueries(normQuery);
      for (const relQuery of relatedCandidates) {
        const fallbackMatches = SearchDeduplicator.deduplicateJobs(rawAggregated).filter((j) => filterJob(j, relQuery));

        if (fallbackMatches.length > 0) {
          uniqueJobs = fallbackMatches;
          relatedQueryUsed = relQuery;
          break;
        }
      }
    }

    const rankedJobs = SearchRanking.rankJobs(uniqueJobs, {
      ...params,
      query: normQuery,
      company: normCompany,
      location: normLocation,
    });

    const total = rankedJobs.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = rankedJobs.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < total;

    const response: SearchGatewayResponse<NormalizedExternalJob> = {
      success: failedProviderCount < providerResults.length,
      data: paginatedData,
      total,
      page,
      limit,
      hasMore,
      cached: false,
      queryTimeMs: Date.now() - startTime,
      providersQueried: queriedProviderIds,
      relatedQueryUsed,
      ...(failedProviderCount === providerResults.length
        ? { error: 'All external job providers are temporarily unavailable.' }
        : {}),
    };

    searchCache.set(cacheKey, response, 15 * 60 * 1000, 'providers');

    return response;
  }

  getProviderMetrics(): ProviderMetrics[] {
    return this.providers.map((p) => p.getMetrics());
  }
}

export const jobSearchService = new JobSearchService();
