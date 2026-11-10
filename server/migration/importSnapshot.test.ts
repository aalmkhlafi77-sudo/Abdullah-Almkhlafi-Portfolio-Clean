import assert from 'node:assert/strict';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import type { PortfolioSnapshotV1 } from '../content/schema.js';
import { initialMedia } from '../../src/data/initialData.js';
import type { MediaRecord, MediaRepository } from '../media/repository.js';
import { importSnapshot } from './importSnapshot.js';
import { ContentConflictError } from '../content/service.js';

const PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z7S8AAAAASUVORK5CYII=';

const snapshot = (): PortfolioSnapshotV1 => ({
  schemaVersion: 1,
  profile: { avatarUrl: `data:image/png;base64,${PNG_BASE64}` } as PortfolioSnapshotV1['profile'],
  metrics: [], services: [], solutions: [], projects: [], articles: [], mediaList: [], pages: [], showcaseApps: [],
  showcaseBarConfig: {} as PortfolioSnapshotV1['showcaseBarConfig'],
  cvResumeData: {} as PortfolioSnapshotV1['cvResumeData'],
  heroConfig: {} as PortfolioSnapshotV1['heroConfig'],
  brandVideoUrl: '', savedAt: '2026-10-04T00:00:00.000Z',
});

class MemoryMediaRepository implements MediaRepository {
  records: MediaRecord[] = [];
  async insert(value: MediaRecord) { this.records.push(value); return value; }
  async findById(id: string) { return this.records.find((record) => record.id === id) ?? null; }
  async delete(id: string) { this.records = this.records.filter((record) => record.id !== id); }
}

test('converts embedded data images to persistent /media URLs before saving draft', async () => {
  const uploadRoot = await mkdtemp(path.join(os.tmpdir(), 'portfolio-import-'));
  const repository = new MemoryMediaRepository();
  let saved: PortfolioSnapshotV1 | null = null;
  try {
    const result = await importSnapshot(snapshot(), {
      uploadRoot,
      adminId: 3,
      expectedDraftVersion: 5,
      saveDraft: async (value, expectedVersion, adminId, records) => {
        assert.equal(expectedVersion, 5);
        assert.equal(adminId, 3);
        repository.records.push(...records);
        saved = value;
        return { snapshot: value, draftVersion: 6 };
      },
    });

    assert.match(result.snapshot.profile.avatarUrl!, /^\/media\/[a-f0-9-]{36}\.png$/);
    assert.equal(saved?.profile.avatarUrl, result.snapshot.profile.avatarUrl);
    assert.equal(repository.records.length, 1);
    assert.equal((await readdir(uploadRoot)).length, 1);
  } finally {
    await rm(uploadRoot, { recursive: true, force: true });
  }
});

test('rejects blob URLs without writing files or draft content', async () => {
  const uploadRoot = await mkdtemp(path.join(os.tmpdir(), 'portfolio-import-'));
  const repository = new MemoryMediaRepository();
  const input = snapshot();
  input.profile.avatarUrl = 'blob:https://example.com/temporary';
  let saveCalls = 0;
  try {
    await assert.rejects(() => importSnapshot(input, {
      uploadRoot,
      adminId: 3,
      expectedDraftVersion: 5,
      saveDraft: async (value) => { saveCalls += 1; return { snapshot: value, draftVersion: 6 }; },
    }), /blob:/i);
    assert.equal(saveCalls, 0);
    assert.deepEqual(await readdir(uploadRoot), []);
  } finally {
    await rm(uploadRoot, { recursive: true, force: true });
  }
});

test('removes newly created files and rows when saving the imported draft fails', async () => {
  const uploadRoot = await mkdtemp(path.join(os.tmpdir(), 'portfolio-import-'));
  const repository = new MemoryMediaRepository();
  try {
    await assert.rejects(() => importSnapshot(snapshot(), {
      uploadRoot,
      adminId: 3,
      expectedDraftVersion: 5,
      saveDraft: async () => { throw new Error('database save failed'); },
    }), /database save failed/);
    assert.deepEqual(await readdir(uploadRoot), []);
    assert.deepEqual(repository.records, []);
  } finally {
    await rm(uploadRoot, { recursive: true, force: true });
  }
});

test('deduplicates repeated embedded images and gives imported gallery items a persistent record id', async () => {
  const uploadRoot = await mkdtemp(path.join(os.tmpdir(), 'portfolio-import-'));
  const repository = new MemoryMediaRepository();
  const input = snapshot();
  input.mediaList = [{ ...initialMedia[0], id: 'old-id', url: input.profile.avatarUrl! }];
  try {
    const result = await importSnapshot(input, {
      uploadRoot, adminId: 3, expectedDraftVersion: 5,
      saveDraft: async (value, _version, _adminId, records) => {
        repository.records.push(...records);
        return { snapshot: value, draftVersion: 6 };
      },
    });
    assert.equal((await readdir(uploadRoot)).length, 1);
    assert.equal(repository.records.length, 1);
    assert.equal(result.snapshot.mediaList[0].id, repository.records[0].id);
    assert.equal(result.snapshot.mediaList[0].url, result.snapshot.profile.avatarUrl);
  } finally { await rm(uploadRoot, { recursive: true, force: true }); }
});

test('media database rows are committed in the same transaction as the imported draft', async () => {
  const uploadRoot = await mkdtemp(path.join(os.tmpdir(), 'portfolio-import-'));
  const repository = new MemoryMediaRepository();
  try {
    await importSnapshot(snapshot(), {
      uploadRoot, adminId: 3, expectedDraftVersion: 5,
      saveDraft: async (value, _version, _adminId, records) => {
        assert.equal(repository.records.length, 0);
        assert.equal(records?.length, 1);
        repository.records.push(...records!);
        return { snapshot: value, draftVersion: 6 };
      },
    });
    assert.equal(repository.records.length, 1);
  } finally { await rm(uploadRoot, { recursive: true, force: true }); }
});

test('version conflict or a later invalid image leaves no staged image files', async () => {
  const uploadRoot = await mkdtemp(path.join(os.tmpdir(), 'portfolio-import-'));
  try {
    await assert.rejects(() => importSnapshot(snapshot(), {
      uploadRoot, adminId: 3, expectedDraftVersion: 5,
      saveDraft: async () => { throw new ContentConflictError(6); },
    }), (error: unknown) => error instanceof ContentConflictError && error.currentVersion === 6);
    assert.deepEqual(await readdir(uploadRoot), []);

    const input = snapshot();
    input.mediaList = [{ ...initialMedia[0], url: 'data:image/png;base64,AA==' }];
    let saved = false;
    await assert.rejects(() => importSnapshot(input, {
      uploadRoot, adminId: 3, expectedDraftVersion: 5,
      saveDraft: async (value) => { saved = true; return { snapshot: value, draftVersion: 6 }; },
    }), /image|type/i);
    assert.equal(saved, false);
    assert.deepEqual(await readdir(uploadRoot), []);
  } finally { await rm(uploadRoot, { recursive: true, force: true }); }
});
