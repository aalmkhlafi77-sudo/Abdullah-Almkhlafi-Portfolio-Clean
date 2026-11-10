import path from 'node:path';
import { randomUUID } from 'node:crypto';

import { Router } from 'express';
import multer from 'multer';

import type { PortfolioSnapshotV1 } from '../content/schema.js';
import type { MediaRecord, MediaRepository } from './repository.js';
import { detectImageType, MAX_IMAGE_BYTES, removeStoredImage, storeImage } from './storage.js';

const containsExactString = (value: unknown, target: string): boolean => {
  if (value === target) return true;
  if (Array.isArray(value)) return value.some((child) => containsExactString(child, target));
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some((child) => containsExactString(child, target));
  }
  return false;
};

export const isMediaReferenced = (snapshot: PortfolioSnapshotV1 | null, url: string): boolean =>
  snapshot !== null && containsExactString(snapshot, url);

export interface DeleteMediaDependencies {
  repository: MediaRepository;
  uploadRoot: string;
  draft: PortfolioSnapshotV1;
  published: PortfolioSnapshotV1 | null;
}

export const deleteMediaAsset = async (id: string, deps: DeleteMediaDependencies): Promise<void> => {
  const record = await deps.repository.findById(id);
  if (!record) throw new Error('Media not found');
  if (isMediaReferenced(deps.draft, record.publicUrl) || isMediaReferenced(deps.published, record.publicUrl)) {
    throw new Error('Media is referenced by content');
  }
  await removeStoredImage(deps.uploadRoot, record.storageName);
  await deps.repository.delete(id);
};

export interface MediaRouterDependencies {
  repository: MediaRepository;
  uploadRoot: string;
  getDraft(adminId: number): Promise<{ snapshot: PortfolioSnapshotV1 }>;
  getPublished(): Promise<{ snapshot: PortfolioSnapshotV1 }>;
}

export const createMediaRouter = (deps: MediaRouterDependencies): Router => {
  const router = Router();
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_IMAGE_BYTES, files: 1 } });

  router.post('/media', upload.single('file'), async (req, res) => {
    if (!req.file || !req.admin) {
      res.status(400).json({ error: 'IMAGE_REQUIRED' });
      return;
    }
    let stored: Awaited<ReturnType<typeof storeImage>> | null = null;
    try {
      const type = await detectImageType(req.file.buffer);
      stored = await storeImage(req.file.buffer, type, deps.uploadRoot);
      const record: MediaRecord = {
        id: randomUUID(),
        storageName: stored.storageName,
        originalName: path.basename(req.file.originalname),
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        publicUrl: stored.publicUrl,
        createdBy: req.admin.id,
      };
      await deps.repository.insert(record);
      res.status(201).json(record);
    } catch {
      if (stored) await removeStoredImage(deps.uploadRoot, stored.storageName);
      res.status(400).json({ error: 'IMAGE_UPLOAD_FAILED' });
    }
  });

  router.delete('/media/:id', async (req, res) => {
    if (!req.admin) {
      res.status(401).json({ error: 'AUTHENTICATION_REQUIRED' });
      return;
    }
    try {
      const draft = (await deps.getDraft(req.admin.id)).snapshot;
      let published: PortfolioSnapshotV1 | null = null;
      try { published = (await deps.getPublished()).snapshot; } catch {}
      await deleteMediaAsset(req.params.id, { ...deps, draft, published });
      res.status(204).end();
    } catch (error) {
      const referenced = error instanceof Error && /referenced/i.test(error.message);
      res.status(referenced ? 409 : 404).json({ error: referenced ? 'MEDIA_IN_USE' : 'MEDIA_NOT_FOUND' });
    }
  });

  return router;
};
