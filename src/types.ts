export type ThemeMode = 'dark' | 'light';
export type ActiveView = 'public' | 'builder' | 'studio';
export type StudioTab = 'articles' | 'photo_editor' | 'media_library';
export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface ProfileData {
  name: string;
  englishName: string;
  role: string;
  tagline: string;
  bio: string;
  longBio: string;
  quote: string;
  logoUrl?: string;
  logoHeight?: number;
  useImageLogo?: boolean;
  avatarUrl?: string;
  avatarSize?: 'sm' | 'md' | 'lg' | 'xl';
  avatarShape?: 'circle' | 'rounded' | 'square';
  avatarFit?: 'cover' | 'contain' | 'fill';
  avatarPosition?: 'center' | 'top' | 'bottom';
  avatarAlign?: 'right' | 'center' | 'left';
  avatarBrightness?: number;
  avatarContrast?: number;
  avatarSaturation?: number;
  avatarBlur?: number;
  avatarZoom?: number;
  avatarFilter?: 'normal' | 'cinematic_gold' | 'bw' | 'warm' | 'cool' | 'vintage';
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  availableForHire: boolean;
  socials: {
    github: string;
    linkedin?: string;
    x?: string;
    email: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    snapchat?: string;
  };
}

export interface MetricItem {
  id: string;
  label: string;
  value: string;
  iconName: string;
  iconColor?: string;
  iconSize?: number;
  iconRotation?: number;
  subtext?: string;
}

export interface ShowcaseAppItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  logoUrl?: string; // Transparent PNG / SVG or custom image
  iconName?: string; // Fallback Lucide icon name if no image uploaded
  logoBgColor?: string; // Optional background tint or transparent
  url: string;
  status?: 'live' | 'beta' | 'in_development';
  tags?: string[];
  order: number;
}

export interface ShowcaseBarConfig {
  title: string;
  subtitle?: string;
  enabled: boolean;
  layoutStyle: 'grid_bar' | 'marquee_carousel' | 'cards_flow';
  showBadge: boolean;
}

export interface CvWorkExperience {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements?: string[];
}

export interface CvEducation {
  id: string;
  degree: string;
  institution: string;
  year: string;
  details?: string;
}

export interface CvCertification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface CvResumeData {
  summary: string;
  skills: string[];
  experiences: CvWorkExperience[];
  education: CvEducation[];
  certifications: CvCertification[];
  languages: Array<{ name: string; level: string }>;
  template: 'executive_gold' | 'minimal_clean' | 'modern_tech';
  showPhoto: boolean;
  showContact: boolean;
  showProjects: boolean;
  showServices: boolean;
  showMetrics: boolean;
  accentColor: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  fullDescription?: string;
  year: string;
  role: string;
  tools: string[];
  challenge?: string;
  solution?: string;
  results?: string;
  imageUrl: string;
  galleryUrls?: string[];
  externalUrl?: string;
  link?: string;
  videoUrl?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  order?: number;
  imageFit?: 'cover' | 'contain';
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  deliverables?: string[];
  type?: 'consulting' | 'service';
  iconName: string;
  iconColor?: string;
  iconSize?: number;
  iconRotation?: number;
  category: string;
  tags: string[];
  order: number;
}

export interface IntegratedSolutionItem {
  id: string;
  title: string;
  problemSolved: string;
  includedServices: string[];
  deliverables: string[];
  targetAudience: string;
  estimatedDuration?: string;
  imageUrl?: string;
  iconName?: string;
  badge?: string;
  detailsUrl?: string;
  order: number;
  featured?: boolean;
}

export type ArticleBlockType = 'h1' | 'h2' | 'paragraph' | 'quote' | 'image' | 'gallery' | 'table' | 'cta' | 'divider';

export interface ArticleBlock {
  id: string;
  type: ArticleBlockType;
  content: string;
  meta?: Record<string, any>;
}

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  readTime: string;
  publishDate: string;
  status: 'published' | 'draft' | 'scheduled';
  seoTitle: string;
  seoDescription: string;
  imageFit?: 'cover' | 'contain';
  blocks: ArticleBlock[];
}

