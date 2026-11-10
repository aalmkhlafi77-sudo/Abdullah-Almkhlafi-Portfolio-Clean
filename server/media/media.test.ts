import assert from 'node:assert/strict';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import type { PortfolioSnapshotV1 } from '../content/schema.js';
import type { MediaRecord, MediaRepository } from './repository.js';
import { deleteMediaAsset, isMediaReferenced } from './routes.js';
import { detectImageType, resolveMediaPath, storeImage } from './storage.js';

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z7S8AAAAASUVORK5CYII=',
  'base64',
);

const emptySnapshot = (): PortfolioSnapshotV1 => ({
  schemaVersion: 1,
  profile: {} as PortfolioSnapshotV1['profile'],
  metrics: [], services: [], solutions: [], projects: [], articles: [], mediaList: [], pages: [], showcaseApps: [],
  showcaseBarConfig: {} as PortfolioSnapshotV1['showcaseBarConfig'],
  cvResumeData: {} as PortfolioSnapshotV1['cvResumeData'],
  heroConfig: {} as PortfolioSnapshotV1['heroConfig'],
  brandVideoUrl: '', savedAt: '2026-10-04T00:00:00.000Z',
});

test('detects the real image signature and rejects a declared type mismatch', async () => {
  assert.deepEqual(await detectImageType(PNG), { ext: 'png', mime: 'image/png' });
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-media-'));
  try {
    await assert.rejects(
      () => storeImage(Buffer.from('not an image'), { ext: 'png', mime: 'image/png' }, root),
      /signature/i,
    );
    assert.deepEqual(await readdir(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('stores accepted images under random names and returns a permanent media URL', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-media-'));
  try {
    const stored = await storeImage(PNG, { ext: 'png', mime: 'image/png' }, root);
    assert.match(stored.storageName, /^[a-f0-9-]{36}\.png$/);
    assert.equal(stored.publicUrl, `/media/${stored.storageName}`);
    assert.deepEqual(await readdir(root), [stored.storageName]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('rejects manipulated media paths outside the upload root', () => {
  assert.throws(() => resolveMediaPath('/srv/portfolio-media', '../outside.png'), /path/i);
  assert.throws(() => resolveMediaPath('/srv/portfolio-media', '/absolute.png'), /path/i);
});

test('detects exact media URL references anywhere in a snapshot', () => {
  const value = emptySnapshot();
  value.profile = { avatarUrl: '/media/used.png' } as PortfolioSnapshotV1['profile'];
  assert.equal(isMediaReferenced(value, '/media/used.png'), true);
  assert.equal(isMediaReferenced(value, '/media/not-used.png'), false);
});

test('refuses deletion when a media URL is used by draft or published content', async () => {
  const record: MediaRecord = {
    id: 'media-1', storageName: 'used.png', originalName: 'used.png', mimeType: 'image/png',
    sizeBytes: PNG.length, publicUrl: '/media/used.png', createdBy: 1,
  };
  let removed = false;
  const repository: MediaRepository = {
    async insert(value) { return value; },
    async findById() { return record; },
    async delete() { removed = true; },
  };
  const draft = emptySnapshot();
  draft.profile = { avatarUrl: record.publicUrl } as PortfolioSnapshotV1['profile'];

  await assert.rejects(
    () => deleteMediaAsset(record.id, { repository, uploadRoot: os.tmpdir(), draft, published: emptySnapshot() }),
    /referenced/i,
  );
  assert.equal(removed, false);
});
