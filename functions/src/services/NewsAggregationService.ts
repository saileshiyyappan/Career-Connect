import * as crypto from 'crypto';
import { careerNewsRepository } from '../repositories/CareerNewsRepository';
import { newsSourceRepository } from '../repositories/NewsSourceRepository';
import { syncLogRepository } from '../repositories/SyncLogRepository';
import { NewsParser } from '../news/parser';
import { NewsNormalizer } from '../news/normalizer';
import { NewsSourceDocument, RawNewsArticleInput } from '../types/news';
import { SyncResult, SyncStats } from '../types/sync';
import { logger } from '../utils/logger';
import { getEnvironmentConfig } from '../config/environment';
import { classifyNewsRelevance } from '../utils/normalize';

export class NewsAggregationService {
  /**
   * Runs end-to-end synchronization for all enabled news sources.
   */
  async syncAllEnabledSources(): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    const sources = await newsSourceRepository.getEnabledSources();

    if (!sources.length) {
      logger.info('NewsAggregationService: No enabled news sources found to synchronize.');
      return results;
    }

    logger.info(`NewsAggregationService: Starting synchronization for ${sources.length} sources.`);

    for (const source of sources) {
      try {
        const result = await this.syncSource(source);
        results.push(result);
      } catch (error) {
        logger.error(`NewsAggregationService: Source ${source.id} failed catastrophically`, error);
      }
    }

