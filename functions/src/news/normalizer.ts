import { ParsedNewsArticle } from './parser';
import { CareerNewsDocument } from '../types/news';
import {
  generateNewsContentHash,
  generateNewsIdentityKey,
} from '../utils/hash';
import { classifyNewsRelevance, classifyNewsTaxonomy, normalizeIsoDate } from '../utils/normalize';

export interface NewsNormalizationContext {
  sourceId: string;
  sourceName: string;
  defaultSourceUrl?: string;
  defaultCategory?: string;
}

export class NewsNormalizer {
  /**
   * Transforms parsed news data into a normalized CareerNewsDocument.
   * Guarantees attribution/provenance, classifies category taxonomy, and computes deduplication hash.
   */
  static normalize(parsed: ParsedNewsArticle, context: NewsNormalizationContext): CareerNewsDocument {
    const now = new Date().toISOString();
    const publishedAt = normalizeIsoDate(parsed.publishedAt);

    const sourceUrl = parsed.sourceUrl || context.defaultSourceUrl || '';

    // Calculate content hash for deduplication
    const contentHash = generateNewsContentHash({
      title: parsed.title,
      sourceId: context.sourceId,
      sourceUrl,
    });

    // Calculate deterministic document ID
    const deterministicId = generateNewsIdentityKey(context.sourceId, parsed.guid || sourceUrl);

    // Classify into standardized CareerConnect taxonomy
    const classification = classifyNewsTaxonomy(
      parsed.title,
      parsed.summary,
      parsed.categories || [parsed.category],
      context.defaultCategory
    );
    const relevance = classifyNewsRelevance(parsed.title, parsed.summary, context.sourceName, parsed.categories || [parsed.category]);

    // Rough estimated reading time (avg 200 words/min)
    const wordCount = parsed.summary.split(/\s+/).filter(Boolean).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const normalized: CareerNewsDocument = {
      id: deterministicId,
      sourceId: context.sourceId,
      sourceName: context.sourceName,
      sourceUrl,
      title: parsed.title,
      summary: parsed.summary,
      thumbnailUrl: parsed.thumbnailUrl,
      category: classification.primaryCategory,
      tags: classification.tags,
      author: parsed.author,
      publishedAt,
      fetchedAt: now,
      contentHash,
      status: 'active',
      readingTimeMinutes,
      createdAt: now,
      updatedAt: now,
      relevanceScore: relevance.score,
      isRelevant: relevance.isRelevant,
    };

    // Firestore rejects explicit undefined values from providers without
    // optional thumbnails or author metadata.
    if (normalized.thumbnailUrl === undefined) delete normalized.thumbnailUrl;
    if (normalized.author === undefined) delete normalized.author;

    return normalized;
  }
}
