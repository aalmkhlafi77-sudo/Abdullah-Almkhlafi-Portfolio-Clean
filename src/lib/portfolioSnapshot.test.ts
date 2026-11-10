import assert from 'node:assert/strict';
import test from 'node:test';

import { createPortfolioSnapshot } from './portfolioSnapshot.js';

test('creates a complete snapshot without operational or authentication state', () => {
  const state = {
    profile: { name: 'عبدالله المخلافي' },
    metrics: [],
    services: [],
    solutions: [],
    projects: [],
    articles: [],
    mediaList: [],
    pages: [],
    showcaseApps: [],
    showcaseBarConfig: { enabled: true },
    cvResumeData: { summary: 'summary' },
    heroConfig: { preset: 'neural_core' },
    brandVideoUrl: 'https://example.com/video',
    adminCredentials: { username: 'admin', password: 'must-not-leak' },
    isAuthenticated: true,
  };

  const snapshot = createPortfolioSnapshot(state, '2026-10-04T00:00:00.000Z');

  assert.equal(snapshot.schemaVersion, 1);
  assert.equal(snapshot.savedAt, '2026-10-04T00:00:00.000Z');
  assert.equal(snapshot.profile.name, 'عبدالله المخلافي');
  assert.equal(snapshot.heroConfig.preset, 'neural_core');
  assert.equal(snapshot.brandVideoUrl, 'https://example.com/video');
  assert.equal('adminCredentials' in snapshot, false);
  assert.equal('isAuthenticated' in snapshot, false);
});

test('deep clones snapshot fields so later editor mutations do not alter the payload', () => {
  const state = {
    profile: { name: 'original' },
    metrics: [], services: [], solutions: [], projects: [], articles: [], mediaList: [], pages: [],
    showcaseApps: [], showcaseBarConfig: {}, cvResumeData: {}, heroConfig: {}, brandVideoUrl: '',
  };

  const snapshot = createPortfolioSnapshot(state, '2026-10-04T00:00:00.000Z');
  state.profile.name = 'changed';

  assert.equal(snapshot.profile.name, 'original');
});
