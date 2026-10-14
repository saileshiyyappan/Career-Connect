import { onSchedule, ScheduledEvent } from 'firebase-functions/v2/scheduler';
import { onCall, CallableRequest, HttpsError } from 'firebase-functions/v2/https';
import { jobAggregationService } from './services/JobAggregationService';
import { newsAggregationService } from './services/NewsAggregationService';
import { adminDb } from './config/firebase';
import { logger } from './utils/logger';

// Re-export all domain modules, services, types & utilities
export * from './types';
export * from './utils/hash';
export * from './utils/normalize';
export * from './utils/logger';
export * from './jobs/parser';
export * from './jobs/normalizer';
export * from './news/parser';
export * from './news/normalizer';
export * from './repositories/ExternalJobRepository';
export * from './repositories/CareerNewsRepository';
export * from './repositories/JobSourceRepository';
export * from './repositories/NewsSourceRepository';
export * from './repositories/SyncLogRepository';
export * from './repositories/ServerNotificationRepository';
export * from './services/JobAggregationService';
export * from './services/NewsAggregationService';
export * from './services/ServerNotificationService';

/**
 * 2nd Generation Cloud Function: Scheduled Daily External Job Aggregation
 * Runs daily at 02:00 UTC to synchronize all active external job sources.
 */
export const scheduledDailyJobAggregation = onSchedule(
  {
    schedule: '0 2 * * *',
    timeZone: 'UTC',
    memory: '512MiB',
    timeoutSeconds: 540,
    retryCount: 1,
  },
  async (event: ScheduledEvent) => {
    logger.info('Scheduled job aggregation triggered', { jobName: event.jobName, scheduleTime: event.scheduleTime });
    try {
      const results = await jobAggregationService.syncAllEnabledSources();
      logger.info('Scheduled job aggregation finished successfully', {
        sourcesProcessed: results.length,
      });
    } catch (error) {
      logger.error('Scheduled job aggregation encountered an error', error);
      throw error;
    }
  }
);

/**
 * 2nd Generation Cloud Function: Scheduled Daily Career News Aggregation
 * Runs daily at 03:00 UTC to synchronize all active RSS and API news feeds.
 */
export const scheduledDailyNewsAggregation = onSchedule(
  {
    schedule: '0 3 * * *',
    timeZone: 'UTC',
    memory: '512MiB',
    timeoutSeconds: 540,
    retryCount: 1,
  },
  async (event: ScheduledEvent) => {
    logger.info('Scheduled news aggregation triggered', { jobName: event.jobName, scheduleTime: event.scheduleTime });
    try {
      const results = await newsAggregationService.syncAllEnabledSources();
      logger.info('Scheduled news aggregation finished successfully', {
        sourcesProcessed: results.length,
      });
    } catch (error) {
      logger.error('Scheduled news aggregation encountered an error', error);
      throw error;
    }
  }
);

/**
 * 2nd Generation Cloud Function: Admin Manual Job Sync Trigger
 * Allows authenticated administrators to manually initiate job synchronization.
 */
export const triggerJobSync = onCall(
  {
    memory: '512MiB',
    timeoutSeconds: 300,
  },
  async (request: CallableRequest) => {
    // 1. Verify Authentication & Admin Role
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated to invoke synchronization.');
    }

    const userId = request.auth.uid;
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== 'admin') {
      throw new HttpsError('permission-denied', 'Only platform administrators can trigger manual synchronization.');
    }

    logger.info(`Manual job sync requested by admin ${userId}`);

    try {
      const results = await jobAggregationService.syncAllEnabledSources();
      return {
        success: true,
        message: `Synchronized ${results.length} job source(s).`,
        results,
      };
    } catch (error) {
      logger.error('Manual job sync trigger failed', error);
      throw new HttpsError('internal', 'Job synchronization failed during execution.');
    }
  }
);

/**
 * 2nd Generation Cloud Function: Explicit syncExternalJobsManual Callable
 * Allows authenticated administrators/developers to trigger manual job sync with custom parameters.
 */
