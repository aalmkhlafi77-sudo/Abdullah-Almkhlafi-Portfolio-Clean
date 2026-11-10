import { randomUUID } from 'node:crypto';

import type { DraftContentResult } from '../content/types.js';
import { validatePortfolioSnapshot, type PortfolioSnapshotV1 } from '../content/schema.js';
import type { MediaRecord, MediaRepository } from '../media/repository.js';
import { detectImageType, removeStoredImage, storeImage } from '../media/storage.js';

export interface ImportSnapshotDependencies {
  mediaRepository: MediaRepository;
  uploadRoot: string;
  adminId: number;
  expectedDraftVersion: number;
  saveDraft(
    snapshot: PortfolioSnapshotV1,
    expectedVersion: number,
    adminId: number,
  ): Promise<DraftContentResult>;
}

const DATA_IMAGE = /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=\s]+)$/;

export const importSnapshot = async (
  input: unknown,
  deps: ImportSnapshotDependencies,
): Promise<DraftContentResult> => {
  const raw = typeof input === 'string' ? JSON.parse(input) : input;
  const created: MediaRecord[] = [];

  const transform = async (value: unknown): Promise<unknown> => {
    if (typeof value === 'string') {
      if (value.startsWith('blob:')) throw new Error('blob: URLs cannot be imported');
      if (!value.startsWith('data:image/')) return value;
      const match = DATA_IMAGE.exec(value);
      if (!match) throw new Error('Invalid embedded image');
      const buffer = Buffer.from(match[2].replace(/\s/g, ''), 'base64');
      const detected = await detectImageType(buffer);
      if (detected.mime !== match[1]) throw new Error('Embedded image signature does not match MIME type');
      const stored = await storeImage(buffer, detected, deps.uploadRoot);
      const record: MediaRecord = {
        id: randomUUID(),
        storageName: stored.storageName,
        originalName: `imported.${detected.ext}`,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        publicUrl: stored.publicUrl,
        createdBy: deps.adminId,
      };
      try {
        await deps.mediaRepository.insert(record);
      } catch (error) {
        await removeStoredImage(deps.uploadRoot, stored.storageName);
        throw error;
      }
      created.push(record);
      return record.publicUrl;
    }
    if (Array.isArray(value)) return Promise.all(value.map(transform));
    if (value && typeof value === 'object') {
      const entries = await Promise.all(
        Object.entries(value as Record<string, unknown>).map(async ([key, child]) => [key, await transform(child)]),
      );
      return Object.fromEntries(entries);
    }
    return value;
  };

  try {
    const transformed = await transform(raw);
    const snapshot = validatePortfolioSnapshot(transformed);
    return await deps.saveDraft(snapshot, deps.expectedDraftVersion, deps.adminId);
  } catch (error) {
    for (const record of created.reverse()) {
      await removeStoredImage(deps.uploadRoot, record.storageName);
      await deps.mediaRepository.delete(record.id);
    }
    throw error;
  }
};
