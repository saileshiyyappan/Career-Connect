import { BaseSearchProvider } from './ProviderBase';
import { NormalizedExternalJob, NormalizedExternalCompany, JobSearchParams, CompanySearchParams } from '../types';
import { SearchNormalizer } from '../normalizer';

export class RemotiveProvider extends BaseSearchProvider {
  id = 'remotive';
  name = 'Remotive';
  baseUrl = 'https://remotive.com/api/remote-jobs';
  attributionText = 'Via Remotive';
  supportsCompanySearch = true;
  supportsJobSearch = true;
  supportsPagination = true;

  async searchJobs(params: JobSearchParams): Promise<NormalizedExternalJob[]> {
    const startTime = Date.now();
    const limit = Math.min(params.limit || 50, 100);
    const url = new URL(this.baseUrl);
    url.searchParams.set('limit', String(limit));

    if (params.query) {
      url.searchParams.set('search', SearchNormalizer.normalizeQuery(params.query));
    }

    try {
      const res = await this.safeFetch(url.toString(), 12000);
      if (!res.ok) {
        throw new Error(`Remotive returned HTTP ${res.status}: ${res.statusText}`);
      }

      const data = (await res.json()) as { jobs?: any[] };
      const rawJobs = data?.jobs || [];
      const fetchedAt = new Date().toISOString();

      const normalizedJobs: NormalizedExternalJob[] = [];

      for (const raw of rawJobs) {
        if (!raw.title || !raw.url || !raw.company_name) continue;

        const pubDateIso = raw.publication_date ? new Date(raw.publication_date).toISOString() : fetchedAt;
        const locationStr = raw.candidate_required_location || 'Worldwide (Remote)';
        const category = SearchNormalizer.inferCategory(raw.title, raw.category ? [raw.category] : [], raw.tags);

        normalizedJobs.push({
          id: `ext_rem_${SearchNormalizer.generateFingerprint(raw.company_name || '', raw.title, locationStr)}`,
          externalId: String(raw.id || raw.url),
          sourceId: this.id,
          sourceName: this.name,
          sourceUrl: raw.url,
          title: raw.title,
          companyName: raw.company_name,
          companyLogoUrl: raw.company_logo || undefined,
          location: locationStr,
          isRemote: true,
          employmentType: SearchNormalizer.normalizeEmploymentType(raw.job_type),
          category,
          salaryFormatted: raw.salary || undefined,
          description: SearchNormalizer.stripHtml(raw.description),
          skills: raw.tags || [],
          publishedAt: raw.publication_date ? pubDateIso : '',
          fetchedAt,
          applicationUrl: raw.url,
          jobOrigin: 'external',
        });
      }

      this.trackSuccess(Date.now() - startTime);
      return normalizedJobs;
    } catch (err) {
      this.trackFailure(err);
      return [];
    }
  }

  async searchCompanies(params: CompanySearchParams): Promise<NormalizedExternalCompany[]> {
    const jobs = await this.searchJobs({ query: params.query, limit: 50 });
    const companyMap = new Map<string, NormalizedExternalCompany>();

    for (const job of jobs) {
      if (!job.companyName) continue;
      const key = job.companyName.trim().toLowerCase();
      const existing = companyMap.get(key);

      if (existing) {
        existing.openJobsCount += 1;
      } else {
        companyMap.set(key, {
          id: `org_rem_${key.replace(/[^a-z0-9]/g, '_')}`,
          externalId: key,
          sourceId: this.id,
          sourceName: this.name,
          sourceUrl: job.applicationUrl,
          name: job.companyName,
          logoUrl: job.companyLogoUrl,
          industry: job.category,
          headquarters: job.location,
          openJobsCount: 1,
          verified: false,
          companyOrigin: 'external',
        });
      }
    }

    return Array.from(companyMap.values());
  }
}
