import path from 'node:path';

import express, { type Express, type Router } from 'express';
import helmet from 'helmet';
import multer from 'multer';

import type { DatabaseHealth } from './db.js';
import { asyncHandler } from './http/asyncHandler.js';
import { originGuard } from './security/originGuard.js';

export interface CreateAppDependencies {
  publicOrigin: string;
  uploadRoot: string;
  distDir: string;
  trustProxy: number;
  checkHealth(): Promise<DatabaseHealth>;
  authRouter: Router;
  publicRouter: Router;
  adminRouter: Router;
  mediaRouter: Router;
}

export const createApp = (deps: CreateAppDependencies): Express => {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', deps.trustProxy);
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'same-site' },
    contentSecurityPolicy: {
      directives: {
        frameSrc: ["'self'", 'https://www.youtube-nocookie.com', 'https://www.youtube.com', 'https://player.vimeo.com'],
        mediaSrc: ["'self'", 'https:', 'data:'],
        connectSrc: ["'self'"],
      },
    },
  }));
  app.use('/api', originGuard(deps.publicOrigin));
  app.use(express.json({ limit: '25mb' }));

  app.get('/api/health', asyncHandler(async (_req, res) => {
    const health = await deps.checkHealth();
    if (!health.ok) {
      res.status(503).json({ ok: false, database: 'unavailable' });
      return;
    }
    res.json({ ok: true, database: 'ready' });
  }));

  app.use('/api/public', deps.publicRouter);
  app.use('/api/auth', deps.authRouter);
  app.use('/api/admin', deps.adminRouter);
  app.use('/api/admin', deps.mediaRouter);
  app.use('/media', express.static(deps.uploadRoot, { index: false, immutable: true, maxAge: '1y' }));
  app.use(express.static(deps.distDir, { index: false }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/media/')) {
      res.status(404).json({ error: 'NOT_FOUND' });
      return;
    }
    res.sendFile(path.join(deps.distDir, 'index.html'), (error) => {
      if (error) next(error);
    });
  });

  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ error: 'UPLOAD_TOO_LARGE' });
      return;
    }
    if ((error as { type?: string }).type === 'entity.too.large') {
      res.status(413).json({ error: 'PAYLOAD_TOO_LARGE' });
      return;
    }
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  });

  return app;
};
