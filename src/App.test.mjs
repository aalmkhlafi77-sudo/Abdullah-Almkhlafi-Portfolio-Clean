import assert from 'node:assert/strict';
import test from 'node:test';

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

const response = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
});

test('an unpublished site still lets the first admin open the login form', async () => {
  const originalFetch = globalThis.fetch;
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const classList = { add() {}, remove() {} };
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: () => null, setItem() {} },
  });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { documentElement: { classList, setAttribute() {} }, body: { classList } },
  });
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.fetch = (input) => {
    if (String(input) === '/api/public/content') return Promise.resolve(response(404, { error: 'CONTENT_NOT_FOUND' }));
    if (String(input) === '/api/auth/me') return Promise.resolve(response(401, { error: 'AUTHENTICATION_REQUIRED' }));
    throw new Error(`Unexpected request: ${input}`);
  };

  let renderer;
  try {
    const { default: App } = await import('./App.js');
    await act(async () => { renderer = TestRenderer.create(React.createElement(App)); });

    assert.match(JSON.stringify(renderer.toJSON()), /لم يُنشر محتوى الموقع بعد/);
    const loginButton = renderer.root.findByProps({ id: 'unpublished-admin-login-btn' });
    await act(async () => { loginButton.props.onClick(); });
    assert.equal(renderer.root.findByProps({ id: 'admin-login-modal' }).type, 'div');
  } finally {
    if (renderer) await act(async () => { renderer.unmount(); });
    globalThis.fetch = originalFetch;
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
    else delete globalThis.localStorage;
    if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument);
    else delete globalThis.document;
  }
});
