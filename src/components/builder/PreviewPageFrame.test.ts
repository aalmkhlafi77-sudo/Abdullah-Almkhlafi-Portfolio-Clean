import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PreviewPageFrame } from './PreviewPageFrame.js';

test('a long editor page is not shrunk and clipped to the fixed-height viewport', () => {
  const html = renderToStaticMarkup(React.createElement(PreviewPageFrame, { theme: 'dark', deviceMode: 'desktop' },
    React.createElement('div', { style: { height: '2000px' } }, 'bottom of page')));
  assert.match(html, /flex-none/);
  assert.match(html, /min-height:85vh/);
  assert.match(html, /bottom of page/);
});
