import assert from 'node:assert/strict';
import test from 'node:test';

import { getBrandVideoEmbedInfo } from './mediaUtils.js';

test('video link rejects ordinary webpages and unsafe schemes instead of presenting a broken player', () => {
  for (const url of ['https://example.com/watch', 'http://example.com/demo.mp4', 'https://example.com/clip.mov', 'javascript:alert(1)', 'https://youtube.com/watch?v=bad', 'https://example.com/youtube.com/watch?v=LXb3EKWsInQ', 'https://fakevimeo.com/123456']) {
    assert.deepEqual(getBrandVideoEmbedInfo(url), { isVideo: false, provider: 'none', embedUrl: '' });
  }
  assert.equal(getBrandVideoEmbedInfo('/media/stored.mp4').provider, 'direct');
  assert.equal(getBrandVideoEmbedInfo('https://example.com/demo.webm?token=abc').provider, 'direct');
  assert.equal(getBrandVideoEmbedInfo('https://youtu.be/LXb3EKWsInQ').provider, 'youtube');
});
