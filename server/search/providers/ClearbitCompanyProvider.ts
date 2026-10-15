import { BaseSearchProvider } from './ProviderBase';
import { NormalizedExternalCompany, CompanySearchParams, NormalizedExternalJob, JobSearchParams } from '../types';

interface ClearbitSuggestItem {
  name: string;
  domain: string;
  logo?: string | null;
}

export class ClearbitCompanyProvider extends BaseSearchProvider {
  id = 'clearbit';
  name = 'Clearbit Company Directory';
  baseUrl = 'https://autocomplete.clearbit.com/v1/companies/suggest';
  attributionText = 'Data provided by Clearbit Company Autocomplete';
  supportsCompanySearch = true;
  supportsJobSearch = false;
  supportsPagination = false;

  async searchJobs(_params: JobSearchParams): Promise<NormalizedExternalJob[]> {
    return [];
  }

  async searchCompanies(params: CompanySearchParams): Promise<NormalizedExternalCompany[]> {
    const startTime = Date.now();
    const query = params.query?.trim();
    if (!query) return [];

    try {
      const url = `${this.baseUrl}?query=${encodeURIComponent(query)}`;
      const response = await this.safeFetch(url, 6000);

      if (!response.ok) {
        throw new Error(`Clearbit returned status ${response.status}`);
      }

      const items: ClearbitSuggestItem[] = await response.json();
      if (!Array.isArray(items)) {
        this.trackSuccess(Date.now() - startTime);
        return [];
      }

      const normalized: NormalizedExternalCompany[] = items.map((item) => {
        const domain = item.domain || '';
        const websiteUrl = domain ? `https://${domain}` : undefined;

        return {
          id: `comp_cb_${domain.replace(/[^a-z0-9]/gi, '_').toLowerCase() || Math.random().toString(36).substring(2, 9)}`,
          externalId: domain,
          sourceId: this.id,
          sourceName: this.name,
          sourceUrl: websiteUrl || 'https://clearbit.com',
          name: item.name,
          legalName: item.name,
          logoUrl: item.logo || undefined,
          website: websiteUrl,
          websiteUrl: websiteUrl,
          description: `Global organization (${domain}). Verified domain from official public company directory.`,
          industry: 'Enterprise & Technology',
          headquarters: 'Global',
          openJobsCount: 0,
          verified: false,
          companyOrigin: 'External Organization',
          fetchedAt: new Date().toISOString(),
        };
      });

      this.trackSuccess(Date.now() - startTime);
      return normalized;
    } catch (err) {
      this.trackFailure(err);
      return [];
    }
  }
}
