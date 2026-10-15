import { JobParser } from '../src/jobs/parser';
import { JobNormalizer } from '../src/jobs/normalizer';
import { RawExternalJobInput } from '../src/types/job';

export function runJobNormalizationTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err) {
      results.push({ name, passed: false, error: err instanceof Error ? err.message : String(err) });
    }
  }

  test('should parse raw job with various key formats and normalize employment & experience', () => {
    const raw: RawExternalJobInput = {
      id: 'job-12345',
      title: '  Senior Full-Stack TypeScript Engineer  ',
      company: { name: 'Acme Technologies Ltd.', logo: 'https://example.com/logo.png' },
      location: { city: 'San Francisco', area: ['CA', 'USA'] },
      employment_type: 'full_time',
      experience_level: 'senior',
      salary: { min: 140000, max: 180000, currency: 'USD', period: 'yearly' },
      description: '<p>Join our team building <b>high-scale</b> apps.</p>',
      responsibilities: ['Architect microservices', 'Mentor junior engineers'],
      requirements: ['TypeScript', 'React', 'Node.js', 'Firestore'],
      skills: ['TypeScript', 'React', 'Cloud Functions'],
      tags: ['TypeScript', 'NodeJS', 'Fullstack'],
      url: 'https://careers.acme.com/jobs/12345',
      remote: true,
      published_at: '2026-08-15T12:00:00Z',
    };

    const parsed = JobParser.parse(raw);
    if (!parsed) throw new Error('JobParser failed to parse valid job');
    if (parsed.title !== 'Senior Full-Stack TypeScript Engineer') throw new Error(`Incorrect title: ${parsed.title}`);
    if (parsed.companyName !== 'Acme Technologies Ltd.') throw new Error(`Incorrect company: ${parsed.companyName}`);
    if (parsed.sourceUrl !== 'https://careers.acme.com/jobs/12345') throw new Error(`Incorrect sourceUrl: ${parsed.sourceUrl}`);
    if (!parsed.isRemote) throw new Error('Failed to detect remote flag');

    const normalized = JobNormalizer.normalize(parsed, {
      sourceId: 'adzuna_us',
      sourceName: 'Adzuna US',
      defaultSourceUrl: 'https://adzuna.com',
    });

    if (normalized.employmentType !== 'Full-time') throw new Error(`Expected Full-time, got ${normalized.employmentType}`);
    if (normalized.experienceLevel !== 'Senior') throw new Error(`Expected Senior, got ${normalized.experienceLevel}`);
    if (normalized.sourceName !== 'Adzuna US') throw new Error('Provenance sourceName missing or altered');
    if (!normalized.contentHash || normalized.contentHash.length !== 64) throw new Error('Valid 64-char SHA-256 contentHash missing');
    if (!normalized.id) throw new Error('Deterministic ID missing');
    if (normalized.status !== 'active') throw new Error('Initial status must be active');
    if (normalized.skills.length < 3) throw new Error('Skills not normalized properly');
  });

  test('should reject invalid or malformed job records lacking required provenance or title', () => {
    const missingTitle: RawExternalJobInput = {
      id: 'job-999',
      company: 'Tech Corp',
      url: 'https://example.com/job/999',
    };
    const res1 = JobParser.parse(missingTitle);
    if (res1 !== null) throw new Error('Should reject job with missing title');

    const missingUrl: RawExternalJobInput = {
      id: 'job-999',
      title: 'Software Developer',
      company: 'Tech Corp',
      url: 'ftp://invalid-url', // not http
    };
    const res2 = JobParser.parse(missingUrl);
    if (res2 !== null) throw new Error('Should reject job with invalid protocol/url');
  });

  return results;
}
