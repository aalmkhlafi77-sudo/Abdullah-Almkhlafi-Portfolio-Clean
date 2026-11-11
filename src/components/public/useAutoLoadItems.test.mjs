import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { useAutoLoadItems } from './useAutoLoadItems.js';

test('visible projects continue loading when their sentinel enters the preview viewport', async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const original = globalThis.IntersectionObserver;
  const observers = [];
  globalThis.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe(target) { this.target = target; }
    disconnect() {}
  };
  let renderer;
  const List = ({ total, category }) => {
    const { visibleCount, sentinelRef } = useAutoLoadItems(total, category, 6, 3);
    return React.createElement('div', null,
      React.createElement('span', null, String(visibleCount)),
      visibleCount < total && React.createElement('div', { ref: sentinelRef, id: 'sentinel' }));
  };
  try {
    await act(async () => { renderer = TestRenderer.create(React.createElement(List, { total: 14, category: 'all' }), {
      createNodeMock: (element) => element.props.id === 'sentinel' ? { id: 'sentinel' } : null,
    }); });
    assert.equal(renderer.root.findByType('span').children[0], '6');
    for (const expected of ['9', '12', '14']) {
      const observer = observers.at(-1);
      assert.equal(observer.target.id, 'sentinel');
      await act(async () => { observer.callback([{ isIntersecting: true }]); });
      assert.equal(renderer.root.findByType('span').children[0], expected);
    }
    await act(async () => { renderer.update(React.createElement(List, { total: 14, category: 'design' })); });
    assert.equal(renderer.root.findByType('span').children[0], '6');
  } finally {
    if (renderer) await act(async () => { renderer.unmount(); });
    if (original) globalThis.IntersectionObserver = original;
    else delete globalThis.IntersectionObserver;
  }
});

test('without IntersectionObserver all filtered projects remain visible without a button', async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const original = globalThis.IntersectionObserver;
  delete globalThis.IntersectionObserver;
  let count;
  const List = () => { count = useAutoLoadItems(14, 'all', 6, 3).visibleCount; return null; };
  let renderer;
  try {
    await act(async () => { renderer = TestRenderer.create(React.createElement(List)); });
    assert.equal(count, 14);
  } finally {
    if (renderer) await act(async () => { renderer.unmount(); });
    if (original) globalThis.IntersectionObserver = original;
  }
});
