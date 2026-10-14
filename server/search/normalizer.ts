import * as crypto from 'crypto';
import { NormalizedExternalJob, NormalizedExternalCompany } from './types';

// Deterministic query normalization map
const QUERY_SYNONYM_MAP: Record<string, string> = {
  'softwear enginer': 'software engineer',
  'softwear engineer': 'software engineer',
  'software enginer': 'software engineer',
  'softwar engineer': 'software engineer',
  'react js': 'react',
  'react js dev': 'react developer',
  'react js developer': 'react developer',
  'reactjs': 'react',
  'node js': 'node.js',
  'nodejs': 'node.js',
  'ml engineer': 'machine learning engineer',
  'ai engineer': 'artificial intelligence engineer',
  'frontend': 'frontend developer',
  'front end': 'frontend developer',
  'backend': 'backend developer',
  'back end': 'backend developer',
  'fullstack': 'full stack developer',
  'full stack': 'full stack developer',
  'devops': 'devops engineer',
  'sre': 'site reliability engineer',
  'qa': 'qa engineer',
  'product design': 'product designer',
  'ui ux': 'ui/ux designer',
  'ui/ux': 'ui/ux designer',
};

export class SearchNormalizer {
  /**
   * Normalizes raw user query string deterministically.
   */
  static normalizeQuery(rawQuery?: string): string {
    if (!rawQuery) return '';
    const cleaned = rawQuery.trim().toLowerCase().replace(/\s+/g, ' ');
    return QUERY_SYNONYM_MAP[cleaned] || cleaned;
  }

  /**
   * Returns related queries for fallback when exact searches yield 0 results.
   */
  static getRelatedQueries(query: string): string[] {
    const normalized = this.normalizeQuery(query);
    const relatedMap: Record<string, string[]> = {
      'software engineer': ['software developer', 'full stack developer', 'backend developer', 'frontend developer'],
      'frontend developer': ['react developer', 'ui engineer', 'javascript developer', 'web developer'],
      'backend developer': ['node.js developer', 'python developer', 'golang developer', 'api engineer'],
      'full stack developer': ['software engineer', 'web developer', 'javascript engineer'],
      'devops engineer': ['cloud engineer', 'site reliability engineer', 'infrastructure engineer', 'platform engineer'],
      'machine learning engineer': ['ai engineer', 'data scientist', 'deep learning engineer'],
      'data scientist': ['data analyst', 'machine learning engineer', 'data engineer'],
      'product manager': ['technical product manager', 'product owner', 'program manager'],
      'ui/ux designer': ['product designer', 'ux researcher', 'ui designer'],
    };

    return relatedMap[normalized] || [];
  }

  /**
   * Strips HTML tags cleanly from descriptions.
   */
  static stripHtml(html?: string): string {
    if (!html) return '';
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&hellip;/g, '...')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Generates a deterministic hash for deduplication.
   */
  static generateFingerprint(company: string, title: string, location?: string): string {
    const norm = `${company.toLowerCase().trim()}_${title.toLowerCase().trim()}_${(location || 'remote').toLowerCase().trim()}`;
    return crypto.createHash('sha256').update(norm).digest('hex').slice(0, 24);
  }

  /**
   * Standardizes employment types.
   */
  static normalizeEmploymentType(raw?: string): string {
    if (!raw) return 'Full-time';
    const lower = raw.toLowerCase();
    if (lower.includes('part') || lower.includes('part-time')) return 'Part-time';
    if (lower.includes('contract') || lower.includes('freelance')) return 'Contract';
    if (lower.includes('intern')) return 'Internship';
    if (lower.includes('temporary') || lower.includes('temp')) return 'Temporary';
    return 'Full-time';
  }

  /**
   * Standardizes categories based on title & skills.
   */
  static inferCategory(title: string, categories?: string[], skills?: string[]): string {
    const text = `${title} ${(categories || []).join(' ')} ${(skills || []).join(' ')}`.toLowerCase();
    if (text.includes('data') || text.includes('machine learning') || text.includes('ai') || text.includes('analytics')) {
      return 'Data & AI';
    }
    if (text.includes('design') || text.includes('ui') || text.includes('ux') || text.includes('creative')) {
      return 'Design';
    }
    if (text.includes('devops') || text.includes('cloud') || text.includes('sre') || text.includes('infrastructure') || text.includes('security')) {
      return 'DevOps & Cloud';
    }
    if (text.includes('product') || text.includes('project manager') || text.includes('scrum')) {
      return 'Product';
    }
    if (text.includes('marketing') || text.includes('sales') || text.includes('growth') || text.includes('content')) {
      return 'Marketing';
    }
    return 'Engineering';
  }
}
