import { BaseSearchProvider } from './ProviderBase';
import { NormalizedExternalJob, NormalizedExternalCompany, JobSearchParams, CompanySearchParams } from '../types';
import { SearchNormalizer } from '../normalizer';

export class JobicyProvider extends BaseSearchProvider {
  id = 'jobicy';
  name = 'Jobicy';
  baseUrl = 'https://jobicy.com/api/v2/remote-jobs';
  attributionText = 'Via Jobicy';
  supportsCompanySearch = true;
  supportsJobSearch = true;
  supportsPagination = true;

  async searchJobs(params: JobSearchParams): Promise<NormalizedExternalJob[]> {
    const startTime = Date.now();
    const count = Math.min(params.limit || 50, 50);
    const url = new URL(this.baseUrl);
    url.searchParams.set('count', String(count));

    if (params.query) {
      const norm = SearchNormalizer.normalizeQuery(params.query);
      const tagCandidate = norm.split(/\s+/)[0];
      if (tagCandidate && tagCandidate.length > 2) {
        url.searchParams.set('tag', tagCandidate);
      }
    }

    if (params.location && params.location.toLowerCase().includes('usa')) {
      url.searchParams.set('geo', 'usa');
    } else if (params.location && params.location.toLowerCase().includes('apac')) {
      url.searchParams.set('geo', 'apac');
    }

    try {
      const res = await this.safeFetch(url.toString(), 12000);
      if (!res.ok) {
        throw new Error(`Jobicy returned HTTP ${res.status}: ${res.statusText}`);
      }

      const data = (await res.json()) as { jobs?: any[] };
      const rawJobs = data?.jobs || [];
      const fetchedAt = new Date().toISOString();

      const normalizedJobs: NormalizedExternalJob[] = [];

      for (const raw of rawJobs) {
        const title = raw.jobTitle || raw.title;
        const appUrl = raw.url || raw.jobExcerpt;
        if (!title || !appUrl || !raw.companyName) continue;

        const pubDateIso = raw.pubDate ? new Date(raw.pubDate).toISOString() : fetchedAt;
        const locationStr = raw.jobGeo || 'Remote';
        const category = SearchNormalizer.inferCategory(title, raw.jobIndustry ? [raw.jobIndustry] : []);

        const minSal = raw.annualSalaryMin ? Number(raw.annualSalaryMin) : undefined;
        const maxSal = raw.annualSalaryMax ? Number(raw.annualSalaryMax) : undefined;

        normalizedJobs.push({
          id: `ext_jobicy_${SearchNormalizer.generateFingerprint(raw.companyName || '', title, locationStr)}`,
          externalId: String(raw.id || appUrl),
          sourceId: this.id,
          sourceName: this.name,
          sourceUrl: appUrl,
          title,
          companyName: raw.companyName,
          companyLogoUrl: raw.companyLogo || undefined,
          location: locationStr,
          isRemote: true,
          employmentType: SearchNormalizer.normalizeEmploymentType(Array.isArray(raw.jobType) ? raw.jobType.join(', ') : raw.jobType),
          experienceLevel: raw.jobLevel || undefined,
          category,
          salaryMin: !isNaN(Number(minSal)) ? minSal : undefined,
          salaryMax: !isNaN(Number(maxSal)) ? maxSal : undefined,
          salaryCurrency: raw.salaryCurrency || 'USD',
          salaryPeriod: 'yearly',
          salaryFormatted: minSal && maxSal ? `$${minSal.toLocaleString()} - $${maxSal.toLocaleString()}` : undefined,
          description: SearchNormalizer.stripHtml(raw.jobDescription || raw.jobExcerpt),
          excerpt: raw.jobExcerpt ? SearchNormalizer.stripHtml(raw.jobExcerpt) : undefined,
          skills: raw.jobTags || [],
          publishedAt: raw.pubDate ? pubDateIso : '',
          fetchedAt,
          applicationUrl: appUrl,
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
          id: `org_jbc_${key.replace(/[^a-z0-9]/g, '_')}`,
          externalId: key,
          sourceId: this.id,
          sourceName: this.name,
          sourceUrl: job.applicationUrl,
          name: job.companyName,
          logoUrl: job.companyLogoUrl,
          industry: job.category,
          description: `Organization actively hiring for ${job.title} and related roles.`,
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
