import type { PortfolioSnapshotV1 } from './schema.js';

export interface ContentDocument {
  id: number;
  key: 'main_site';
  draft: PortfolioSnapshotV1;
  published: PortfolioSnapshotV1 | null;
  draftVersion: number;
  publishedVersion: number;
  publishedAt: Date | null;
}

export interface ContentVersion {
  id: number;
  versionNumber: number;
  snapshot: PortfolioSnapshotV1;
  note: string | null;
  createdBy: number;
  createdAt: Date;
}

export interface AuditEntry {
  adminId: number;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
}

export interface ContentTransaction {
  getDocumentForUpdate(): Promise<ContentDocument>;
  updateDraft(snapshot: PortfolioSnapshotV1, version: number, adminId: number): Promise<void>;
  updatePublished(
    snapshot: PortfolioSnapshotV1,
    version: number,
    adminId: number,
    publishedAt: Date,
  ): Promise<void>;
  insertVersion(version: Omit<ContentVersion, 'id'>): Promise<ContentVersion>;
  writeAudit(entry: AuditEntry): Promise<void>;
}

export interface ContentRepository {
  getDocument(): Promise<ContentDocument>;
  getVersion(id: number): Promise<ContentVersion | null>;
  transaction<T>(work: (transaction: ContentTransaction) => Promise<T>): Promise<T>;
}
