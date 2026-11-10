import assert from 'node:assert/strict';
import test from 'node:test';

import {
  SnapshotValidationError,
  validatePortfolioSnapshot,
  type PortfolioSnapshotV1,
} from './schema.js';

const validSnapshot = (): PortfolioSnapshotV1 => ({
  schemaVersion: 1,
  profile: {} as PortfolioSnapshotV1['profile'],
  metrics: [],
  services: [],
  solutions: [],
  projects: [],
  articles: [],
  mediaList: [],
  pages: [],
  showcaseApps: [],
  showcaseBarConfig: {} as PortfolioSnapshotV1['showcaseBarConfig'],
  cvResumeData: {} as PortfolioSnapshotV1['cvResumeData'],
  heroConfig: {} as PortfolioSnapshotV1['heroConfig'],
  brandVideoUrl: '',
  savedAt: '2026-10-04T00:00:00.000Z',
});

test('accepts and returns a complete version 1 snapshot', () => {
  const input = validSnapshot();

  assert.deepEqual(validatePortfolioSnapshot(input), input);
});

test('validates snapshots without relying on the Node.js Buffer global', () => {
  const originalBuffer = globalThis.Buffer;
  try {
    // The same schema is bundled into the browser, where Buffer is undefined.
    globalThis.Buffer = undefined;
    assert.deepEqual(validatePortfolioSnapshot(validSnapshot()), validSnapshot());
  } finally {
    globalThis.Buffer = originalBuffer;
  }
});

test('rejects a non-object snapshot root', () => {
  assert.throws(
    () => validatePortfolioSnapshot([]),
    (error: unknown) => error instanceof SnapshotValidationError && error.code === 'INVALID_ROOT',
  );
});

test('rejects an unsupported schema version', () => {
  assert.throws(
    () => validatePortfolioSnapshot({ ...validSnapshot(), schemaVersion: 2 }),
    (error: unknown) => error instanceof SnapshotValidationError && error.code === 'INVALID_SCHEMA_VERSION',
  );
});

test('rejects a serialized snapshot larger than the configured limit', () => {
  const input = { ...validSnapshot(), brandVideoUrl: 'x'.repeat(512) };

  assert.throws(
    () => validatePortfolioSnapshot(input, 128),
    (error: unknown) => error instanceof SnapshotValidationError && error.code === 'SNAPSHOT_TOO_LARGE',
  );
});

test('rejects admin credentials and password keys anywhere in content', () => {
  for (const forbidden of [
    { ...validSnapshot(), adminCredentials: { username: 'admin' } },
    { ...validSnapshot(), profile: { password: 'secret' } },
  ]) {
    assert.throws(
      () => validatePortfolioSnapshot(forbidden),
      (error: unknown) => error instanceof SnapshotValidationError && error.code === 'FORBIDDEN_FIELD',
    );
  }
});

test('rejects a snapshot missing a required content field', () => {
  const input = validSnapshot() as unknown as Record<string, unknown>;
  delete input.heroConfig;

  assert.throws(
    () => validatePortfolioSnapshot(input),
    (error: unknown) => error instanceof SnapshotValidationError && error.code === 'MISSING_FIELD',
  );
});
