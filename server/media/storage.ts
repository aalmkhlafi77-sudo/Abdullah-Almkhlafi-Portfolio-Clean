import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { fileTypeFromBuffer } from 'file-type';

import type { DetectedImageType, StoredImage, SupportedImageExtension, SupportedImageMime } from './types.js';

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const SUPPORTED = new Map<string, SupportedImageExtension>([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

export const detectImageType = async (buffer: Buffer): Promise<DetectedImageType> => {
  if (buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) throw new Error('Image size is invalid');
  const detected = await fileTypeFromBuffer(buffer);
  const ext = detected ? SUPPORTED.get(detected.mime) : undefined;
  if (!detected || !ext) throw new Error('Image signature is not supported');
  return { ext, mime: detected.mime as SupportedImageMime };
};

export const resolveMediaPath = (uploadRoot: string, storageName: string): string => {
  if (!path.isAbsolute(uploadRoot) || path.basename(storageName) !== storageName || storageName.includes('..')) {
    throw new Error('Invalid media path');
  }
  const root = path.resolve(uploadRoot);
  const target = path.resolve(root, storageName);
  if (!target.startsWith(`${root}${path.sep}`)) throw new Error('Invalid media path');
  return target;
};

export const storeImage = async (
  buffer: Buffer,
  detectedType: DetectedImageType,
  uploadRoot: string,
): Promise<StoredImage> => {
  const actual = await detectImageType(buffer);
  if (actual.ext !== detectedType.ext || actual.mime !== detectedType.mime) {
    throw new Error('Image signature does not match the declared type');
  }
  const storageName = `${randomUUID()}.${actual.ext}`;
  const absolutePath = resolveMediaPath(uploadRoot, storageName);
  await mkdir(uploadRoot, { recursive: true });
  await writeFile(absolutePath, buffer, { flag: 'wx', mode: 0o640 });
  return {
    storageName,
    absolutePath,
    publicUrl: `/media/${storageName}`,
    mimeType: actual.mime,
    sizeBytes: buffer.length,
  };
};

export const removeStoredImage = async (uploadRoot: string, storageName: string): Promise<void> => {
  try {
    await unlink(resolveMediaPath(uploadRoot, storageName));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
};