export interface MediaAdjustments {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  temperature: number; // -100 (cool) to 100 (warm)
  sharpness: number; // 0 to 100
  opacity: number; // 0 to 100
  cropRatio: 'free' | '1:1' | '4:5' | '16:9' | '3:2';
  rotate: number; // 0 to 360
  flipH: boolean;
  flipV: boolean;
  focalPoint: { x: number; y: number }; // 0-100%
}

export interface MediaVersion {
  id: string;
  timestamp: string;
  label: string;
  adjustments: MediaAdjustments;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  originalUrl: string;
  type: string;
  dimensions: string;
  fileSize: string;
  addedDate: string;
  altText: string;
  keywords: string[];
  license: string;
  adjustments: MediaAdjustments;
  versions: MediaVersion[];
}

export type BuilderElementType = 
  | 'hero' 
  | 'stats' 
  | 'expertise' 
  | 'projects' 
  | 'articles' 
  | 'quote' 
  | 'contact' 
  | 'heading' 
  | 'paragraph' 
  | 'button' 
  | 'image' 
  | 'divider';

export interface GradientConfig {
  enabled: boolean;
  type?: 'linear' | 'radial';
  angle?: number;
  startColor?: string;
  middleColor?: string;
  endColor?: string;
  useMiddleColor?: boolean;
}

export type ElementScope = 'container' | 'title' | 'subtitle' | 'description' | 'cards' | 'button';

export interface ScopeStyle {
  textColor?: string;
  backgroundColor?: string;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  borderRadius?: string;
  borderColor?: string;
  gradient?: GradientConfig;
  customWidthPx?: number;
  customHeightPx?: number;
  glow?: boolean;
}

export interface BuilderElement {
  id: string;
  name: string;
  type: BuilderElementType;
  visible: boolean;
  locked: boolean;
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    imageUrl?: string;
    avatarUrl?: string;
    quoteText?: string;
    customFields?: Record<string, any>;
  };
  layout: {
    paddingY: string;
    maxWidth: string;
    align: 'start' | 'center' | 'end';
    customWidth?: string;
    customHeight?: string;
    customWidthPx?: number;
    customHeightPx?: number;
    cardWidthPx?: number;
    cardHeightPx?: number;
  };
  style: {
    material: 'glass' | 'metal' | 'matte' | 'translucent';
    glow: boolean;
    borderColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
    cardBackground?: string;
    cardTextColor?: string;
    cardBorderColor?: string;
    cardBorderRadius?: string;
    accentColor?: string;
    gradient?: GradientConfig;
    activeScope?: ElementScope;
    scopedStyles?: Partial<Record<ElementScope, ScopeStyle>>;
  };
  motion: {
    animationType: 'fade-up' | 'scale' | 'slide' | 'none';
    duration: number;
    delay: number;
  };
}

export interface BuilderPage {
  id: string;
  slug: string;
  title: string;
  isHome: boolean;
  published: boolean;
  elements: BuilderElement[];
}

export type HeroThemePreset = 
  | 'ai_forest'
  | 'neural_core'
  | 'ai_matrix' 
  | 'tech_entrepreneur' 
  | 'code_software' 
  | 'golden_flow' 
  | 'cyber_mesh'
  | 'custom_image';

export type HeroMotionStyle = 
  | 'flow_loop' 
  | 'pulse_wave' 
  | 'drift_particles' 
  | 'cyber_scan';

export interface HeroConfig {
  preset: HeroThemePreset;
  customImageUrl?: string;
  lightingIntensity: number; // 0 to 100%
  overlayOpacity: number; // 0 to 100%
  blurAmount: number; // 0 to 20px
  animationSpeed: number; // 0.2 to 3.0x
  motionDuration: number; // 5s to 40s
  motionStyle: HeroMotionStyle;
  repeatCount: 'infinite' | 'pulse' | 'gentle_wave';
  particlesEnabled: boolean;
  codeSnippetEffect: boolean;
  ambientGlow: boolean;
}

export interface AdminCredentials {
  username: string;
  password: string;
}


