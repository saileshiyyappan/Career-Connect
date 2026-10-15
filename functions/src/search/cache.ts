interface CacheEntry<T> {
  data: T;
  fetchedAt: string;
  expiresAt: number;
  source: string;
}

export class SearchCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTLMs: number;

  constructor(defaultTTLMinutes: number = 15) {
    this.defaultTTLMs = defaultTTLMinutes * 60 * 1000;
  }

  get<T>(key: string): { data: T; fetchedAt: string; isStale: boolean } | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return {
      data: entry.data,
      fetchedAt: entry.fetchedAt,
      isStale: now > entry.expiresAt - this.defaultTTLMs / 2,
    };
  }

  set<T>(key: string, data: T, ttlMs?: number, source: string = 'provider'): void {
    const now = Date.now();
    const effectiveTTL = ttlMs || this.defaultTTLMs;
    this.cache.set(key, {
      data,
      fetchedAt: new Date().toISOString(),
      expiresAt: now + effectiveTTL,
      source,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const searchCache = new SearchCache(20);
