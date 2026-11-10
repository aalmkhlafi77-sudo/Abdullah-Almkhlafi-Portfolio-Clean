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
import { ensureDefaultSiteDocument } from './content/bootstrap.js';
import { ContentService } from './content/service.js';
import { checkDatabase, createDbPool, type QueryablePool } from './db.js';
import { MySqlMediaRepository } from './media/mysqlRepository.js';
import { createMediaRouter } from './media/routes.js';
import { importSnapshot } from './migration/importSnapshot.js';
import { createImportRouter } from './migration/routes.js';

async function startServer(): Promise<void> {
const config = loadConfig();
const pool = createDbPool(config);
await ensureDefaultSiteDocument(pool);
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
adminRouter.use(createImportRouter((snapshot, expectedDraftVersion, adminId) => importSnapshot(snapshot, {
  uploadRoot: config.uploadRoot,
  adminId,
  expectedDraftVersion,
  saveDraft: (value, version, actorId, records) => contentService.importDraft(value, version, actorId, records),
})));

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
