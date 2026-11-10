import { createDefaultSnapshot } from '../../src/lib/defaultSnapshot.js';

interface BootstrapConnection {
  beginTransaction(): Promise<void>;
  execute(sql: string, values?: string[]): Promise<unknown>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  release(): void;
}

export interface BootstrapPool {
  getConnection(): Promise<BootstrapConnection>;
}

const affectedRows = (result: unknown): number =>
  (result as [{ affectedRows: number }])[0].affectedRows;

/** Requires imported schema.sql. Publishes GitHub defaults only for a truly uninitialized database. */
export const ensureDefaultSiteDocument = async (pool: BootstrapPool): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const snapshot = JSON.stringify(createDefaultSnapshot());
    const inserted = await connection.execute(
      `INSERT IGNORE INTO site_documents
       (document_key, draft_json, published_json, draft_version, published_version, published_at)
       VALUES ('main_site', ?, ?, 1, 1, NOW(3))`,
      [snapshot, snapshot],
    );
    let seeded = affectedRows(inserted) === 1;
    if (!seeded) {
      // Older schema imports left an untouched {} row. A real saved empty Snapshot has keys
      // and/or a nonzero draft version, and must remain untouched on every restart.
      const updated = await connection.execute(
        `UPDATE site_documents
         SET draft_json = ?, published_json = ?, draft_version = 1,
             published_version = 1, published_at = NOW(3)
         WHERE document_key = 'main_site'
           AND JSON_TYPE(draft_json) = 'OBJECT' AND JSON_LENGTH(draft_json) = 0
           AND draft_version = 0 AND published_json IS NULL AND published_version = 0`,
        [snapshot, snapshot],
      );
      seeded = affectedRows(updated) === 1;
    }
    if (seeded) {
      await connection.execute(
        `INSERT INTO content_versions (site_document_id, version_number, snapshot_json, note)
         VALUES ((SELECT id FROM site_documents WHERE document_key = 'main_site'), 1, ?, 'Initial defaults')`,
        [snapshot],
      );
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
