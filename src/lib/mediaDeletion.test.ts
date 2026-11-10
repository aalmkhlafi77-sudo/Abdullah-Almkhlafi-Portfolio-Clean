import assert from 'node:assert/strict';
import test from 'node:test';

import { persistMediaDeletion } from './mediaDeletion.js';

test('saves content references before deleting the persistent media file', async () => {
  const calls: string[] = [];

  await persistMediaDeletion('media-1', {
    saveDraftWithoutMedia: async () => { calls.push('save-draft'); },
    deleteMediaFile: async () => { calls.push('delete-file'); },
  });

  assert.deepEqual(calls, ['save-draft', 'delete-file']);
});

test('never deletes the persistent file when saving the updated draft fails', async () => {
  let deleted = false;

  await assert.rejects(() => persistMediaDeletion('media-1', {
    saveDraftWithoutMedia: async () => { throw new Error('save failed'); },
    deleteMediaFile: async () => { deleted = true; },
  }), /save failed/);

  assert.equal(deleted, false);
});
