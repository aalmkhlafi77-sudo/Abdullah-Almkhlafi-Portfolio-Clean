import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('server entrypoint keeps async startup inside a callable function', async () => {
  const source = await readFile(new URL('./index.ts', import.meta.url), 'utf8');

  assert.match(source, /async function startServer\(\)/);
  assert.match(source, /void startServer\(\)\.catch\(/);
});
