export type CareerNewsStatus = 'active' | 'archived' | 'error';

export interface CareerNewsDocument {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  summary: string;
  thumbnailUrl?: string;
  category: string;
  author?: string;
  publishedAt: string; // ISO 8601 string
  fetchedAt: string;    // ISO 8601 string
  contentHash: string;
  status: CareerNewsStatus;
  tags?: string[];
  readingTimeMinutes?: number;
  createdAt: string;    // ISO 8601 string
  updatedAt: string;    // ISO 8601 string
  relevanceScore?: number;
  isRelevant?: boolean;
}

export type NewsSourceType = 'rss' | 'atom' | 'api' | 'custom';
export type NewsSourceStatus = 'active' | 'paused' | 'error';

export interface NewsSourceDocument {
  id: string;
  name: string;
  type: NewsSourceType;
  feedUrl: string;
  enabled: boolean;
  categories: string[];
  lastSuccessfulSync?: string;
  lastAttemptedSync?: string;
  status: NewsSourceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RawNewsArticleInput {
  guid?: string;
  id?: string;
  title?: string;
  description?: string;
  summary?: string;
  content?: string;
  link?: string;
  url?: string;
  pubDate?: string | number;
  published_at?: string | number;
  publishedAt?: string | number;
  author?: string | { name?: string };
  creator?: string;
  category?: string | string[];
  categories?: string[];
  thumbnail?: string;
  image?: string | { url?: string };
  urlToImage?: string;
  source?: { id?: string | null; name?: string };
  enclosure?: { url?: string; type?: string };
}
