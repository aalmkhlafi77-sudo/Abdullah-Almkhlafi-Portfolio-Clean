import type { Pool, PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import { MySqlAuditRepository } from '../audit/mysqlRepository.js';
import type {
  AuditEntry,
  ContentDocument,
  ContentRepository,
  ContentTransaction,
  ContentVersion,
} from './repository.js';
import { validatePortfolioSnapshot, type PortfolioSnapshotV1 } from './schema.js';

type DocumentRow = RowDataPacket & {
  id: number;
  documentKey: 'main_site';
  draftJson: string | PortfolioSnapshotV1;
  publishedJson: string | PortfolioSnapshotV1 | null;
  draftVersion: number;
  publishedVersion: number;
  publishedAt: Date | null;
};

type VersionRow = RowDataPacket & {
  id: number;
  versionNumber: number;
  snapshotJson: string | PortfolioSnapshotV1;
  note: string | null;
  createdBy: number;
  createdAt: Date;
};

const parseJson = (value: string | PortfolioSnapshotV1): PortfolioSnapshotV1 =>
  validatePortfolioSnapshot(typeof value === 'string' ? JSON.parse(value) : value);

const emptyBootstrapSnapshot = (): PortfolioSnapshotV1 => ({
  schemaVersion: 1,
  profile: {} as PortfolioSnapshotV1['profile'],
  metrics: [],
  services: [],
  solutions: [],
  projects: [],
  articles: [],
  mediaList: [],
  pages: [],
  showcaseApps: [],
  showcaseBarConfig: {} as PortfolioSnapshotV1['showcaseBarConfig'],
  cvResumeData: {} as PortfolioSnapshotV1['cvResumeData'],
  heroConfig: {} as PortfolioSnapshotV1['heroConfig'],
  brandVideoUrl: '',
  savedAt: '1970-01-01T00:00:00.000Z',
});

export const parseStoredDraft = (value: string | PortfolioSnapshotV1): PortfolioSnapshotV1 => {
  const parsed = typeof value === 'string' ? JSON.parse(value) : value;
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Object.keys(parsed).length === 0) {
    return validatePortfolioSnapshot(emptyBootstrapSnapshot());
  }
  return validatePortfolioSnapshot(parsed);
};

const mapDocument = (row: DocumentRow): ContentDocument => ({
  id: row.id,
  key: row.documentKey,
  draft: parseStoredDraft(row.draftJson),
  published: row.publishedJson === null ? null : parseJson(row.publishedJson),
  draftVersion: Number(row.draftVersion),
  publishedVersion: Number(row.publishedVersion),
  publishedAt: row.publishedAt ? new Date(row.publishedAt) : null,
});

const mapVersion = (row: VersionRow): ContentVersion => ({
  id: row.id,
  versionNumber: Number(row.versionNumber),
  snapshot: parseJson(row.snapshotJson),
  note: row.note,
  createdBy: row.createdBy,
  createdAt: new Date(row.createdAt),
});

const documentSelect = `SELECT id, document_key AS documentKey, draft_json AS draftJson,
  published_json AS publishedJson, draft_version AS draftVersion,
  published_version AS publishedVersion, published_at AS publishedAt
  FROM site_documents WHERE document_key = 'main_site'`;

export class MySqlContentRepository implements ContentRepository {
  private readonly audit: MySqlAuditRepository;

  constructor(private readonly pool: Pool) {
    this.audit = new MySqlAuditRepository(pool);
  }

  async getDocument(): Promise<ContentDocument> {
    const [rows] = await this.pool.query<DocumentRow[]>(`${documentSelect} LIMIT 1`);
    if (!rows[0]) throw new Error('main_site document is missing');
    return mapDocument(rows[0]);
  }

  async getVersion(id: number): Promise<ContentVersion | null> {
    const [rows] = await this.pool.execute<VersionRow[]>(
      `SELECT id, version_number AS versionNumber, snapshot_json AS snapshotJson,
       note, created_by AS createdBy, created_at AS createdAt
       FROM content_versions WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0] ? mapVersion(rows[0]) : null;
  }

  async transaction<T>(work: (transaction: ContentTransaction) => Promise<T>): Promise<T> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await work(this.createTransaction(connection));
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  private createTransaction(connection: PoolConnection): ContentTransaction {
    return {
      getDocumentForUpdate: async () => {
        const [rows] = await connection.query<DocumentRow[]>(`${documentSelect} FOR UPDATE`);
        if (!rows[0]) throw new Error('main_site document is missing');
        return mapDocument(rows[0]);
      },
      updateDraft: async (snapshot, version, adminId) => {
        await connection.execute(
          `UPDATE site_documents SET draft_json = ?, draft_version = ?, updated_by = ?
           WHERE document_key = 'main_site'`,
          [JSON.stringify(snapshot), version, adminId],
        );
      },
      updatePublished: async (snapshot, version, adminId, publishedAt) => {
        await connection.execute(
          `UPDATE site_documents SET published_json = ?, published_version = ?, published_by = ?, published_at = ?
           WHERE document_key = 'main_site'`,
          [JSON.stringify(snapshot), version, adminId, publishedAt],
        );
      },
      insertVersion: async (version) => {
        const [result] = await connection.execute<ResultSetHeader>(
          `INSERT INTO content_versions
           (site_document_id, version_number, snapshot_json, note, created_by, created_at)
           VALUES ((SELECT id FROM site_documents WHERE document_key = 'main_site'), ?, ?, ?, ?, ?)`,
          [version.versionNumber, JSON.stringify(version.snapshot), version.note, version.createdBy, version.createdAt],
        );
        return { ...version, id: result.insertId };
      },
      writeAudit: (entry: AuditEntry) => this.audit.write(entry, connection),
    };
  }
}
