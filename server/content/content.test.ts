import assert from 'node:assert/strict';
import test from 'node:test';

import type { PortfolioSnapshotV1 } from './schema.js';
import type { MediaRecord } from '../media/repository.js';
import { ContentConflictError, ContentNotPublishedError, ContentService } from './service.js';
import type {
  AuditEntry,
  ContentDocument,
  ContentRepository,
  ContentTransaction,
  ContentVersion,
} from './repository.js';

const snapshot = (name: string): PortfolioSnapshotV1 => ({
  schemaVersion: 1,
  profile: { name } as PortfolioSnapshotV1['profile'],
  metrics: [], services: [], solutions: [], projects: [], articles: [], mediaList: [], pages: [],
  showcaseApps: [],
  showcaseBarConfig: {} as PortfolioSnapshotV1['showcaseBarConfig'],
  cvResumeData: {} as PortfolioSnapshotV1['cvResumeData'],
  heroConfig: {} as PortfolioSnapshotV1['heroConfig'],
  brandVideoUrl: '',
  savedAt: '2026-10-04T00:00:00.000Z',
});

class MemoryContentRepository implements ContentRepository, ContentTransaction {
  document: ContentDocument = {
    id: 1,
    key: 'main_site',
    draft: snapshot('draft-one'),
    published: snapshot('published-old'),
    draftVersion: 1,
    publishedVersion: 1,
    publishedAt: new Date('2026-10-01T00:00:00Z'),
  };
  versions: ContentVersion[] = [];
  audits: AuditEntry[] = [];
  mediaRecords: MediaRecord[] = [];
  failAudit = false;

  async getDocument() { return structuredClone(this.document); }
  async getVersion(id: number) { return structuredClone(this.versions.find((version) => version.id === id) ?? null); }
  async transaction<T>(work: (transaction: ContentTransaction) => Promise<T>): Promise<T> {
    const before = structuredClone({ document: this.document, versions: this.versions, audits: this.audits, mediaRecords: this.mediaRecords });
    try {
      return await work(this);
    } catch (error) {
      this.document = before.document;
      this.versions = before.versions;
      this.audits = before.audits;
      this.mediaRecords = before.mediaRecords;
      throw error;
    }
  }
  async getDocumentForUpdate() { return structuredClone(this.document); }
  async updateDraft(value: PortfolioSnapshotV1, version: number) {
    this.document.draft = structuredClone(value);
    this.document.draftVersion = version;
  }
  async updatePublished(value: PortfolioSnapshotV1, version: number, adminId: number, publishedAt: Date) {
    this.document.published = structuredClone(value);
    this.document.publishedVersion = version;
    this.document.publishedAt = publishedAt;
  }
  async insertVersion(value: Omit<ContentVersion, 'id'>) {
    const inserted = { ...structuredClone(value), id: this.versions.length + 1 };
    this.versions.push(inserted);
    return inserted;
  }
  async writeAudit(entry: AuditEntry) {
    if (this.failAudit) throw new Error('simulated audit failure');
    this.audits.push(structuredClone(entry));
  }
  async insertMedia(record: MediaRecord) { this.mediaRecords.push(record); }
}

test('importing media and draft commits together and respects the expected version', async () => {
  const repository = new MemoryContentRepository();
  const service = new ContentService(repository);
  const record = { id: 'image-one', storageName: 'image-one.png', originalName: 'old.png', mimeType: 'image/png', sizeBytes: 42, publicUrl: '/media/image-one.png', createdBy: 7 };
  await assert.rejects(() => service.importDraft(snapshot('stale'), 0, 7, [record]), (error: unknown) => error instanceof ContentConflictError);
  assert.equal(repository.mediaRecords.length, 0);
  await service.importDraft(snapshot('new'), 1, 7, [record]);
  assert.equal(repository.mediaRecords.length, 1);
  assert.equal(repository.document.draft.profile.name, 'new');
  assert.equal(repository.document.draftVersion, 2);
});

test('failed database write rolls back imported media and draft together', async () => {
  const repository = new MemoryContentRepository();
  repository.failAudit = true;
  const service = new ContentService(repository);
  const record = { id: 'image-one', storageName: 'image-one.png', originalName: 'old.png', mimeType: 'image/png', sizeBytes: 42, publicUrl: '/media/image-one.png', createdBy: 7 };
  await assert.rejects(() => service.importDraft(snapshot('new'), 1, 7, [record]), /audit failure/);
  assert.equal(repository.mediaRecords.length, 0);
  assert.equal(repository.document.draft.profile.name, 'draft-one');
});

test('saving a draft increments only the draft version', async () => {
  const repository = new MemoryContentRepository();
  const service = new ContentService(repository, () => new Date('2026-10-04T12:00:00Z'));

  const result = await service.saveDraft(snapshot('draft-two'), 1, 7);

  assert.equal(result.draftVersion, 2);
  assert.equal(result.snapshot.profile.name, 'draft-two');
  assert.equal(repository.document.published?.profile.name, 'published-old');
  assert.equal(repository.document.publishedVersion, 1);
});

test('a stale expected draft version is rejected without overwriting newer content', async () => {
  const repository = new MemoryContentRepository();
  const service = new ContentService(repository);

  await assert.rejects(
    () => service.saveDraft(snapshot('stale-write'), 0, 7),
    (error: unknown) => error instanceof ContentConflictError,
  );
  assert.equal(repository.document.draft.profile.name, 'draft-one');
});

test('publishing copies the draft, creates a version, and writes an audit event', async () => {
  const repository = new MemoryContentRepository();
  const service = new ContentService(repository, () => new Date('2026-10-04T12:00:00Z'));

  const result = await service.publish(1, 7, 'approved');

  assert.equal(result.snapshot.profile.name, 'draft-one');
  assert.equal(result.publishedVersion, 2);
  assert.equal(repository.versions.length, 1);
  assert.equal(repository.versions[0].snapshot.profile.name, 'draft-one');
  assert.deepEqual(repository.audits[0], {
    adminId: 7,
    action: 'content.publish',
    entityType: 'site_document',
    entityId: 'main_site',
    metadata: { publishedVersion: 2, note: 'approved' },
  });
});

test('a failure inside publish transaction preserves the previous publication', async () => {
  const repository = new MemoryContentRepository();
  repository.failAudit = true;
  const service = new ContentService(repository);

  await assert.rejects(() => service.publish(1, 7, 'will fail'), /simulated audit failure/);

  assert.equal(repository.document.published?.profile.name, 'published-old');
  assert.equal(repository.document.publishedVersion, 1);
  assert.equal(repository.versions.length, 0);
  assert.equal(repository.audits.length, 0);
});

test('restoring a historical version creates a new draft without auto-publishing it', async () => {
  const repository = new MemoryContentRepository();
  repository.versions.push({
    id: 44,
    versionNumber: 1,
    snapshot: snapshot('historical'),
    note: null,
    createdBy: 7,
    createdAt: new Date('2026-10-02T00:00:00Z'),
  });
  const service = new ContentService(repository);

  const result = await service.restore(44, 9);

  assert.equal(result.snapshot.profile.name, 'historical');
  assert.equal(result.draftVersion, 2);
  assert.equal(repository.document.published?.profile.name, 'published-old');
  assert.equal(repository.document.publishedVersion, 1);
});

test('public reads fail clearly when content has never been published', async () => {
  const repository = new MemoryContentRepository();
  repository.document.published = null;
  const service = new ContentService(repository);

  await assert.rejects(() => service.getPublished(), (error: unknown) => error instanceof ContentNotPublishedError);
});
