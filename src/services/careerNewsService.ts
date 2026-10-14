import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config/firestore';
import { CareerNewsItem } from '../types/news';
import { DEFAULT_CAREER_NEWS } from '../data/defaultCareerNews';
import { isCareerRelevantNews } from '../utils/newsRelevance';

const NEWS_COLLECTION = 'career_news';

export interface PaginatedNewsResponse {
  items: CareerNewsItem[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
  totalFetched: number;
}

export interface FetchNewsOptions {
  category?: string;
  sourceId?: string;
  limitCount?: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
  sortBy?: 'publishedAt' | 'fetchedAt';
  sortOrder?: 'desc' | 'asc';
}

export class CareerNewsService {
  /**
   * Filter in-memory fallback list by category, source, status, and sort
   */
  private getFallbackNews(options: FetchNewsOptions = {}): CareerNewsItem[] {
    const { category, sourceId, sortBy = 'publishedAt', sortOrder = 'desc' } = options;
    let list = [...DEFAULT_CAREER_NEWS];
    list = list.filter(isCareerRelevantNews);

    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      list = list.filter(
        (item) =>
          item.category?.toLowerCase() === catLower ||
          item.tags?.some((t) => t.toLowerCase() === catLower)
      );
    }

    if (sourceId && sourceId !== 'all') {
      const srcLower = sourceId.toLowerCase();
      list = list.filter(
        (item) =>
          item.sourceId?.toLowerCase() === srcLower ||
          item.sourceName?.toLowerCase().includes(srcLower)
      );
    }

    list.sort((a, b) => {
      const timeA = new Date(a[sortBy] || a.publishedAt).getTime();
      const timeB = new Date(b[sortBy] || b.publishedAt).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }

  /**
   * Fetches paginated career news articles sorted by date.
   * If Firestore is empty or restricted by remote permissions, provides curated career news.
   */
  async getPaginatedNews(options: FetchNewsOptions = {}): Promise<PaginatedNewsResponse> {
    const {
      category,
      sourceId,
      limitCount = 12,
      lastDoc = null,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
    } = options;

    if (!isFirebaseConfigured) {
      const fallbackList = this.getFallbackNews(options);
      const items = fallbackList.slice(0, limitCount);
      return {
        items,
        lastDoc: null,
        hasMore: fallbackList.length > limitCount,
        totalFetched: items.length,
      };
    }

    try {
      const constraints: any[] = [orderBy(sortBy, sortOrder)];

      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const fetchMultiplier = (category && category !== 'all') || sourceId ? 4 : 2;
      constraints.push(firestoreLimit(Math.max(limitCount * fetchMultiplier, 25)));

      const q = query(collection(db, NEWS_COLLECTION), ...constraints);
      const snapshot = await getDocs(q);

      const docs = snapshot.docs;
      const allItems: CareerNewsItem[] = docs.map(
        (d) =>
          ({
            id: d.id,
            ...d.data(),
          } as CareerNewsItem)
      );

      const filtered = allItems.filter((item) => {
        if (!isCareerRelevantNews(item)) return false;
        if (item.status && item.status !== 'active') return false;

        if (category && category !== 'all') {
          const itemCat = item.category?.toLowerCase();
          const targetCat = category.toLowerCase();
          if (itemCat !== targetCat && !item.tags?.some((t) => t.toLowerCase() === targetCat)) {
            return false;
          }
        }

        if (sourceId && sourceId !== 'all') {
          if (
            item.sourceId !== sourceId &&
            !item.sourceName?.toLowerCase().includes(sourceId.toLowerCase())
          ) {
            return false;
          }
        }

        return true;
      });

      // If Firestore has articles, return them
      if (filtered.length > 0) {
        const hasMore =
          docs.length >= Math.max(limitCount * fetchMultiplier, 25) && filtered.length > limitCount;
        const resultItems = filtered.slice(0, limitCount);
        const newLastDoc = docs.length > 0 ? docs[docs.length - 1] : null;

        return {
          items: resultItems,
          lastDoc: newLastDoc,
          hasMore,
          totalFetched: resultItems.length,
        };
      }
    } catch (error) {
      console.warn('CareerNewsService.getPaginatedNews notice (using curated news feed):', error);
    }

    // Curated fallback
    const fallbackList = this.getFallbackNews(options);
    const items = fallbackList.slice(0, limitCount);
    return {
      items,
      lastDoc: null,
      hasMore: fallbackList.length > limitCount,
      totalFetched: items.length,
    };
  }

  /**
   * Fetches latest active career news articles sorted by published date.
   */
  async getLatestNews(limitCount: number = 30): Promise<CareerNewsItem[]> {
    if (!isFirebaseConfigured) {
      return this.getFallbackNews({ limitCount }).slice(0, limitCount);
    }

    try {
      const q = query(
        collection(db, NEWS_COLLECTION),
        orderBy('publishedAt', 'desc'),
        firestoreLimit(limitCount * 2)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() } as CareerNewsItem))
        .filter(isCareerRelevantNews)
        .filter((item) => !item.status || item.status === 'active');

      if (items.length > 0) {
        return items.slice(0, limitCount);
      }
    } catch (error) {
      console.warn('CareerNewsService.getLatestNews notice (using curated news feed):', error);
    }

    return this.getFallbackNews({ limitCount }).slice(0, limitCount);
  }

  /**
   * Alias for getLatestNews
   */
  async getNews(limitCount: number = 30): Promise<CareerNewsItem[]> {
    return this.getLatestNews(limitCount);
  }

