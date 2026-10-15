export type SyncSourceType = 'job' | 'news';
export type SyncStatus = 'success' | 'partial' | 'failure';

export interface SyncErrorDetail {
  recordId?: string;
  sourceUrl?: string;
  phase: 'fetch' | 'parse' | 'normalize' | 'validate' | 'persist';
  message: string;
  timestamp: string;
}

export interface SyncLogDocument {
  id: string;
  sourceId: string;
  sourceType: SyncSourceType;
  startedAt: string;     // ISO 8601 string
  completedAt: string;   // ISO 8601 string
  status: SyncStatus;
  fetchedCount: number;
  insertedCount: number;
  updatedCount: number;
  duplicateCount: number;
  expiredCount: number;
  errorCount: number;
  errors: SyncErrorDetail[];
  executionId: string;
  durationMs: number;
  metadata?: Record<string, unknown>;
}

export interface SyncStats {
  fetchedCount: number;
  insertedCount: number;
  updatedCount: number;
  duplicateCount: number;
  expiredCount: number;
  errorCount: number;
  rejectedCount?: number;
  errors: SyncErrorDetail[];
}

export interface SyncResult {
  executionId: string;
  sourceId: string;
  sourceType: SyncSourceType;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  status: SyncStatus;
  stats: SyncStats;
}
