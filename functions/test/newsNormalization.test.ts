import { NewsParser } from '../src/news/parser';
import { NewsNormalizer } from '../src/news/normalizer';
import { classifyNewsTaxonomy, cleanCanonicalUrl } from '../src/utils/normalize';

export function runNewsNormalizationTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err) {
      results.push({ name, passed: false, error: err instanceof Error ? err.message : String(err) });
    }
  }

  test('should parse RSS 2.0 XML with CDATA sections and extract article fields', () => {
    const xmlFeed = `
      <?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
        <channel>
          <title>Tech Career Insights</title>
          <item>
            <title><![CDATA[Top Software Engineering Skills in High Demand for 2026]]></title>
            <link>https://techcareerinsights.com/articles/top-skills-2026?utm_source=rss&utm_medium=feed</link>
            <guid>article-tech-2026-001</guid>
            <description><![CDATA[Explore the most sought-after programming languages, cloud architectures, and developer compensation.]]></description>
            <pubDate>Mon, 18 Aug 2026 09:30:00 GMT</pubDate>
            <dc:creator><![CDATA[Jane Doe]]></dc:creator>
            <category><![CDATA[Career Trends]]></category>
            <enclosure url="https://techcareerinsights.com/images/thumb1.jpg" type="image/jpeg" />
          </item>
        </channel>
      </rss>
    `;

    const rawArticles = NewsParser.parseXmlFeed(xmlFeed);
    if (rawArticles.length !== 1) throw new Error(`Expected 1 raw article, got ${rawArticles.length}`);

    const article = rawArticles[0];
    if (article.title !== 'Top Software Engineering Skills in High Demand for 2026') throw new Error(`Title mismatch: ${article.title}`);

    const parsed = NewsParser.parseRawArticle(article);
    if (!parsed) throw new Error('NewsParser failed to parse extracted raw article');

    const normalized = NewsNormalizer.normalize(parsed, {
      sourceId: 'tech_career_rss',
      sourceName: 'Tech Career Insights RSS',
      defaultCategory: 'technology_careers',
    });

    if (normalized.sourceName !== 'Tech Career Insights RSS') throw new Error('Source attribution lost');
    if (normalized.sourceUrl !== 'https://techcareerinsights.com/articles/top-skills-2026') throw new Error(`Source URL not cleaned: ${normalized.sourceUrl}`);
    if (normalized.category !== 'technology_careers') throw new Error(`Category mismatch: ${normalized.category}`);
    if (normalized.status !== 'active') throw new Error('Status must be active');
    if (!normalized.thumbnailUrl || normalized.thumbnailUrl !== 'https://techcareerinsights.com/images/thumb1.jpg') {
      throw new Error(`Thumbnail lost: ${normalized.thumbnailUrl}`);
    }
    if (!normalized.contentHash || normalized.contentHash.length !== 64) throw new Error('Content hash missing');
  });

  test('should parse Atom feed with entries and media namespace tags', () => {
    const atomFeed = `
      <?xml version="1.0" encoding="utf-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
        <title>AI & Machine Learning Career Journal</title>
        <entry>
          <title type="text">Generative AI Engineer Salaries Surge Amid Enterprise Adoption</title>
          <link rel="alternate" href="https://aicarrer.org/generative-ai-salaries" />
          <id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id>
          <updated>2026-08-28T18:00:00Z</updated>
          <summary type="text">New salary reports show AI/ML prompt engineers and LLM researchers earning record packages.</summary>
          <author>
            <name>Alex Vance</name>
          </author>
          <category term="ai_careers" />
          <media:thumbnail url="https://aicarrer.org/assets/ai_surge.png" width="800" height="400" />
        </entry>
      </feed>
    `;

    const rawArticles = NewsParser.parseXmlFeed(atomFeed);
    if (rawArticles.length !== 1) throw new Error(`Expected 1 raw article, got ${rawArticles.length}`);

    const parsed = NewsParser.parseRawArticle(rawArticles[0]);
    if (!parsed) throw new Error('NewsParser failed on Atom entry');

    const normalized = NewsNormalizer.normalize(parsed, {
      sourceId: 'ai_journal',
      sourceName: 'AI Career Journal',
    });

    if (normalized.category !== 'ai_careers') throw new Error(`Expected category ai_careers, got ${normalized.category}`);
    if (!normalized.tags?.includes('salary')) throw new Error(`Expected tags to include 'salary', got ${JSON.stringify(normalized.tags)}`);
    if (normalized.author !== 'Alex Vance') throw new Error(`Author mismatch: ${normalized.author}`);
    if (normalized.thumbnailUrl !== 'https://aicarrer.org/assets/ai_surge.png') throw new Error(`Thumbnail mismatch: ${normalized.thumbnailUrl}`);
  });

  test('should classify taxonomy accurately across diverse domains', () => {
    const placement = classifyNewsTaxonomy(
      'IIT Madras campus placement phase 1 concludes with 1200 job offers',
      'Engineering freshers received high compensation packages from multinational corporations.',
      ['Campus', 'India']
    );
    if (placement.primaryCategory !== 'placements') {
      throw new Error(`Expected placements, got ${placement.primaryCategory}`);
    }
    if (!placement.tags.includes('india') || !placement.tags.includes('freshers')) {
      throw new Error(`Tags missing india or freshers: ${JSON.stringify(placement.tags)}`);
    }

    const aiArticle = classifyNewsTaxonomy(
      'OpenAI and Nvidia announce joint initiative for deep learning hiring',
      'Cloud compute infrastructure demands are driving a surge in machine learning engineers.',
      ['AI', 'Startups']
    );
    if (aiArticle.primaryCategory !== 'ai_careers') {
      throw new Error(`Expected ai_careers, got ${aiArticle.primaryCategory}`);
    }
  });

  test('should clean tracking parameters from canonical URLs while preserving legitimate queries', () => {
    const dirtyUrl = 'https://news.example.com/article/123?utm_source=twitter&utm_medium=social&utm_campaign=launch&id=999';
    const cleaned = cleanCanonicalUrl(dirtyUrl);
    if (cleaned.includes('utm_source') || cleaned.includes('utm_medium')) {
      throw new Error(`Tracking params not stripped: ${cleaned}`);
    }
    if (!cleaned.includes('id=999')) {
      throw new Error(`Legitimate parameter stripped: ${cleaned}`);
    }
  });

  test('should reject malformed articles lacking essential fields', () => {
    const badArticle = {
      title: '', // empty title
      link: 'https://example.com/article',
    };
    const parsed = NewsParser.parseRawArticle(badArticle);
    if (parsed !== null) throw new Error('Should reject article with empty title');
  });

  return results;
}
