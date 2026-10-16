import { RawNewsArticleInput } from '../types/news';
import { cleanCanonicalUrl, sanitizeText } from '../utils/normalize';

export interface ParsedNewsArticle {
  guid: string;
  title: string;
  summary: string;
  sourceUrl: string;
  author?: string;
  category: string;
  categories?: string[];
  thumbnailUrl?: string;
  publishedAt?: string | number;
}

export class NewsParser {
  /**
   * Parses a raw JSON object or pre-parsed feed article.
   */
  static parseRawArticle(raw: RawNewsArticleInput, defaultSourceUrl?: string): ParsedNewsArticle | null {
    if (!raw || typeof raw !== 'object') return null;

    const title = sanitizeText(raw.title);
    if (!title || title.length < 3) return null;

    // An item must carry its own canonical article URL. Falling back to the
    // feed URL would create duplicate documents that do not open the article.
    const rawUrl = raw.link || raw.url || '';
    const sourceUrl = cleanCanonicalUrl(rawUrl);
    if (!sourceUrl || !sourceUrl.startsWith('http')) return null;

    // Build concise, clean summary (max 350 chars cleanly at word boundary)
    const rawSummaryText = sanitizeText(raw.description || raw.summary || raw.content || '');
    let summary = rawSummaryText;
    if (summary.length > 350) {
      const truncated = summary.substring(0, 350);
      const lastSpace = truncated.lastIndexOf(' ');
      summary = (lastSpace > 200 ? truncated.substring(0, lastSpace) : truncated) + '...';
    }

    const guid = String(raw.guid || raw.id || sourceUrl).trim();

    let author: string | undefined;
    if (typeof raw.author === 'string') author = sanitizeText(raw.author);
    else if (raw.author && typeof raw.author === 'object') author = sanitizeText(raw.author.name);
    else if (raw.creator) author = sanitizeText(raw.creator);
    else if (raw.source?.name) author = sanitizeText(raw.source.name);

    const categories: string[] = [];
    if (typeof raw.category === 'string') {
      categories.push(...raw.category.split(',').map((c) => sanitizeText(c)).filter(Boolean));
    } else if (Array.isArray(raw.category)) {
      categories.push(...raw.category.map((c) => sanitizeText(c)).filter(Boolean));
    }
    if (Array.isArray(raw.categories)) {
      categories.push(...raw.categories.map((c) => sanitizeText(c)).filter(Boolean));
    }

    const primaryCategory = categories[0] || 'Career & Industry';

    // Extract legitimate thumbnail URL (never fabricate)
    let thumbnailUrl: string | undefined;
    if (raw.thumbnail && raw.thumbnail.startsWith('http')) {
      thumbnailUrl = raw.thumbnail.trim();
    } else if (raw.urlToImage && raw.urlToImage.startsWith('http')) {
      thumbnailUrl = raw.urlToImage.trim();
    } else if (raw.image && typeof raw.image === 'object' && raw.image.url && raw.image.url.startsWith('http')) {
      thumbnailUrl = raw.image.url.trim();
    } else if (typeof raw.image === 'string' && raw.image.startsWith('http')) {
      thumbnailUrl = raw.image.trim();
    } else if (raw.enclosure?.url && raw.enclosure.url.startsWith('http')) {
      thumbnailUrl = raw.enclosure.url.trim();
    }

    return {
      guid,
      title,
      summary,
      sourceUrl,
      author,
      category: primaryCategory,
      categories,
      thumbnailUrl,
      publishedAt: raw.pubDate || raw.published_at || raw.publishedAt,
    };
  }

