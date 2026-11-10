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

test('backup import waits for an in-flight save and advances only after confirmed import', async () => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  const calls: number[] = [];
  const queue = createDraftSaveQueue({
    saveDraft: async (snapshot: { name: string }, version: number) => {
      await pending;
      return { snapshot, draftVersion: version + 1 };
    },
    publish: async () => ({}),
  }, 5);
  const save = queue.save({ name: 'before' });
  const imported = queue.importSnapshot({ name: 'backup' }, async (snapshot, version) => {
    calls.push(version);
    return { snapshot, draftVersion: version + 1 };
  });
  release();
  await Promise.all([save, imported]);
  assert.deepEqual(calls, [6]);
  assert.equal(queue.version, 7);
  await assert.rejects(() => queue.importSnapshot({ name: 'bad' }, async () => { throw new Error('failed import'); }), /failed import/);
  assert.equal(queue.version, 7);
});
