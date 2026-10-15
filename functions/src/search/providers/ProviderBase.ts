import { NormalizedExternalJob, NormalizedExternalCompany, JobSearchParams, CompanySearchParams, ProviderMetrics } from '../types';

export interface ISearchProvider {
  id: string;
  name: string;
  baseUrl: string;
  attributionText: string;
  supportsCompanySearch: boolean;
  supportsJobSearch: boolean;
  supportsPagination: boolean;

  searchJobs(params: JobSearchParams): Promise<NormalizedExternalJob[]>;
  searchCompanies(params: CompanySearchParams): Promise<NormalizedExternalCompany[]>;
  getMetrics(): ProviderMetrics;
}

export abstract class BaseSearchProvider implements ISearchProvider {
  abstract id: string;
  abstract name: string;
  abstract baseUrl: string;
  abstract attributionText: string;
  abstract supportsCompanySearch: boolean;
  abstract supportsJobSearch: boolean;
  abstract supportsPagination: boolean;

  protected totalQueries: number = 0;
  protected successfulQueries: number = 0;
  protected failedQueries: number = 0;
  protected totalLatencyMs: number = 0;
  protected lastQueryAt?: string;
  protected lastError?: string;

  abstract searchJobs(params: JobSearchParams): Promise<NormalizedExternalJob[]>;
  abstract searchCompanies(params: CompanySearchParams): Promise<NormalizedExternalCompany[]>;

  getMetrics(): ProviderMetrics {
    const avgLatency = this.successfulQueries > 0 ? Math.round(this.totalLatencyMs / this.successfulQueries) : 0;
    const failureRate = this.totalQueries > 0 ? this.failedQueries / this.totalQueries : 0;

    let status: 'active' | 'degraded' | 'down' = 'active';
    if (failureRate > 0.5 && this.totalQueries > 3) {
      status = 'down';
    } else if (failureRate > 0.2 || avgLatency > 5000) {
      status = 'degraded';
    }

    return {
      providerId: this.id,
      providerName: this.name,
      status,
      lastQueryAt: this.lastQueryAt,
      totalQueries: this.totalQueries,
      successfulQueries: this.successfulQueries,
      failedQueries: this.failedQueries,
      averageLatencyMs: avgLatency,
    };
  }

  protected trackSuccess(latencyMs: number): void {
    this.totalQueries++;
    this.successfulQueries++;
    this.totalLatencyMs += latencyMs;
    this.lastQueryAt = new Date().toISOString();
  }

  protected trackFailure(error: unknown): void {
    this.totalQueries++;
    this.failedQueries++;
    this.lastQueryAt = new Date().toISOString();
    this.lastError = error instanceof Error ? error.message : String(error);
  }

  protected async safeFetch(url: string, timeoutMs: number = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CareerConnect-SearchGateway/2.0 (+https://careerconnect.app)',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return response;
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }
}
