import { NormalizedExternalJob, NormalizedExternalCompany, JobSearchParams, CompanySearchParams } from './types';
import { SearchNormalizer } from './normalizer';

export class SearchRanking {
  static rankJobs(jobs: NormalizedExternalJob[], params: JobSearchParams): NormalizedExternalJob[] {
    const rawQuery = params.query ? SearchNormalizer.normalizeQuery(params.query) : '';
    const queryTerms = rawQuery ? rawQuery.split(/\s+/).filter(Boolean) : [];
    const locationQuery = params.location ? params.location.toLowerCase().trim() : '';
    const companyQuery = params.company ? params.company.toLowerCase().trim() : '';

    return jobs
      .map((job) => {
        let score = 10;
        const titleLower = job.title.toLowerCase();
        const companyLower = job.companyName.toLowerCase();
        const locationLower = job.location.toLowerCase();
        const descLower = (job.excerpt || job.description || '').toLowerCase();
        const skillsLower = (job.skills || []).map((s) => s.toLowerCase());

        if (rawQuery && titleLower.includes(rawQuery)) {
          score += 50;
          if (titleLower === rawQuery) score += 30;
        }

        for (const term of queryTerms) {
          if (titleLower.includes(term)) score += 15;
          if (companyLower.includes(term)) score += 10;
          if (skillsLower.includes(term)) score += 8;
          if (descLower.includes(term)) score += 3;
        }

        if (companyQuery && companyLower.includes(companyQuery)) {
          score += 40;
          if (companyLower === companyQuery) score += 20;
        }

        if (locationQuery) {
          if (locationQuery.includes('remote') && job.isRemote) {
            score += 25;
          } else if (locationLower.includes(locationQuery)) {
            score += 25;
          }
        }

        if (params.category && params.category !== 'All') {
          if (job.category.toLowerCase() === params.category.toLowerCase()) {
            score += 15;
          }
        }

        if (params.type && params.type !== 'All') {
          if (job.employmentType.toLowerCase() === params.type.toLowerCase()) {
            score += 10;
          }
        }

        if (job.publishedAt) {
          const ageHours = (Date.now() - new Date(job.publishedAt).getTime()) / (1000 * 60 * 60);
          if (ageHours < 48) score += 15;
          else if (ageHours < 168) score += 8;
        }

        return { ...job, score };
      })
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  /**
   * Scores and ranks a company list based on company search query:
   * Exact name > Prefix > Partial name > Domain > Industry/Description match
   */
  static rankCompanies(companies: NormalizedExternalCompany[], params: CompanySearchParams): NormalizedExternalCompany[] {
    const rawQuery = params.query ? SearchNormalizer.normalizeQuery(params.query) : '';
    const queryTerms = rawQuery ? rawQuery.split(/\s+/).filter(Boolean) : [];

    return companies
      .map((company) => {
        let score = 5;
        const nameLower = company.name.toLowerCase();
        const industryLower = (company.industry || '').toLowerCase();
        const descLower = (company.description || '').toLowerCase();
        const hqLower = (company.headquarters || '').toLowerCase();
        const websiteLower = (company.website || company.websiteUrl || '').toLowerCase();

        if (rawQuery) {
          if (nameLower === rawQuery) {
            score += 120; // 1. Exact name match
          } else if (nameLower.startsWith(rawQuery)) {
            score += 70; // 2. Prefix match
          } else if (nameLower.includes(rawQuery)) {
            score += 40; // 3. Substring match
          } else if (websiteLower.includes(rawQuery)) {
            score += 30; // Domain match
          }
        }

        for (const term of queryTerms) {
          if (nameLower.includes(term)) score += 15;
          if (industryLower.includes(term)) score += 8;
          if (hqLower.includes(term)) score += 6;
          if (descLower.includes(term)) score += 4;
        }

        // Verified boost
        if (company.verified) score += 30;

        // Open jobs boost (active hiring)
        score += Math.min(company.openJobsCount * 2, 15);

        return { ...company, score };
      })
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }
}
