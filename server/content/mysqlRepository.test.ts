import assert from 'node:assert/strict';
import test from 'node:test';

import { parseStoredDraft } from './mysqlRepository.js';

test('normalizes the seeded empty main_site draft so the first JSON import can replace it', () => {
  const snapshot = parseStoredDraft('{}');

  assert.equal(snapshot.schemaVersion, 1);
  assert.equal(snapshot.savedAt, '1970-01-01T00:00:00.000Z');
  assert.deepEqual(snapshot.projects, []);
  assert.deepEqual(snapshot.heroConfig, {});
});