export const syncExternalJobsManual = onCall(
  {
    memory: '512MiB',
    timeoutSeconds: 300,
  },
  async (request: CallableRequest<{ sourceId?: string; limitPerPage?: number; maxPages?: number }>) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated to invoke manual synchronization.');
    }

    const userId = request.auth.uid;
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== 'admin') {
      throw new HttpsError('permission-denied', 'Only platform administrators can trigger manual synchronization.');
    }

    const { sourceId, limitPerPage, maxPages } = request.data || {};
    logger.info(`Explicit syncExternalJobsManual invoked by admin ${userId}`, { sourceId, limitPerPage, maxPages });

    try {
      if (sourceId) {
        const result = await jobAggregationService.syncSpecificSource(sourceId, { limitPerPage, maxPages });
        return {
          success: true,
          message: `Synchronized source ${sourceId} successfully.`,
          results: [result],
        };
      }

      const results = await jobAggregationService.syncAllEnabledSources({ limitPerPage, maxPages });
      return {
        success: true,
        message: `Synchronized ${results.length} enabled job source(s).`,
        results,
      };
    } catch (error) {
      logger.error('syncExternalJobsManual failed', error);
      throw new HttpsError('internal', `Job synchronization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
);

/**
 * 2nd Generation Cloud Function: Admin Manual News Sync Trigger
 * Allows authenticated administrators to manually initiate news synchronization.
 */
export const triggerNewsSync = onCall(
  {
    memory: '512MiB',
    timeoutSeconds: 300,
  },
  async (request: CallableRequest) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated to invoke synchronization.');
    }

    const userId = request.auth.uid;
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== 'admin') {
      throw new HttpsError('permission-denied', 'Only platform administrators can trigger manual synchronization.');
    }

    logger.info(`Manual news sync requested by admin ${userId}`);

    try {
      const results = await newsAggregationService.syncAllEnabledSources();
      return {
        success: true,
        message: `Synchronized ${results.length} news source(s).`,
        results,
      };
    } catch (error) {
      logger.error('Manual news sync trigger failed', error);
      throw new HttpsError('internal', 'News synchronization failed during execution.');
    }
  }
);

/**
 * 2nd Generation Cloud Function: Explicit syncCareerNewsManual Callable
 * Allows authenticated administrators/developers to trigger manual news sync with source override.
 */
export const syncCareerNewsManual = onCall(
  {
    memory: '512MiB',
    timeoutSeconds: 300,
  },
  async (request: CallableRequest<{ sourceId?: string }>) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated to invoke manual synchronization.');
    }

    const userId = request.auth.uid;
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== 'admin') {
      throw new HttpsError('permission-denied', 'Only platform administrators can trigger manual synchronization.');
    }

    const { sourceId } = request.data || {};
    logger.info(`Explicit syncCareerNewsManual invoked by admin ${userId}`, { sourceId });

    try {
      if (sourceId) {
        const result = await newsAggregationService.syncSpecificSource(sourceId);
        return {
          success: true,
          message: `Synchronized news source ${sourceId} successfully.`,
          results: [result],
        };
      }

      const results = await newsAggregationService.syncAllEnabledSources();
      return {
        success: true,
        message: `Synchronized ${results.length} enabled news source(s).`,
        results,
      };
    } catch (error) {
      logger.error('syncCareerNewsManual failed', error);
      throw new HttpsError('internal', `News synchronization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
);

// Re-export Search Gateway Services & Providers
export * from './search/types';
export * from './search/normalizer';
export * from './search/deduplicator';
export * from './search/ranking';
export * from './search/cache';
export * from './search/JobSearchService';
export * from './search/CompanySearchService';

import { jobSearchService } from './search/JobSearchService';
import { companySearchService } from './search/CompanySearchService';
import { JobSearchParams, CompanySearchParams } from './search/types';

/**
 * 2nd Generation Cloud Function: Real-Time Global Job Search Gateway
 * Discovers and aggregates live jobs dynamically across external providers.
 */
export const searchJobsGateway = onCall(
  {
    memory: '512MiB',
    timeoutSeconds: 30,
  },
  async (request: CallableRequest<JobSearchParams>) => {
    try {
      const params = request.data || {};
      const result = await jobSearchService.searchJobs(params);
      return result;
    } catch (error) {
      logger.error('searchJobsGateway error', error);
      throw new HttpsError('internal', error instanceof Error ? error.message : 'Job search gateway failed.');
    }
  }
);

/**
 * 2nd Generation Cloud Function: Real-Time Global Company Search Gateway
 * Discovers and aggregates live hiring organizations dynamically across external providers.
 */
export const searchCompaniesGateway = onCall(
  {
    memory: '512MiB',
    timeoutSeconds: 30,
  },
  async (request: CallableRequest<CompanySearchParams>) => {
    try {
      const params = request.data || {};
      const result = await companySearchService.searchCompanies(params);
      return result;
    } catch (error) {
      logger.error('searchCompaniesGateway error', error);
      throw new HttpsError('internal', error instanceof Error ? error.message : 'Company search gateway failed.');
    }
  }
);