  /**
   * Resiliently parses RSS 2.0 / Atom XML text into an array of RawNewsArticleInput objects.
   */
  static parseXmlFeed(xmlText: string): RawNewsArticleInput[] {
    const articles: RawNewsArticleInput[] = [];
    if (!xmlText || typeof xmlText !== 'string') return articles;

    // Match either RSS <item> blocks or Atom <entry> blocks
    const itemRegex = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
    let match: RegExpExecArray | null;

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const block = match[1];

      // 1. Extract title (with CDATA or raw)
      const titleMatch = block.match(/<title[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/title>/i);
      const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '').trim() : '';

      // 2. Extract link / url
      let link = '';
      const linkHrefMatch = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
      if (linkHrefMatch) {
        link = linkHrefMatch[1].trim();
      } else {
        const linkTagMatch = block.match(/<link[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/link>/i);
        if (linkTagMatch) {
          link = (linkTagMatch[1] || linkTagMatch[2] || '').trim();
        }
      }

      // 3. Extract guid / id
      const guidMatch = block.match(/<(?:guid|id)[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/(?:guid|id)>/i);
      const guid = guidMatch ? (guidMatch[1] || guidMatch[2] || '').trim() : link;

      // 4. Extract description / summary / content
      const descMatch = block.match(/<(?:description|summary|content:encoded|content)[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/(?:description|summary|content:encoded|content)>/i);
      const rawDescription = descMatch ? (descMatch[1] || descMatch[2] || '').trim() : '';

      // 5. Extract pubDate / published / updated / dc:date
      const dateMatch = block.match(/<(?:pubDate|published|updated|dc:date)[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/(?:pubDate|published|updated|dc:date)>/i);
      const pubDate = dateMatch ? (dateMatch[1] || dateMatch[2] || '').trim() : undefined;

      // 6. Extract author / dc:creator
      const authorMatch = block.match(/<(?:author|dc:creator)[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/(?:author|dc:creator)>/i);
      let creator = authorMatch ? (authorMatch[1] || authorMatch[2] || '').trim() : undefined;
      if (creator && creator.includes('<name>')) {
        const nameMatch = creator.match(/<name>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/name>/i);
        if (nameMatch) creator = (nameMatch[1] || nameMatch[2] || '').trim();
      }

      // 7. Extract categories
      const categories: string[] = [];
      const catRegex = /<category[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/category>/gi;
      let catMatch: RegExpExecArray | null;
      while ((catMatch = catRegex.exec(block)) !== null) {
        const catVal = (catMatch[1] || catMatch[2] || '').trim();
        if (catVal) categories.push(catVal);
      }

      // 8. Extract legitimate thumbnail
      let thumbnail: string | undefined;

      // Priority a: media:thumbnail
      const mediaThumbMatch = block.match(/<media:thumbnail[^>]+url=["']([^"']+)["'][^>]*\/?>/i);
      if (mediaThumbMatch && mediaThumbMatch[1].startsWith('http')) {
        thumbnail = mediaThumbMatch[1];
      }

      // Priority b: media:content with url
      if (!thumbnail) {
        const mediaContentMatch = block.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*\/?>/i);
        if (mediaContentMatch && mediaContentMatch[1].startsWith('http')) {
          thumbnail = mediaContentMatch[1];
        }
      }

      // Priority c: enclosure with image type or url
      if (!thumbnail) {
        const enclosureMatch = block.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*\/?>/i);
        if (enclosureMatch && enclosureMatch[1].startsWith('http')) {
          thumbnail = enclosureMatch[1];
        }
      }

      // Priority d: <img> tag in description (e.g. Times of India / Economic Times embedded img)
      if (!thumbnail && descMatch) {
        const imgMatch = block.match(/<img[^>]+src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp|cms)[^"']*)["'][^>]*\/?>/i) ||
                         block.match(/<img[^>]+src=["'](https?:\/\/[^"']+\/photo\/[^"']+)["'][^>]*\/?>/i);
        if (imgMatch) {
          thumbnail = imgMatch[1];
        }
      }

      if (title && (link || guid)) {
        articles.push({
          guid,
          title,
          description: rawDescription,
          link,
          pubDate,
          creator,
          categories: categories.length ? categories : undefined,
          thumbnail,
        });
      }
    }

    return articles;
  }
}
