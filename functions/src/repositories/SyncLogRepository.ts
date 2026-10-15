import { adminDb } from '../config/firebase';
import { SyncLogDocument } from '../types/sync';
import { logger } from '../utils/logger';

export class SyncLogRepository {
  private collectionName = 'sync_logs';

  private get collection() {
    return adminDb.collection(this.collectionName);
  }

  async createLog(log: SyncLogDocument): Promise<void> {
    try {
      const docRef = log.id ? this.collection.doc(log.id) : this.collection.doc();
      await docRef.set({
        ...log,
        id: docRef.id,
      });
    } catch (error) {
      logger.error('SyncLogRepository.createLog error', error, { executionId: log.executionId });
    }
  }

  async getRecentLogs(sourceType?: 'job' | 'news', limitCount: number = 20): Promise<SyncLogDocument[]> {
    try {
      let q = this.collection.orderBy('startedAt', 'desc').limit(limitCount);
      if (sourceType) {
        q = this.collection.where('sourceType', '==', sourceType).orderBy('startedAt', 'desc').limit(limitCount);
      }
      const snapshot = await q.get();
      return snapshot.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: d.id, ...d.data() } as SyncLogDocument));
    } catch (error) {
      logger.error('SyncLogRepository.getRecentLogs error', error);
      return [];
    }
  }
}

export const syncLogRepository = new SyncLogRepository();
