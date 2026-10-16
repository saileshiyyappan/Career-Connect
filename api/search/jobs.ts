import { jobSearchService } from '../../server/search/JobSearchService';
import { JobSearchParams } from '../../server/search/types';

interface VercelRequest {
  query: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status(code: number): VercelResponse;
  json(body: unknown): void;
}

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const query = first(req.query.query);
    const company = first(req.query.company);
    const location = first(req.query.location);
    const category = first(req.query.category);
    const type = first(req.query.type);
    const page = Number(first(req.query.page) || 1);
    const limit = Number(first(req.query.limit) || 20);

    const params: JobSearchParams = {
      query: query?.slice(0, 200),
      company: company?.slice(0, 160),
      location: location?.slice(0, 160),
      category: category?.slice(0, 100),
      type: type?.slice(0, 100),
      remoteOnly: first(req.query.remoteOnly) === 'true',
      page: Number.isFinite(page) ? page : 1,
      limit: Number.isFinite(limit) ? limit : 20,
    };

    const result = await jobSearchService.searchJobs(params);
    res.status(result.success ? 200 : 503).json(result);
  } catch (error) {
    console.error('Vercel jobs API error:', error instanceof Error ? error.message : 'unknown error');
    res.status(503).json({
      success: false,
      data: [],
      total: 0,
      page: 1,
      limit: 20,
      hasMore: false,
      cached: false,
      queryTimeMs: 0,
      providersQueried: [],
      error: 'Search is temporarily unavailable. Please try again.',
    });
  }
}