  /**
   * Fetches the top featured/newest articles
   */
  async getTopNews(limitCount: number = 3): Promise<CareerNewsItem[]> {
    return this.getLatestNews(limitCount);
  }

  /**
   * Fetches active career news articles filtered by category.
   */
  async getNewsByCategory(category: string, limitCount: number = 30): Promise<CareerNewsItem[]> {
    if (!category || category === 'all') {
      return this.getLatestNews(limitCount);
    }

    try {
      const allNews = await this.getLatestNews(limitCount * 3);
      const target = category.toLowerCase();
      const filtered = allNews.filter((item) => {
        return (
          item.category?.toLowerCase() === target ||
          item.tags?.some((t) => t.toLowerCase() === target)
        );
      });

      if (filtered.length > 0) {
        return filtered.slice(0, limitCount);
      }
    } catch (error) {
      console.warn(`CareerNewsService.getNewsByCategory notice for '${category}':`, error);
    }

    return this.getFallbackNews({ category, limitCount }).slice(0, limitCount);
  }

  /**
   * Fetches active career news articles from a specific source ID.
   */
  async getNewsBySource(sourceId: string, limitCount: number = 30): Promise<CareerNewsItem[]> {
    try {
      const allNews = await this.getLatestNews(limitCount * 3);
      const filtered = allNews.filter((item) => {
        return (
          item.sourceId === sourceId ||
          item.sourceName?.toLowerCase().includes(sourceId.toLowerCase())
        );
      });

      if (filtered.length > 0) {
        return filtered.slice(0, limitCount);
      }
    } catch (error) {
      console.warn(`CareerNewsService.getNewsBySource notice for '${sourceId}':`, error);
    }

    return this.getFallbackNews({ sourceId, limitCount }).slice(0, limitCount);
  }

  /**
   * Fetches recent news published within a specified lookback window in hours.
   */
  async getRecentNews(hoursAgo: number = 48, limitCount: number = 30): Promise<CareerNewsItem[]> {
    try {
      const allNews = await this.getLatestNews(limitCount * 2);
      const thresholdTime = Date.now() - hoursAgo * 60 * 60 * 1000;
      const filtered = allNews.filter((item) => {
        if (!item.publishedAt) return true;
        const time = new Date(item.publishedAt).getTime();
        return isNaN(time) || time >= thresholdTime;
      });

      if (filtered.length > 0) {
        return filtered.slice(0, limitCount);
      }
    } catch (error) {
      console.warn('CareerNewsService.getRecentNews notice:', error);
    }

    return this.getFallbackNews({ limitCount }).slice(0, limitCount);
  }

  /**
   * Fetches a single career news article by its ID.
   */
  async getNewsById(id: string): Promise<CareerNewsItem | null> {
    if (isFirebaseConfigured) {
      try {
        const docRef = doc(db, NEWS_COLLECTION, id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const item = { id: snap.id, ...snap.data() } as CareerNewsItem;
          return isCareerRelevantNews(item) ? item : null;
        }
      } catch (error) {
        console.warn(`CareerNewsService.getNewsById notice for '${id}':`, error);
      }
    }

    const fallback = DEFAULT_CAREER_NEWS.find((item) => item.id === id);
    return fallback || null;
  }

  /**
   * Client-friendly search with metadata filtering.
   */
  async searchNews(
    queryText: string,
    category?: string,
    limitCount: number = 40
  ): Promise<CareerNewsItem[]> {
    const sanitizedQuery = queryText.toLowerCase().trim();
    if (!sanitizedQuery) {
      return category && category !== 'all'
        ? this.getNewsByCategory(category, limitCount)
        : this.getLatestNews(limitCount);
    }

    try {
      const baseArticles =
        category && category !== 'all'
          ? await this.getNewsByCategory(category, 60)
          : await this.getLatestNews(60);

      const terms = sanitizedQuery.split(/\s+/).filter(Boolean);
      const matched = baseArticles.filter((item) => {
        const titleMatch = item.title?.toLowerCase() || '';
        const summaryMatch = item.summary?.toLowerCase() || '';
        const sourceMatch = item.sourceName?.toLowerCase() || '';
        const authorMatch = item.author?.toLowerCase() || '';
        const tagsMatch = item.tags?.join(' ').toLowerCase() || '';
        const categoryMatch = item.category?.toLowerCase() || '';

        const fullText = `${titleMatch} ${summaryMatch} ${sourceMatch} ${authorMatch} ${tagsMatch} ${categoryMatch}`;
        return terms.every((term) => fullText.includes(term));
      });

      if (matched.length > 0) {
        return matched.slice(0, limitCount);
      }
    } catch (error) {
      console.warn('CareerNewsService.searchNews notice:', error);
    }

    // Search in fallback data
    const terms = sanitizedQuery.split(/\s+/).filter(Boolean);
    const fallbackBase = this.getFallbackNews({ category, limitCount: 60 });
    return fallbackBase
      .filter((item) => {
        const titleMatch = item.title?.toLowerCase() || '';
        const summaryMatch = item.summary?.toLowerCase() || '';
        const sourceMatch = item.sourceName?.toLowerCase() || '';
        const authorMatch = item.author?.toLowerCase() || '';
        const tagsMatch = item.tags?.join(' ').toLowerCase() || '';
        const categoryMatch = item.category?.toLowerCase() || '';

        const fullText = `${titleMatch} ${summaryMatch} ${sourceMatch} ${authorMatch} ${tagsMatch} ${categoryMatch}`;
        return terms.every((term) => fullText.includes(term));
      })
      .slice(0, limitCount);
  }
}

export const careerNewsService = new CareerNewsService();
