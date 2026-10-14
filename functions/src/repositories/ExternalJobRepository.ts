import { adminDb } from '../config/firebase';
import { ExternalJobDocument } from '../types/job';
import { logger } from '../utils/logger';

export class ExternalJobRepository {
  private collectionName = 'external_jobs';

  private get collection() {
    return adminDb.collection(this.collectionName);
  }

  async findById(id: string): Promise<ExternalJobDocument | null> {
    try {
      const docSnap = await this.collection.doc(id).get();
      if (!docSnap.exists) return null;
      return { id: docSnap.id, ...docSnap.data() } as ExternalJobDocument;
    } catch (error) {
      logger.error(`ExternalJobRepository.findById error for ${id}`, error);
      return null;
    }
  }

  async findByContentHash(contentHash: string): Promise<ExternalJobDocument | null> {
    try {
      const snapshot = await this.collection.where('contentHash', '==', contentHash).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as ExternalJobDocument;
    } catch (error) {
      logger.error('ExternalJobRepository.findByContentHash error', error);
      return null;
    }
  }

  async findBySourceAndExternalId(sourceId: string, externalId: string): Promise<ExternalJobDocument | null> {
    try {
      const snapshot = await this.collection
        .where('sourceId', '==', sourceId)
        .where('externalId', '==', externalId)
        .limit(1)
        .get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as ExternalJobDocument;
    } catch (error) {
      logger.error('ExternalJobRepository.findBySourceAndExternalId error', error);
      return null;
    }
  }

  /**
   * Idempotent upsert of an external job posting.
   * Checks both (sourceId + externalId) and contentHash to prevent duplicates.
   */
  async upsertJob(job: ExternalJobDocument): Promise<{
    action: 'inserted' | 'updated' | 'duplicate';
    documentId: string;
  }> {
    try {
      // 1. Try finding by deterministic ID or source + externalId
      let existing = await this.findBySourceAndExternalId(job.sourceId, job.externalId);

      // 2. If not found by external ID, try content hash match
      if (!existing && job.contentHash) {
        existing = await this.findByContentHash(job.contentHash);
      }

      const now = new Date().toISOString();

      if (existing) {
        // Check if content is truly identical to avoid unnecessary writes
        if (
          existing.contentHash === job.contentHash &&
          existing.status === job.status &&
          existing.expiresAt === job.expiresAt
        ) {
          // Record was unchanged
          return { action: 'duplicate', documentId: existing.id };
        }

        // Update existing document preserving original creation date
        const updatedDoc: Partial<ExternalJobDocument> = {
          ...job,
          id: existing.id,
          createdAt: existing.createdAt || job.createdAt,
          updatedAt: now,
          fetchedAt: job.fetchedAt || now,
        };

        await this.collection.doc(existing.id).set(updatedDoc, { merge: true });
        return { action: 'updated', documentId: existing.id };
      }

      // 3. New insertion
      const docRef = job.id ? this.collection.doc(job.id) : this.collection.doc();
      const newJob: ExternalJobDocument = {
        ...job,
        id: docRef.id,
        createdAt: job.createdAt || now,
        updatedAt: now,
        fetchedAt: job.fetchedAt || now,
      };

      await docRef.set(newJob);
      return { action: 'inserted', documentId: docRef.id };
    } catch (error) {
      logger.error('ExternalJobRepository.upsertJob failed', error, {
        sourceId: job.sourceId,
        externalId: job.externalId,
      });
      throw error;
    }
  }

  async markExpired(id: string): Promise<void> {
    try {
      const now = new Date().toISOString();
      await this.collection.doc(id).update({
        status: 'expired',
        updatedAt: now,
      });
    } catch (error) {
      logger.error(`ExternalJobRepository.markExpired error for ${id}`, error);
    }
  }

  async listActive(limitCount: number = 50): Promise<ExternalJobDocument[]> {
    try {
      const snapshot = await this.collection
        .where('status', '==', 'active')
        .orderBy('publishedAt', 'desc')
        .limit(limitCount)
        .get();

      return snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as ExternalJobDocument));
    } catch (error) {
      logger.error('ExternalJobRepository.listActive error', error);
      return [];
    }
  }

  async findBySource(sourceId: string, limitCount: number = 50): Promise<ExternalJobDocument[]> {
    try {
      const snapshot = await this.collection
        .where('sourceId', '==', sourceId)
        .where('status', '==', 'active')
        .orderBy('publishedAt', 'desc')
        .limit(limitCount)
        .get();

      return snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as ExternalJobDocument));
    } catch (error) {
      logger.error(`ExternalJobRepository.findBySource error for ${sourceId}`, error);
      return [];
    }
  }

  async count(): Promise<number> {
    try {
      const snapshot = await this.collection.count().get();
      return snapshot.data().count;
    } catch (error) {
      logger.error('ExternalJobRepository.count error', error);
      return 0;
    }
  }
}

export const externalJobRepository = new ExternalJobRepository();
