import assert from 'node:assert/strict';
import test from 'node:test';

import { asyncHandler } from './asyncHandler.js';

test('forwards rejected async route handlers to Express error middleware', async () => {
  const marker = new Error('database unavailable');
  let forwarded: unknown;
  const wrapped = asyncHandler(async () => { throw marker; });

  await new Promise<void>((resolve) => {
    wrapped({} as never, {} as never, (error?: unknown) => {
      forwarded = error;
      resolve();
    });
  });

  assert.equal(forwarded, marker);
});
