import assert from 'node:assert/strict';
import test from 'node:test';

import { createDefaultSnapshot } from './defaultSnapshot.js';
import { parseBackupForImport } from './backupImport.js';

const oldBackup = () => {
  const { schemaVersion: _schemaVersion, savedAt: _savedAt, heroConfig: _heroConfig, brandVideoUrl: _brandVideoUrl, ...fields } = createDefaultSnapshot();
  return { ...fields, timestamp: '2026-11-10T18:23:36.610Z' };
};

test('converts the old backup format while preserving supplied pages and using documented defaults', () => {
  const old = oldBackup();
  old.pages[0].elements.pop();
  old.mediaList[0].url = 'data:image/webp;base64,AA==';
  const result = parseBackupForImport(JSON.stringify(old));
  assert.equal(result.preview.format, 'legacy');
  assert.equal(result.preview.pages, 7);
  assert.equal(result.preview.elements, 29);
  assert.equal(result.preview.images, old.mediaList.length);
  assert.equal(result.snapshot.mediaList[0].url, old.mediaList[0].url);
  assert.deepEqual(result.snapshot.heroConfig, createDefaultSnapshot().heroConfig);
  assert.equal(result.snapshot.brandVideoUrl, '');
  assert.equal(result.snapshot.savedAt, old.timestamp);
  assert.deepEqual(result.preview.defaultedFields, ['heroConfig', 'brandVideoUrl']);
});

test('does not silently replace missing legacy content lists with empty defaults', () => {
  const old = oldBackup() as Record<string, unknown>;
  delete old.pages;
  assert.throws(() => parseBackupForImport(JSON.stringify(old)), /الصفحات|pages/);
});

test('rejects invalid JSON and an oversized backup before preview or import', () => {
  assert.throws(() => parseBackupForImport('{broken'), /JSON/);
  assert.throws(() => parseBackupForImport(JSON.stringify(oldBackup()), 100), /حجم|size/i);
});

test('accepts current snapshots without changing intentionally empty arrays', () => {
  const snapshot = createDefaultSnapshot();
  snapshot.pages = [];
  const result = parseBackupForImport(JSON.stringify(snapshot));
  assert.equal(result.preview.format, 'v1');
  assert.equal(result.preview.pages, 0);
  assert.equal(result.snapshot.pages.length, 0);
});
