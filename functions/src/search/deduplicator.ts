import { NormalizedExternalJob, NormalizedExternalCompany } from './types';
import { SearchNormalizer } from './normalizer';

export class SearchDeduplicator {
  static deduplicateJobs(jobs: NormalizedExternalJob[]): NormalizedExternalJob[] {
    const seenExternalIds = new Set<string>();
    const seenFingerprints = new Set<string>();
    const uniqueJobs: NormalizedExternalJob[] = [];

    for (const job of jobs) {
      const externalKey = `${job.sourceId}:${job.externalId}`;
      const fingerprint = SearchNormalizer.generateFingerprint(job.companyName, job.title, job.location);

      if (seenExternalIds.has(externalKey) || seenFingerprints.has(fingerprint)) {
        continue;
      }

      seenExternalIds.add(externalKey);
      seenFingerprints.add(fingerprint);
      uniqueJobs.push(job);
    }

    return uniqueJobs;
  }

  /**
   * Deduplicates and aggregates companies across directories and job feeds.
   */
  static deduplicateCompanies(companies: NormalizedExternalCompany[]): NormalizedExternalCompany[] {
    const map = new Map<string, NormalizedExternalCompany>();

    for (const comp of companies) {
      // Key by clean domain if available or normalized name
      const cleanName = comp.name.trim().toLowerCase().replace(/^(the|a)\s+/i, '');
      const domain = (comp.website || comp.websiteUrl || '')
        .replace(/^https?:\/\//i, '')
        .replace(/^www\./i, '')
        .split('/')[0]
        .toLowerCase();

      const key = domain ? `dom:${domain}` : `name:${cleanName}`;
      const existing = map.get(key) || map.get(`name:${cleanName}`);

      if (!existing) {
        map.set(key, { ...comp });
        if (domain && !map.has(`name:${cleanName}`)) {
          map.set(`name:${cleanName}`, map.get(key)!);
        }
      } else {
        // Merge attributes carefully
        existing.openJobsCount = (existing.openJobsCount || 0) + (comp.openJobsCount || 0);
        if (!existing.logoUrl && comp.logoUrl) existing.logoUrl = comp.logoUrl;
        if (!existing.website && (comp.website || comp.websiteUrl)) {
          existing.website = comp.website || comp.websiteUrl;
          existing.websiteUrl = comp.websiteUrl || comp.website;
        }
        if (!existing.legalName && comp.legalName) existing.legalName = comp.legalName;
        if ((!existing.description || existing.description.length < (comp.description || '').length) && comp.description) {
          existing.description = comp.description;
        }
        if ((!existing.industry || existing.industry === 'Enterprise & Technology') && comp.industry) {
          existing.industry = comp.industry;
        }
        if ((!existing.headquarters || existing.headquarters === 'Global' || existing.headquarters === 'Remote') && comp.headquarters) {
          existing.headquarters = comp.headquarters;
        }
        if (comp.verified) {
          existing.verified = true;
          existing.companyOrigin = 'CareerConnect Verified Employer';
        }
      }
    }

    // Return unique company instances
    const uniqueInstances = new Set<NormalizedExternalCompany>(map.values());
    return Array.from(uniqueInstances);
  }
}
