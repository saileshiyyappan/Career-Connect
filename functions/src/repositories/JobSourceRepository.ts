import { adminDb } from '../config/firebase';
import { JobSourceDocument } from '../types/job';
import { logger } from '../utils/logger';

export const DEFAULT_JOB_SOURCES: JobSourceDocument[] = [
  {
    id: 'adzuna_us',
    name: 'Adzuna US',
    type: 'api',
    baseUrl: 'https://api.adzuna.com/v1/api/jobs',
    enabled: true,
    status: 'active',
    rateLimitPerMinute: 10,
    maxPagesPerRun: 1,
    limitPerPage: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'himalayas',
    name: 'Himalayas',
    type: 'api',
    baseUrl: 'https://himalayas.app/jobs/api',
    enabled: true,
    status: 'active',
    rateLimitPerMinute: 30,
    cursorParamName: 'cursor',
    maxPagesPerRun: 2,
    limitPerPage: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'jobicy',
    name: 'Jobicy',
    type: 'api',
    baseUrl: 'https://jobicy.com/api/v2/remote-jobs',
    enabled: false, // Optional secondary source kept behind configuration switch
    status: 'active',
    rateLimitPerMinute: 20,
    maxPagesPerRun: 1,
    limitPerPage: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class JobSourceRepository {
  private collectionName = 'job_sources';

  private get collection() {
    return adminDb.collection(this.collectionName);
  }

  async getEnabledSources(): Promise<JobSourceDocument[]> {
    try {
      await this.ensureDefaultSources();
      const snapshot = await this.collection.where('enabled', '==', true).get();
      if (!snapshot.empty) {
        return snapshot.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: d.id, ...d.data() } as JobSourceDocument));
      }

      // If no sources exist in Firestore yet, automatically seed default sources
      const seededSnapshot = await this.collection.where('enabled', '==', true).get();
      if (!seededSnapshot.empty) {
        return seededSnapshot.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: d.id, ...d.data() } as JobSourceDocument));
      }

      return DEFAULT_JOB_SOURCES.filter((s) => s.enabled);
    } catch (error) {
      logger.error('JobSourceRepository.getEnabledSources error', error);
      // Fallback to in-memory default enabled sources if Firestore unavailable
      return DEFAULT_JOB_SOURCES.filter((s) => s.enabled);
    }
  }

  async ensureDefaultSources(): Promise<void> {
    try {
      for (const source of DEFAULT_JOB_SOURCES) {
        const docRef = this.collection.doc(source.id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
          await docRef.set(source);
          logger.info(`JobSourceRepository: Seeded default source ${source.id}`);
        } else if (!docSnap.data()?.baseUrl) {
          // A failed first sync can create a partial status-only document.
          // Backfill provider configuration without replacing status/timestamps.
          const repair: Partial<JobSourceDocument> = {
            name: source.name,
            type: source.type,
            baseUrl: source.baseUrl,
            enabled: source.enabled,
            rateLimitPerMinute: source.rateLimitPerMinute,
            maxPagesPerRun: source.maxPagesPerRun,
            limitPerPage: source.limitPerPage,
          };
          if (source.cursorParamName !== undefined) repair.cursorParamName = source.cursorParamName;
          await docRef.set(repair, { merge: true });
        }
      }
    } catch (error) {
      logger.error('JobSourceRepository.ensureDefaultSources error', error);
    }
  }

  async findById(id: string): Promise<JobSourceDocument | null> {
    try {
      const docSnap = await this.collection.doc(id).get();
      if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() } as JobSourceDocument;
      }
      // Fallback lookup in default sources
      const defaultMatch = DEFAULT_JOB_SOURCES.find((s) => s.id === id);
      return defaultMatch || null;
    } catch (error) {
      logger.error(`JobSourceRepository.findById error for ${id}`, error);
      const defaultMatch = DEFAULT_JOB_SOURCES.find((s) => s.id === id);
      return defaultMatch || null;
    }
  }

  async updateSyncStatus(sourceId: string, success: boolean, timestamp: string): Promise<void> {
    try {
      const updates: Partial<JobSourceDocument> = {
        lastAttemptedSync: timestamp,
        status: success ? 'active' : 'error',
        updatedAt: timestamp,
      };
      if (success) {
        updates.lastSuccessfulSync = timestamp;
      }
      await this.collection.doc(sourceId).set(updates, { merge: true });
    } catch (error) {
      logger.error(`JobSourceRepository.updateSyncStatus error for ${sourceId}`, error);
    }
  }
}

export const jobSourceRepository = new JobSourceRepository();
