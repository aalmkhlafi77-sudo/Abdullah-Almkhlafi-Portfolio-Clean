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
import { createPortfolioSnapshot } from './portfolioSnapshot.js';

/** The same complete defaults used by the editor and by first-run MySQL seeding. */
export const createDefaultSnapshot = (savedAt = new Date().toISOString()) => createPortfolioSnapshot({
  profile: initialProfile,
  metrics: initialMetrics,
  services: initialServices,
  solutions: initialSolutions,
  projects: initialProjects,
  articles: initialArticles,
  mediaList: initialMedia,
  pages: initialPages,
  showcaseApps: initialShowcaseApps,
  showcaseBarConfig: initialShowcaseBarConfig,
  cvResumeData: initialCvResumeData,
  heroConfig: initialHeroConfig,
  brandVideoUrl: '',
}, savedAt);
