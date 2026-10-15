import * as crypto from 'crypto';
import { externalJobRepository } from '../repositories/ExternalJobRepository';
import { jobSourceRepository } from '../repositories/JobSourceRepository';
import { syncLogRepository } from '../repositories/SyncLogRepository';
import { JobParser } from '../jobs/parser';
import { JobNormalizer } from '../jobs/normalizer';
import { JobSourceDocument, RawExternalJobInput } from '../types/job';
import { SyncResult, SyncStats, SyncErrorDetail } from '../types/sync';
import { logger } from '../utils/logger';
import { getEnvironmentConfig } from '../config/environment';

export interface JobSyncOptions {
  maxPages?: number;
  limitPerPage?: number;
}

export class JobAggregationService {
  /**
   * Runs end-to-end synchronization for all enabled job sources.
   */
  async syncAllEnabledSources(options?: JobSyncOptions): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    const sources = await jobSourceRepository.getEnabledSources();

    if (!sources.length) {
      logger.info('JobAggregationService: No enabled job sources found to synchronize.');
      return results;
    }

    logger.info(`JobAggregationService: Starting synchronization for ${sources.length} source(s).`);

    for (const source of sources) {
      try {
        const result = await this.syncSource(source, options);
        results.push(result);
      } catch (error) {
        logger.error(`JobAggregationService: Source ${source.id} failed catastrophically`, error);
      }
    }

