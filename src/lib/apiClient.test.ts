import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ApiConflictError,
  ApiSessionExpiredError,
  createApiClient,
} from './apiClient.js';

const response = (status: number, body?: unknown): Response => new Response(
  body === undefined ? null : JSON.stringify(body),
  { status, headers: body === undefined ? undefined : { 'Content-Type': 'application/json' } },
);

test('all authenticated requests send the HttpOnly session cookie credentials mode', async () => {
  const calls: Array<{ input: string; init?: RequestInit }> = [];
  const client = createApiClient(async (input, init) => {
    calls.push({ input: String(input), init });
    return response(200, { admin: { id: 1, username: 'abdullah' } });
  });

  await client.me();
  await client.login('abdullah', 'secret');

  assert.equal(calls.length, 2);
  assert.equal(calls.every((call) => call.init?.credentials === 'include'), true);
});

test('maps a 409 response to ApiConflictError with the current server version', async () => {
  const client = createApiClient(async () => response(409, {
    error: 'CONTENT_CONFLICT', currentVersion: 12,
  }));

  await assert.rejects(
    () => client.saveDraft({} as never, 11),
    (error: unknown) => error instanceof ApiConflictError && error.currentVersion === 12,
  );
});

test('maps a 401 response to an explicit expired-session error', async () => {
  const client = createApiClient(async () => response(401, { error: 'AUTHENTICATION_REQUIRED' }));

  await assert.rejects(() => client.getDraft(), (error: unknown) => error instanceof ApiSessionExpiredError);
});

test('a failed draft save rejects so UI state and success notifications stay unchanged', async () => {
  const client = createApiClient(async () => response(500, { error: 'INTERNAL_ERROR' }));
  let status: 'unsaved' | 'saved' = 'unsaved';
  let successShown = false;

  await assert.rejects(async () => {
    await client.saveDraft({} as never, 1);
    status = 'saved';
    successShown = true;
  });

  assert.equal(status, 'unsaved');
  assert.equal(successShown, false);
});
