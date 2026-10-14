import {
  generateJobContentHash,
  generateJobIdentityKey,
} from '../src/utils/hash';

export function runContentHashingTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err) {
      results.push({ name, passed: false, error: err instanceof Error ? err.message : String(err) });
    }
  }

  test('should generate identical content hashes regardless of casing, punctuation, and extra whitespace', () => {
    const hash1 = generateJobContentHash({
      title: 'Senior Software Engineer (Full-Stack)',
      companyName: 'Stripe, Inc.',
      location: 'San Francisco, CA',
      sourceId: 'adzuna_us',
    });

    const hash2 = generateJobContentHash({
      title: '  senior software engineer  fullstack ',
      companyName: 'STRIPE INC',
      location: '  san francisco ca  ',
      sourceId: 'ADZUNA_US',
    });

    if (hash1 !== hash2) {
      throw new Error(`Content hashes should match for equivalent jobs:\n Hash1: ${hash1}\n Hash2: ${hash2}`);
    }
  });

  test('should generate distinct content hashes for different positions or companies', () => {
    const hashA = generateJobContentHash({
      title: 'Frontend Engineer',
      companyName: 'Google',
      location: 'Mountain View',
      sourceId: 'adzuna_us',
    });

    const hashB = generateJobContentHash({
      title: 'Backend Engineer',
      companyName: 'Google',
      location: 'Mountain View',
      sourceId: 'adzuna_us',
    });

    if (hashA === hashB) {
      throw new Error('Distinct jobs must produce different hashes');
    }
  });

  test('should generate deterministic source-scoped identity keys', () => {
    const key1 = generateJobIdentityKey('reed_uk', '123456');
    const key2 = generateJobIdentityKey('reed_uk', '123456');
    const key3 = generateJobIdentityKey('adzuna_uk', '123456');

    if (key1 !== key2) throw new Error('Same source and externalId must produce identical key');
    if (key1 === key3) throw new Error('Different sources must produce different keys even with same ID');
  });

  return results;
}
