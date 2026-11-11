import assert from 'node:assert/strict';
import test from 'node:test';

import { persistBrandVideoFile } from './videoUpload.js';

test('video upload does not change the draft or report success before the server confirms storage', async () => {
  let finish!: (value: { publicUrl: string; mimeType: string }) => void;
  const pending = new Promise<{ publicUrl: string; mimeType: string }>((resolve) => { finish = resolve; });
  const updates: string[] = [];
  const notices: string[] = [];
  const file = new File(['video'], 'clip.mp4', { type: 'video/mp4' });
  const uploading = persistBrandVideoFile(file, async () => pending, (url) => updates.push(url), (message) => notices.push(message));
  assert.deepEqual(updates, []);
  assert.deepEqual(notices, []);
  finish({ publicUrl: '/media/123e4567-e89b-42d3-a456-426614174000.mp4', mimeType: 'video/mp4' });
  assert.equal(await uploading, true);
  assert.deepEqual(updates, ['/media/123e4567-e89b-42d3-a456-426614174000.mp4']);
  assert.equal(notices.length, 1);
});

test('failed video upload leaves the existing draft unchanged and reports no success', async () => {
  const updates: string[] = [];
  const notices: string[] = [];
  const result = await persistBrandVideoFile(
    new File(['video'], 'clip.mp4', { type: 'video/mp4' }),
    async () => { throw new Error('server failure'); },
    (url) => updates.push(url),
    (message) => notices.push(message),
  );
  assert.equal(result, false);
  assert.deepEqual(updates, []);
  assert.deepEqual(notices, []);
});
