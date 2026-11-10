import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Router } from 'express';

import { createApp } from './app.js';
import { bootstrapInitialAdmin } from './auth/initialAdmin.js';
import { requireAdmin } from './auth/middleware.js';
import { MySqlAuthRepository } from './auth/mysqlRepository.js';
import { createAuthRouter } from './auth/routes.js';
import { loadConfig } from './config.js';
import { createAdminContentRouter, createPublicContentRouter } from './content/routes.js';
import { MySqlContentRepository } from './content/mysqlRepository.js';
import { ContentService } from './content/service.js';
import { checkDatabase, createDbPool, type QueryablePool } from './db.js';
import { MySqlMediaRepository } from './media/mysqlRepository.js';
import { createMediaRouter } from './media/routes.js';
import { importSnapshot } from './migration/importSnapshot.js';

async function startServer(): Promise<void> {
const config = loadConfig();
const pool = createDbPool(config);
const authRepository = new MySqlAuthRepository(pool);
const initialAdminResult = await bootstrapInitialAdmin(authRepository, process.env);
if (initialAdminResult === 'created') {
  process.stdout.write('Initial admin account created\n');
} else if (initialAdminResult === 'skipped-existing') {
  process.stdout.write('Initial admin bootstrap skipped because an admin already exists\n');
}
const contentService = new ContentService(new MySqlContentRepository(pool));
const mediaRepository = new MySqlMediaRepository(pool);
const authenticate = requireAdmin({ repository: authRepository });

const adminRouter = Router();
adminRouter.use(authenticate);
adminRouter.use(createAdminContentRouter(contentService, (_req, _res, next) => next()));
adminRouter.use(createMediaRouter({
  repository: mediaRepository,
  uploadRoot: config.uploadRoot,
  getDraft: (adminId) => contentService.getDraft(adminId),
  getPublished: () => contentService.getPublished(),
}));
adminRouter.post('/content/import', async (req, res) => {
  try {
    res.json(await importSnapshot(req.body.snapshot, {
      mediaRepository,
      uploadRoot: config.uploadRoot,
      adminId: req.admin!.id,
      expectedDraftVersion: req.body.expectedDraftVersion,
      saveDraft: (snapshot, version, adminId) => contentService.saveDraft(snapshot, version, adminId),
    }));
  } catch {
    res.status(400).json({ error: 'IMPORT_FAILED' });
  }
});

const dirname = path.dirname(fileURLToPath(import.meta.url));
const app = createApp({
  publicOrigin: config.publicOrigin,
  uploadRoot: config.uploadRoot,
  distDir: path.resolve(dirname, '../dist'),
  trustProxy: config.trustProxy,
  checkHealth: () => checkDatabase(pool as unknown as QueryablePool),
  authRouter: createAuthRouter({ repository: authRepository }),
  publicRouter: createPublicContentRouter(contentService),
  adminRouter,
  mediaRouter: Router(),
});

const server = app.listen(config.port, '0.0.0.0', () => {
  process.stdout.write(`Server listening on port ${config.port}\n`);
});

const shutdown = (): void => {
  server.close(() => {
    void pool.end().finally(() => process.exit(0));
  });
};
process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
}

void startServer().catch((error: unknown) => {
  console.error('Server startup failed', error);
  process.exitCode = 1;
});
