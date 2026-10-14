import { BaseSearchProvider } from './ProviderBase';
import { NormalizedExternalCompany, CompanySearchParams, NormalizedExternalJob, JobSearchParams } from '../types';

interface WikidataSearchEntity {
  id: string;
  title: string;
  label?: string;
  description?: string;
  concepturi?: string;
}

export class WikidataCompanyProvider extends BaseSearchProvider {
  id = 'wikidata';
  name = 'Wikidata Knowledge Graph';
  baseUrl = 'https://www.wikidata.org/w/api.php';
  attributionText = 'Data licensed under Creative Commons CC0 by Wikidata';
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
      const url = `${this.baseUrl}?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&type=item&format=json&limit=8`;
      const response = await this.safeFetch(url, 6000);

      if (!response.ok) {
        throw new Error(`Wikidata returned status ${response.status}`);
      }

      const json = (await response.json()) as { search?: WikidataSearchEntity[] };
      const entities: WikidataSearchEntity[] = json?.search || [];

      // Filter to relevant organizational entities
      const orgKeywords = [
        'company', 'corporation', 'enterprise', 'organization', 'business', 
        'conglomerate', 'tech', 'software', 'bank', 'retailer', 'firm', 
        'subsidiary', 'multinational', 'institution', 'consulting', 'provider',
        'airline', 'manufacturer', 'agency', 'holding', 'service'
      ];

      const filteredEntities = entities.filter((ent) => {
        const desc = (ent.description || '').toLowerCase();
        return orgKeywords.some((kw) => desc.includes(kw));
      });

      const normalized: NormalizedExternalCompany[] = filteredEntities.map((ent) => {
        const name = ent.label || ent.title;
        const description = ent.description || 'Public organization entity recorded in the Wikidata Knowledge Graph.';

        return {
          id: `comp_wd_${ent.id.toLowerCase()}`,
          externalId: ent.id,
          sourceId: this.id,
          sourceName: this.name,
          sourceUrl: ent.concepturi || `https://www.wikidata.org/wiki/${ent.id}`,
          name: name,
          legalName: name,
          description: description,
          industry: this.inferIndustry(description),
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

  private inferIndustry(description: string): string {
    const desc = description.toLowerCase();
    if (desc.includes('software') || desc.includes('technology') || desc.includes('internet') || desc.includes('artificial intelligence') || desc.includes('computer')) {
      return 'Technology';
    }
    if (desc.includes('bank') || desc.includes('financial') || desc.includes('insurance') || desc.includes('investment')) {
      return 'Finance';
    }
    if (desc.includes('consulting') || desc.includes('professional services')) {
      return 'Consulting';
    }
    if (desc.includes('healthcare') || desc.includes('pharmaceutical') || desc.includes('medical') || desc.includes('biotech')) {
      return 'Healthcare';
    }
    if (desc.includes('automotive') || desc.includes('vehicle') || desc.includes('car')) {
      return 'Automotive';
    }
    if (desc.includes('retail') || desc.includes('e-commerce') || desc.includes('store')) {
      return 'Retail';
    }
    if (desc.includes('media') || desc.includes('entertainment') || desc.includes('streaming')) {
      return 'Media';
    }
    return 'Corporate Organization';
  }
}
