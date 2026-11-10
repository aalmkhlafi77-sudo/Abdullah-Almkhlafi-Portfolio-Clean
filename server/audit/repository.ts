import type { AuditEntry } from '../content/repository.js';
import type { Pool, PoolConnection } from 'mysql2/promise';

export interface AuditRepository {
  write(entry: AuditEntry, executor?: Pool | PoolConnection): Promise<void>;
}
