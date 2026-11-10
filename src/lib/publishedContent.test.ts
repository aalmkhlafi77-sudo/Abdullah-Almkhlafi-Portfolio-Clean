import assert from 'node:assert/strict';
import test from 'node:test';

import { ApiError } from './apiClient.js';
import { loadPublishedContent } from './publishedContent.js';

test('a failed API read never restores an old published snapshot from browser storage', async () => {
  let storageRead = false;
  const oldStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem() { storageRead = true; return JSON.stringify({ profile: { name: 'old' } }); } },
  });
  try {
    const result = await loadPublishedContent(async () => { throw new ApiError(500, 'INTERNAL_ERROR'); });
    assert.deepEqual(result, { status: 'unavailable', snapshot: null });
    assert.equal(storageRead, false);
  } finally {
    if (oldStorage === undefined) delete (globalThis as { localStorage?: Storage }).localStorage;
    else Object.defineProperty(globalThis, 'localStorage', oldStorage);
  }
});

test('an unpublished site is not presented as an API outage', async () => {
  assert.deepEqual(
    await loadPublishedContent(async () => { throw new ApiError(404, 'CONTENT_NOT_FOUND'); }),
    { status: 'unpublished', snapshot: null },
  );
});
