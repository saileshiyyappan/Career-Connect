import { BaseSearchProvider } from './ProviderBase';
import { NormalizedExternalJob, NormalizedExternalCompany, JobSearchParams, CompanySearchParams } from '../types';
import { SearchNormalizer } from '../normalizer';

export class ArbeitnowProvider extends BaseSearchProvider {
  id = 'arbeitnow';
  name = 'Arbeitnow';
  baseUrl = 'https://www.arbeitnow.com/api/job-board-api';
  attributionText = 'Via Arbeitnow';
  supportsCompanySearch = true;
  supportsJobSearch = true;
  supportsPagination = true;

  async searchJobs(params: JobSearchParams): Promise<NormalizedExternalJob[]> {
    const startTime = Date.now();
    const url = new URL(this.baseUrl);
    if (params.page && params.page > 1) {
      url.searchParams.set('page', String(params.page));
    }

    try {
      const res = await this.safeFetch(url.toString(), 12000);
      if (!res.ok) {
        throw new Error(`Arbeitnow returned HTTP ${res.status}: ${res.statusText}`);
      }

      const data = (await res.json()) as { data?: any[] };
      const rawJobs = data?.data || [];
      const fetchedAt = new Date().toISOString();

      const normalizedJobs: NormalizedExternalJob[] = [];

      for (const raw of rawJobs) {
        if (!raw.title || !raw.url || !raw.company_name) continue;

        const pubDateIso = raw.created_at
          ? (typeof raw.created_at === 'number' ? new Date(raw.created_at * 1000).toISOString() : new Date(raw.created_at).toISOString())
          : fetchedAt;

        const locationStr = raw.location || (raw.remote ? 'Remote' : 'Europe');
        const category = SearchNormalizer.inferCategory(raw.title, raw.tags);

        normalizedJobs.push({
          id: `ext_arb_${SearchNormalizer.generateFingerprint(raw.company_name || '', raw.title, locationStr)}`,
          externalId: String(raw.slug || raw.url),
          sourceId: this.id,
          sourceName: this.name,
          sourceUrl: raw.url,
          title: raw.title,
          companyName: raw.company_name,
          location: locationStr,
          isRemote: raw.remote === true || locationStr.toLowerCase().includes('remote'),
          employmentType: SearchNormalizer.normalizeEmploymentType(Array.isArray(raw.job_types) ? raw.job_types.join(', ') : raw.job_types),
          category,
          description: SearchNormalizer.stripHtml(raw.description),
          skills: raw.tags || [],
          publishedAt: raw.created_at ? pubDateIso : '',
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
    const jobs = await this.searchJobs({ limit: 50 });
    const companyMap = new Map<string, NormalizedExternalCompany>();

    for (const job of jobs) {
      if (!job.companyName) continue;
      const key = job.companyName.trim().toLowerCase();
      const existing = companyMap.get(key);

      if (existing) {
        existing.openJobsCount += 1;
      } else {
        companyMap.set(key, {
          id: `org_arb_${key.replace(/[^a-z0-9]/g, '_')}`,
          externalId: key,
          sourceId: this.id,
          sourceName: this.name,
          sourceUrl: job.applicationUrl,
          name: job.companyName,
          industry: job.category,
          description: `Organization actively hiring for ${job.title} and European/Remote roles.`,
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
