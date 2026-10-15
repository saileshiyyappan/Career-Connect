import { NewsParser } from '../src/news/parser';
import { NewsNormalizer } from '../src/news/normalizer';
import { DEFAULT_NEWS_SOURCES } from '../src/repositories/NewsSourceRepository';
import { getEnvironmentConfig } from '../src/config/environment';
import { RawNewsArticleInput } from '../src/types/news';

export async function runLiveNewsSyncTests(): Promise<{ name: string; passed: boolean; error?: string }[]> {
  const results: { name: string; passed: boolean; error?: string }[] = [];
<<<<<<< HEAD
  const runLiveFeeds = process.env.RUN_LIVE_FEED_TESTS === 'true';
=======
>>>>>>> origin/main

  for (const source of DEFAULT_NEWS_SOURCES) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const requestUrl = new URL(source.feedUrl);
<<<<<<< HEAD
      let body: string;
      if (!runLiveFeeds) {
        // Keep parser/normalizer tests deterministic. The production provider
        // integrations remain unchanged and can be exercised explicitly with
        // RUN_LIVE_FEED_TESTS=true in an environment with network access.
        if (source.id === 'newsapi') {
        body = JSON.stringify({
          status: 'ok',
          totalResults: 1,
          articles: [{
            source: { id: 'fixture', name: 'Fixture News' },
            author: 'CareerConnect Test',
            title: 'Fixture technology careers update',
            description: 'Deterministic fixture for NewsAPI parsing tests.',
            url: 'https://example.com/fixture-careers-update',
            urlToImage: null,
            publishedAt: '2025-01-01T00:00:00Z',
            content: 'Fixture content',
          }],
        });
        } else {
          body = `<rss version="2.0"><channel><title>CareerConnect Fixture</title><item><title>Fixture technology careers update</title><description>Deterministic fixture for RSS parsing tests.</description><link>https://example.com/fixture-careers-update</link><pubDate>Wed, 01 Jan 2025 00:00:00 GMT</pubDate><guid>fixture-careers-update</guid></item></channel></rss>`;
        }
        clearTimeout(timeout);
      } else {
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
        body = await response.text();
      }
=======
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
>>>>>>> origin/main
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
<<<<<<< HEAD
        name: `${runLiveFeeds ? 'Live Feed' : 'Fixture'}: ${source.name} (${rawArticles.length} articles discovered, verified parsing & normalization)`,
=======
        name: `Live Feed: ${source.name} (${rawArticles.length} articles discovered, verified parsing & normalization)`,
>>>>>>> origin/main
        passed: true,
      });
    } catch (err) {
      results.push({
<<<<<<< HEAD
        name: `${runLiveFeeds ? 'Live Feed' : 'Fixture'}: ${source.name}`,
=======
        name: `Live Feed: ${source.name}`,
>>>>>>> origin/main
        passed: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return results;
}