    return results;
  }

  /**
   * Synchronizes a single job source by its ID.
   */
  async syncSpecificSource(sourceId: string, options?: JobSyncOptions): Promise<SyncResult> {
    await jobSourceRepository.ensureDefaultSources();
    const source = await jobSourceRepository.findById(sourceId);
    if (!source) {
      throw new Error(`Job source '${sourceId}' not found.`);
    }
    return this.syncSource(source, options);
  }

  /**
   * Synchronizes a single job source idempotently.
   */
  async syncSource(source: JobSourceDocument, options?: JobSyncOptions): Promise<SyncResult> {
    const executionId = `sync_job_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
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

    logger.info(`Starting job sync execution: ${executionId}`, {
      sourceId: source.id,
      sourceName: source.name,
      type: source.type,
      baseUrl: source.baseUrl,
    });

    try {
      // 1. Fetch raw data from provider (supporting cursor-based pagination for Himalayas)
      const rawRecords = await this.fetchRawSourceData(source, stats, options);
      stats.fetchedCount = rawRecords.length;

      // 2. Process and normalize each raw record
      for (const raw of rawRecords) {
        try {
          // Parse
          const parsed = JobParser.parse(raw, source.baseUrl || source.feedUrl);
          if (!parsed) {
            stats.errorCount++;
            stats.errors.push({
              phase: 'parse',
              message: 'Failed to parse record: missing required title or provenance url',
              timestamp: new Date().toISOString(),
            });
            continue;
          }

          // Normalize
          const normalized = JobNormalizer.normalize(parsed, {
            sourceId: source.id,
            sourceName: source.name,
            defaultSourceUrl: source.baseUrl,
          });

          // Deduplicate & Persist
          const upsertRes = await externalJobRepository.upsertJob(normalized);

          if (upsertRes.action === 'inserted') {
            stats.insertedCount++;
          } else if (upsertRes.action === 'updated') {
            stats.updatedCount++;
          } else {
            stats.duplicateCount++;
          }
        } catch (recordError) {
          stats.errorCount++;
          stats.errors.push({
            phase: 'persist',
            message: recordError instanceof Error ? recordError.message : String(recordError),
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Mark source sync status
      const completedAt = new Date().toISOString();
      const isSuccess = stats.errorCount === 0 || stats.insertedCount > 0 || stats.updatedCount > 0 || stats.duplicateCount > 0;
      await jobSourceRepository.updateSyncStatus(source.id, isSuccess, completedAt);

      const syncStatus = stats.errorCount === 0 ? 'success' : (stats.insertedCount > 0 || stats.updatedCount > 0 || stats.duplicateCount > 0) ? 'partial' : 'failure';

      const result: SyncResult = {
        executionId,
        sourceId: source.id,
        sourceType: 'job',
        startedAt,
        completedAt,
        durationMs: Date.now() - startTimeMs,
        status: syncStatus,
        stats,
      };

      // Record detailed sync log for audit & observability
      await syncLogRepository.createLog({
        id: executionId,
        sourceId: source.id,
        sourceType: 'job',
        startedAt,
        completedAt,
        status: syncStatus,
        fetchedCount: stats.fetchedCount,
        insertedCount: stats.insertedCount,
        updatedCount: stats.updatedCount,
        duplicateCount: stats.duplicateCount,
        expiredCount: stats.expiredCount,
        errorCount: stats.errorCount,
        errors: stats.errors.slice(0, 50), // Cap logged errors
        executionId,
        durationMs: result.durationMs,
      });

      logger.info(`Job sync execution completed: ${executionId}`, {
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
        message: `Catastrophic fetch failure: ${errMessage}`,
        timestamp: completedAt,
      });

      await jobSourceRepository.updateSyncStatus(source.id, false, completedAt);

      const result: SyncResult = {
        executionId,
        sourceId: source.id,
        sourceType: 'job',
        startedAt,
        completedAt,
        durationMs: Date.now() - startTimeMs,
        status: 'failure',
        stats,
      };

      await syncLogRepository.createLog({
        id: executionId,
        sourceId: source.id,
        sourceType: 'job',
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
   * Fetches raw payload from source endpoint.
   * Handles Himalayas cursor-based pagination and standard pagination safely.
   */
  private async fetchRawSourceData(
    source: JobSourceDocument,
    stats: SyncStats,
    options?: JobSyncOptions
  ): Promise<RawExternalJobInput[]> {
    const baseUrl = source.feedUrl || source.baseUrl;
    if (!baseUrl) {
      throw new Error(`Source ${source.id} has no valid URL configured.`);
    }

    const isHimalayas = source.id === 'himalayas' || baseUrl.includes('himalayas.app');
    const isJobicy = source.id === 'jobicy' || baseUrl.includes('jobicy.com');

    const limitPerPage = options?.limitPerPage || source.limitPerPage || 50;
    const maxPages = options?.maxPages || source.maxPagesPerRun || 2;

    const allRecords: RawExternalJobInput[] = [];

    // Adzuna uses a country/page path and app credentials as query parameters.
    if (source.id.startsWith('adzuna')) {
      const config = getEnvironmentConfig();
      if (!config.jobApiId || !config.jobApiKey) {
        throw new Error('Adzuna configuration is incomplete; set JOB_APP_ID/JOB_API_ID and JOB_APP_KEY/JOB_API_KEY.');
      }

      const country = source.id.split('_')[1] || 'us';
      const maxPages = options?.maxPages || source.maxPagesPerRun || 1;
      const limitPerPage = options?.limitPerPage || source.limitPerPage || 20;
      for (let page = 1; page <= maxPages; page++) {
        const baseUrl = config.jobApiBaseUrl || source.baseUrl;
        const url = new URL(`${baseUrl.replace(/\/$/, '')}/${country}/search/${page}`);
        url.searchParams.set('app_id', config.jobApiId);
        url.searchParams.set('app_key', config.jobApiKey);
        url.searchParams.set('results_per_page', String(Math.min(limitPerPage, 50)));
        url.searchParams.set('what', 'software');

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);
        try {
          const response = await fetch(url, {
            headers: { Accept: 'application/json', 'User-Agent': 'CareerConnect-Aggregator/2.0' },
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(`Adzuna HTTP ${response.status}: ${response.statusText}`);
          const payload = await response.json() as { results?: RawExternalJobInput[] };
          const pageRecords = Array.isArray(payload.results) ? payload.results : [];
          allRecords.push(...pageRecords);
          if (pageRecords.length === 0 || pageRecords.length < limitPerPage) break;
        } finally {
          clearTimeout(timeout);
        }
      }
      return allRecords;
    }

    // --- HIMALAYAS CURSOR-BASED PAGINATION ---
    if (isHimalayas) {
      let currentCursor: string | undefined = undefined;
      let pageCount = 0;

      while (pageCount < maxPages) {
        pageCount++;
        const url = new URL(baseUrl);
        url.searchParams.set('limit', String(limitPerPage));
        if (currentCursor) {
          url.searchParams.set('cursor', currentCursor);
        }

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 25000);

          const headers: Record<string, string> = {
            'Accept': 'application/json',
            'User-Agent': 'CareerConnect-Aggregator/2.0 (+https://careerconnect.app)',
          };

          const response = await fetch(url.toString(), {
            headers,
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = (await response.json()) as {
            jobs?: RawExternalJobInput[];
            nextCursor?: string;
            totalCount?: number;
          };

          const pageJobs = data?.jobs || [];
          allRecords.push(...pageJobs);

          logger.info(`Himalayas Page ${pageCount} fetched: ${pageJobs.length} jobs. (Next cursor: ${data.nextCursor ? 'present' : 'none'})`);

          // Stop if no next cursor or no jobs returned
          if (!data.nextCursor || pageJobs.length === 0) {
            break;
          }

          currentCursor = data.nextCursor;

          // Courtesy delay between pagination requests
          if (pageCount < maxPages) {
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
        } catch (pageErr) {
          const msg = pageErr instanceof Error ? pageErr.message : String(pageErr);
          stats.errors.push({
            sourceUrl: url.toString(),
            phase: 'fetch',
            message: `Himalayas page ${pageCount} fetch error: ${msg}`,
            timestamp: new Date().toISOString(),
          });
          logger.warn(`Himalayas fetch encountered error on page ${pageCount}: ${msg}`);
          // If we already have some records, preserve them rather than failing completely
          if (allRecords.length > 0) {
            break;
          } else {
            throw pageErr;
          }
        }
      }

      return allRecords;
    }

    // --- JOBICY API FETCHER ---
    if (isJobicy) {
      const url = new URL(baseUrl);
      url.searchParams.set('count', String(Math.min(limitPerPage, 50)));

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);

        const headers: Record<string, string> = {
          'Accept': 'application/json',
          'User-Agent': 'CareerConnect-Aggregator/2.0 (+https://careerconnect.app)',
        };

        const response = await fetch(url.toString(), {
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = (await response.json()) as {
          jobs?: RawExternalJobInput[];
          jobCount?: number;
        };

        return data?.jobs || [];
      } catch (fetchErr) {
        const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
        stats.errors.push({
          sourceUrl: url.toString(),
          phase: 'fetch',
          message: msg,
          timestamp: new Date().toISOString(),
        });
        throw fetchErr;
      }
    }

    // --- GENERIC API / FEED FETCHER ---
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const headers: Record<string, string> = {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'CareerConnect-Aggregator/2.0 (+https://careerconnect.app)',
      };

      const response = await fetch(baseUrl, {
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('json') || source.type === 'api') {
        const json = (await response.json()) as Record<string, unknown>;
        if (Array.isArray(json)) return json as RawExternalJobInput[];
        if (json && Array.isArray(json['jobs'])) return json['jobs'] as RawExternalJobInput[];
        if (json && Array.isArray(json['results'])) return json['results'] as RawExternalJobInput[];
        if (json && Array.isArray(json['data'])) return json['data'] as RawExternalJobInput[];
        return [];
      } else {
        await response.text();
        return [];
      }
    } catch (fetchErr) {
      const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      const detail: SyncErrorDetail = {
        sourceUrl: baseUrl,
        phase: 'fetch',
        message: msg,
        timestamp: new Date().toISOString(),
      };
      stats.errors.push(detail);
      throw fetchErr;
    }
  }
}

export const jobAggregationService = new JobAggregationService();
