import { JobParser } from '../src/jobs/parser';
import { JobNormalizer } from '../src/jobs/normalizer';
import { RawExternalJobInput } from '../src/types/job';

export function runHimalayasTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err) {
      results.push({ name, passed: false, error: err instanceof Error ? err.message : String(err) });
    }
  }

  test('should parse and normalize real Himalayas API response with epoch timestamps and cursor pagination schema', () => {
    // Real schema sample from Himalayas API: https://himalayas.app/jobs/api
    const himalayasRaw: RawExternalJobInput = {
      title: 'Senior Frontend Engineer (React / TypeScript)',
      companyName: 'Linear Technologies',
      companyLogo: 'https://cdn.himalayas.app/company-logos/linear.png',
      applicationLink: 'https://himalayas.app/companies/linear/jobs/senior-frontend-engineer-react-typescript',
      guid: 'https://himalayas.app/companies/linear/jobs/senior-frontend-engineer-react-typescript',
      pubDate: 1735689600, // Unix epoch seconds
      expiryDate: 1767225600,
      description: '<p>Linear is looking for a Senior Frontend Engineer to build high-performance interfaces.</p>',
      locationRestrictions: ['Worldwide', 'Americas', 'Europe'],
      employmentType: 'Full-time',
      seniority: ['Senior'],
      minSalary: 160000,
      maxSalary: 210000,
      currency: 'USD',
      salaryPeriod: 'yearly',
      categories: ['Engineering', 'Frontend'],
      parentCategories: ['Software Development'],
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    };

    const parsed = JobParser.parse(himalayasRaw, 'https://himalayas.app/jobs/api');
    if (!parsed) throw new Error('JobParser returned null for valid Himalayas payload');

    if (parsed.title !== 'Senior Frontend Engineer (React / TypeScript)') {
      throw new Error(`Unexpected title: ${parsed.title}`);
    }
    if (parsed.companyName !== 'Linear Technologies') {
      throw new Error(`Unexpected companyName: ${parsed.companyName}`);
    }
    if (parsed.companyLogo !== 'https://cdn.himalayas.app/company-logos/linear.png') {
      throw new Error(`Unexpected companyLogo: ${parsed.companyLogo}`);
    }
    if (parsed.sourceUrl !== 'https://himalayas.app/companies/linear/jobs/senior-frontend-engineer-react-typescript') {
      throw new Error(`Unexpected sourceUrl: ${parsed.sourceUrl}`);
    }
    if (parsed.externalId !== 'https://himalayas.app/companies/linear/jobs/senior-frontend-engineer-react-typescript') {
      throw new Error(`Unexpected externalId: ${parsed.externalId}`);
    }
    if (!parsed.isRemote) {
      throw new Error('Expected isRemote to be true for Himalayas');
    }

    const normalized = JobNormalizer.normalize(parsed, {
      sourceId: 'himalayas',
      sourceName: 'Himalayas',
      defaultSourceUrl: 'https://himalayas.app/jobs/api',
    });

    if (normalized.jobOrigin !== 'external') {
      throw new Error(`Expected jobOrigin to be 'external', got '${normalized.jobOrigin}'`);
    }
    if (normalized.sourceId !== 'himalayas') {
      throw new Error(`Expected sourceId to be 'himalayas', got '${normalized.sourceId}'`);
    }
    if (normalized.sourceName !== 'Himalayas') {
      throw new Error(`Expected sourceName to be 'Himalayas', got '${normalized.sourceName}'`);
    }
    if (normalized.sourceUrl !== 'https://himalayas.app/companies/linear/jobs/senior-frontend-engineer-react-typescript') {
      throw new Error(`Source attribution URL altered: ${normalized.sourceUrl}`);
    }
    if (normalized.employmentType !== 'Full-time') {
      throw new Error(`Expected Full-time, got ${normalized.employmentType}`);
    }
    if (normalized.experienceLevel !== 'Senior') {
      throw new Error(`Expected Senior, got ${normalized.experienceLevel}`);
    }
    if (!normalized.publishedAt.startsWith('2025-') && !normalized.publishedAt.startsWith('2024-') && !normalized.publishedAt.startsWith('2026-')) {
      throw new Error(`PublishedAt was not properly converted from epoch to ISO date string: ${normalized.publishedAt}`);
    }
    if (!normalized.contentHash || normalized.contentHash.length !== 64) {
      throw new Error('Expected 64-character SHA-256 contentHash');
    }
    if (!normalized.id || typeof normalized.id !== 'string' || normalized.id.length < 16) {
      throw new Error(`Expected valid deterministic ID, got ${normalized.id}`);
    }
    if (normalized.salary?.min !== 160000 || normalized.salary?.max !== 210000) {
      throw new Error(`Salary normalization failed: ${JSON.stringify(normalized.salary)}`);
    }
    if (!normalized.skills.includes('React') || !normalized.skills.includes('TypeScript')) {
      throw new Error('Skills extraction failed for Himalayas categories/skills');
    }
  });

  test('should ensure deterministic idempotency on consecutive runs with the same Himalayas listing', () => {
    const rawListing: RawExternalJobInput = {
      title: 'Staff Backend Architect (Go / Distributed Systems)',
      companyName: 'CloudScale Inc',
      applicationLink: 'https://himalayas.app/companies/cloudscale/jobs/staff-backend-architect',
      guid: 'cloudscale-staff-backend-architect-101',
      pubDate: 1735000000,
      description: 'Design robust distributed backend architectures.',
      locationRestrictions: ['Worldwide (Remote)'],
    };

    const parsed1 = JobParser.parse(rawListing);
    const parsed2 = JobParser.parse(rawListing);

    if (!parsed1 || !parsed2) throw new Error('Parsing failed');

    const norm1 = JobNormalizer.normalize(parsed1, { sourceId: 'himalayas', sourceName: 'Himalayas' });
    const norm2 = JobNormalizer.normalize(parsed2, { sourceId: 'himalayas', sourceName: 'Himalayas' });

    if (norm1.id !== norm2.id) {
      throw new Error(`Deterministic ID mismatch between sync runs: ${norm1.id} vs ${norm2.id}`);
    }
    if (norm1.contentHash !== norm2.contentHash) {
      throw new Error(`Content hash mismatch between sync runs: ${norm1.contentHash} vs ${norm2.contentHash}`);
    }
  });

  return results;
}
