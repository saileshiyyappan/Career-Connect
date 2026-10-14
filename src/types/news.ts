export type CareerNewsStatus = 'active' | 'archived' | 'error';

export interface CareerNewsItem {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  summary: string;
  thumbnailUrl?: string;
  category: string;
  tags?: string[];
  author?: string;
  publishedAt: string; // ISO 8601 string
  fetchedAt: string;    // ISO 8601 string
  contentHash: string;
  status: CareerNewsStatus;
  readingTimeMinutes?: number;
  createdAt: string;
  updatedAt: string;
  relevanceScore?: number;
  isRelevant?: boolean;
}

export type NewsCategory =
  | 'job_market'
  | 'hiring'
  | 'placements'
  | 'internships'
  | 'freshers'
  | 'technology_careers'
  | 'ai_careers'
  | 'salary'
  | 'companies'
  | 'startups'
  | 'career_advice'
  | 'india'
  | 'global'
  | string;
