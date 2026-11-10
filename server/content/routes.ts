import { Router, type RequestHandler } from 'express';

import {
  ContentConflictError,
  ContentNotPublishedError,
  ContentService,
  ContentVersionNotFoundError,
} from './service.js';

const sendContentError = (error: unknown, res: Parameters<RequestHandler>[1]): void => {
  if (error instanceof ContentConflictError) {
    res.status(409).json({ error: 'CONTENT_CONFLICT', currentVersion: error.currentVersion });
  } else if (error instanceof ContentNotPublishedError || error instanceof ContentVersionNotFoundError) {
    res.status(404).json({ error: 'CONTENT_NOT_FOUND' });
  } else {
    res.status(500).json({ error: 'INTERNAL_ERROR' });
  }
};

export const createPublicContentRouter = (service: ContentService): Router => {
  const router = Router();
  router.get('/content', async (_req, res) => {
    try {
      res.json(await service.getPublished());
    } catch (error) {
      sendContentError(error, res);
    }
  });
  return router;
};

export const createAdminContentRouter = (
  service: ContentService,
  authenticate: RequestHandler,
): Router => {
  const router = Router();
  router.use(authenticate);
  router.get('/content/draft', async (req, res) => {
    try {
      res.json(await service.getDraft(req.admin!.id));
    } catch (error) {
      sendContentError(error, res);
    }
  });
  router.get('/content/export', async (req, res) => {
    try {
      res.json(await service.getDraft(req.admin!.id));
    } catch (error) {
      sendContentError(error, res);
    }
  });
  router.put('/content/draft', async (req, res) => {
    try {
      res.json(await service.saveDraft(req.body.snapshot, req.body.expectedDraftVersion, req.admin!.id));
    } catch (error) {
      sendContentError(error, res);
    }
  });
  router.post('/content/publish', async (req, res) => {
    try {
      res.json(await service.publish(req.body.expectedDraftVersion, req.admin!.id, req.body.note ?? null));
    } catch (error) {
      sendContentError(error, res);
    }
  });
  router.post('/content/restore/:version', async (req, res) => {
    try {
      res.json(await service.restore(Number(req.params.version), req.admin!.id));
    } catch (error) {
      sendContentError(error, res);
    }
  });
  return router;
};
