import assert from 'node:assert/strict';
import test from 'node:test';

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import { initialMedia } from '../data/initialData.js';

const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z7S8AAAAASUVORK5CYII=';
const response = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json' },
});
const deferred = () => {
  let resolve;
  const promise = new Promise((complete) => { resolve = complete; });
  return { promise, resolve };
};
let handleUpload;
const fetchBridge = (input, init) => {
  const path = String(input);
  if (path === '/api/public/content') return Promise.resolve(response(404, { error: 'CONTENT_NOT_FOUND' }));
  if (path === '/api/auth/me') return Promise.resolve(response(401, { error: 'AUTHENTICATION_REQUIRED' }));
  if (path === '/api/admin/media') return handleUpload(init);
  throw new TypeError(`Blocked by connect-src: ${path}`);
};

const mountApp = async (onUpload, { renderStudio = false } = {}) => {
  const originalFetch = globalThis.fetch;
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const originalFileReader = Object.getOwnPropertyDescriptor(globalThis, 'FileReader');
  const classList = { add() {}, remove() {} };
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true, value: { getItem: () => null, setItem() {} },
  });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { documentElement: { classList, setAttribute() {} }, body: { classList } },
  });
  Object.defineProperty(globalThis, 'FileReader', {
    configurable: true,
    value: class {
      readAsDataURL() { this.onload?.({ target: { result: dataUrl } }); }
    },
  });
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  handleUpload = onUpload;
  globalThis.fetch = fetchBridge;

  const { AppProvider, useApp } = await import('./AppContext.js');
  const Studio = renderStudio ? (await import('../components/studio/ContentStudio.js')).ContentStudio : null;
  let current;
  const Probe = () => { current = useApp(); return React.createElement('div'); };
  let renderer;
  await act(async () => {
    renderer = TestRenderer.create(React.createElement(AppProvider, null,
      React.createElement(Probe), Studio && React.createElement(Studio)));
  });
  return {
    get app() { return current; },
    get renderer() { return renderer; },
    async close() {
      await act(async () => { renderer.unmount(); });
      globalThis.fetch = originalFetch;
      if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
      else delete globalThis.localStorage;
      if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument);
      else delete globalThis.document;
      if (originalFileReader) Object.defineProperty(globalThis, 'FileReader', originalFileReader);
      else delete globalThis.FileReader;
    },
  };
};

test('image upload reaches the server without fetching its data URL and reports success only after confirmation', async () => {
  const pending = deferred();
  const uploads = [];
  const mounted = await mountApp((init) => { uploads.push(init); return pending.promise; });
  try {
    let upload;
    await act(async () => {
      upload = mounted.app.addMediaItem({ ...initialMedia[0], id: 'pending-image', name: 'test.png', url: dataUrl });
    });
    assert.equal(uploads.length, 1);
    assert.equal(uploads[0].body.get('file').type, 'image/png');
    assert.deepEqual(
      [...new Uint8Array(await uploads[0].body.get('file').arrayBuffer()).slice(0, 8)],
      [137, 80, 78, 71, 13, 10, 26, 10],
    );
    assert.equal(mounted.app.mediaList.some((item) => item.id === 'pending-image'), false);
    assert.equal(mounted.app.toasts.some((toast) => toast.type === 'success' && /رفع الصورة/.test(toast.text)), false);

    let savedMedia;
    await act(async () => {
      pending.resolve(response(201, { id: 'stored-image', publicUrl: '/media/stored-image.png', mimeType: 'image/png' }));
      savedMedia = await upload;
    });
    assert.equal(savedMedia.url, '/media/stored-image.png');
    assert.equal(mounted.app.mediaList[0].id, 'stored-image');
    assert.equal(mounted.app.mediaList[0].url, '/media/stored-image.png');
    assert.equal(mounted.app.toasts.some((toast) => toast.type === 'success' && /رفع الصورة/.test(toast.text)), true);
  } finally {
    await mounted.close();
  }
});

test('media library does not show a success toast while upload is pending or after it fails', async () => {
  const pending = deferred();
  const mounted = await mountApp(() => pending.promise, { renderStudio: true });
  try {
    await act(async () => { mounted.app.setStudioTab('media_library'); });
    const input = mounted.renderer.root.findAllByType('input').find((node) => node.props.type === 'file');
    assert.ok(input);
    let upload;
    await act(async () => {
      upload = input.props.onChange({ target: { files: [new File(['image'], 'test.png', { type: 'image/png' })] } });
    });
    assert.equal(mounted.app.toasts.some((toast) => toast.type === 'success' && /رفع الصورة/.test(toast.text)), false);
    await act(async () => { pending.resolve(response(500, { error: 'IMAGE_UPLOAD_FAILED' })); await upload; });
    assert.equal(mounted.app.toasts.some((toast) => toast.type === 'success' && /رفع الصورة/.test(toast.text)), false);
    assert.equal(mounted.app.toasts.some((toast) => toast.type === 'warning' && /تعذر رفع الصورة/.test(toast.text)), true);
  } finally {
    await mounted.close();
  }
});

test('failed image upload leaves the gallery unchanged and shows no success', async () => {
  let uploads = 0;
  const mounted = await mountApp(() => { uploads++; return Promise.resolve(response(500, { error: 'IMAGE_UPLOAD_FAILED' })); });
  try {
    const initialCount = mounted.app.mediaList.length;
    let savedMedia;
    await act(async () => {
      savedMedia = await mounted.app.addMediaItem({ ...initialMedia[0], id: 'failed-image', name: 'test.png', url: dataUrl });
    });
    assert.equal(savedMedia, null);
    assert.equal(uploads, 1);
    assert.equal(mounted.app.mediaList.length, initialCount);
    assert.equal(mounted.app.toasts.some((toast) => toast.type === 'success' && /رفع الصورة/.test(toast.text)), false);
    assert.equal(mounted.app.toasts.some((toast) => toast.type === 'warning' && /تعذر رفع الصورة/.test(toast.text)), true);
  } finally {
    await mounted.close();
  }
});
