import { adminDb } from '../config/firebase';
import { NewsSourceDocument } from '../types/news';
import { logger } from '../utils/logger';

export const DEFAULT_NEWS_SOURCES: NewsSourceDocument[] = [
  {
    id: 'newsapi',
    name: 'NewsAPI Career Headlines',
    type: 'api',
    feedUrl: 'https://newsapi.org/v2/top-headlines',
    enabled: true,
    categories: ['career', 'technology', 'business'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'economic_times_jobs',
    name: 'The Economic Times - Jobs & Careers',
    type: 'rss',
    feedUrl: 'https://economictimes.indiatimes.com/jobs/rssfeeds/107115.cms',
    enabled: true,
    categories: ['job_market', 'hiring', 'india', 'salary'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'times_of_india_careers',
    name: 'Times of India - Education & Campus',
    type: 'rss',
    feedUrl: 'https://timesofindia.indiatimes.com/rssfeeds/913168846.cms',
    enabled: true,
    categories: ['placements', 'freshers', 'campus', 'india'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'freecodecamp_careers',
    name: 'freeCodeCamp - Tech & Career Guides',
    type: 'rss',
    feedUrl: 'https://www.freecodecamp.org/news/rss/',
    enabled: true,
    categories: ['technology_careers', 'software_engineering', 'career_advice'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'wired_work',
    name: 'Wired - Workplace & Big Tech',
    type: 'rss',
    feedUrl: 'https://www.wired.com/feed/category/business/latest/rss',
    enabled: true,
    categories: ['technology_careers', 'ai_careers', 'companies', 'global'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'techcrunch_enterprise',
    name: 'TechCrunch - Enterprise & AI',
    type: 'rss',
    feedUrl: 'https://techcrunch.com/category/enterprise/feed/',
    enabled: true,
    categories: ['ai_careers', 'startups', 'technology_careers', 'global'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'devto_careers',
    name: 'DEV Community - Developer Careers',
    type: 'rss',
    feedUrl: 'https://dev.to/feed/tag/career',
    enabled: true,
    categories: ['career_advice', 'technology_careers', 'software_engineering'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class NewsSourceRepository {
  private collectionName = 'news_sources';

  private get collection() {
    return adminDb.collection(this.collectionName);
  }

  async getEnabledSources(): Promise<NewsSourceDocument[]> {
    try {
      await this.ensureDefaultSources();
      const snapshot = await this.collection.where('enabled', '==', true).get();
      if (!snapshot.empty) {
        return snapshot.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: d.id, ...d.data() } as NewsSourceDocument));
      }

      // If no sources exist in Firestore yet, automatically seed default sources
      const seededSnapshot = await this.collection.where('enabled', '==', true).get();
      if (!seededSnapshot.empty) {
        return seededSnapshot.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: d.id, ...d.data() } as NewsSourceDocument));
      }

      return DEFAULT_NEWS_SOURCES.filter((s) => s.enabled);
    } catch (error) {
      logger.error('NewsSourceRepository.getEnabledSources error', error);
      return DEFAULT_NEWS_SOURCES.filter((s) => s.enabled);
    }
  }

  async ensureDefaultSources(): Promise<void> {
    try {
      for (const source of DEFAULT_NEWS_SOURCES) {
        const docRef = this.collection.doc(source.id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
          await docRef.set(source);
          logger.info(`NewsSourceRepository: Seeded default source ${source.id}`);
        } else if (!docSnap.data()?.feedUrl) {
          // A failed first sync can create a partial status-only document.
          // Backfill provider configuration without replacing status/timestamps.
          await docRef.set({
            name: source.name,
            type: source.type,
            feedUrl: source.feedUrl,
            enabled: source.enabled,
            categories: source.categories,
          }, { merge: true });
        }
      }
    } catch (error) {
      logger.error('NewsSourceRepository.ensureDefaultSources error', error);
    }
  }

  async findById(id: string): Promise<NewsSourceDocument | null> {
    try {
      const docSnap = await this.collection.doc(id).get();
      if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() } as NewsSourceDocument;
      }
      const defaultMatch = DEFAULT_NEWS_SOURCES.find((s) => s.id === id);
      return defaultMatch || null;
    } catch (error) {
      logger.error(`NewsSourceRepository.findById error for ${id}`, error);
      const defaultMatch = DEFAULT_NEWS_SOURCES.find((s) => s.id === id);
      return defaultMatch || null;
    }
  }

  async updateSyncStatus(sourceId: string, success: boolean, timestamp: string): Promise<void> {
    try {
      const updates: Partial<NewsSourceDocument> = {
        lastAttemptedSync: timestamp,
        status: success ? 'active' : 'error',
        updatedAt: timestamp,
      };
      if (success) {
        updates.lastSuccessfulSync = timestamp;
      }
      await this.collection.doc(sourceId).set(updates, { merge: true });
    } catch (error) {
      logger.error(`NewsSourceRepository.updateSyncStatus error for ${sourceId}`, error);
    }
  }
}

export const newsSourceRepository = new NewsSourceRepository();
