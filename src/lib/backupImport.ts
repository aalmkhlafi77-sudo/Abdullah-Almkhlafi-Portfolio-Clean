import {
  DEFAULT_MAX_SNAPSHOT_BYTES,
  validatePortfolioSnapshot,
  type PortfolioSnapshotV1,
} from '../../server/content/schema.js';
import { createDefaultSnapshot } from './defaultSnapshot.js';

export interface BackupPreview {
  format: 'v1' | 'legacy';
  pages: number;
  elements: number;
  projects: number;
  services: number;
  solutions: number;
  articles: number;
  images: number;
  embeddedImages: number;
  defaultedFields: string[];
}

const CORE_FIELDS = [
  'profile', 'metrics', 'services', 'solutions', 'projects', 'articles',
  'mediaList', 'pages', 'showcaseApps', 'showcaseBarConfig', 'cvResumeData',
] as const;

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const checkSecrets = (value: unknown): void => {
  if (Array.isArray(value)) return value.forEach(checkSecrets);
  if (!isObject(value)) return;
  for (const [key, child] of Object.entries(value)) {
    if (['password', 'admincredentials'].includes(key.toLowerCase())) {
      throw new Error(`لا يمكن استيراد حقل بيانات اعتماد: ${key}`);
    }
    checkSecrets(child);
  }
};

const countEmbeddedImages = (value: unknown, found = new Set<string>()): number => {
  if (typeof value === 'string' && value.startsWith('data:image/')) found.add(value);
  else if (Array.isArray(value)) value.forEach((child) => countEmbeddedImages(child, found));
  else if (isObject(value)) Object.values(value).forEach((child) => countEmbeddedImages(child, found));
  return found.size;
};

/** Legacy exports predate schemaVersion/savedAt/heroConfig/brandVideoUrl. No content list is silently invented. */
export const parseBackupForImport = (
  text: string,
  maxBytes = DEFAULT_MAX_SNAPSHOT_BYTES,
): { snapshot: PortfolioSnapshotV1; preview: BackupPreview } => {
  if (new TextEncoder().encode(text).byteLength > maxBytes) throw new Error('حجم ملف JSON يتجاوز الحد المسموح');
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { throw new Error('ملف JSON غير صالح'); }
  if (!isObject(raw)) throw new Error('يجب أن يكون جذر ملف JSON كائنًا');
  checkSecrets(raw);

  let snapshot: PortfolioSnapshotV1;
  let format: BackupPreview['format'];
  const defaultedFields: string[] = [];
  if (raw.schemaVersion === 1) {
    snapshot = validatePortfolioSnapshot(raw, maxBytes);
    format = 'v1';
  } else if (raw.schemaVersion === undefined && typeof raw.timestamp === 'string') {
    for (const field of CORE_FIELDS) {
      if (!(field in raw)) throw new Error(`النسخة القديمة تفتقد الحقل المطلوب: ${field}`);
    }
    if (Number.isNaN(Date.parse(raw.timestamp))) throw new Error('تاريخ النسخة القديمة غير صالح');
    const defaults = createDefaultSnapshot(raw.timestamp);
    const legacy = Object.fromEntries(CORE_FIELDS.map((field) => [field, raw[field]]));
    const heroConfig = 'heroConfig' in raw ? raw.heroConfig : defaults.heroConfig;
    const brandVideoUrl = 'brandVideoUrl' in raw ? raw.brandVideoUrl : defaults.brandVideoUrl;
    if (!('heroConfig' in raw)) defaultedFields.push('heroConfig');
    if (!('brandVideoUrl' in raw)) defaultedFields.push('brandVideoUrl');
    snapshot = validatePortfolioSnapshot({
      schemaVersion: 1,
      ...legacy,
      heroConfig,
      brandVideoUrl,
      savedAt: raw.timestamp,
    }, maxBytes);
    format = 'legacy';
  } else {
    throw new Error('صيغة النسخة غير مدعومة؛ يلزم schemaVersion=1 أو timestamp للنسخة القديمة');
  }

  return {
    snapshot,
    preview: {
      format,
      pages: snapshot.pages.length,
      elements: snapshot.pages.reduce((n, page) => n + (Array.isArray(page?.elements) ? page.elements.length : 0), 0),
      projects: snapshot.projects.length,
      services: snapshot.services.length,
      solutions: snapshot.solutions.length,
      articles: snapshot.articles.length,
      images: snapshot.mediaList.length,
      embeddedImages: countEmbeddedImages(snapshot),
      defaultedFields,
    },
  };
};
