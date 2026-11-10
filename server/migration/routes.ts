import { Router } from 'express';

import { SnapshotValidationError } from '../content/schema.js';
import { ContentConflictError } from '../content/service.js';
import type { DraftContentResult } from '../content/types.js';

export const createImportRouter = (
  importContent: (snapshot: unknown, expectedVersion: number, adminId: number) => Promise<DraftContentResult>,
): Router => {
  const router = Router();
  router.post('/content/import', async (req, res) => {
    try {
      res.json(await importContent(req.body.snapshot, req.body.expectedDraftVersion, req.admin!.id));
    } catch (error) {
      if (error instanceof ContentConflictError) {
        res.status(409).json({ error: 'CONTENT_CONFLICT', currentVersion: error.currentVersion });
      } else if (error instanceof SnapshotValidationError) {
        res.status(400).json({ error: error.code });
      } else if (error instanceof SyntaxError) {
        res.status(400).json({ error: 'INVALID_JSON' });
      } else if (error instanceof Error && /^(blob: URLs|Invalid embedded image|Embedded image signature)/.test(error.message)) {
        res.status(400).json({ error: 'INVALID_EMBEDDED_IMAGE' });
      } else {
        res.status(500).json({ error: 'IMPORT_STORAGE_FAILED' });
      }
    }
  });
  return router;
};
