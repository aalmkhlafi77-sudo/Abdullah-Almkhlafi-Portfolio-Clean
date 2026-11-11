import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

const response = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json' },
});

test('live video editor waits for durable upload before replacing the current video URL', async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const oldFetch = globalThis.fetch;
  const oldStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const classList = { add() {}, remove() {} };
  let finish;
  const pending = new Promise((resolve) => { finish = resolve; });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => null, setItem() {} } });
  Object.defineProperty(globalThis, 'document', {
    configurable: true, value: { documentElement: { classList, setAttribute() {} }, body: { classList } },
  });
  globalThis.fetch = (input) => {
    if (String(input) === '/api/public/content') return Promise.resolve(response(404, { error: 'CONTENT_NOT_FOUND' }));
    if (String(input) === '/api/auth/me') return Promise.resolve(response(401, { error: 'AUTHENTICATION_REQUIRED' }));
    if (String(input) === '/api/admin/videos') return pending;
    throw new Error(`Unexpected request: ${input}`);
  };
  let renderer, current;
  try {
    const { AppProvider, useApp } = await import('../../../context/AppContext.js');
    const { UnifiedPropertiesSidebar } = await import('./UnifiedPropertiesSidebar.js');
    const Probe = () => { current = useApp(); return null; };
    await act(async () => { renderer = TestRenderer.create(React.createElement(AppProvider, null,
      React.createElement(Probe), React.createElement(UnifiedPropertiesSidebar))); });
    await act(async () => { current.setSelectedLiveElementId('animated-brand-icon'); current.setShowLivePropertiesPanel(true); });
    const before = current.brandVideoUrl;
    const fileInput = renderer.root.findByProps({ type: 'file' });
    let uploading;
    await act(async () => { uploading = fileInput.props.onChange({ target: { files: [new File(['video'], 'clip.mp4', { type: 'video/mp4' })], value: 'clip.mp4' } }); });
    assert.equal(current.brandVideoUrl, before);
    assert.equal(current.toasts.some((toast) => toast.type === 'success' && /رفع الفيديو/.test(toast.text)), false);
    await act(async () => {
      finish(response(201, { publicUrl: '/media/123e4567-e89b-42d3-a456-426614174000.mp4', mimeType: 'video/mp4' }));
      await uploading;
    });
    assert.equal(current.brandVideoUrl, '/media/123e4567-e89b-42d3-a456-426614174000.mp4');
  } finally {
    if (renderer) await act(async () => { renderer.unmount(); });
    globalThis.fetch = oldFetch;
    if (oldStorage) Object.defineProperty(globalThis, 'localStorage', oldStorage); else delete globalThis.localStorage;
    if (oldDocument) Object.defineProperty(globalThis, 'document', oldDocument); else delete globalThis.document;
  }
});
