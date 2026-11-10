/** Local browser fixture only. Binds loopback and never connects to Hostinger or MySQL. */
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { Router } from 'express';

import { createApp } from '../app.js';
import { createDefaultSnapshot } from '../../src/lib/defaultSnapshot.js';
import { importSnapshot } from '../migration/importSnapshot.js';
import { createImportRouter } from '../migration/routes.js';
import type { PortfolioSnapshotV1 } from '../content/schema.js';
import type { MediaRecord } from '../media/repository.js';

const port = 4173;
const origin = `http://127.0.0.1:${port}`;
const uploadRoot = await mkdtemp(path.join(os.tmpdir(), 'portfolio-browser-fixture-'));
let draft = createDefaultSnapshot();
let published = structuredClone(draft);
let draftVersion = 1;
let publishedVersion = 1;
const records: MediaRecord[] = [];

const authRouter = Router();
authRouter.get('/me', (_req, res) => res.json({ admin: { id: 1, username: 'local-fixture' } }));

const publicRouter = Router();
publicRouter.get('/content', (_req, res) => res.json({ snapshot: published, publishedVersion, publishedAt: new Date().toISOString() }));

const adminRouter = Router();
adminRouter.use((req, _res, next) => { req.admin = { id: 1, username: 'local-fixture' }; next(); });
adminRouter.get('/content/draft', (_req, res) => res.json({ snapshot: draft, draftVersion }));
adminRouter.put('/content/draft', (req, res) => {
  if (req.body.expectedDraftVersion !== draftVersion) { res.status(409).json({ error: 'CONTENT_CONFLICT', currentVersion: draftVersion }); return; }
  draft = req.body.snapshot as PortfolioSnapshotV1;
  draftVersion += 1;
  res.json({ snapshot: draft, draftVersion });
});
adminRouter.post('/content/publish', (req, res) => {
  if (req.body.expectedDraftVersion !== draftVersion) { res.status(409).json({ error: 'CONTENT_CONFLICT', currentVersion: draftVersion }); return; }
  published = structuredClone(draft);
  publishedVersion += 1;
  res.json({ snapshot: published, publishedVersion, publishedAt: new Date().toISOString() });
});
adminRouter.use(createImportRouter((snapshot, expectedVersion, adminId) => importSnapshot(snapshot, {
  uploadRoot, adminId, expectedDraftVersion: expectedVersion,
  saveDraft: async (value, version, _actorId, media) => {
    if (version !== draftVersion) throw new Error('fixture version conflict');
    records.push(...media);
    draft = value;
    draftVersion += 1;
    return { snapshot: draft, draftVersion };
  },
})));

const app = createApp({
  publicOrigin: origin,
  uploadRoot,
  distDir: path.resolve('dist'),
  trustProxy: 0,
  checkHealth: async () => ({ ok: true, missingTables: [], mainSitePresent: true }),
  authRouter, publicRouter, adminRouter, mediaRouter: Router(),
});
const server = app.listen(port, '127.0.0.1', () => {
  process.stdout.write(`Local browser fixture: ${origin}\n`);
});
const close = () => server.close(() => { void rm(uploadRoot, { recursive: true, force: true }).finally(() => process.exit(0)); });
process.once('SIGINT', close);
process.once('SIGTERM', close);
