import { randomUUID } from 'node:crypto';

import type { DraftContentResult } from '../content/types.js';
import { validatePortfolioSnapshot, type PortfolioSnapshotV1 } from '../content/schema.js';
import type { MediaRecord } from '../media/repository.js';
import { detectImageType, removeStoredImage, storeImage } from '../media/storage.js';

export interface ImportSnapshotDependencies {
  uploadRoot: string;
  adminId: number;
  expectedDraftVersion: number;
  saveDraft(
    snapshot: PortfolioSnapshotV1,
    expectedVersion: number,
    adminId: number,
    mediaRecords: MediaRecord[],
  ): Promise<DraftContentResult>;
}

const DATA_IMAGE = /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=\s]+)$/;

export const importSnapshot = async (
  input: unknown,
  deps: ImportSnapshotDependencies,
): Promise<DraftContentResult> => {
  const raw = validatePortfolioSnapshot(typeof input === 'string' ? JSON.parse(input) : input);
  const created: MediaRecord[] = [];
  const storedByDataUrl = new Map<string, MediaRecord>();

  const transform = async (value: unknown): Promise<unknown> => {
    if (typeof value === 'string') {
      if (value.startsWith('blob:')) throw new Error('blob: URLs cannot be imported');
      if (!value.startsWith('data:image/')) return value;
      const existing = storedByDataUrl.get(value);
      if (existing) return existing.publicUrl;
      const match = DATA_IMAGE.exec(value);
      if (!match) throw new Error('Invalid embedded image');
      const buffer = Buffer.from(match[2].replace(/\s/g, ''), 'base64');
      let detected: Awaited<ReturnType<typeof detectImageType>>;
      try {
        detected = await detectImageType(buffer);
      } catch {
        throw new Error('Invalid embedded image signature');
      }
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
      created.push(record);
      storedByDataUrl.set(value, record);
      return record.publicUrl;
    }
    if (Array.isArray(value)) {
      const output: unknown[] = [];
      for (const child of value) output.push(await transform(child));
      return output;
    }
    if (value && typeof value === 'object') {
      const output: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        output[key] = await transform(child);
      }
      return output;
    }
    return value;
  };

  try {
    const transformed = await transform(raw) as PortfolioSnapshotV1;
    transformed.mediaList = transformed.mediaList.map((item, index) => {
      const source = raw.mediaList[index];
      const record = typeof source?.url === 'string' ? storedByDataUrl.get(source.url) : undefined;
      return record ? { ...item, id: record.id } : item;
    });
    const snapshot = validatePortfolioSnapshot(transformed);
    return await deps.saveDraft(snapshot, deps.expectedDraftVersion, deps.adminId, created);
  } catch (error) {
    for (const record of created.reverse()) {
      await removeStoredImage(deps.uploadRoot, record.storageName);
    }
    throw error;
  }
};
