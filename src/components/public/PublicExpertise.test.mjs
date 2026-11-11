import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

const response = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json' },
});

test('YouTube video frame identifies the embedding site without changing uploaded video playback', async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const oldFetch = globalThis.fetch;
  const oldStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const classList = { add() {}, remove() {} };
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => null, setItem() {} } });
  Object.defineProperty(globalThis, 'document', {
    configurable: true, value: { documentElement: { classList, setAttribute() {} }, body: { classList } },
  });
  globalThis.fetch = (input) => {
    if (String(input) === '/api/public/content') return Promise.resolve(response(404, { error: 'CONTENT_NOT_FOUND' }));
    if (String(input) === '/api/auth/me') return Promise.resolve(response(401, { error: 'AUTHENTICATION_REQUIRED' }));
    throw new Error(`Unexpected request: ${input}`);
  };
  let renderer, current;
  try {
    const { AppProvider, useApp } = await import('../../context/AppContext.js');
    const { PublicExpertise } = await import('./PublicExpertise.js');
    const Probe = () => { current = useApp(); return null; };
    await act(async () => { renderer = TestRenderer.create(React.createElement(AppProvider, null,
      React.createElement(Probe), React.createElement(PublicExpertise))); });
    await act(async () => { current.updateBrandVideoUrl('https://www.youtube.com/watch?v=LXb3EKWsInQ'); });
    const youtubeFrame = renderer.root.findAllByType('iframe').find((frame) => frame.props.src.includes('youtube-nocookie.com'));
    assert.ok(youtubeFrame);
    assert.equal(youtubeFrame.props.referrerPolicy, 'strict-origin-when-cross-origin');
    assert.equal(youtubeFrame.props.src.includes('loop=1'), true);

    await act(async () => { current.updateBrandVideoUrl('/media/stored.mp4'); });
    assert.equal(renderer.root.findByType('video').props.src, '/media/stored.mp4');
  } finally {
    if (renderer) await act(async () => { renderer.unmount(); });
    globalThis.fetch = oldFetch;
    if (oldStorage) Object.defineProperty(globalThis, 'localStorage', oldStorage); else delete globalThis.localStorage;
    if (oldDocument) Object.defineProperty(globalThis, 'document', oldDocument); else delete globalThis.document;
  }
});