    return results;
  }

  /**
   * Synchronizes a single targeted news source by its ID.
   */
  async syncSpecificSource(sourceId: string): Promise<SyncResult> {
    await newsSourceRepository.ensureDefaultSources();
    const source = await newsSourceRepository.findById(sourceId);
    if (!source) {
      throw new Error(`News source with ID '${sourceId}' not found.`);
    }
    return this.syncSource(source);
  }

  /**
   * Synchronizes a single news / RSS feed source idempotently.
   */
  async syncSource(source: NewsSourceDocument): Promise<SyncResult> {
    const executionId = `sync_news_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const startedAt = new Date().toISOString();
    const startTimeMs = Date.now();

    const stats: SyncStats = {
      fetchedCount: 0,
      insertedCount: 0,
      updatedCount: 0,
      duplicateCount: 0,
      expiredCount: 0,
      errorCount: 0,
      errors: [],
    };

    logger.info(`Starting news sync execution: ${executionId}`, {
      sourceId: source.id,
      sourceName: source.name,
      type: source.type,
    });

    try {
      // 1. Fetch raw feed data
      const rawArticles = await this.fetchRawFeedData(source, stats);
      stats.fetchedCount = rawArticles.length;

      // 2. Parse, normalize and persist each article
      for (const raw of rawArticles) {
        try {
          const parsed = NewsParser.parseRawArticle(raw, source.feedUrl);
          if (!parsed) {
            stats.errorCount++;
            stats.errors.push({
              phase: 'parse',
              message: 'Failed to parse news item: missing required title or sourceUrl',
              timestamp: new Date().toISOString(),
            });
            continue;
          }

          const relevance = classifyNewsRelevance(parsed.title, parsed.summary, source.name, parsed.categories || [parsed.category]);
          if (!relevance.isRelevant) {
            stats.rejectedCount = (stats.rejectedCount || 0) + 1;
            continue;
          }

          const normalized = NewsNormalizer.normalize(parsed, {
            sourceId: source.id,
            sourceName: source.name,
            defaultSourceUrl: source.feedUrl,
            defaultCategory: source.categories?.[0] || 'Career & Industry',
          });

          const upsertRes = await careerNewsRepository.upsertNews(normalized);

          if (upsertRes.action === 'inserted') {
            stats.insertedCount++;
          } else if (upsertRes.action === 'updated') {
            stats.updatedCount++;
          } else {
            stats.duplicateCount++;
          }
        } catch (itemErr) {
          stats.errorCount++;
          stats.errors.push({
            phase: 'persist',
            message: itemErr instanceof Error ? itemErr.message : String(itemErr),
            timestamp: new Date().toISOString(),
          });
        }
      }

      const completedAt = new Date().toISOString();
      const isSuccess = stats.errorCount === 0 || stats.insertedCount > 0 || stats.updatedCount > 0;
      await newsSourceRepository.updateSyncStatus(source.id, isSuccess, completedAt);

      const syncStatus = stats.errorCount === 0 ? 'success' : stats.insertedCount > 0 ? 'partial' : 'failure';

      const result: SyncResult = {
        executionId,
        sourceId: source.id,
        sourceType: 'news',
        startedAt,
        completedAt,
        durationMs: Date.now() - startTimeMs,
        status: syncStatus,
        stats,
      };

      await syncLogRepository.createLog({
        id: executionId,
        sourceId: source.id,
        sourceType: 'news',
        startedAt,
        completedAt,
        status: syncStatus,
        fetchedCount: stats.fetchedCount,
        insertedCount: stats.insertedCount,
        updatedCount: stats.updatedCount,
        duplicateCount: stats.duplicateCount,
        expiredCount: stats.expiredCount,
        errorCount: stats.errorCount,
        errors: stats.errors.slice(0, 50),
        executionId,
        durationMs: result.durationMs,
      });

      logger.info(`News sync execution completed: ${executionId}`, {
        sourceId: source.id,
        status: syncStatus,
        inserted: stats.insertedCount,
        updated: stats.updatedCount,
        duplicates: stats.duplicateCount,
        errors: stats.errorCount,
      });

      return result;
    } catch (sourceError) {
      const completedAt = new Date().toISOString();
      const errMessage = sourceError instanceof Error ? sourceError.message : String(sourceError);

      stats.errorCount++;
      stats.errors.push({
        phase: 'fetch',
        message: `Catastrophic news fetch failure: ${errMessage}`,
        timestamp: completedAt,
      });

      await newsSourceRepository.updateSyncStatus(source.id, false, completedAt);

      const result: SyncResult = {
        executionId,
        sourceId: source.id,
        sourceType: 'news',
        startedAt,
        completedAt,
        durationMs: Date.now() - startTimeMs,
        status: 'failure',
        stats,
      };

      await syncLogRepository.createLog({
        id: executionId,
        sourceId: source.id,
        sourceType: 'news',
        startedAt,
        completedAt,
        status: 'failure',
        fetchedCount: stats.fetchedCount,
        insertedCount: stats.insertedCount,
        updatedCount: stats.updatedCount,
        duplicateCount: stats.duplicateCount,
        expiredCount: stats.expiredCount,
        errorCount: stats.errorCount,
        errors: stats.errors,
        executionId,
        durationMs: result.durationMs,
      });

      return result;
    }
  }

  /**
   * Fetches RSS/Atom XML or JSON API feed data.
   */
  private async fetchRawFeedData(
    source: NewsSourceDocument,
    stats: SyncStats
  ): Promise<RawNewsArticleInput[]> {
    if (!source.feedUrl) {
      throw new Error(`News source ${source.id} has no feedUrl configured.`);
    }

    if (source.id === 'newsapi') {
      const config = getEnvironmentConfig();
      if (!config.newsApiKey) {
        throw new Error('NewsAPI configuration is incomplete; set NEWS_API_KEY.');
      }

      const configuredBaseUrl = config.newsApiBaseUrl || source.feedUrl;
      const url = new URL(configuredBaseUrl);
      if (!url.pathname.endsWith('/top-headlines')) {
        url.pathname = `${url.pathname.replace(/\/$/, '')}/top-headlines`;
      }
      url.searchParams.set('country', 'us');
      url.searchParams.set('pageSize', '50');
      // NewsAPI's top-headlines endpoint is more reliable with a bounded
      // technology category than a long OR query; the relevance classifier
      // remains the authoritative acceptance gate.
      url.searchParams.set('category', 'technology');
      url.searchParams.set('apiKey', config.newsApiKey);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      try {
        const response = await fetch(url, {
          headers: { Accept: 'application/json', 'User-Agent': 'CareerConnect-News-Aggregator/2.0' },
          signal: controller.signal,
        });
        const payload = await response.json() as { status?: string; code?: string; message?: string; articles?: RawNewsArticleInput[] };
        if (!response.ok || payload.status === 'error') {
          throw new Error(`NewsAPI HTTP ${response.status}: ${payload.code || payload.message || response.statusText}`);
        }
        return Array.isArray(payload.articles) ? payload.articles : [];
      } finally {
        clearTimeout(timeout);
      }
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const headers: Record<string, string> = {
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, application/json, text/plain, */*',
        'User-Agent': 'CareerConnect-News-Aggregator/2.0 (+https://careerconnect.app)',
      };

      const response = await fetch(source.feedUrl, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();

      // Check if it's JSON or XML
      if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
        try {
          const json = JSON.parse(text);
          if (Array.isArray(json)) return json;
          if (json.articles && Array.isArray(json.articles)) return json.articles;
          if (json.items && Array.isArray(json.items)) return json.items;
          return [];
        } catch {
          // If JSON parse fails, fall through to XML parsing
        }
      }

      // Parse as RSS/Atom XML
      return NewsParser.parseXmlFeed(text);
    } catch (fetchErr) {
      const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      stats.errors.push({
        sourceUrl: source.feedUrl,
        phase: 'fetch',
        message: msg,
        timestamp: new Date().toISOString(),
      });
      throw fetchErr;
    }
  }
}

export const newsAggregationService = new NewsAggregationService();
