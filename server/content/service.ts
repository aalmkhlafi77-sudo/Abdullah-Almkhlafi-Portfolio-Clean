import type { ContentRepository } from './repository.js';
import type { MediaRecord } from '../media/repository.js';
import { validatePortfolioSnapshot, type PortfolioSnapshotV1 } from './schema.js';
import type { DraftContentResult, PublishedContentResult } from './types.js';

export class ContentConflictError extends Error {
  constructor(public readonly currentVersion: number) {
    super('The draft was changed by another session');
    this.name = 'ContentConflictError';
  }
}

export class ContentNotPublishedError extends Error {
  constructor() {
    super('No content has been published');
    this.name = 'ContentNotPublishedError';
  }
}

export class ContentVersionNotFoundError extends Error {
  constructor() {
    super('Content version was not found');
    this.name = 'ContentVersionNotFoundError';
  }
}

export class ContentService {
  constructor(
    private readonly repository: ContentRepository,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async getPublished(): Promise<PublishedContentResult> {
    const document = await this.repository.getDocument();
    if (!document.published || !document.publishedAt) throw new ContentNotPublishedError();
    return {
      snapshot: document.published,
      publishedVersion: document.publishedVersion,
      publishedAt: document.publishedAt,
    };
  }

  async getDraft(_adminId: number): Promise<DraftContentResult> {
    const document = await this.repository.getDocument();
    return { snapshot: document.draft, draftVersion: document.draftVersion };
  }

  async saveDraft(
    snapshot: PortfolioSnapshotV1,
    expectedVersion: number,
    adminId: number,
  ): Promise<DraftContentResult> {
    const clean = validatePortfolioSnapshot(snapshot);
    return this.repository.transaction(async (transaction) => {
      const current = await transaction.getDocumentForUpdate();
      if (current.draftVersion !== expectedVersion) throw new ContentConflictError(current.draftVersion);
      const draftVersion = current.draftVersion + 1;
      await transaction.updateDraft(clean, draftVersion, adminId);
      await transaction.writeAudit({
        adminId,
        action: 'content.draft.save',
        entityType: 'site_document',
        entityId: 'main_site',
        metadata: { draftVersion },
      });
      return { snapshot: clean, draftVersion };
    });
  }

  async importDraft(
    snapshot: PortfolioSnapshotV1,
    expectedVersion: number,
    adminId: number,
    mediaRecords: MediaRecord[],
  ): Promise<DraftContentResult> {
    const clean = validatePortfolioSnapshot(snapshot);
    return this.repository.transaction(async (transaction) => {
      const current = await transaction.getDocumentForUpdate();
      if (current.draftVersion !== expectedVersion) throw new ContentConflictError(current.draftVersion);
      for (const record of mediaRecords) await transaction.insertMedia(record);
      const draftVersion = current.draftVersion + 1;
      await transaction.updateDraft(clean, draftVersion, adminId);
      await transaction.writeAudit({
        adminId,
        action: 'content.import',
        entityType: 'site_document',
        entityId: 'main_site',
        metadata: { draftVersion, importedMedia: mediaRecords.length },
      });
      return { snapshot: clean, draftVersion };
    });
  }

  async publish(
    expectedDraftVersion: number,
    adminId: number,
    note: string | null = null,
  ): Promise<PublishedContentResult> {
    return this.repository.transaction(async (transaction) => {
      const current = await transaction.getDocumentForUpdate();
      if (current.draftVersion !== expectedDraftVersion) throw new ContentConflictError(current.draftVersion);
      const snapshot = validatePortfolioSnapshot(current.draft);
      const publishedVersion = current.publishedVersion + 1;
      const publishedAt = this.now();
      await transaction.insertVersion({
        versionNumber: publishedVersion,
        snapshot,
        note,
        createdBy: adminId,
        createdAt: publishedAt,
      });
      await transaction.updatePublished(snapshot, publishedVersion, adminId, publishedAt);
      await transaction.writeAudit({
        adminId,
        action: 'content.publish',
        entityType: 'site_document',
        entityId: 'main_site',
        metadata: { publishedVersion, note },
      });
      return { snapshot, publishedVersion, publishedAt };
    });
  }

  async restore(versionId: number, adminId: number): Promise<DraftContentResult> {
    const version = await this.repository.getVersion(versionId);
    if (!version) throw new ContentVersionNotFoundError();
    const snapshot = validatePortfolioSnapshot(version.snapshot);
    return this.repository.transaction(async (transaction) => {
      const current = await transaction.getDocumentForUpdate();
      const draftVersion = current.draftVersion + 1;
      await transaction.updateDraft(snapshot, draftVersion, adminId);
      await transaction.writeAudit({
        adminId,
        action: 'content.restore',
        entityType: 'content_version',
        entityId: String(versionId),
        metadata: { draftVersion, restoredPublishedVersion: version.versionNumber },
      });
      return { snapshot, draftVersion };
    });
  }
}
