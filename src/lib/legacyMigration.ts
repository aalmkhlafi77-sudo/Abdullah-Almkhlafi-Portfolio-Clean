import type { PortfolioSnapshotV1 } from '../../server/content/schema.js';
import { validatePortfolioSnapshot } from '../../server/content/schema.js';
import {
  initialArticles,
  initialCvResumeData,
  initialHeroConfig,
  initialMedia,
  initialMetrics,
  initialPages,
  initialProfile,
  initialProjects,
  initialServices,
  initialShowcaseApps,
  initialShowcaseBarConfig,
  initialSolutions,
} from '../data/initialData.js';

export const LEGACY_STORAGE_KEYS = {
  profile: 'almkhlafi_profile_v2',
  heroConfig: 'almkhlafi_hero_config_v2',
  metrics: 'almkhlafi_metrics_v3',
  services: 'almkhlafi_services_v12',
  solutions: 'almkhlafi_solutions_v1',
  projects: 'almkhlafi_projects_v3',
  articles: 'almkhlafi_articles_v2',
  mediaList: 'almkhlafi_media_v2',
  pages: 'almkhlafi_pages_v2',
  showcaseApps: 'almkhlafi_showcase_apps_v2',
  showcaseBarConfig: 'almkhlafi_showcase_config_v2',
  cvResumeData: 'almkhlafi_cv_resume_v2',
  brandVideoUrl: 'almkhlafi_brand_video_url',
  adminCredentials: 'almkhlafi_admin_creds_v2',
  authSession: 'almkhlafi_auth_session_v2',
  localUpdatedAt: 'almkhlafi_local_updated_at',
  cloudSyncedAt: 'almkhlafi_cloud_synced_at',
  pageDraft: 'almkhlafi_pages_draft_v2',
  lastSavedTime: 'almkhlafi_last_saved_time',
} as const;

const readJson = <T>(storage: Storage, key: string, fallback: T): T => {
  const raw = storage.getItem(key);
  if (!raw) return structuredClone(fallback);
  try {
    return JSON.parse(raw) as T;
  } catch {
    return structuredClone(fallback);
  }
};

export const readLegacySnapshot = (
  storage: Storage,
  savedAt = new Date().toISOString(),
): PortfolioSnapshotV1 => validatePortfolioSnapshot({
  schemaVersion: 1,
  profile: readJson(storage, LEGACY_STORAGE_KEYS.profile, initialProfile),
  metrics: readJson(storage, LEGACY_STORAGE_KEYS.metrics, initialMetrics),
  services: readJson(storage, LEGACY_STORAGE_KEYS.services, initialServices),
  solutions: readJson(storage, LEGACY_STORAGE_KEYS.solutions, initialSolutions),
  projects: readJson(storage, LEGACY_STORAGE_KEYS.projects, initialProjects),
  articles: readJson(storage, LEGACY_STORAGE_KEYS.articles, initialArticles),
  mediaList: readJson(storage, LEGACY_STORAGE_KEYS.mediaList, initialMedia),
  pages: readJson(storage, LEGACY_STORAGE_KEYS.pages, initialPages),
  showcaseApps: readJson(storage, LEGACY_STORAGE_KEYS.showcaseApps, initialShowcaseApps),
  showcaseBarConfig: readJson(storage, LEGACY_STORAGE_KEYS.showcaseBarConfig, initialShowcaseBarConfig),
  cvResumeData: readJson(storage, LEGACY_STORAGE_KEYS.cvResumeData, initialCvResumeData),
  heroConfig: readJson(storage, LEGACY_STORAGE_KEYS.heroConfig, initialHeroConfig),
  brandVideoUrl: storage.getItem(LEGACY_STORAGE_KEYS.brandVideoUrl) ?? '',
  savedAt,
});

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const isEmpty = (value: unknown): boolean =>
  value === null || value === undefined || value === '' ||
  (Array.isArray(value) && value.length === 0) ||
  (isPlainObject(value) && Object.keys(value).length === 0);

const mergeMissing = (server: unknown, legacy: unknown): unknown => {
  if (isEmpty(server) && !isEmpty(legacy)) return structuredClone(legacy);
  if (isPlainObject(server) && isPlainObject(legacy)) {
    const result: Record<string, unknown> = structuredClone(server);
    for (const [key, legacyValue] of Object.entries(legacy)) {
      result[key] = key in result ? mergeMissing(result[key], legacyValue) : structuredClone(legacyValue);
    }
    return result;
  }
  return structuredClone(server);
};

export const mergeMissingLegacyFields = (
  server: PortfolioSnapshotV1,
  legacy: PortfolioSnapshotV1,
): PortfolioSnapshotV1 => validatePortfolioSnapshot({
  ...mergeMissing(server, legacy) as PortfolioSnapshotV1,
  schemaVersion: 1,
  savedAt: new Date().toISOString(),
});

const collectMissing = (server: unknown, legacy: unknown, prefix: string, output: string[]): void => {
  if (isEmpty(server) && !isEmpty(legacy)) {
    output.push(prefix);
    return;
  }
  if (isPlainObject(server) && isPlainObject(legacy)) {
    for (const [key, legacyValue] of Object.entries(legacy)) {
      collectMissing(server[key], legacyValue, prefix ? `${prefix}.${key}` : key, output);
    }
  }
};

export const listLegacyDifferences = (
  server: PortfolioSnapshotV1,
  legacy: PortfolioSnapshotV1,
): string[] => {
  const paths: string[] = [];
  collectMissing(server, legacy, '', paths);
  return paths.filter(Boolean);
};

export const clearLegacyPersistence = (storage: Storage, secondDeviceVerified = false): void => {
  if (!secondDeviceVerified) throw new Error('Second device verification is required before cleanup');
  for (const key of Object.values(LEGACY_STORAGE_KEYS)) storage.removeItem(key);
};
