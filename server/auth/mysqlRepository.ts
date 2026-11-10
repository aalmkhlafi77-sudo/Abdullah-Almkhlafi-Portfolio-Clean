import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';

import type { AdminRecord, AuthRepository, StoredSession } from './repository.js';

type AdminRow = RowDataPacket & {
  id: number;
  username: string;
  passwordHash: string;
  isActive: number;
};

type SessionRow = RowDataPacket & {
  adminId: number;
  tokenHash: string;
  expiresAt: Date;
};

type AdminCountRow = RowDataPacket & {
  total: number;
};

const mapAdmin = (row: AdminRow): AdminRecord => ({
  id: row.id,
  username: row.username,
  passwordHash: row.passwordHash,
  isActive: row.isActive === 1,
});

export class MySqlAuthRepository implements AuthRepository {
  constructor(private readonly pool: Pool) {}

  async countAdmins(): Promise<number> {
    const [rows] = await this.pool.execute<AdminCountRow[]>('SELECT COUNT(*) AS total FROM admins');
    return Number(rows[0]?.total ?? 0);
  }

  async findAdminByUsername(username: string): Promise<AdminRecord | null> {
    const [rows] = await this.pool.execute<AdminRow[]>(
      'SELECT id, username, password_hash AS passwordHash, is_active AS isActive FROM admins WHERE username = ? LIMIT 1',
      [username],
    );
    return rows[0] ? mapAdmin(rows[0]) : null;
  }

  async findAdminById(id: number): Promise<AdminRecord | null> {
    const [rows] = await this.pool.execute<AdminRow[]>(
      'SELECT id, username, password_hash AS passwordHash, is_active AS isActive FROM admins WHERE id = ? LIMIT 1',
      [id],
    );
    return rows[0] ? mapAdmin(rows[0]) : null;
  }

  async createAdmin(input: Omit<AdminRecord, 'id'>): Promise<AdminRecord> {
    const [result] = await this.pool.execute<ResultSetHeader>(
      'INSERT INTO admins (username, password_hash, is_active) VALUES (?, ?, ?)',
      [input.username, input.passwordHash, input.isActive ? 1 : 0],
    );
    return { ...input, id: result.insertId };
  }

  async createSession(session: StoredSession): Promise<void> {
    await this.pool.execute(
      'INSERT INTO admin_sessions (admin_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [session.adminId, session.tokenHash, session.expiresAt],
    );
  }

  async findSession(tokenHash: string): Promise<StoredSession | null> {
    const [rows] = await this.pool.execute<SessionRow[]>(
      'SELECT admin_id AS adminId, token_hash AS tokenHash, expires_at AS expiresAt FROM admin_sessions WHERE token_hash = ? LIMIT 1',
      [tokenHash],
    );
    return rows[0] ? { adminId: rows[0].adminId, tokenHash: rows[0].tokenHash, expiresAt: new Date(rows[0].expiresAt) } : null;
  }

  async deleteSession(tokenHash: string): Promise<void> {
    await this.pool.execute('DELETE FROM admin_sessions WHERE token_hash = ?', [tokenHash]);
  }

  async deleteSessionsForAdmin(adminId: number): Promise<void> {
    await this.pool.execute('DELETE FROM admin_sessions WHERE admin_id = ?', [adminId]);
  }

  async updatePassword(adminId: number, passwordHash: string): Promise<void> {
    await this.pool.execute('UPDATE admins SET password_hash = ? WHERE id = ?', [passwordHash, adminId]);
  }

  async markLogin(adminId: number): Promise<void> {
    await this.pool.execute('UPDATE admins SET last_login_at = CURRENT_TIMESTAMP(3) WHERE id = ?', [adminId]);
  }
}
