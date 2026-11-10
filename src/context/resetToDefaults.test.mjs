import assert from 'node:assert/strict';
import test from 'node:test';

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import { initialMetrics, initialProfile, initialShowcaseBarConfig } from '../data/initialData.js';

const response = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json' },
});
const deferred = () => {
  let resolve;
  const promise = new Promise((complete) => { resolve = complete; });
  return { promise, resolve };
};
const confirmed = (body) => response(200, {
  snapshot: body.snapshot,
  draftVersion: body.expectedDraftVersion + 1,
});

let handleSave;
const fetchBridge = async (input, init) => {
  const path = String(input);
  if (path === '/api/public/content') return response(404, { error: 'CONTENT_NOT_FOUND' });
  if (path === '/api/auth/me') return response(401, { error: 'AUTHENTICATION_REQUIRED' });
  if (path === '/api/admin/content/draft' && init?.method === 'PUT') {
    return await handleSave(JSON.parse(init.body));
  }
  throw new Error(`Unexpected request: ${path}`);
};

const mountApp = async (onSave) => {
  const originalFetch = globalThis.fetch;
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const storage = new Map();
  const classList = { add() {}, remove() {} };
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
  });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { documentElement: { classList, setAttribute() {} }, body: { classList } },
  });
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  handleSave = onSave;
  globalThis.fetch = fetchBridge;

  const { AppProvider, useApp } = await import('./AppContext.js');
  let current;
  const Probe = () => { current = useApp(); return React.createElement('div', null, current.draftStatus); };
  let renderer;
  await act(async () => {
    renderer = TestRenderer.create(React.createElement(AppProvider, null, React.createElement(Probe)));
  });
  return {
    get app() { return current; },
    async close() {
      await act(async () => { renderer.unmount(); });
      globalThis.fetch = originalFetch;
      if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
      else delete globalThis.localStorage;
      if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument);
      else delete globalThis.document;
    },
  };
};

test('reset remains unsaved and shows no success before the server confirms the draft', async () => {
  const pending = deferred();
  const requests = [];
  const mounted = await mountApp(async (body) => {
    requests.push(body);
    return pending.promise;
  });
  try {
    await act(async () => {
      mounted.app.updateProfile({ name: 'تعديل قبل الاستعادة' });
      mounted.app.updateMetric(initialMetrics[0].id, { value: '999' });
      mounted.app.updateShowcaseBarConfig({ title: 'عنوان مؤقت' });
    });
    let reset;
    await act(async () => { reset = mounted.app.resetToDefaults(); });

    assert.equal(mounted.app.draftStatus, 'unsaved');
    assert.equal(mounted.app.profile.name, initialProfile.name);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].snapshot.profile.name, initialProfile.name);
    assert.deepEqual(requests[0].snapshot.metrics, initialMetrics);
    assert.deepEqual(requests[0].snapshot.showcaseBarConfig, initialShowcaseBarConfig);
    assert.equal(mounted.app.toasts.some((toast) => toast.type === 'success' && /استعادة/.test(toast.text)), false);

    await act(async () => { pending.resolve(confirmed(requests[0])); await reset; });
    assert.equal(mounted.app.draftStatus, 'saved');
    assert.equal(mounted.app.toasts.some((toast) => toast.type === 'success' && /استعادة/.test(toast.text)), true);
  } finally {
    await mounted.close();
  }
});

test('failed reset save keeps default edits visible and unsaved without success', async () => {
  const pending = deferred();
  const mounted = await mountApp(async () => pending.promise);
  try {
    let reset;
    await act(async () => { reset = mounted.app.resetToDefaults(); });
    await act(async () => { pending.resolve(response(500, { error: 'INTERNAL_ERROR' })); await reset; });
    assert.equal(mounted.app.profile.name, initialProfile.name);
    assert.equal(mounted.app.draftStatus, 'unsaved');
    assert.equal(mounted.app.toasts.some((toast) => toast.type === 'success' && /استعادة/.test(toast.text)), false);
    assert.equal(mounted.app.toasts.some((toast) => toast.type === 'warning' && /تعذر حفظ/.test(toast.text)), true);
  } finally {
    await mounted.close();
  }
});

test('reset waits for an in-flight save and uses its committed version', async () => {
  const first = deferred();
  const second = deferred();
  const requests = [];
  const mounted = await mountApp(async (body) => {
    requests.push(body);
    return requests.length === 1 ? first.promise : second.promise;
  });
  try {
    await act(async () => { mounted.app.updateProfile({ name: 'تعديل سابق' }); });
    let priorSave;
    await act(async () => { priorSave = mounted.app.saveDraft(); });
    let reset;
    await act(async () => { reset = mounted.app.resetToDefaults(); });
    assert.equal(requests.length, 1);
    assert.equal(mounted.app.draftStatus, 'unsaved');

    await act(async () => { first.resolve(confirmed(requests[0])); await priorSave; });
    assert.equal(requests.length, 2);
    assert.deepEqual(requests.map((body) => body.expectedDraftVersion), [0, 1]);
    assert.equal(requests[1].snapshot.profile.name, initialProfile.name);
    assert.equal(mounted.app.draftStatus, 'unsaved');

    await act(async () => { second.resolve(confirmed(requests[1])); await reset; });
    assert.equal(mounted.app.draftStatus, 'saved');
    assert.equal(mounted.app.profile.name, initialProfile.name);
  } finally {
    await mounted.close();
  }
});

test('new edits made during reset save are preserved and remain unsaved', async () => {
  const pending = deferred();
  const requests = [];
  const mounted = await mountApp(async (body) => {
    requests.push(body);
    return pending.promise;
  });
  try {
    let reset;
    await act(async () => { reset = mounted.app.resetToDefaults(); });
    await act(async () => { mounted.app.updateProfile({ name: 'تعديل أحدث' }); });
    await act(async () => { pending.resolve(confirmed(requests[0])); await reset; });
    assert.equal(mounted.app.profile.name, 'تعديل أحدث');
    assert.equal(mounted.app.draftStatus, 'unsaved');
    assert.equal(mounted.app.toasts.some((toast) => toast.type === 'success' && /استعادة/.test(toast.text)), false);
  } finally {
    await mounted.close();
  }
});
