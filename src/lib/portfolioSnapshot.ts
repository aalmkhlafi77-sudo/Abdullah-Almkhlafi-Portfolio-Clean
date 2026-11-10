import {
  validatePortfolioSnapshot,
  type PortfolioSnapshotV1,
} from '../../server/content/schema.js';

export type PortfolioSnapshotSource = {
  [K in Exclude<keyof PortfolioSnapshotV1, 'schemaVersion' | 'savedAt'>]: unknown;
};

const CONTENT_FIELDS = [
  'profile',
  'metrics',
  'services',
  'solutions',
  'projects',
  'articles',
  'mediaList',
  'pages',
  'showcaseApps',
  'showcaseBarConfig',
  'cvResumeData',
  'heroConfig',
  'brandVideoUrl',
] as const satisfies ReadonlyArray<keyof PortfolioSnapshotSource>;

export const createPortfolioSnapshot = (
  state: PortfolioSnapshotSource,
  savedAt = new Date().toISOString(),
): PortfolioSnapshotV1 => {
  const content = Object.fromEntries(CONTENT_FIELDS.map((field) => [field, state[field]]));
  return validatePortfolioSnapshot({ schemaVersion: 1, ...content, savedAt });
};

export type { PortfolioSnapshotV1 } from '../../server/content/schema.js';
