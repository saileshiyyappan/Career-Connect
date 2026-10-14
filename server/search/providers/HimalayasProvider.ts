import { BaseSearchProvider } from './ProviderBase';
import { NormalizedExternalJob, NormalizedExternalCompany, JobSearchParams, CompanySearchParams } from '../types';
import { SearchNormalizer } from '../normalizer';

export class HimalayasProvider extends BaseSearchProvider {
  id = 'himalayas';
  name = 'Himalayas';
  baseUrl = 'https://himalayas.app/jobs/api';
  attributionText = 'Via Himalayas';
  supportsCompanySearch = true;
  supportsJobSearch = true;
  supportsPagination = true;

  async searchJobs(params: JobSearchParams): Promise<NormalizedExternalJob[]> {
    const startTime = Date.now();
    const limit = Math.min(params.limit || 50, 100);
    const url = new URL(this.baseUrl);
    url.searchParams.set('limit', String(limit));

    try {
      const res = await this.safeFetch(url.toString(), 12000);
      if (!res.ok) {
        throw new Error(`Himalayas returned HTTP ${res.status}: ${res.statusText}`);
      }

      const data = (await res.json()) as { jobs?: any[] };
      const rawJobs = data?.jobs || [];
      const fetchedAt = new Date().toISOString();

      const normalizedJobs: NormalizedExternalJob[] = [];

      for (const raw of rawJobs) {
        if (!raw.title || !raw.applicationLink) continue;

        const pubDateIso = raw.pubDate
          ? (typeof raw.pubDate === 'number' ? new Date(raw.pubDate * 1000).toISOString() : new Date(raw.pubDate).toISOString())
          : fetchedAt;

        const isRemote = true; // Himalayas is remote-first
        const locationStr = raw.locationRestrictions && raw.locationRestrictions.length > 0
          ? raw.locationRestrictions.join(', ')
          : 'Remote';

        const category = SearchNormalizer.inferCategory(raw.title, raw.categories, raw.skills);

        normalizedJobs.push({
          id: `ext_him_${SearchNormalizer.generateFingerprint(raw.companyName || '', raw.title, locationStr)}`,
          externalId: raw.guid || raw.applicationLink,
          sourceId: this.id,
          sourceName: this.name,
          sourceUrl: raw.applicationLink,
          title: raw.title,
          companyName: raw.companyName || 'Featured Organization',
          companySlug: raw.companySlug,
          companyLogoUrl: raw.companyLogo || undefined,
          companyWebsite: raw.applicationLink,
          location: locationStr,
          isRemote,
          employmentType: SearchNormalizer.normalizeEmploymentType(raw.employmentType),
          experienceLevel: Array.isArray(raw.seniority) ? raw.seniority.join(', ') : undefined,
          category,
          salaryMin: typeof raw.minSalary === 'number' ? raw.minSalary : undefined,
          salaryMax: typeof raw.maxSalary === 'number' ? raw.maxSalary : undefined,
          salaryCurrency: raw.currency || 'USD',
          salaryPeriod: raw.salaryPeriod || 'annual',
          salaryFormatted: raw.minSalary && raw.maxSalary
            ? `$${raw.minSalary.toLocaleString()} - $${raw.maxSalary.toLocaleString()}`
            : undefined,
          description: SearchNormalizer.stripHtml(raw.description),
          excerpt: raw.excerpt || undefined,
          skills: Array.isArray(raw.categories) ? raw.categories : [],
          publishedAt: pubDateIso,
          fetchedAt,
          applicationUrl: raw.applicationLink,
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
    // Extract real organizations from live Himalayas listings
    const jobs = await this.searchJobs({ limit: 80 });
    const companyMap = new Map<string, NormalizedExternalCompany>();

    for (const job of jobs) {
      if (!job.companyName) continue;
      const key = job.companyName.trim().toLowerCase();
      const existing = companyMap.get(key);

      if (existing) {
        existing.openJobsCount += 1;
      } else {
        companyMap.set(key, {
          id: `org_him_${key.replace(/[^a-z0-9]/g, '_')}`,
          externalId: job.companySlug || key,
          sourceId: this.id,
          sourceName: this.name,
          sourceUrl: job.applicationUrl,
          name: job.companyName,
          logoUrl: job.companyLogoUrl,
          industry: job.category,
          description: `Organization actively hiring for ${job.title} and related positions.`,
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
