import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { startVisibleCanvasAnimation } from './visibleCanvasAnimation.js';

const originalObserver = globalThis.IntersectionObserver;
const originalDocument = globalThis.document;
const originalRequestFrame = globalThis.requestAnimationFrame;
const originalCancelFrame = globalThis.cancelAnimationFrame;

afterEach(() => {
  globalThis.IntersectionObserver = originalObserver;
  globalThis.document = originalDocument;
  globalThis.requestAnimationFrame = originalRequestFrame;
  globalThis.cancelAnimationFrame = originalCancelFrame;
});

test('draws only in view and pauses when the hero leaves the viewport or tab is hidden', () => {
  const scheduled = new Map<number, FrameRequestCallback>();
  let nextId = 0;
  let drawCount = 0;
  let intersection: IntersectionObserverCallback | undefined;
  let disconnected = false;
  let documentHidden = false;
  const listeners = new Map<string, EventListener>();
  const canvas = {} as HTMLCanvasElement;

  globalThis.requestAnimationFrame = callback => {
    scheduled.set(++nextId, callback);
    return nextId;
  };
  globalThis.cancelAnimationFrame = id => { scheduled.delete(id); };
  globalThis.document = {
    get hidden() { return documentHidden; },
    addEventListener: (event: string, callback: EventListener) => { listeners.set(event, callback); },
    removeEventListener: (event: string) => { listeners.delete(event); }
  } as unknown as Document;
  globalThis.IntersectionObserver = class {
    constructor(callback: IntersectionObserverCallback) { intersection = callback; }
    observe(target: Element) { assert.equal(target, canvas); }
    disconnect() { disconnected = true; }
  } as unknown as typeof IntersectionObserver;

  const frame = () => {
    const [id, callback] = [...scheduled.entries()][0];
    scheduled.delete(id);
    callback(0);
  };
  const setVisible = (value: boolean) => intersection?.([{ isIntersecting: value } as IntersectionObserverEntry], {} as IntersectionObserver);
  const stop = startVisibleCanvasAnimation(canvas, () => { drawCount++; });

  assert.equal(scheduled.size, 0);
  setVisible(true);
  assert.equal(scheduled.size, 1);
  frame();
  assert.equal(drawCount, 1);
  assert.equal(scheduled.size, 1);

  setVisible(false);
  assert.equal(scheduled.size, 0);
  setVisible(true);
  documentHidden = true;
  listeners.get('visibilitychange')?.({} as Event);
  assert.equal(scheduled.size, 0);
  documentHidden = false;
  listeners.get('visibilitychange')?.({} as Event);
  frame();
  assert.equal(drawCount, 2);

  stop();
  assert.equal(scheduled.size, 0);
  assert.equal(disconnected, true);
  assert.equal(listeners.size, 0);
  setVisible(true);
  assert.equal(scheduled.size, 0);
});

test('keeps animation running without IntersectionObserver support', () => {
  globalThis.IntersectionObserver = undefined as unknown as typeof IntersectionObserver;
  globalThis.document = { hidden: false, addEventListener() {}, removeEventListener() {} } as unknown as Document;
  const scheduled = new Map<number, FrameRequestCallback>();
  globalThis.requestAnimationFrame = callback => { scheduled.set(1, callback); return 1; };
  globalThis.cancelAnimationFrame = id => { scheduled.delete(id); };
  const stop = startVisibleCanvasAnimation({} as HTMLCanvasElement, () => {});
  assert.equal(scheduled.size, 1);
  stop();
  assert.equal(scheduled.size, 0);
});
