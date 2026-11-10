import assert from 'node:assert/strict';
import test from 'node:test';

import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import { createDefaultSnapshot } from '../../lib/defaultSnapshot.js';
import { BackupImportCard } from './BackupImportCard.js';

test('file chooser previews counts and requires explicit replacement confirmation', async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const imported = [];
  let renderer;
  try {
    await act(async () => {
      renderer = TestRenderer.create(React.createElement(BackupImportCard, {
        theme: 'light', onImport: async (text) => { imported.push(text); return true; },
      }));
    });
    const fileInput = renderer.root.findByProps({ type: 'file' });
    assert.match(JSON.stringify(renderer.toJSON()), /اختيار ملف JSON/);
    const contents = JSON.stringify(createDefaultSnapshot());
    await act(async () => { await fileInput.props.onChange({ target: { files: [new File([contents], 'backup.json', { type: 'application/json' })] } }); });
    assert.equal(imported.length, 0);
    const preview = renderer.root.findByProps({ id: 'backup-preview-button' });
    await act(async () => { preview.props.onClick(); });
    const summary = renderer.root.findByProps({ role: 'status' }).findAllByType('p').map((p) => p.children.join('')).join(' ');
    assert.match(summary, /7 صفحات/);
    assert.match(summary, /30 عنصرًا/);
    let importButton = renderer.root.findByProps({ id: 'backup-import-button' });
    assert.equal(importButton.props.disabled, true);
    await act(async () => { renderer.root.findByProps({ id: 'backup-confirm-replace' }).props.onChange({ target: { checked: true } }); });
    importButton = renderer.root.findByProps({ id: 'backup-import-button' });
    assert.equal(importButton.props.disabled, false);
    await act(async () => { await importButton.props.onClick(); });
    assert.deepEqual(imported, [contents]);
  } finally {
    if (renderer) await act(async () => { renderer.unmount(); });
  }
});

test('invalid selected JSON reports a useful inline error without calling import', async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  let calls = 0;
  let renderer;
  try {
    await act(async () => { renderer = TestRenderer.create(React.createElement(BackupImportCard, { theme: 'light', onImport: async () => { calls += 1; return true; } })); });
    await act(async () => { await renderer.root.findByProps({ type: 'file' }).props.onChange({ target: { files: [new File(['{broken'], 'bad.json')] } }); });
    await act(async () => { renderer.root.findByProps({ id: 'backup-preview-button' }).props.onClick(); });
    assert.match(JSON.stringify(renderer.toJSON()), /ملف JSON غير صالح/);
    assert.equal(calls, 0);
    assert.equal(renderer.root.findByProps({ id: 'backup-import-button' }).props.disabled, true);
  } finally {
    if (renderer) await act(async () => { renderer.unmount(); });
  }
});
