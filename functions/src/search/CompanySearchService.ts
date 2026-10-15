import { ISearchProvider } from './providers/ProviderBase';
import { ClearbitCompanyProvider } from './providers/ClearbitCompanyProvider';
import { WikidataCompanyProvider } from './providers/WikidataCompanyProvider';
import { HimalayasProvider } from './providers/HimalayasProvider';
import { JobicyProvider } from './providers/JobicyProvider';
import { RemotiveProvider } from './providers/RemotiveProvider';
import { ArbeitnowProvider } from './providers/ArbeitnowProvider';
import { NormalizedExternalCompany, CompanySearchParams, SearchGatewayResponse, ProviderMetrics } from './types';
import { SearchNormalizer } from './normalizer';
import { SearchDeduplicator } from './deduplicator';
import { SearchRanking } from './ranking';
import { searchCache } from './cache';

export class CompanySearchService {
  private directoryProviders: ISearchProvider[] = [
    new ClearbitCompanyProvider(),
    new WikidataCompanyProvider(),
  ];

  private jobProviders: ISearchProvider[] = [
    new HimalayasProvider(),
    new JobicyProvider(),
    new RemotiveProvider(),
    new ArbeitnowProvider(),
  ];

  private allProviders: ISearchProvider[] = [
    ...this.directoryProviders,
    ...this.jobProviders,
  ];

  /**
   * Discovers and aggregates companies dynamically across configured external providers:
   * 1. Authorized Directory (Clearbit, Wikidata)
   * 2. Hiring Organizations discovered from active Job Providers (Himalayas, Jobicy, Remotive, Arbeitnow)
   */
  async searchCompanies(params: CompanySearchParams): Promise<SearchGatewayResponse<NormalizedExternalCompany>> {
    const startTime = Date.now();
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params.limit) || 20, 1), 60);

    const normQuery = params.query ? SearchNormalizer.normalizeQuery(params.query) : '';
    const normIndustry = params.industry && params.industry !== 'All' ? params.industry.trim().toLowerCase() : '';

    const cacheKey = `companies:${normQuery}:${normIndustry}:${page}:${limit}`;

    // 1. Check Cache
    const cached = searchCache.get<SearchGatewayResponse<NormalizedExternalCompany>>(cacheKey);
    if (cached) {
      return {
        ...cached.data,
        cached: true,
        queryTimeMs: Date.now() - startTime,
      };
    }

    // 2. Query Providers Concurrently
    const providerPromises = this.allProviders.map(async (provider) => {
      try {
        const companies = await provider.searchCompanies({
          query: normQuery,
          industry: normIndustry,
          page,
          limit: 30,
        });
        return { providerId: provider.id, companies, error: null };
      } catch (err) {
        return {
          providerId: provider.id,
          companies: [],
          error: err instanceof Error ? err.message : String(err),
        };
      }
    });

    const providerResults = await Promise.all(providerPromises);
    const queriedProviderIds = providerResults.map((r) => r.providerId);

    // 3. Aggregate
    let rawAggregated: NormalizedExternalCompany[] = [];
    for (const res of providerResults) {
      rawAggregated.push(...res.companies);
    }

    // 4. Deduplicate
    let uniqueCompanies = SearchDeduplicator.deduplicateCompanies(rawAggregated);

    // 5. Apply Query & Industry Filters
    if (normQuery) {
      const terms = normQuery.split(/\s+/).filter(Boolean);
      uniqueCompanies = uniqueCompanies.filter((c) => {
        const nameLower = c.name.toLowerCase();
        const legalLower = (c.legalName || '').toLowerCase();
        const webLower = (c.website || c.websiteUrl || '').toLowerCase();
        const descLower = (c.description || '').toLowerCase();
        const indLower = (c.industry || '').toLowerCase();
        const hqLower = (c.headquarters || '').toLowerCase();

        // Exact or partial substring match in name/domain
        if (nameLower.includes(normQuery) || webLower.includes(normQuery) || legalLower.includes(normQuery)) {
          return true;
        }

        // Terms match across full attributes
        const fullText = `${nameLower} ${legalLower} ${webLower} ${descLower} ${indLower} ${hqLower}`;
        return terms.every((t) => fullText.includes(t));
      });
    }

    if (normIndustry) {
      uniqueCompanies = uniqueCompanies.filter((c) => (c.industry || '').toLowerCase().includes(normIndustry));
    }

    // 6. Rank by Relevance (Exact > Prefix > Partial > Industry)
    const rankedCompanies = SearchRanking.rankCompanies(uniqueCompanies, {
      ...params,
      query: normQuery,
    });

    // 7. Paginate
    const total = rankedCompanies.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = rankedCompanies.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < total;

    const response: SearchGatewayResponse<NormalizedExternalCompany> = {
      success: true,
      data: paginatedData,
      total,
      page,
      limit,
      hasMore,
      cached: false,
      queryTimeMs: Date.now() - startTime,
      providersQueried: queriedProviderIds,
    };

    // Cache the response for 15 minutes
    searchCache.set(cacheKey, response, 15 * 60 * 1000, 'providers');

    return response;
  }

  getProviderMetrics(): ProviderMetrics[] {
    return this.allProviders.map((p) => p.getMetrics());
  }
}

export const companySearchService = new CompanySearchService();
