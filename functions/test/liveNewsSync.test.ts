import { NewsParser } from '../src/news/parser';
import { NewsNormalizer } from '../src/news/normalizer';
import { DEFAULT_NEWS_SOURCES } from '../src/repositories/NewsSourceRepository';
import { getEnvironmentConfig } from '../src/config/environment';
import { RawNewsArticleInput } from '../src/types/news';

export async function runLiveNewsSyncTests(): Promise<{ name: string; passed: boolean; error?: string }[]> {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  for (const source of DEFAULT_NEWS_SOURCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const requestUrl = new URL(source.feedUrl);
      if (source.id === 'newsapi') {
        const config = getEnvironmentConfig();
        if (!config.newsApiKey) throw new Error('NEWS_API_KEY is not configured');
        requestUrl.searchParams.set('country', 'us');
        requestUrl.searchParams.set('pageSize', '1');
        requestUrl.searchParams.set('apiKey', config.newsApiKey);
      }

      const response = await fetch(requestUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CareerConnect-News-Aggregator/2.0',
          'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}: ${response.statusText}`);
      }

      const body = await response.text();
      let rawArticles: RawNewsArticleInput[];
      if (source.id === 'newsapi') {
        const payload = JSON.parse(body) as { status?: string; code?: string; message?: string; articles?: RawNewsArticleInput[] };
        if (payload.status === 'error') throw new Error(`NewsAPI ${payload.code || 'error'}: ${payload.message || 'request failed'}`);
        rawArticles = Array.isArray(payload.articles) ? payload.articles : [];
      } else {
        rawArticles = NewsParser.parseXmlFeed(body);
      }

      if (!rawArticles || rawArticles.length === 0) {
        throw new Error(`Feed returned 0 items parsed.`);
      }

      // Check first article normalization
      const firstRaw = rawArticles[0];
      const parsed = NewsParser.parseRawArticle(firstRaw, source.feedUrl);
      if (!parsed) {
        throw new Error(`Failed to parse first raw article from ${source.name}`);
      }

      const normalized = NewsNormalizer.normalize(parsed, {
        sourceId: source.id,
        sourceName: source.name,
        defaultSourceUrl: source.feedUrl,
        defaultCategory: source.categories[0],
      });

      if (!normalized.title || normalized.title.length < 3) {
        throw new Error(`Normalized article has empty or invalid title.`);
      }
      if (!normalized.sourceUrl.startsWith('http')) {
        throw new Error(`Invalid sourceUrl: ${normalized.sourceUrl}`);
      }
      if (!normalized.contentHash || normalized.contentHash.length !== 64) {
        throw new Error(`Invalid contentHash.`);
      }
      if (!normalized.id || normalized.id.length < 16) {
        throw new Error(`Invalid deterministic ID: ${normalized.id}`);
      }

      results.push({
        name: `Live Feed: ${source.name} (${rawArticles.length} articles discovered, verified parsing & normalization)`,
        passed: true,
      });
    } catch (err) {
      results.push({
        name: `Live Feed: ${source.name}`,
        passed: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}
