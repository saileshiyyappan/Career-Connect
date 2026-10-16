import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { jobSearchService } from './server/search/JobSearchService';
import { companySearchService } from './server/search/CompanySearchService';
import { JobSearchParams, CompanySearchParams } from './server/search/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ========================================================================
  // HEALTH & STATUS
  // ========================================================================
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'CareerConnect Search Gateway',
      version: '2.0.0',
    });
  });

  // ========================================================================
  // PROVIDER METRICS & OBSERVABILITY
  // ========================================================================
  app.get('/api/search/providers', (_req: Request, res: Response) => {
    try {
      const jobMetrics = jobSearchService.getProviderMetrics();
      const compMetrics = companySearchService.getProviderMetrics();
      res.json({
        success: true,
        jobProviders: jobMetrics,
        companyProviders: compMetrics,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err instanceof Error ? err.message : 'Failed to retrieve provider metrics',
      });
    }
  });

  // ========================================================================
  // GLOBAL JOB SEARCH GATEWAY
  // ========================================================================
  app.get('/api/search/jobs', async (req: Request, res: Response) => {
    try {
      const queryParams: JobSearchParams = {
        query: req.query.query ? String(req.query.query) : undefined,
        company: req.query.company ? String(req.query.company) : undefined,
        location: req.query.location ? String(req.query.location) : undefined,
        category: req.query.category ? String(req.query.category) : undefined,
        type: req.query.type ? String(req.query.type) : undefined,
        remoteOnly: req.query.remoteOnly === 'true',
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
      };

      const result = await jobSearchService.searchJobs(queryParams);
      res.json(result);
    } catch (err) {
      console.error('Job search gateway error:', err instanceof Error ? err.message : 'unknown error');
      res.status(500).json({
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
  });

  // ========================================================================
  // GLOBAL COMPANY SEARCH GATEWAY
  // ========================================================================
  app.get('/api/search/companies', async (req: Request, res: Response) => {
    try {
      const queryParams: CompanySearchParams = {
        query: req.query.query ? String(req.query.query) : undefined,
        industry: req.query.industry ? String(req.query.industry) : undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 24,
      };

      const result = await companySearchService.searchCompanies(queryParams);
      res.json(result);
    } catch (err) {
      console.error('Company search gateway error:', err);
      res.status(500).json({
        success: false,
        data: [],
        total: 0,
        page: 1,
        limit: 24,
        hasMore: false,
        cached: false,
        queryTimeMs: 0,
        providersQueried: [],
        error: err instanceof Error ? err.message : 'Company search is temporarily unavailable. Please try again.',
      });
    }
  });

  // ========================================================================
  // VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVE
  // ========================================================================
  const server = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      plugins: [
        {
          name: 'vite-disable-hmr-client-ws',
          apply: 'serve',
          transform(code, id) {
            // When DISABLE_HMR is true, prevent Vite's injected @vite/client runtime from attempting
            // unsupported WebSocket connections to closed ports (24678) or through reverse proxies.
            if (process.env.DISABLE_HMR === 'true' && id.includes('vite/dist/client/client.mjs')) {
              return code.replace(
                'async connect(handlers) {',
                'async connect(handlers) { return;'
              );
            }
          },
        },
      ],
      server: {
        middlewareMode: true,
        // In AI Studio / containerized reverse-proxy environments, attach HMR directly to
        // the main HTTP server to prevent Vite from binding to port 24678 (which is blocked by proxy).
        // If DISABLE_HMR is set to true, disable WebSocket creation entirely.
        hmr: isHmrDisabled ? false : { server },
        ws: !isHmrDisabled,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerConnect Server & Search Gateway running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
