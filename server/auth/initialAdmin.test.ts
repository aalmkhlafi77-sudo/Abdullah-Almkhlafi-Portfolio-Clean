import assert from 'node:assert/strict';
import test from 'node:test';

import type { AdminRecord } from './repository.js';
import { bootstrapInitialAdmin } from './initialAdmin.js';
import { verifyPassword } from './password.js';

const unusedRepository = {
  async countAdmins(): Promise<number> {
    throw new Error('countAdmins must not run when bootstrap is disabled');
  },
  async createAdmin(_input: Omit<AdminRecord, 'id'>): Promise<AdminRecord> {
    throw new Error('createAdmin must not run when bootstrap is disabled');
  },
};

test('initial admin bootstrap stays disabled when both temporary variables are absent', async () => {
  const result = await bootstrapInitialAdmin(unusedRepository, {});

  assert.equal(result, 'disabled');
});

test('initial admin bootstrap rejects a partially configured credential pair', async () => {
  await assert.rejects(
    () => bootstrapInitialAdmin(unusedRepository, { INITIAL_ADMIN_USERNAME: 'abdullah' }),
    /INITIAL_ADMIN_USERNAME and INITIAL_ADMIN_PASSWORD must be provided together/,
  );
  await assert.rejects(
    () => bootstrapInitialAdmin(unusedRepository, { INITIAL_ADMIN_PASSWORD: 'a-secure-password' }),
    /INITIAL_ADMIN_USERNAME and INITIAL_ADMIN_PASSWORD must be provided together/,
  );
});

test('initial admin bootstrap rejects passwords shorter than twelve characters', async () => {
  await assert.rejects(
    () => bootstrapInitialAdmin(unusedRepository, {
      INITIAL_ADMIN_USERNAME: 'abdullah',
      INITIAL_ADMIN_PASSWORD: 'short-pass',
    }),
    /INITIAL_ADMIN_PASSWORD must contain at least 12 characters/,
  );
});

test('initial admin bootstrap never creates another account when an admin already exists', async () => {
  const repository = {
    async countAdmins(): Promise<number> {
      return 1;
    },
    async createAdmin(_input: Omit<AdminRecord, 'id'>): Promise<AdminRecord> {
      throw new Error('createAdmin must not run when an admin already exists');
    },
  };

  const result = await bootstrapInitialAdmin(repository, {
    INITIAL_ADMIN_USERNAME: 'second-admin',
    INITIAL_ADMIN_PASSWORD: 'another-secure-password',
  });

  assert.equal(result, 'skipped-existing');
});

test('initial admin bootstrap creates the first active account with a hashed password', async () => {
  let created: Omit<AdminRecord, 'id'> | undefined;
  const repository = {
    async countAdmins(): Promise<number> {
      return 0;
    },
    async createAdmin(input: Omit<AdminRecord, 'id'>): Promise<AdminRecord> {
      created = input;
      return { ...input, id: 1 };
    },
  };
  const password = 'a-unique-secure-password';

  const result = await bootstrapInitialAdmin(repository, {
    INITIAL_ADMIN_USERNAME: '  abdullah  ',
    INITIAL_ADMIN_PASSWORD: password,
  });

  assert.equal(result, 'created');
  assert.equal(created?.username, 'abdullah');
  assert.equal(created?.isActive, true);
  assert.notEqual(created?.passwordHash, password);
  assert.equal(await verifyPassword(password, created?.passwordHash ?? ''), true);
});
