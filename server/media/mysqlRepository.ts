import type { Pool, RowDataPacket } from 'mysql2/promise';

import type { MediaRecord, MediaRepository } from './repository.js';

type MediaRow = RowDataPacket & {
  id: string;
  storageName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  publicUrl: string;
  createdBy: number;
};

export class MySqlMediaRepository implements MediaRepository {
  constructor(private readonly pool: Pool) {}

  async insert(record: MediaRecord): Promise<MediaRecord> {
    await this.pool.execute(
      `INSERT INTO media_files
       (id, storage_name, original_name, mime_type, size_bytes, public_url, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [record.id, record.storageName, record.originalName, record.mimeType, record.sizeBytes, record.publicUrl, record.createdBy],
    );
    return record;
  }

  async findById(id: string): Promise<MediaRecord | null> {
    const [rows] = await this.pool.execute<MediaRow[]>(
      `SELECT id, storage_name AS storageName, original_name AS originalName,
       mime_type AS mimeType, size_bytes AS sizeBytes, public_url AS publicUrl,
       created_by AS createdBy FROM media_files WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0] ?? null;
  }

  async delete(id: string): Promise<void> {
    await this.pool.execute('DELETE FROM media_files WHERE id = ?', [id]);
  }
}
