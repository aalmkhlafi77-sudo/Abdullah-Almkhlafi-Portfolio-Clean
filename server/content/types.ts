import type { PortfolioSnapshotV1 } from './schema.js';

export interface DraftContentResult {
  snapshot: PortfolioSnapshotV1;
  draftVersion: number;
}

export interface PublishedContentResult {
  snapshot: PortfolioSnapshotV1;
  publishedVersion: number;
  publishedAt: Date;
}
