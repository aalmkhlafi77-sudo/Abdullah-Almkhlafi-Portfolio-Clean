import assert from 'node:assert/strict';
import test from 'node:test';

import { initialProfile } from '../data/initialData.js';
import { sanitizeProfileSocials } from './AppContext.js';

test('does not label the Facebook page as five unrelated social profiles', () => {
  const result = sanitizeProfileSocials(initialProfile);
  assert.equal(result.socials.facebook, 'https://www.facebook.com/bdallhhzaalmkhlafy');
  for (const platform of ['linkedin', 'x', 'youtube', 'tiktok', 'snapchat'] as const) {
    assert.equal(result.socials[platform], '', platform);
  }
});
