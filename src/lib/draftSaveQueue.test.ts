import assert from 'node:assert/strict';
import test from 'node:test';

import { createDraftSaveQueue } from './draftSaveQueue.js';

test('serializes overlapping draft saves with the committed server version', async () => {
  const versions: number[] = [];
  let finishFirst!: () => void;
  const firstPending = new Promise<void>((resolve) => { finishFirst = resolve; });
  const queue = createDraftSaveQueue({
    saveDraft: async (snapshot: { name: string }, expectedVersion: number) => {
      versions.push(expectedVersion);
      if (snapshot.name === 'first') await firstPending;
      return { snapshot, draftVersion: expectedVersion + 1 };
    },
    publish: async (expectedVersion: number) => ({ snapshot: { name: 'published' }, publishedVersion: expectedVersion }),
  }, 4);

  const first = queue.save({ name: 'first' });
  const second = queue.save({ name: 'second' });
  finishFirst();
  await Promise.all([first, second]);

  assert.deepEqual(versions, [4, 5]);
  assert.equal(queue.version, 6);
});

test('a failed save leaves its version unchanged and does not block the next save', async () => {
  const versions: number[] = [];
  let fail = true;
  const queue = createDraftSaveQueue({
    saveDraft: async (snapshot: { name: string }, expectedVersion: number) => {
      versions.push(expectedVersion);
      if (fail) { fail = false; throw new Error('database unavailable'); }
      return { snapshot, draftVersion: expectedVersion + 1 };
    },
    publish: async (expectedVersion: number) => ({ snapshot: { name: 'published' }, publishedVersion: expectedVersion }),
  }, 4);

  await assert.rejects(() => queue.save({ name: 'first' }), /database unavailable/);
  await queue.save({ name: 'second' });
  assert.deepEqual(versions, [4, 4]);
  assert.equal(queue.version, 5);
});
