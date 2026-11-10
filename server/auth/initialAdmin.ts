import type { AdminRecord } from './repository.js';
import { hashPassword } from './password.js';

export interface InitialAdminRepository {
  countAdmins(): Promise<number>;
  createAdmin(input: Omit<AdminRecord, 'id'>): Promise<AdminRecord>;
}

export interface InitialAdminEnvironment {
  INITIAL_ADMIN_USERNAME?: string;
  INITIAL_ADMIN_PASSWORD?: string;
}

export const bootstrapInitialAdmin = async (
  repository: InitialAdminRepository,
  env: InitialAdminEnvironment,
): Promise<'disabled' | 'created' | 'skipped-existing'> => {
  const username = env.INITIAL_ADMIN_USERNAME?.trim();
  const password = env.INITIAL_ADMIN_PASSWORD;
  if (!username && !password) return 'disabled';
  if (!username || !password) {
    throw new Error('INITIAL_ADMIN_USERNAME and INITIAL_ADMIN_PASSWORD must be provided together');
  }
  if (password.length < 12) {
    throw new Error('INITIAL_ADMIN_PASSWORD must contain at least 12 characters');
  }
  if (await repository.countAdmins() > 0) return 'skipped-existing';
  await repository.createAdmin({
    username,
    passwordHash: await hashPassword(password),
    isActive: true,
  });
  return 'created';
};
