import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { fileTypeFromBuffer } from 'file-type';

import type { DetectedImageType, StoredImage, SupportedImageExtension, SupportedImageMime } from './types.js';

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
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

const VIDEO_TYPES = new Map([['video/mp4', 'mp4'], ['video/webm', 'webm']]);

export const detectVideoType = async (buffer: Buffer): Promise<{ ext: string; mime: string }> => {
  if (buffer.length === 0 || buffer.length > MAX_VIDEO_BYTES) throw new Error('Video size is invalid');
  const detected = await fileTypeFromBuffer(buffer);
  const ext = detected && VIDEO_TYPES.get(detected.mime);
  if (!detected || !ext) throw new Error('Video signature is not supported');
  return { ext, mime: detected.mime };
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

export const storeVideo = async (buffer: Buffer, uploadRoot: string) => {
  const type = await detectVideoType(buffer);
  const storageName = `${randomUUID()}.${type.ext}`;
  const absolutePath = resolveMediaPath(uploadRoot, storageName);
  await mkdir(uploadRoot, { recursive: true });
  await writeFile(absolutePath, buffer, { flag: 'wx', mode: 0o640 });
  return {
    storageName,
    absolutePath,
    publicUrl: `/media/${storageName}`,
    mimeType: type.mime,
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
