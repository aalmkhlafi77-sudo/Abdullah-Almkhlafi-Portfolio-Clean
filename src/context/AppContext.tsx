import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { apiClient, ApiConflictError, ApiSessionExpiredError } from '../lib/apiClient';
import { createPortfolioSnapshot, type PortfolioSnapshotV1 } from '../lib/portfolioSnapshot';
import { persistMediaDeletion } from '../lib/mediaDeletion';
import { getLoginFailureMessage } from '../lib/loginFailure';
import { createDraftSaveQueue } from '../lib/draftSaveQueue';
import { loadPublishedContent } from '../lib/publishedContent';
import {
  clearLegacyPersistence,
  listLegacyDifferences,
  mergeMissingLegacyFields,
  readLegacySnapshot,
} from '../lib/legacyMigration';
import { optimizeImage } from '../utils/imageOptimizer';
import {
  ThemeMode,
  ActiveView,
  StudioTab,
  DeviceMode,
  ProfileData,
  MetricItem,
  ProjectItem,
  ServiceItem,
  ArticleItem,
  MediaItem,
  MediaAdjustments,
  BuilderPage,
  BuilderElement,
  HeroConfig,
  AdminCredentials,
  ShowcaseAppItem,
  ShowcaseBarConfig,
  CvResumeData,
  IntegratedSolutionItem
} from '../types';
import {
  initialProfile,
  initialMetrics,
  initialServices,
  initialProjects,
  initialArticles,
  initialMedia,
  initialPages,
  initialHeroConfig,
  initialShowcaseApps,
  initialShowcaseBarConfig,
  initialCvResumeData,
  initialSolutions
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  viewMode: ActiveView;
  setViewMode: (mode: ActiveView) => void;
  requestViewMode: (mode: ActiveView) => void;
  studioTab: StudioTab;
  setStudioTab: (tab: StudioTab) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;

  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  isProfileLoaded: boolean;
  publishedContentStatus: 'loading' | 'ready' | 'unpublished' | 'unavailable';
  avatarStatus: 'loading' | 'loaded-with-image' | 'loaded-without-image';
  deleteAvatar: () => Promise<void>;

  heroConfig: HeroConfig;
  updateHeroConfig: (updates: Partial<HeroConfig>) => void;
  resetHeroConfig: () => void;

  isAuthenticated: boolean;
  login: (username: string, pass: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => Promise<void>;
  adminCredentials: AdminCredentials;
  updateAdminCredentials: (creds: Partial<AdminCredentials>, currentPassword?: string) => Promise<boolean>;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  pendingViewAfterAuth: ActiveView | null;
  setPendingViewAfterAuth: (view: ActiveView | null) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  settingsModalTab: 'profile' | 'hero' | 'showcase' | 'services' | 'icons' | 'security' | 'backup';
  setSettingsModalTab: (tab: 'profile' | 'hero' | 'showcase' | 'services' | 'icons' | 'security' | 'backup') => void;
  openSettingsModal: (tab?: 'profile' | 'hero' | 'showcase' | 'services' | 'icons' | 'security' | 'backup') => void;
  showProfileModal: boolean;
  setShowProfileModal: (show: boolean) => void;
  showIconLibraryModal: boolean;
  setShowIconLibraryModal: (show: boolean) => void;
  showResumeModal: boolean;
  setShowResumeModal: (show: boolean) => void;
  showShowcaseModal: boolean;
  setShowShowcaseModal: (show: boolean) => void;
  iconLibraryTarget: {
    type: 'service' | 'metric';
    id: string;
    currentIconName?: string;
    currentColor?: string;
    currentSize?: number;
    currentRotation?: number;
  } | null;
  openIconLibrary: (target: {
    type: 'service' | 'metric';
    id: string;
    currentIconName?: string;
    currentColor?: string;
    currentSize?: number;
    currentRotation?: number;
  }) => void;
  applyIconToTarget: (iconName: string, customStyle?: { color?: string; size?: number; rotation?: number }) => void;
  applyPresetPackToServices: (pack: {
    title: string;
    icons: Array<{ name: string; color?: string; size?: number; rotation?: number }>;
  }) => void;

  showcaseApps: ShowcaseAppItem[];
  showcaseBarConfig: ShowcaseBarConfig;
  updateShowcaseBarConfig: (updates: Partial<ShowcaseBarConfig>) => void;
  updateShowcaseApp: (id: string, updates: Partial<ShowcaseAppItem>) => void;
  addShowcaseApp: (app: ShowcaseAppItem) => void;
  deleteShowcaseApp: (id: string) => void;
  reorderShowcaseApps: (newOrder: ShowcaseAppItem[]) => void;

  cvResumeData: CvResumeData;
  updateCvResumeData: (updates: Partial<CvResumeData>) => void;

  metrics: MetricItem[];
  updateMetric: (id: string, updates: Partial<MetricItem>) => void;

  services: ServiceItem[];
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  addService: (service: ServiceItem) => void;
  deleteService: (id: string) => void;
  reorderServices: (newServices: ServiceItem[]) => void;
  resetServicesToDefault: () => void;

  solutions: IntegratedSolutionItem[];
  updateSolution: (id: string, updates: Partial<IntegratedSolutionItem>) => void;
  addSolution: (solution: IntegratedSolutionItem) => void;
  deleteSolution: (id: string) => void;
  reorderSolutions: (newOrder: IntegratedSolutionItem[]) => void;
  resetSolutionsToDefault: () => void;

  isLiveEditMode: boolean;
  setIsLiveEditMode: (active: boolean) => void;
  selectedLiveElementId: string | null;
  setSelectedLiveElementId: (id: string | null) => void;
  showLivePropertiesPanel: boolean;
  setShowLivePropertiesPanel: (show: boolean) => void;

  brandVideoUrl: string;
  updateBrandVideoUrl: (url: string) => void;

  projects: ProjectItem[];
  updateProject: (id: string, updates: Partial<ProjectItem>) => void;
  addProject: (project: ProjectItem) => void;
  deleteProject: (id: string) => void;

  articles: ArticleItem[];
  selectedArticleId: string;
  setSelectedArticleId: (id: string) => void;
  updateArticle: (id: string, updates: Partial<ArticleItem>) => void;
  addArticle: (article: ArticleItem) => void;
  deleteArticle: (id: string) => void;

  mediaList: MediaItem[];
  selectedMediaId: string;
  setSelectedMediaId: (id: string) => void;
  updateMediaAdjustments: (id: string, adjustments: Partial<MediaAdjustments>) => void;
  resetMediaAdjustments: (id: string) => void;
  saveMediaVersion: (id: string, note?: string) => void;
  restoreMediaVersion: (id: string, versionId: string) => void;
  addMediaItem: (item: MediaItem) => Promise<MediaItem | null>;
  deleteMediaItem: (id: string) => void;

  pages: BuilderPage[];
  activePageId: string;
  setActivePageId: (id: string) => void;
  addPage: (title: string, slug?: string) => void;
  deletePage: (id: string) => void;
  populatePageWithTemplate: (pageId: string) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  updateBuilderElement: (elementId: string, updates: Partial<BuilderElement>) => void;
  reorderBuilderElement: (elementId: string, direction: 'up' | 'down') => void;
  duplicateBuilderElement: (elementId: string) => void;
  deleteBuilderElement: (elementId: string) => void;
  addBuilderElement: (element: BuilderElement) => void;

  undoBuilder: () => void;
  redoBuilder: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clipboardElement: BuilderElement | null;
  copyBuilderElement: (elementId: string) => void;
  pasteBuilderElement: (targetIndex?: number) => void;
  cutBuilderElement: (elementId: string) => void;

  setAvatarUrl: (url: string) => void;

  draftStatus: 'saved' | 'unsaved' | 'published';
  setDraftStatus: (status: 'saved' | 'unsaved' | 'published') => void;
  lastSavedTime: string | null;
  saveDraft: () => Promise<void>;
  restoreDraft: () => boolean;
  publishChanges: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
  exportBackup: () => void;
  importBackup: (jsonData: string) => Promise<boolean>;
  previewLegacyMigration: () => string[];
  mergeLegacyMigration: () => Promise<boolean>;
  clearLegacyData: (secondDeviceVerified: boolean) => boolean;
  savePortfolioToServer: (options?: {
    profileOverride?: ProfileData;
    metricsOverride?: MetricItem[];
    mediaOverride?: MediaItem[];
    pagesOverride?: BuilderPage[];
    projectsOverride?: ProjectItem[];
    articlesOverride?: ArticleItem[];
    servicesOverride?: ServiceItem[];
    solutionsOverride?: IntegratedSolutionItem[];
    showcaseAppsOverride?: ShowcaseAppItem[];
    showcaseBarConfigOverride?: ShowcaseBarConfig;
    cvResumeDataOverride?: CvResumeData;
    heroConfigOverride?: HeroConfig;
    isPublished?: boolean;
  }) => Promise<void>;

  isCloudQuotaExhausted: boolean;
  resetCloudQuotaStatus: () => void;

  toasts: ToastMessage[];
  notify: (text: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const THEME_STORAGE_KEY = 'almkhlafi_theme_v2';

export const isOldStockAvatar = (url?: string | null): boolean => {
  if (!url) return false;
  return url.includes('1507003211169-0a1dd7228f2d');
};

export const sanitizeProfileSocials = (prof: ProfileData): ProfileData => {
  const socials = { ...(prof.socials || initialProfile.socials) };
  if (!socials.github || socials.github === 'https://github.com/almkhlafi') {
    socials.github = 'https://github.com/aalmkhlafi77-sudo';
  }
  if (!socials.facebook || socials.facebook === 'https://facebook.com/almkhlafi') {
    socials.facebook = 'https://www.facebook.com/bdallhhzaalmkhlafy';
  }
  const placeholderSocials = {
    linkedin: 'https://linkedin.com/in/almkhlafi',
    x: 'https://x.com/almkhlafi',
    youtube: 'https://youtube.com/@almkhlafi',
    tiktok: 'https://tiktok.com/@almkhlafi',
    snapchat: 'https://snapchat.com/add/almkhlafi',
  };
  for (const platform of Object.keys(placeholderSocials) as Array<keyof typeof placeholderSocials>) {
    if (socials[platform] === placeholderSocials[platform] || socials[platform] === socials.facebook) {
      socials[platform] = '';
    }
  }
  return {
    ...prof,
    socials
  };
};

export const sanitizeShowcaseApps = (apps: ShowcaseAppItem[]): ShowcaseAppItem[] => {
  if (!Array.isArray(apps)) return initialShowcaseApps;
  return apps.map(app => {
    let cleanUrl = app.url ? app.url.trim() : '';
    if (cleanUrl === '#' || cleanUrl === 'https://' || cleanUrl === 'http://') {
      cleanUrl = '';
    }
    if (cleanUrl.includes('github.com/almkhlafi') && !cleanUrl.includes('aalmkhlafi77-sudo')) {
      cleanUrl = '';
    }
    return {
      ...app,
      url: cleanUrl || undefined
    };
  });
};

export const sanitizeProjects = (projectsList: ProjectItem[]): ProjectItem[] => {
  if (!Array.isArray(projectsList)) return initialProjects;
  return projectsList.map(proj => {
    let cleanExtUrl = proj.externalUrl ? proj.externalUrl.trim() : '';
    if (cleanExtUrl === '#' || cleanExtUrl === 'https://' || cleanExtUrl === 'http://') {
      cleanExtUrl = '';
    }
    if (cleanExtUrl.includes('github.com/almkhlafi') && !cleanExtUrl.includes('aalmkhlafi77-sudo')) {
      cleanExtUrl = '';
    }
    let cleanLink = (proj as any).link ? (proj as any).link.trim() : '';
    if (cleanLink.includes('github.com/almkhlafi') && !cleanLink.includes('aalmkhlafi77-sudo')) {
      cleanLink = '';
    }
    return {
      ...proj,
      externalUrl: cleanExtUrl,
      ...(cleanLink ? { link: cleanLink } : {})
    };
  });
};

export const sanitizeArticles = (articlesList: ArticleItem[]): ArticleItem[] => {
  if (!Array.isArray(articlesList)) return initialArticles;
  return articlesList.map(art => {
    if (art.blocks && Array.isArray(art.blocks)) {
      const cleanBlocks = art.blocks.map(b => {
        if (b.meta && b.meta.buttonLink) {
          let bLink = b.meta.buttonLink.trim();
          if (bLink.includes('github.com/almkhlafi') && !bLink.includes('aalmkhlafi77-sudo')) {
            bLink = '#contact';
          }
          return {
            ...b,
            meta: { ...b.meta, buttonLink: bLink }
          };
        }
        return b;
      });
      return { ...art, blocks: cleanBlocks };
    }
    return art;
  });
};

export const sanitizePages = (pagesList: BuilderPage[]): BuilderPage[] => {
  if (!Array.isArray(pagesList)) return initialPages;
  return pagesList.map(page => {
    if (page.elements && Array.isArray(page.elements)) {
      const cleanElements = page.elements.map(el => {
        if (el.content && el.content.buttonLink) {
          let bLink = el.content.buttonLink.trim();
          if (bLink.includes('github.com/almkhlafi') && !bLink.includes('aalmkhlafi77-sudo')) {
            bLink = '#contact';
          }
          return {
            ...el,
            content: { ...el.content, buttonLink: bLink }
          };
        }
        return el;
      });
      return { ...page, elements: cleanElements };
    }
    return page;
  });
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  });

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Views & tabs
  const [viewMode, setViewMode] = useState<ActiveView>('public');
  const [studioTab, setStudioTab] = useState<StudioTab>('articles');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  const DEFAULT_BRAND_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  const [brandVideoUrl, setBrandVideoUrl] = useState<string>(DEFAULT_BRAND_VIDEO_URL);

  const updateBrandVideoUrl = (url: string) => {
    const trimmed = (url || '').trim();
    setBrandVideoUrl(trimmed);
    setDraftStatus('unsaved');
  };
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [settingsModalTab, setSettingsModalTab] = useState<'profile' | 'hero' | 'showcase' | 'services' | 'icons' | 'security' | 'backup'>('hero');
  const [pendingActionAfterAuth, setPendingActionAfterAuth] = useState<{
    type: 'settings' | 'profile' | 'showcase' | 'iconLibrary';
    tab?: 'profile' | 'hero' | 'showcase' | 'services' | 'icons' | 'security' | 'backup';
  } | null>(null);

  const openSettingsModal = (tab: 'profile' | 'hero' | 'showcase' | 'services' | 'icons' | 'security' | 'backup' = 'hero') => {
    setSettingsModalTab(tab);
    if (!isAuthenticated) {
      setPendingActionAfterAuth({ type: 'settings', tab });
      setShowLoginModal(true);
      notify('يرجى تسجيل الدخول بحساب المسؤول أولاً للوصول إلى لوحة التحكم', 'info');
      return;
    }
    setShowSettingsModal(true);
  };
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showIconLibraryModal, setShowIconLibraryModal] = useState<boolean>(false);
  const [showResumeModal, setShowResumeModal] = useState<boolean>(false);
  const [showShowcaseModal, setShowShowcaseModal] = useState<boolean>(false);
  const [iconLibraryTarget, setIconLibraryTarget] = useState<{
    type: 'service' | 'metric';
    id: string;
    currentIconName?: string;
    currentColor?: string;
    currentSize?: number;
    currentRotation?: number;
  } | null>(null);

  const openIconLibrary = (target: {
    type: 'service' | 'metric';
    id: string;
    currentIconName?: string;
    currentColor?: string;
    currentSize?: number;
    currentRotation?: number;
  }) => {
    setIconLibraryTarget(target);
    setShowIconLibraryModal(true);
  };

  const applyIconToTarget = (iconName: string, customStyle?: { color?: string; size?: number; rotation?: number }) => {
    if (!iconLibraryTarget) return;
    if (iconLibraryTarget.type === 'service') {
      updateService(iconLibraryTarget.id, {
        iconName,
        iconColor: customStyle?.color,
        iconSize: customStyle?.size,
        iconRotation: customStyle?.rotation
      });
      notify('تم تحديث أيقونة البطاقة بنجاح');
    } else if (iconLibraryTarget.type === 'metric') {
      updateMetric(iconLibraryTarget.id, {
        iconName,
        iconColor: customStyle?.color,
        iconSize: customStyle?.size,
        iconRotation: customStyle?.rotation
      });
      notify('تم تحديث أيقونة المقياس بنجاح');
    }
  };

  const applyPresetPackToServices = (pack: {
    title: string;
    icons: Array<{ name: string; color?: string; size?: number; rotation?: number }>;
  }) => {
    if (!pack.icons || pack.icons.length === 0) return;
    setServices(prev => {
      const updated = prev.map((service, idx) => {
        const presetIcon = pack.icons[idx % pack.icons.length];
        return {
          ...service,
          iconName: presetIcon.name,
          iconColor: presetIcon.color,
          iconSize: presetIcon.size,
          iconRotation: presetIcon.rotation
        };
      });
      return updated;
    });
    notify(`تم تطبيق حزمة الأيقونات (${pack.title}) على جميع البطاقات بنجاح`);
  };

  // Authentication & Admin State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>({ username: '', password: '' });

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [pendingViewAfterAuth, setPendingViewAfterAuth] = useState<ActiveView | null>(null);

  const login = async (username: string, pass: string): Promise<{ ok: true } | { ok: false; message: string }> => {
    try {
      const { admin } = await apiClient.login(username.trim(), pass);
      setIsAuthenticated(true);
      setAdminCredentials({ username: admin.username, password: '' });
      setShowLoginModal(false);
      notify(`مرحباً بك مجدداً، تم تسجيل الدخول كمسؤول بنجاح!`, 'success');

      try {
        const draft = await apiClient.getDraft();
        applySnapshot(draft.snapshot);
        setDraftVersion(draft.draftVersion);
        draftSaveQueueRef.current.setVersion(draft.draftVersion);
        setDraftStatus('saved');
      } catch (error) {
        console.error('Unable to load server draft after login:', error);
        notify('تم تسجيل الدخول، لكن تعذر تحميل المسودة من الخادم', 'warning');
      }
      
      if (pendingViewAfterAuth) {
        setViewMode(pendingViewAfterAuth);
        setPendingViewAfterAuth(null);
      }

      if (pendingActionAfterAuth) {
        if (pendingActionAfterAuth.type === 'settings') {
          if (pendingActionAfterAuth.tab) {
            setSettingsModalTab(pendingActionAfterAuth.tab);
          }
          setShowSettingsModal(true);
        } else if (pendingActionAfterAuth.type === 'profile') {
          setShowProfileModal(true);
        } else if (pendingActionAfterAuth.type === 'showcase') {
          setShowShowcaseModal(true);
        }
        setPendingActionAfterAuth(null);
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, message: getLoginFailureMessage(error) };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.warn('Server logout did not complete cleanly:', error);
    } finally {
      setIsAuthenticated(false);
      setAdminCredentials({ username: '', password: '' });
      setShowSettingsModal(false);
      setShowProfileModal(false);
      setShowShowcaseModal(false);
      setShowIconLibraryModal(false);
      setViewMode('public');
      notify('تم تسجيل الخروج بنجاح وتأمين لوحة التحكم', 'info');
    }
  };

  const updateAdminCredentials = async (
    creds: Partial<AdminCredentials>,
    currentPassword = '',
  ): Promise<boolean> => {
    const newUsername = (creds.username !== undefined ? creds.username : adminCredentials.username).trim();
    const newPassword = (creds.password ?? '').trim();
    
    if (newUsername !== adminCredentials.username) {
      notify('تغيير اسم المستخدم غير متاح في هذا الإصدار؛ يمكنك تغيير كلمة المرور بأمان', 'warning');
      return false;
    }
    if (!currentPassword || newPassword.length < 12) {
      notify('أدخل كلمة المرور الحالية، واجعل الجديدة 12 حرفاً على الأقل', 'warning');
      return false;
    }
    try {
      await apiClient.changePassword(currentPassword, newPassword);
      setIsAuthenticated(false);
      setAdminCredentials({ username: newUsername, password: '' });
      setViewMode('public');
      notify('تم تغيير كلمة المرور وإلغاء جميع الجلسات. سجّل الدخول مجدداً 🔒', 'success');
      return true;
    } catch {
      notify('تعذر تغيير كلمة المرور؛ تحقق من كلمة المرور الحالية', 'warning');
      return false;
    }
  };

  const requestViewMode = (mode: ActiveView) => {
    if (mode === 'public') {
      setViewMode('public');
      return;
    }
    if (isAuthenticated) {
      setViewMode(mode);
    } else {
      setPendingViewAfterAuth(mode);
      setShowLoginModal(true);
      notify('يرجى تسجيل الدخول للوصول إلى لوحة التحكم والتعديل', 'info');
    }
  };

  // Dynamic Animated Hero Config State
  const [heroConfig, setHeroConfig] = useState<HeroConfig>(initialHeroConfig);

  const updateHeroConfig = (updates: Partial<HeroConfig>) => {
    setHeroConfig(prev => ({ ...prev, ...updates }));
    setDraftStatus('unsaved');
  };

  const resetHeroConfig = () => {
    setHeroConfig(initialHeroConfig);
    setDraftStatus('unsaved');
    notify('تمت استعادة إعدادات الهيرو الافتراضية');
  };


  // Core Data
  const [profile, setProfile] = useState<ProfileData>(() =>
    sanitizeProfileSocials({ ...initialProfile, avatarUrl: '' }),
  );

  // Keep the image hidden until the server read is resolved.
  const [isProfileLoaded, setIsProfileLoaded] = useState<boolean>(false);
  const [publishedContentStatus, setPublishedContentStatus] = useState<'loading' | 'ready' | 'unpublished' | 'unavailable'>('loading');

  const avatarStatus: 'loading' | 'loaded-with-image' | 'loaded-without-image' = useMemo(() => {
    if (!isProfileLoaded) return 'loading';
    if (profile.avatarUrl && profile.avatarUrl.trim() !== '' && !isOldStockAvatar(profile.avatarUrl)) {
      return 'loaded-with-image';
    }
    return 'loaded-without-image';
  }, [isProfileLoaded, profile.avatarUrl]);

  const [metrics, setMetrics] = useState<MetricItem[]>(initialMetrics);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [solutions, setSolutions] = useState<IntegratedSolutionItem[]>(initialSolutions);

  // Contextual live edit mode states
  const [isLiveEditMode, setIsLiveEditMode] = useState<boolean>(true);
  const [selectedLiveElementId, setSelectedLiveElementId] = useState<string | null>(null);
  const [showLivePropertiesPanel, setShowLivePropertiesPanel] = useState<boolean>(false);

  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);

  const [selectedArticleId, setSelectedArticleId] = useState<string>(() => initialArticles[0]?.id || '');

  const [mediaList, setMediaList] = useState<MediaItem[]>(initialMedia);

  const [selectedMediaId, setSelectedMediaId] = useState<string>(() => initialMedia[0]?.id || '');

  const [showcaseApps, setShowcaseApps] = useState<ShowcaseAppItem[]>(initialShowcaseApps);
  const [showcaseBarConfig, setShowcaseBarConfig] = useState<ShowcaseBarConfig>(initialShowcaseBarConfig);
  const [cvResumeData, setCvResumeData] = useState<CvResumeData>(initialCvResumeData);
  const [pages, setPages] = useState<BuilderPage[]>(initialPages);

  const [activePageId, setActivePageId] = useState<string>('page_home');
  const [selectedElementId, setSelectedElementId] = useState<string | null>('el_hero');

  // Builder Undo / Redo & Clipboard state
  const [undoStack, setUndoStack] = useState<BuilderPage[][]>([]);
  const [redoStack, setRedoStack] = useState<BuilderPage[][]>([]);
  const [clipboardElement, setClipboardElement] = useState<BuilderElement | null>(null);

  const pushHistory = (currentPages: BuilderPage[]) => {
    setUndoStack(prev => [...prev.slice(-30), JSON.parse(JSON.stringify(currentPages))]);
    setRedoStack([]);
  };

  const undoBuilder = () => {
    if (undoStack.length === 0) {
      notify('لا توجد تعديلات سابقة للتراجع عنها', 'info');
      return;
    }
    const previous = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(pages))]);
    setPages(previous);
    setDraftStatus('unsaved');
    notify('تم التراجع عن التعديل (Ctrl+Z)', 'info');
  };

  const redoBuilder = () => {
    if (redoStack.length === 0) {
      notify('لا توجد خطوات لإعادتها', 'info');
      return;
    }
    const next = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(pages))]);
    setPages(next);
    setDraftStatus('unsaved');
    notify('تمت إعادة تطبيق التعديل (Ctrl+Y)', 'info');
  };

  const copyBuilderElement = (elementId: string) => {
    const page = pages.find(p => p.id === activePageId);
    const el = page?.elements.find(e => e.id === elementId);
    if (!el) return;
    setClipboardElement(JSON.parse(JSON.stringify(el)));
    notify(`تم نسخ "${el.name}" إلى الحافظة (Ctrl+C)`);
  };

  const cutBuilderElement = (elementId: string) => {
    const page = pages.find(p => p.id === activePageId);
    const el = page?.elements.find(e => e.id === elementId);
    if (!el) return;
    setClipboardElement(JSON.parse(JSON.stringify(el)));
    pushHistory(pages);
    deleteBuilderElement(elementId);
    notify(`تم قص "${el.name}" (Ctrl+X)`);
  };

  const pasteBuilderElement = (targetIndex?: number) => {
    if (!clipboardElement) {
      notify('الحافظة فارغة، يرجى نسخ عنصر أولاً (Ctrl+C)', 'warning');
      return;
    }
    pushHistory(pages);
    const cloned: BuilderElement = {
      ...JSON.parse(JSON.stringify(clipboardElement)),
      id: 'el_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      name: `${clipboardElement.name} (نسخة)`
    };

    setPages(prev =>
      prev.map(page => {
        if (page.id === activePageId) {
          const newElements = [...page.elements];
          let insertIdx = newElements.length;
          if (typeof targetIndex === 'number' && targetIndex >= 0) {
            insertIdx = targetIndex;
          } else if (selectedElementId) {
            const selIdx = newElements.findIndex(e => e.id === selectedElementId);
            if (selIdx !== -1) insertIdx = selIdx + 1;
          }
          newElements.splice(insertIdx, 0, cloned);
          return { ...page, elements: newElements };
        }
        return page;
      })
    );
    setSelectedElementId(cloned.id);
    notify(`تم لصق "${cloned.name}" بنجاح (Ctrl+V)`);
    setDraftStatus('unsaved');
  };

  const [draftStatus, setDraftStatusState] = useState<'saved' | 'unsaved' | 'published'>('saved');
  const draftRevisionRef = useRef(0);
  const setDraftStatus = (status: 'saved' | 'unsaved' | 'published') => {
    if (status === 'unsaved') draftRevisionRef.current += 1;
    setDraftStatusState(status);
  };
  const [draftVersion, setDraftVersion] = useState(0);
  const draftSaveQueueRef = useRef(createDraftSaveQueue(apiClient));
  const lastServerSnapshotRef = useRef<PortfolioSnapshotV1 | null>(null);
  const [isCloudQuotaExhausted, setIsCloudQuotaExhausted] = useState(false);

  const resetCloudQuotaStatus = () => {
    setIsCloudQuotaExhausted(false);
  };

  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notify = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const applySnapshot = (snapshot: PortfolioSnapshotV1) => {
    lastServerSnapshotRef.current = snapshot;
    setProfile(sanitizeProfileSocials({ ...initialProfile, ...snapshot.profile }));
    setMetrics(snapshot.metrics);
    setServices(snapshot.services);
    setSolutions(snapshot.solutions);
    setProjects(sanitizeProjects(snapshot.projects));
    setArticles(sanitizeArticles(snapshot.articles));
    setMediaList(snapshot.mediaList);
    setPages(sanitizePages(snapshot.pages));
    setShowcaseApps(sanitizeShowcaseApps(snapshot.showcaseApps));
    setShowcaseBarConfig(snapshot.showcaseBarConfig);
    setCvResumeData(snapshot.cvResumeData);
    setHeroConfig(snapshot.heroConfig);
    setBrandVideoUrl(snapshot.brandVideoUrl);
    setIsProfileLoaded(true);
  };

  useEffect(() => {
    let cancelled = false;
    const initializeFromServer = async () => {
      const published = await loadPublishedContent(() => apiClient.publicContent());
      if (!cancelled) {
        if (published.snapshot) applySnapshot(published.snapshot);
        setPublishedContentStatus(published.status);
        setIsProfileLoaded(true);
      }

      try {
        const { admin } = await apiClient.me();
        if (cancelled) return;
        setIsAuthenticated(true);
        setAdminCredentials({ username: admin.username, password: '' });
        const draft = await apiClient.getDraft();
        if (!cancelled) {
          applySnapshot(draft.snapshot);
          setDraftVersion(draft.draftVersion);
          draftSaveQueueRef.current.setVersion(draft.draftVersion);
          setDraftStatus('saved');
        }
      } catch (error) {
        if (!cancelled && !(error instanceof ApiSessionExpiredError)) {
          console.warn('Admin session check failed:', error);
        }
      }
    };
    void initializeFromServer();
    return () => { cancelled = true; };
  }, []);

  // Profile operations
  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => {
      const sanitizedUpdates = { ...updates };
      if (sanitizedUpdates.avatarUrl !== undefined && isOldStockAvatar(sanitizedUpdates.avatarUrl)) {
        sanitizedUpdates.avatarUrl = '';
      }
      return { ...prev, ...sanitizedUpdates };
    });
    setIsProfileLoaded(true);
    setDraftStatus('unsaved');
  };

  // Metrics operations
  const updateMetric = (id: string, updates: Partial<MetricItem>) => {
    setMetrics(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
    setDraftStatus('unsaved');
  };

  // Services operations
  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    setDraftStatus('unsaved');
  };

  const addService = (service: ServiceItem) => {
    setServices(prev => [service, ...prev]);
    setDraftStatus('unsaved');
    notify('تمت إضافة الخدمة / الاستشارة بنجاح');
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    setDraftStatus('unsaved');
    notify('تم حذف الخدمة / الاستشارة', 'info');
  };

  const reorderServices = (newServices: ServiceItem[]) => {
    setServices(newServices);
    setDraftStatus('unsaved');
    notify('تم تحديث ترتيب الخدمات والاستشارات بنجاح');
  };

  const resetServicesToDefault = () => {
    setServices(initialServices);
    setDraftStatus('unsaved');
    notify('تمت استعادة الخدمات والاستشارات الافتراضية الـ 9 بنجاح', 'success');
  };

  // Integrated Solutions operations
  const updateSolution = (id: string, updates: Partial<IntegratedSolutionItem>) => {
    setSolutions(prev => prev.map(sol => (sol.id === id ? { ...sol, ...updates } : sol)));
    setDraftStatus('unsaved');
    notify('تم تحديث الحل المتكامل بنجاح');
  };

  const addSolution = (solution: IntegratedSolutionItem) => {
    setSolutions(prev => [solution, ...prev]);
    setDraftStatus('unsaved');
    notify('تمت إضافة الحل المتكامل بنجاح');
  };

  const deleteSolution = (id: string) => {
    setSolutions(prev => prev.filter(sol => sol.id !== id));
    setDraftStatus('unsaved');
    notify('تم حذف الحل المتكامل', 'info');
  };

  const reorderSolutions = (newOrder: IntegratedSolutionItem[]) => {
    setSolutions(newOrder);
    setDraftStatus('unsaved');
    notify('تم تحديث ترتيب الحلول المتكاملة');
  };

  const resetSolutionsToDefault = () => {
    setSolutions(initialSolutions);
    setDraftStatus('unsaved');
    notify('تمت استعادة الحلول المتكاملة الافتراضية', 'success');
  };

  // Project changes stay in the editor until the debounced server draft save succeeds.
  const updateProject = (id: string, updates: Partial<ProjectItem>) => {
    setProjects(prev => prev.map(project => project.id === id ? { ...project, ...updates } : project));
    setDraftStatus('unsaved');
  };

  const addProject = (project: ProjectItem) => {
    setProjects(prev => [project, ...prev]);
    setDraftStatus('unsaved');
    notify('تمت إضافة المشروع إلى المسودة');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    setDraftStatus('unsaved');
    notify('تم حذف المشروع من المسودة', 'info');
  };

  // Showcase Apps Operations
  const updateShowcaseBarConfig = (updates: Partial<ShowcaseBarConfig>) => {
    setShowcaseBarConfig(prev => ({ ...prev, ...updates }));
    setDraftStatus('unsaved');
  };

  const updateShowcaseApp = (id: string, updates: Partial<ShowcaseAppItem>) => {
    setShowcaseApps(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
    setDraftStatus('unsaved');
    notify('تم تحديث تطبيق المعرض بنجاح');
  };

  const addShowcaseApp = (app: ShowcaseAppItem) => {
    setShowcaseApps(prev => [...prev, app]);
    setDraftStatus('unsaved');
    notify('تمت إضافة تطبيق جديد لشريط المعرض');
  };

  const deleteShowcaseApp = (id: string) => {
    setShowcaseApps(prev => prev.filter(a => a.id !== id));
    setDraftStatus('unsaved');
    notify('تم حذف التطبيق من المعرض', 'info');
  };

  const reorderShowcaseApps = (newOrder: ShowcaseAppItem[]) => {
    setShowcaseApps(newOrder);
    setDraftStatus('unsaved');
  };

  // CV / Resume operations
  const updateCvResumeData = (updates: Partial<CvResumeData>) => {
    setCvResumeData(prev => ({ ...prev, ...updates }));
    setDraftStatus('unsaved');
  };

  // Article changes stay in the editor until the debounced server draft save succeeds.
  const updateArticle = (id: string, updates: Partial<ArticleItem>) => {
    setArticles(prev => prev.map(article => article.id === id ? { ...article, ...updates } : article));
    setDraftStatus('unsaved');
  };

  const addArticle = (article: ArticleItem) => {
    setArticles(prev => [article, ...prev]);
    setSelectedArticleId(article.id);
    setDraftStatus('unsaved');
    notify('تمت إضافة المقال إلى المسودة');
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(article => article.id !== id));
    setDraftStatus('unsaved');
    notify('تم حذف المقال من المسودة', 'info');
  };

  // Media adjustments & versioning
  const updateMediaAdjustments = (id: string, adjustments: Partial<MediaAdjustments>) => {
    setMediaList(prev =>
      prev.map(m => {
        if (m.id === id) {
          return {
            ...m,
            adjustments: {
              ...m.adjustments,
              ...adjustments
            }
          };
        }
        return m;
      })
    );
    setDraftStatus('unsaved');
  };

  const resetMediaAdjustments = (id: string) => {
    const defaultAdj: MediaAdjustments = {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      temperature: 0,
      sharpness: 0,
      opacity: 0,
      cropRatio: 'free',
      rotate: 0,
      flipH: false,
      flipV: false,
      focalPoint: { x: 50, y: 50 }
    };
    updateMediaAdjustments(id, defaultAdj);
    notify('تمت إعادة ضبط جميع الفلاتر للوضع الافتراضي');
  };

  const saveMediaVersion = (id: string, note = 'تعديل يدوي جديد') => {
    const target = mediaList.find(m => m.id === id);
    if (!target) return;

    const newVersion = {
      id: 'v_' + Date.now(),
      timestamp: new Date().toLocaleString('ar-SA'),
      label: note,
      adjustments: { ...target.adjustments }
    };

    setMediaList(prev =>
      prev.map(m => {
        if (m.id === id) {
          return {
            ...m,
            versions: [newVersion, ...(m.versions || [])]
          };
        }
        return m;
      })
    );
    notify('تم حفظ إصدار جديد في سجل الصورة');
  };

  const restoreMediaVersion = (id: string, versionId: string) => {
    const target = mediaList.find(m => m.id === id);
    if (!target) return;
    const version = target.versions.find(v => v.id === versionId);
    if (!version) return;

    setMediaList(prev =>
      prev.map(m => {
        if (m.id === id) {
          return {
            ...m,
            adjustments: { ...version.adjustments }
          };
        }
        return m;
      })
    );
    notify(`تمت استعادة الإصدار: ${version.label}`);
  };

  const addMediaItem = async (item: MediaItem): Promise<MediaItem | null> => {
    let persistedItem = { ...item };
    if (persistedItem.url?.startsWith('blob:')) {
      notify('لا يمكن حفظ رابط صورة مؤقت؛ ارفع الملف من جديد', 'warning');
      return null;
    }
    if (persistedItem.url?.startsWith('data:image/')) {
      try {
        const match = /^data:(image\/(?:jpeg|png|webp|gif));base64,([a-z\d+/=]+)$/i.exec(persistedItem.url);
        if (!match) throw new Error('Unsupported image data URL');
        const bytes = Uint8Array.from(atob(match[2]), (character) => character.charCodeAt(0));
        const extension = match[1] === 'image/jpeg' ? 'jpg' : match[1].split('/')[1];
        const name = (persistedItem.name || 'image').replace(/\.[^.]+$/, '');
        const uploaded = await apiClient.uploadMedia(new File([bytes], `${name}.${extension}`, { type: match[1] }));
        const publicUrl = String(uploaded.publicUrl);
        persistedItem = {
          ...persistedItem,
          id: String(uploaded.id),
          url: publicUrl,
          originalUrl: publicUrl,
          type: String(uploaded.mimeType ?? match[1]),
        };
      } catch (err) {
        console.warn('Media upload failed:', err);
        notify('تعذر رفع الصورة إلى التخزين الدائم؛ لم تتم إضافتها', 'warning');
        return null;
      }
    }
    const updatedMedia = [persistedItem, ...mediaList.filter(m => m.id !== persistedItem.id)];
    setMediaList(updatedMedia);
    setSelectedMediaId(persistedItem.id);
    notify('تم رفع الصورة وإضافتها إلى مكتبة الوسائط الدائمة بنجاح');
    setDraftStatus('unsaved');
    return persistedItem;
  };

  const deleteMediaItem = async (id: string) => {
    const remaining = mediaList.filter(m => m.id !== id);
    try {
      await persistMediaDeletion(id, {
        saveDraftWithoutMedia: () => savePortfolioToServer({ mediaOverride: remaining }),
        deleteMediaFile: (mediaId) => apiClient.deleteMedia(mediaId),
      });
      setMediaList(remaining);
      if (selectedMediaId === id && remaining.length > 0) {
        setSelectedMediaId(remaining[0].id);
      }
      notify('تم حذف الصورة من المسودة والتخزين الدائم', 'info');
    } catch (error) {
      console.error('Persistent media deletion failed:', error);
      notify('تعذر حذف الصورة نهائياً؛ تحقق من عدم استخدامها في أي عنصر', 'warning');
    }
  };

  // Page operations
  const addPage = (title: string, slug?: string) => {
    const cleanSlug = slug || 'page_' + Date.now();
    const newPage: BuilderPage = {
      id: 'page_' + Date.now(),
      title,
      slug: cleanSlug,
      isHome: false,
      published: true,
      elements: [
        {
          id: 'el_head_' + Date.now(),
          name: 'عنوان الصفحة',
          type: 'heading',
          visible: true,
          locked: false,
          content: {
            title,
            subtitle: 'صفحة جديدة في منصة عبدالله المخلافي',
            description: 'يمكنك تخصيص محتوى وتصميم هذا القسم بالكامل عبر لوحة الخصائص.'
          },
          layout: {
            paddingY: 'py-16',
            maxWidth: 'max-w-5xl',
            align: 'center'
          },
          style: {
            material: 'glass',
            glow: false
          },
          motion: {
            animationType: 'fade-up',
            duration: 0.5,
            delay: 0.1
          }
        }
      ]
    };
    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    setActivePageId(newPage.id);
    setSelectedElementId(newPage.elements[0].id);
    notify(`تم إنشاء صفحة "${title}" بنجاح`);
    setDraftStatus('unsaved');

  };

  const deletePage = (id: string) => {
    const pageToDelete = pages.find(p => p.id === id);
    if (pageToDelete?.isHome) {
      notify('لا يمكن حذف الصفحة الرئيسية', 'warning');
      return;
    }
    const remainingPages = pages.filter(p => p.id !== id);
    setPages(remainingPages);
    setActivePageId('page_home');
    notify('تم حذف الصفحة بنجاح', 'info');
    setDraftStatus('unsaved');

  };

  const populatePageWithTemplate = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;
    const template = initialPages.find(p => p.id === pageId || p.slug === page.slug);
    const newElements = template && template.elements.length > 0
      ? template.elements
      : [
          {
            id: 'el_' + Date.now() + '_head',
            name: 'ترويسة الصفحة',
            type: 'heading' as const,
            visible: true,
            locked: false,
            content: {
              title: page.title,
              subtitle: 'قسم مخصص',
              description: 'أضف نبذة أو تفاصيل لهذا القسم.'
            },
            layout: { paddingY: 'py-16', maxWidth: 'max-w-5xl', align: 'center' as const },
            style: { material: 'glass' as const, glow: true },
            motion: { animationType: 'fade-up' as const, duration: 0.6, delay: 0.1 }
          },
          {
            id: 'el_' + Date.now() + '_p',
            name: 'محتوى نصي',
            type: 'paragraph' as const,
            visible: true,
            locked: false,
            content: {
              title: 'نص توضيحي',
              description: 'اكتب محتوى مفصل هنا أو قم بتعديل هذا العنصر عبر اللوحة الجانبية.'
            },
            layout: { paddingY: 'py-8', maxWidth: 'max-w-4xl', align: 'start' as const },
            style: { material: 'glass' as const, glow: false },
            motion: { animationType: 'fade-up' as const, duration: 0.5, delay: 0.2 }
          }
        ];

    const updated = pages.map(p => {
      if (p.id === pageId) {
        return { ...p, elements: newElements };
      }
      return p;
    });

    setPages(updated);
    setSelectedElementId(newElements[0]?.id || null);
    notify(`تم توليد محتوى متكامل لصفحة "${page.title}"`);
    setDraftStatus('unsaved');
  };

  const savePortfolioToServer = async (options: {
    profileOverride?: ProfileData;
    metricsOverride?: MetricItem[];
    mediaOverride?: MediaItem[];
    pagesOverride?: BuilderPage[];
    projectsOverride?: ProjectItem[];
    articlesOverride?: ArticleItem[];
    servicesOverride?: ServiceItem[];
    solutionsOverride?: IntegratedSolutionItem[];
    showcaseAppsOverride?: ShowcaseAppItem[];
    showcaseBarConfigOverride?: ShowcaseBarConfig;
    cvResumeDataOverride?: CvResumeData;
    heroConfigOverride?: HeroConfig;
    isPublished?: boolean;
  } = {}): Promise<void> => {
    const snapshot = createPortfolioSnapshot({
      profile: options.profileOverride ?? profile,
      metrics: options.metricsOverride ?? metrics,
      services: options.servicesOverride ?? services,
      solutions: options.solutionsOverride ?? solutions,
      projects: options.projectsOverride ?? projects,
      articles: options.articlesOverride ?? articles,
      mediaList: options.mediaOverride ?? mediaList,
      pages: options.pagesOverride ?? pages,
      showcaseApps: options.showcaseAppsOverride ?? showcaseApps,
      showcaseBarConfig: options.showcaseBarConfigOverride ?? showcaseBarConfig,
      cvResumeData: options.cvResumeDataOverride ?? cvResumeData,
      heroConfig: options.heroConfigOverride ?? heroConfig,
      brandVideoUrl,
    });

    const revision = draftRevisionRef.current;
    const { saved, published } = await draftSaveQueueRef.current.save(snapshot, options.isPublished);
    lastServerSnapshotRef.current = saved.snapshot;
    setDraftVersion(saved.draftVersion);
    if (revision === draftRevisionRef.current) setDraftStatus('saved');

    if (published) {
      lastServerSnapshotRef.current = published.snapshot;
      if (revision === draftRevisionRef.current) setDraftStatus('published');
    }
  };

  const setAvatarUrl = async (url: string) => {
    let optimizedUrl = url;
    if (isOldStockAvatar(url)) {
      optimizedUrl = '';
    } else if (url && url.startsWith('data:image/') && url.length > 70000) {
      try {
        optimizedUrl = await optimizeImage(url, 800, 800, 0.82);
      } catch (e) {
        console.warn('Error compressing avatar in setAvatarUrl:', e);
      }
    }

    const newProfile = {
      ...profile,
      avatarUrl: optimizedUrl
    };
    setProfile(newProfile);
    setIsProfileLoaded(true);
    notify('تم تحديث الصورة الشخصية بنجاح!');
    setDraftStatus('unsaved');

    try {
      await savePortfolioToServer({ profileOverride: newProfile });
      notify('تم حفظ وتحديث الصورة الشخصية في قاعدة بيانات الموقع بنجاح!');
    } catch (e) {
      console.error('Error auto-saving avatar to cloud:', e);
      notify('تعذر حفظ الصورة على الخادم؛ ما زال التعديل غير محفوظ', 'warning');
    }
  };

  const deleteAvatar = async () => {
    const newProfile = {
      ...profile,
      avatarUrl: ''
    };
    setProfile(newProfile);
    setIsProfileLoaded(true);
    notify('تمت إزالة الصورة واستعادة الشعار الفني بنجاح!');
    setDraftStatus('unsaved');

    try {
      await savePortfolioToServer({ profileOverride: newProfile });
      notify('تم حفظ إزالة الصورة الشخصية في قاعدة بيانات الموقع بنجاح!');
    } catch (e) {
      console.error('Error auto-saving removed avatar to cloud:', e);
      notify('تعذر حفظ إزالة الصورة على الخادم؛ ما زال التعديل غير محفوظ', 'warning');
    }
  };

  // Builder elements operations
  const updateBuilderElement = (elementId: string, updates: Partial<BuilderElement>) => {
    pushHistory(pages);
    setPages(prev =>
      prev.map(page => {
        if (page.id === activePageId) {
          return {
            ...page,
            elements: page.elements.map(el => {
              if (el.id === elementId) {
                return {
                  ...el,
                  ...updates,
                  content: { ...el.content, ...(updates.content || {}) },
                  layout: { ...el.layout, ...(updates.layout || {}) },
                  style: { ...el.style, ...(updates.style || {}) },
                  motion: { ...el.motion, ...(updates.motion || {}) }
                };
              }
              return el;
            })
          };
        }
        return page;
      })
    );
    setDraftStatus('unsaved');
  };

  const reorderBuilderElement = (elementId: string, direction: 'up' | 'down') => {
    pushHistory(pages);
    setPages(prev =>
      prev.map(page => {
        if (page.id === activePageId) {
          const index = page.elements.findIndex(el => el.id === elementId);
          if (index === -1) return page;
          const targetIndex = direction === 'up' ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= page.elements.length) return page;

          const newElements = [...page.elements];
          const [moved] = newElements.splice(index, 1);
          newElements.splice(targetIndex, 0, moved);

          return { ...page, elements: newElements };
        }
        return page;
      })
    );
    setDraftStatus('unsaved');
  };

  const duplicateBuilderElement = (elementId: string) => {
    pushHistory(pages);
    setPages(prev =>
      prev.map(page => {
        if (page.id === activePageId) {
          const el = page.elements.find(e => e.id === elementId);
          if (!el) return page;
          const cloned: BuilderElement = {
            ...JSON.parse(JSON.stringify(el)),
            id: 'el_' + Date.now(),
            name: `${el.name} (نسخة)`
          };
          const index = page.elements.findIndex(e => e.id === elementId);
          const newElements = [...page.elements];
          newElements.splice(index + 1, 0, cloned);
          setSelectedElementId(cloned.id);
          return { ...page, elements: newElements };
        }
        return page;
      })
    );
    notify('تم تكرار العنصر بنجاح');
    setDraftStatus('unsaved');
  };

  const deleteBuilderElement = (elementId: string) => {
    pushHistory(pages);
    setPages(prev =>
      prev.map(page => {
        if (page.id === activePageId) {
          return {
            ...page,
            elements: page.elements.filter(e => e.id !== elementId)
          };
        }
        return page;
      })
    );
    setSelectedElementId(null);
    notify('تم حذف العنصر', 'info');
    setDraftStatus('unsaved');
  };

  const addBuilderElement = (element: BuilderElement) => {
    pushHistory(pages);
    setPages(prev =>
      prev.map(page => {
        if (page.id === activePageId) {
          return {
            ...page,
            elements: [...page.elements, element]
          };
        }
        return page;
      })
    );
    setSelectedElementId(element.id);
    notify(`تمت إضافة ${element.name} إلى الصفحة`);
    setDraftStatus('unsaved');
  };

  // Draft & Publish
  const saveDraft = async (): Promise<void> => {
    setDraftStatus('unsaved');
    const revision = draftRevisionRef.current;
    try {
      await savePortfolioToServer();
      const now = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(now);
      if (revision === draftRevisionRef.current) {
        notify('تم حفظ المسودة نهائياً في قاعدة بيانات الموقع ✓', 'success');
      } else {
        notify('حُفظت نسخة من المسودة، وتوجد تعديلات أحدث لم تُحفظ بعد', 'warning');
      }
    } catch (error) {
      setDraftStatus('unsaved');
      if (error instanceof ApiConflictError) {
        notify(`توجد مسودة أحدث على الخادم (الإصدار ${error.currentVersion})؛ أعد تحميلها قبل الحفظ`, 'warning');
      } else if (error instanceof ApiSessionExpiredError) {
        setIsAuthenticated(false);
        notify('انتهت جلسة الإدارة؛ سجّل الدخول ثم أعد الحفظ', 'warning');
      } else {
        notify('تعذر حفظ المسودة على الخادم؛ بقيت التغييرات غير محفوظة', 'warning');
      }
    }
  };

  const restoreDraft = (): boolean => {
    if (!lastServerSnapshotRef.current) {
      notify('لا توجد مسودة خادمية محفوظة لاستعادتها', 'info');
      return false;
    }
    applySnapshot(lastServerSnapshotRef.current);
    setDraftStatus('saved');
    notify('تمت استعادة آخر مسودة مؤكدة من الخادم');
    return true;
  };

  const publishChanges = async (): Promise<void> => {
    setDraftStatus('unsaved');
    const revision = draftRevisionRef.current;
    try {
      await savePortfolioToServer({ isPublished: true });
      const now = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(now);
      if (revision === draftRevisionRef.current) {
        notify('تم نشر التغييرات من قاعدة البيانات وظهورها لجميع الأجهزة 🚀', 'success');
      } else {
        notify('نُشرت النسخة السابقة، وتوجد تعديلات أحدث لم تُنشر بعد', 'warning');
      }
    } catch (error) {
      setDraftVersion(draftSaveQueueRef.current.version);
      setDraftStatus('unsaved');
      if (error instanceof ApiConflictError) {
        notify(`تعارض مع مسودة أحدث على الخادم (الإصدار ${error.currentVersion})؛ لم يتم النشر`, 'warning');
      } else if (error instanceof ApiSessionExpiredError) {
        setIsAuthenticated(false);
        notify('انتهت جلسة الإدارة؛ لم يتم النشر', 'warning');
      } else {
        notify('فشل النشر على الخادم؛ بقي المنشور السابق دون تغيير', 'warning');
      }
    }
  };

  // Debounced background synchronization to the versioned server draft.
  useEffect(() => {
    if (draftStatus !== 'unsaved') return;

    const autoSyncTimer = setTimeout(async () => {
      try {
        console.log('[Auto-Sync] Debounced cloud synchronization triggered...');
        await savePortfolioToServer({
          profileOverride: profile,
          mediaOverride: mediaList,
          pagesOverride: pages,
          projectsOverride: projects,
          articlesOverride: articles,
          servicesOverride: services,
          solutionsOverride: solutions,
          showcaseAppsOverride: showcaseApps,
          heroConfigOverride: heroConfig
        });
        console.log('[Auto-Sync] Background cloud sync completed successfully.');
      } catch (err) {
        console.warn('[Auto-Sync] Background sync deferred:', err);
      }
    }, 2000);

    return () => clearTimeout(autoSyncTimer);
  }, [draftStatus, projects, articles, profile, heroConfig, services, solutions, showcaseApps, pages, mediaList, metrics, showcaseBarConfig, cvResumeData, brandVideoUrl]);

  const resetToDefaults = async (): Promise<void> => {
    setProfile(initialProfile);
    setMetrics(initialMetrics);
    setServices(initialServices);
    setSolutions(initialSolutions);
    setProjects(initialProjects);
    setArticles(initialArticles);
    setMediaList(initialMedia);
    setPages(initialPages);
    setShowcaseApps(initialShowcaseApps);
    setShowcaseBarConfig(initialShowcaseBarConfig);
    setCvResumeData(initialCvResumeData);
    setDraftStatus('unsaved');
    const revision = draftRevisionRef.current;
    try {
      await savePortfolioToServer({
        profileOverride: initialProfile,
        metricsOverride: initialMetrics,
        servicesOverride: initialServices,
        solutionsOverride: initialSolutions,
        projectsOverride: initialProjects,
        articlesOverride: initialArticles,
        mediaOverride: initialMedia,
        pagesOverride: initialPages,
        showcaseAppsOverride: initialShowcaseApps,
        showcaseBarConfigOverride: initialShowcaseBarConfig,
        cvResumeDataOverride: initialCvResumeData,
      });
      if (revision === draftRevisionRef.current) {
        notify('تمت استعادة القيم الافتراضية وحفظها في مسودة الخادم', 'success');
      } else {
        notify('حُفظت القيم الافتراضية، وتوجد تعديلات أحدث لم تُحفظ بعد', 'warning');
      }
    } catch (error) {
      setDraftStatus('unsaved');
      if (error instanceof ApiConflictError) {
        notify(`توجد مسودة أحدث على الخادم (الإصدار ${error.currentVersion})؛ بقيت القيم الافتراضية غير محفوظة`, 'warning');
      } else if (error instanceof ApiSessionExpiredError) {
        setIsAuthenticated(false);
        notify('انتهت جلسة الإدارة؛ بقيت القيم الافتراضية غير محفوظة', 'warning');
      } else {
        notify('تعذر حفظ القيم الافتراضية على الخادم؛ بقيت التغييرات غير محفوظة', 'warning');
      }
    }
  };

  const exportBackup = () => {
    const data = createPortfolioSnapshot({
      profile,
      metrics,
      services,
      solutions,
      projects,
      articles,
      mediaList,
      pages,
      showcaseApps,
      showcaseBarConfig,
      cvResumeData,
      heroConfig,
      brandVideoUrl,
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `almkhlafi-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('تم تحميل ملف النسخة الاحتياطية بنجاح');
  };

  const currentSnapshot = (): PortfolioSnapshotV1 => createPortfolioSnapshot({
    profile,
    metrics,
    services,
    solutions,
    projects,
    articles,
    mediaList,
    pages,
    showcaseApps,
    showcaseBarConfig,
    cvResumeData,
    heroConfig,
    brandVideoUrl,
  });

  const importBackup = async (jsonData: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonData);
      const baseline = currentSnapshot();
      const snapshot = createPortfolioSnapshot({
        profile: parsed.profile ?? baseline.profile,
        metrics: parsed.metrics ?? baseline.metrics,
        services: parsed.services ?? baseline.services,
        solutions: parsed.solutions ?? baseline.solutions,
        projects: parsed.projects ?? baseline.projects,
        articles: parsed.articles ?? baseline.articles,
        mediaList: parsed.mediaList ?? baseline.mediaList,
        pages: parsed.pages ?? baseline.pages,
        showcaseApps: parsed.showcaseApps ?? baseline.showcaseApps,
        showcaseBarConfig: parsed.showcaseBarConfig ?? baseline.showcaseBarConfig,
        cvResumeData: parsed.cvResumeData ?? baseline.cvResumeData,
        heroConfig: parsed.heroConfig ?? baseline.heroConfig,
        brandVideoUrl: parsed.brandVideoUrl ?? baseline.brandVideoUrl,
      }, parsed.savedAt);
      const imported = await apiClient.importContent(snapshot, draftSaveQueueRef.current.version);
      applySnapshot(imported.snapshot);
      setDraftVersion(imported.draftVersion);
      draftSaveQueueRef.current.setVersion(imported.draftVersion);
      setDraftStatus('saved');
      notify('تم استيراد النسخة إلى مسودة الخادم بنجاح');
      return true;
    } catch (error) {
      console.error('Backup import failed:', error);
      notify('فشل الاستيراد أو الحفظ على الخادم؛ لم تُعرض رسالة نجاح وهمية', 'warning');
      return false;
    }
  };

  const previewLegacyMigration = (): string[] => {
    try {
      return listLegacyDifferences(currentSnapshot(), readLegacySnapshot(localStorage));
    } catch (error) {
      console.error('Legacy migration preview failed:', error);
      notify('تعذرت معاينة البيانات المحلية القديمة', 'warning');
      return [];
    }
  };

  const mergeLegacyMigration = async (): Promise<boolean> => {
    try {
      const merged = mergeMissingLegacyFields(currentSnapshot(), readLegacySnapshot(localStorage));
      const imported = await apiClient.importContent(merged, draftSaveQueueRef.current.version);
      applySnapshot(imported.snapshot);
      setDraftVersion(imported.draftVersion);
      draftSaveQueueRef.current.setVersion(imported.draftVersion);
      setDraftStatus('saved');
      notify('تم دمج الحقول المحلية الناقصة وحفظها في مسودة الخادم');
      return true;
    } catch (error) {
      console.error('Legacy migration merge failed:', error);
      notify('تعذر دمج البيانات المحلية مع مسودة الخادم', 'warning');
      return false;
    }
  };

  const clearLegacyData = (secondDeviceVerified: boolean): boolean => {
    try {
      clearLegacyPersistence(localStorage, secondDeviceVerified);
      notify('تم تنظيف بيانات التخزين المحلي القديمة بعد التحقق');
      return true;
    } catch {
      notify('لن يتم التنظيف قبل تأكيد نجاح البيانات على جهاز ثانٍ', 'warning');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        viewMode,
        setViewMode,
        requestViewMode,
        studioTab,
        setStudioTab,
        deviceMode,
        setDeviceMode,

        profile,
        updateProfile,
        isProfileLoaded,
        publishedContentStatus,
        avatarStatus,
        deleteAvatar,

        heroConfig,
        updateHeroConfig,
        resetHeroConfig,

        isAuthenticated,
        login,
        logout,
        adminCredentials,
        updateAdminCredentials,
        showLoginModal,
        setShowLoginModal,
        pendingViewAfterAuth,
        setPendingViewAfterAuth,
        showSettingsModal,
        setShowSettingsModal,
        settingsModalTab,
        setSettingsModalTab,
        openSettingsModal,
        showProfileModal,
        setShowProfileModal,
        showIconLibraryModal,
        setShowIconLibraryModal,
        showResumeModal,
        setShowResumeModal,
        showShowcaseModal,
        setShowShowcaseModal,
        iconLibraryTarget,
        openIconLibrary,
        applyIconToTarget,
        applyPresetPackToServices,

        showcaseApps,
        showcaseBarConfig,
        updateShowcaseBarConfig,
        updateShowcaseApp,
        addShowcaseApp,
        deleteShowcaseApp,
        reorderShowcaseApps,

        cvResumeData,
        updateCvResumeData,

        metrics,
        updateMetric,

        services,
        updateService,
        addService,
        deleteService,
        reorderServices,
        resetServicesToDefault,

        solutions,
        updateSolution,
        addSolution,
        deleteSolution,
        reorderSolutions,
        resetSolutionsToDefault,

        isLiveEditMode,
        setIsLiveEditMode,
        selectedLiveElementId,
        setSelectedLiveElementId,
        showLivePropertiesPanel,
        setShowLivePropertiesPanel,

        projects,
        updateProject,
        addProject,
        deleteProject,

        articles,
        selectedArticleId,
        setSelectedArticleId,
        updateArticle,
        addArticle,
        deleteArticle,

        mediaList,
        selectedMediaId,
        setSelectedMediaId,
        updateMediaAdjustments,
        resetMediaAdjustments,
        saveMediaVersion,
        restoreMediaVersion,
        addMediaItem,
        deleteMediaItem,

        pages,
        activePageId,
        setActivePageId,
        addPage,
        deletePage,
        populatePageWithTemplate,
        selectedElementId,
        setSelectedElementId,
        updateBuilderElement,
        reorderBuilderElement,
        duplicateBuilderElement,
        deleteBuilderElement,
        addBuilderElement,

        undoBuilder,
        redoBuilder,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        clipboardElement,
        copyBuilderElement,
        pasteBuilderElement,
        cutBuilderElement,

        setAvatarUrl,

        draftStatus,
        setDraftStatus,
        lastSavedTime,
        saveDraft,
        restoreDraft,
        publishChanges,
        resetToDefaults,
        exportBackup,
        importBackup,
        previewLegacyMigration,
        mergeLegacyMigration,
        clearLegacyData,
        savePortfolioToServer,

        toasts,
        notify,
        removeToast,

        isCloudQuotaExhausted,
        resetCloudQuotaStatus,

        brandVideoUrl,
        updateBrandVideoUrl
      }}
    >
      <div className={theme === 'light' ? 'light-mode bg-[#F9F7F2] text-[#121212]' : 'dark-mode dark bg-[#121212] text-[#F9F7F2]'}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
