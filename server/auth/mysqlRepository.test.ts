import assert from 'node:assert/strict';
import test from 'node:test';

import type { Pool } from 'mysql2/promise';

import { MySqlAuthRepository } from './mysqlRepository.js';

test('MySQL auth repository reports the current admin count', async () => {
  const pool = {
    async execute() {
      return [[{ total: 2 }], []];
    },
  } as unknown as Pool;
  const repository = new MySqlAuthRepository(pool);

  assert.equal(await repository.countAdmins(), 2);
});
