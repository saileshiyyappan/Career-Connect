import { adminDb } from '../config/firebase';
import { CareerNewsDocument } from '../types/news';
import { logger } from '../utils/logger';

export class CareerNewsRepository {
  private collectionName = 'career_news';

  private get collection() {
    return adminDb.collection(this.collectionName);
  }

  async findById(id: string): Promise<CareerNewsDocument | null> {
    try {
      const docSnap = await this.collection.doc(id).get();
      if (!docSnap.exists) return null;
      return { id: docSnap.id, ...docSnap.data() } as CareerNewsDocument;
    } catch (error) {
      logger.error(`CareerNewsRepository.findById error for ${id}`, error);
      return null;
    }
  }

  async findByContentHash(contentHash: string): Promise<CareerNewsDocument | null> {
    try {
      const snapshot = await this.collection.where('contentHash', '==', contentHash).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as CareerNewsDocument;
    } catch (error) {
      logger.error('CareerNewsRepository.findByContentHash error', error);
      return null;
    }
  }

  async upsertNews(article: CareerNewsDocument): Promise<{
    action: 'inserted' | 'updated' | 'duplicate';
    documentId: string;
  }> {
    try {
      // Find existing by deterministic ID or content hash
      let existing: CareerNewsDocument | null = null;
      if (article.id) {
        existing = await this.findById(article.id);
      }
      if (!existing && article.contentHash) {
        existing = await this.findByContentHash(article.contentHash);
      }

      const now = new Date().toISOString();

      if (existing) {
        if (
          existing.contentHash === article.contentHash &&
          existing.title === article.title &&
          existing.status === article.status
        ) {
          return { action: 'duplicate', documentId: existing.id };
        }

        const updatedDoc: Partial<CareerNewsDocument> = {
          ...article,
          id: existing.id,
          createdAt: existing.createdAt || article.createdAt,
          updatedAt: now,
          fetchedAt: article.fetchedAt || now,
        };

        await this.collection.doc(existing.id).set(updatedDoc, { merge: true });
        return { action: 'updated', documentId: existing.id };
      }

      const docRef = article.id ? this.collection.doc(article.id) : this.collection.doc();
      const newArticle: CareerNewsDocument = {
        ...article,
        id: docRef.id,
        createdAt: article.createdAt || now,
        updatedAt: now,
        fetchedAt: article.fetchedAt || now,
      };

      await docRef.set(newArticle);
      return { action: 'inserted', documentId: docRef.id };
    } catch (error) {
      logger.error('CareerNewsRepository.upsertNews failed', error, {
        sourceId: article.sourceId,
        title: article.title,
      });
      throw error;
    }
  }

  async listActive(limitCount: number = 30): Promise<CareerNewsDocument[]> {
    return this.getLatestNews(limitCount);
  }

  async getLatestNews(limitCount: number = 30): Promise<CareerNewsDocument[]> {
    try {
      const snapshot = await this.collection
        .where('status', '==', 'active')
        .orderBy('publishedAt', 'desc')
        .limit(limitCount)
        .get();

      return snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as CareerNewsDocument));
    } catch (error) {
      logger.error('CareerNewsRepository.getLatestNews error', error);
      return [];
    }
  }

  async getNews(limitCount: number = 30): Promise<CareerNewsDocument[]> {
    return this.getLatestNews(limitCount);
  }

  async getNewsByCategory(category: string, limitCount: number = 30): Promise<CareerNewsDocument[]> {
    try {
      const snapshot = await this.collection
        .where('category', '==', category)
        .where('status', '==', 'active')
        .orderBy('publishedAt', 'desc')
        .limit(limitCount)
        .get();

      return snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as CareerNewsDocument));
    } catch (error) {
      logger.error(`CareerNewsRepository.getNewsByCategory error for ${category}`, error);
      return [];
    }
  }

  async getNewsBySource(sourceId: string, limitCount: number = 30): Promise<CareerNewsDocument[]> {
    try {
      const snapshot = await this.collection
        .where('sourceId', '==', sourceId)
        .where('status', '==', 'active')
        .orderBy('publishedAt', 'desc')
        .limit(limitCount)
        .get();

      return snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as CareerNewsDocument));
    } catch (error) {
      logger.error(`CareerNewsRepository.getNewsBySource error for ${sourceId}`, error);
      return [];
    }
  }

  async getRecentNews(hoursAgo: number = 48, limitCount: number = 30): Promise<CareerNewsDocument[]> {
    try {
      const thresholdDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
      const snapshot = await this.collection
        .where('status', '==', 'active')
        .where('publishedAt', '>=', thresholdDate)
        .orderBy('publishedAt', 'desc')
        .limit(limitCount)
        .get();

      return snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() } as CareerNewsDocument));
    } catch (error) {
      logger.error('CareerNewsRepository.getRecentNews error', error);
      return this.getLatestNews(limitCount);
    }
  }
}

export const careerNewsRepository = new CareerNewsRepository();
