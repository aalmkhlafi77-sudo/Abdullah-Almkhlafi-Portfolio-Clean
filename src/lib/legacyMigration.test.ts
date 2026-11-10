import assert from 'node:assert/strict';
import test from 'node:test';

import type { PortfolioSnapshotV1 } from '../../server/content/schema.js';
import {
  clearLegacyPersistence,
  LEGACY_STORAGE_KEYS,
  mergeMissingLegacyFields,
  readLegacySnapshot,
} from './legacyMigration.js';

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

test('legacy snapshot includes heroConfig and brandVideoUrl but never authentication data', () => {
  const storage = new MemoryStorage();
  storage.setItem(LEGACY_STORAGE_KEYS.profile, JSON.stringify({ name: 'عبدالله' }));
  storage.setItem(LEGACY_STORAGE_KEYS.heroConfig, JSON.stringify({ preset: 'neural_core' }));
  storage.setItem(LEGACY_STORAGE_KEYS.brandVideoUrl, 'https://example.com/brand.mp4');
  storage.setItem(LEGACY_STORAGE_KEYS.adminCredentials, JSON.stringify({ username: 'admin', password: 'secret' }));
  storage.setItem(LEGACY_STORAGE_KEYS.authSession, 'true');

  const result = readLegacySnapshot(storage, '2026-10-04T00:00:00.000Z');

  assert.equal(result.heroConfig.preset, 'neural_core');
  assert.equal(result.brandVideoUrl, 'https://example.com/brand.mp4');
  assert.equal('adminCredentials' in result, false);
  assert.equal(JSON.stringify(result).includes('password'), false);
});

test('merge fills only missing server fields and preserves populated server values', () => {
  const server = readLegacySnapshot(new MemoryStorage(), '2026-10-04T00:00:00.000Z');
  server.profile = { name: 'Server Name', avatarUrl: '' } as PortfolioSnapshotV1['profile'];
  server.services = [{ id: 'server-service' }] as PortfolioSnapshotV1['services'];
  const legacy = structuredClone(server);
  legacy.profile = { name: 'Legacy Name', avatarUrl: '/media/legacy.png' } as PortfolioSnapshotV1['profile'];
  legacy.services = [{ id: 'legacy-service' }] as PortfolioSnapshotV1['services'];
  legacy.brandVideoUrl = 'https://example.com/legacy.mp4';

  const merged = mergeMissingLegacyFields(server, legacy);

  assert.equal(merged.profile.name, 'Server Name');
  assert.equal(merged.profile.avatarUrl, '/media/legacy.png');
  assert.equal(merged.services[0].id, 'server-service');
  assert.equal(merged.brandVideoUrl, 'https://example.com/legacy.mp4');
});

test('legacy persistence cannot be cleared before second-device verification', () => {
  const storage = new MemoryStorage();
  storage.setItem(LEGACY_STORAGE_KEYS.profile, '{}');

  assert.throws(() => clearLegacyPersistence(storage, false), /second device/i);
  assert.equal(storage.getItem(LEGACY_STORAGE_KEYS.profile), '{}');

  clearLegacyPersistence(storage, true);
  assert.equal(storage.getItem(LEGACY_STORAGE_KEYS.profile), null);
});
