export interface AdminRecord {
  id: number;
  username: string;
  passwordHash: string;
  isActive: boolean;
}

export interface StoredSession {
  adminId: number;
  tokenHash: string;
  expiresAt: Date;
}

export interface AuthRepository {
  findAdminByUsername(username: string): Promise<AdminRecord | null>;
  findAdminById(id: number): Promise<AdminRecord | null>;
  createAdmin(input: Omit<AdminRecord, 'id'>): Promise<AdminRecord>;
  createSession(session: StoredSession): Promise<void>;
  findSession(tokenHash: string): Promise<StoredSession | null>;
  deleteSession(tokenHash: string): Promise<void>;
  deleteSessionsForAdmin(adminId: number): Promise<void>;
  updatePassword(adminId: number, passwordHash: string): Promise<void>;
  markLogin(adminId: number): Promise<void>;
}
