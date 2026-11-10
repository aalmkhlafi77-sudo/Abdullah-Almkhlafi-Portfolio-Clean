import type {
  ArticleItem,
  BuilderPage,
  CvResumeData,
  HeroConfig,
  IntegratedSolutionItem,
  MediaItem,
  MetricItem,
  ProfileData,
  ProjectItem,
  ServiceItem,
  ShowcaseAppItem,
  ShowcaseBarConfig,
} from '../../src/types.js';

export const DEFAULT_MAX_SNAPSHOT_BYTES = 25 * 1024 * 1024;

export interface PortfolioSnapshotV1 {
  schemaVersion: 1;
  profile: ProfileData;
  metrics: MetricItem[];
  services: ServiceItem[];
  solutions: IntegratedSolutionItem[];
  projects: ProjectItem[];
  articles: ArticleItem[];
  mediaList: MediaItem[];
  pages: BuilderPage[];
  showcaseApps: ShowcaseAppItem[];
  showcaseBarConfig: ShowcaseBarConfig;
  cvResumeData: CvResumeData;
  heroConfig: HeroConfig;
  brandVideoUrl: string;
  savedAt: string;
}

export type SnapshotValidationCode =
  | 'INVALID_ROOT'
  | 'INVALID_JSON'
  | 'INVALID_SCHEMA_VERSION'
  | 'SNAPSHOT_TOO_LARGE'
  | 'FORBIDDEN_FIELD'
  | 'MISSING_FIELD'
  | 'INVALID_FIELD';

export class SnapshotValidationError extends Error {
  constructor(
    public readonly code: SnapshotValidationCode,
    message: string,
  ) {
    super(message);
    this.name = 'SnapshotValidationError';
  }
}

const SNAPSHOT_FIELDS = [
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
  'savedAt',
] as const;

const ARRAY_FIELDS = new Set([
  'metrics',
  'services',
  'solutions',
  'projects',
  'articles',
  'mediaList',
  'pages',
  'showcaseApps',
]);

const OBJECT_FIELDS = new Set([
  'profile',
  'showcaseBarConfig',
  'cvResumeData',
  'heroConfig',
]);

const FORBIDDEN_KEYS = new Set(['admincredentials', 'password']);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const assertNoSecrets = (value: unknown): void => {
  if (Array.isArray(value)) {
    value.forEach(assertNoSecrets);
    return;
  }
  if (!isPlainObject(value)) return;

  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(key.toLowerCase())) {
      throw new SnapshotValidationError('FORBIDDEN_FIELD', `Forbidden snapshot field: ${key}`);
    }
    assertNoSecrets(child);
  }
};

export const validatePortfolioSnapshot = (
  input: unknown,
  maxBytes = DEFAULT_MAX_SNAPSHOT_BYTES,
): PortfolioSnapshotV1 => {
  if (!isPlainObject(input)) {
    throw new SnapshotValidationError('INVALID_ROOT', 'Snapshot root must be an object');
  }

  let serialized: string;
  try {
    serialized = JSON.stringify(input);
  } catch {
    throw new SnapshotValidationError('INVALID_JSON', 'Snapshot must be serializable JSON');
  }

  // This module is imported by both the Node.js API and the browser bundle.
  // `Buffer` is Node-only, so use the platform-neutral UTF-8 encoder here.
  if (new TextEncoder().encode(serialized).byteLength > maxBytes) {
    throw new SnapshotValidationError('SNAPSHOT_TOO_LARGE', 'Snapshot exceeds the allowed size');
  }
  if (input.schemaVersion !== 1) {
    throw new SnapshotValidationError('INVALID_SCHEMA_VERSION', 'Only schemaVersion 1 is supported');
  }

  assertNoSecrets(input);

  for (const field of SNAPSHOT_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(input, field)) {
      throw new SnapshotValidationError('MISSING_FIELD', `Missing snapshot field: ${field}`);
    }
    const value = input[field];
    if (ARRAY_FIELDS.has(field) && !Array.isArray(value)) {
      throw new SnapshotValidationError('INVALID_FIELD', `${field} must be an array`);
    }
    if (OBJECT_FIELDS.has(field) && !isPlainObject(value)) {
      throw new SnapshotValidationError('INVALID_FIELD', `${field} must be an object`);
    }
  }
  if (typeof input.brandVideoUrl !== 'string' || typeof input.savedAt !== 'string') {
    throw new SnapshotValidationError('INVALID_FIELD', 'brandVideoUrl and savedAt must be strings');
  }

  const clean = Object.fromEntries([
    ['schemaVersion', 1],
    ...SNAPSHOT_FIELDS.map((field) => [field, input[field]]),
  ]);

  return JSON.parse(JSON.stringify(clean)) as PortfolioSnapshotV1;
};