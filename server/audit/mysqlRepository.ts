import type { Pool, PoolConnection } from 'mysql2/promise';

import type { AuditRepository } from './repository.js';
import type { AuditEntry } from '../content/repository.js';

export class MySqlAuditRepository implements AuditRepository {
  constructor(private readonly pool: Pool) {}

  async write(entry: AuditEntry, executor: Pool | PoolConnection = this.pool): Promise<void> {
    await executor.execute(
      `INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, metadata_json)
       VALUES (?, ?, ?, ?, ?)`,
      [entry.adminId, entry.action, entry.entityType, entry.entityId, JSON.stringify(entry.metadata)],
    );
  }
}
