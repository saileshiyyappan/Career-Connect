import * as crypto from 'crypto';

/**
 * Normalizes an input string by converting to lowercase, removing non-alphanumeric noise,
 * collapsing whitespace, and trimming.
 */
export function normalizeStringForHashing(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Computes a deterministic SHA-256 content hash for an external job posting.
 * Uses normalized title, company name, location, and source identifier.
 */
export function generateJobContentHash(params: {
  title: string;
  companyName: string;
  location: string;
  sourceId: string;
}): string {
  const normTitle = normalizeStringForHashing(params.title);
  const normCompany = normalizeStringForHashing(params.companyName);
  const normLocation = normalizeStringForHashing(params.location);
  const normSource = normalizeStringForHashing(params.sourceId);

  const payload = `${normTitle}|${normCompany}|${normLocation}|${normSource}`;
  return crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
}

/**
 * Computes a deterministic source-scoped identity key for an external job.
 */
export function generateJobIdentityKey(sourceId: string, externalId: string): string {
  const cleanSource = normalizeStringForHashing(sourceId);
  const cleanExtId = String(externalId).trim();
  const rawKey = `${cleanSource}::${cleanExtId}`;
  return crypto.createHash('sha256').update(rawKey, 'utf8').digest('hex');
}

/**
 * Computes a deterministic SHA-256 content hash for a career news article.
 * Uses normalized title, source identifier, and author/domain.
 */
export function generateNewsContentHash(params: {
  title: string;
  sourceId: string;
  sourceUrl?: string;
}): string {
  const normTitle = normalizeStringForHashing(params.title);
  const normSource = normalizeStringForHashing(params.sourceId);
  const normUrl = params.sourceUrl ? normalizeStringForHashing(params.sourceUrl.split('?')[0]) : '';

  const payload = `${normTitle}|${normSource}|${normUrl}`;
  return crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
}

/**
 * Computes a deterministic source-scoped identity key for a career news article.
 */
export function generateNewsIdentityKey(sourceId: string, guidOrUrl: string): string {
  const cleanSource = normalizeStringForHashing(sourceId);
  const cleanId = String(guidOrUrl).trim();
  const rawKey = `${cleanSource}::${cleanId}`;
  return crypto.createHash('sha256').update(rawKey, 'utf8').digest('hex');
}
