import { BuilderElement, ElementScope, ScopeStyle } from '../types';

export interface TypographyConfig {
  titleClass: string;
  bodyClass: string;
  headingScale: string;
  weightClass: string;
}

export function getTitleFontSizeClass(fontSize?: string): string {
  if (!fontSize) return 'text-3xl sm:text-4xl lg:text-5xl';
  const clean = fontSize.replace('text-', '').trim();

  switch (clean) {
    case 'sm':
      return 'text-xl sm:text-2xl';
    case 'base':
      return 'text-2xl sm:text-3xl';
    case 'lg':
      return 'text-3xl sm:text-4xl lg:text-5xl';
    case 'xl':
      return 'text-4xl sm:text-5xl lg:text-6xl';
    case '2xl':
      return 'text-5xl sm:text-6xl lg:text-7xl';
    case '3xl':
      return 'text-6xl sm:text-7xl lg:text-8xl';
    case '4xl':
      return 'text-7xl sm:text-8xl lg:text-9xl';
    default:
      return 'text-3xl sm:text-4xl lg:text-5xl';
  }
}

export function getBodyFontSizeClass(fontSize?: string): string {
  if (!fontSize) return 'text-sm sm:text-base';
  const clean = fontSize.replace('text-', '').trim();

  switch (clean) {
    case 'sm':
      return 'text-xs sm:text-sm';
    case 'base':
      return 'text-sm sm:text-base';
    case 'lg':
      return 'text-base sm:text-lg';
    case 'xl':
      return 'text-lg sm:text-xl';
    case '2xl':
      return 'text-xl sm:text-2xl';
    case '3xl':
      return 'text-2xl sm:text-3xl';
    default:
      return 'text-sm sm:text-base';
  }
}

export function getFontWeightClass(fontWeight?: string): string {
  if (!fontWeight) return 'font-bold';
  const clean = fontWeight.replace('font-', '').trim();

  switch (clean) {
    case 'normal':
    case '400':
      return 'font-normal';
    case 'medium':
    case '500':
      return 'font-medium';
    case 'semibold':
    case '600':
      return 'font-semibold';
    case 'bold':
    case '700':
      return 'font-bold';
    case 'black':
    case '900':
      return 'font-black';
    default:
      return 'font-bold';
  }
}

export function getMotionConfig(
  animationType: string = 'fade-up',
  duration: number = 0.6,
  delay: number = 0
) {
  const cleanType = animationType || 'fade-up';

  switch (cleanType) {
    case 'none':
      return {
        initial: { opacity: 1, y: 0, scale: 1, x: 0 },
        animate: { opacity: 1, y: 0, scale: 1, x: 0 },
        transition: { duration: 0.01, delay: 0 }
      };
    case 'scale':
      return {
        initial: { opacity: 0, scale: 0.75 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration, delay, ease: [0.22, 1, 0.36, 1] }
      };
    case 'slide':
      return {
        initial: { opacity: 0, x: -70 },
        animate: { opacity: 1, x: 0 },
        transition: { duration, delay, ease: [0.22, 1, 0.36, 1] }
      };
    case 'fade-up':
    default:
      return {
        initial: { opacity: 0, y: 45 },
        animate: { opacity: 1, y: 0 },
        transition: { duration, delay, ease: [0.22, 1, 0.36, 1] }
      };
  }
}

export function getGradientBackground(gradient?: {
  enabled: boolean;
  type?: 'linear' | 'radial';
  angle?: number;
  startColor?: string;
  middleColor?: string;
  endColor?: string;
  useMiddleColor?: boolean;
}): string | undefined {
  if (!gradient || !gradient.enabled) return undefined;
  
  const type = gradient.type || 'linear';
  const angle = gradient.angle !== undefined ? gradient.angle : 135;
  const start = gradient.startColor || '#1E1C18';
  const end = gradient.endColor || '#121212';
  const middle = gradient.middleColor || '#2A2314';

  if (type === 'radial') {
    if (gradient.useMiddleColor) {
      return `radial-gradient(circle at center, ${start} 0%, ${middle} 50%, ${end} 100%)`;
    }
    return `radial-gradient(circle at center, ${start} 0%, ${end} 100%)`;
  }

  if (gradient.useMiddleColor) {
    return `linear-gradient(${angle}deg, ${start} 0%, ${middle} 50%, ${end} 100%)`;
  }

  return `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)`;
}

export function getScopedValue<K extends keyof ScopeStyle>(
  style: BuilderElement['style'] | undefined,
  scope: ElementScope,
  property: K,
  fallback?: ScopeStyle[K]
): ScopeStyle[K] | undefined {
  if (!style) return fallback;

  const scopedObj = style.scopedStyles?.[scope];
  if (scopedObj && scopedObj[property] !== undefined && scopedObj[property] !== null && scopedObj[property] !== '') {
    return scopedObj[property];
  }

  if (scope === 'title') {
    if (property === 'textColor') return (style.textColor as any) ?? fallback;
    if (property === 'fontSize') return (style.fontSize as any) ?? fallback;
    if (property === 'fontWeight') return (style.fontWeight as any) ?? fallback;
    if (property === 'gradient') return (style.gradient as any) ?? fallback;
  } else if (scope === 'subtitle') {
    if (property === 'textColor') return (style.accentColor as any) ?? (style.textColor as any) ?? fallback;
    if (property === 'fontSize') return (fallback as any) ?? 'sm';
    if (property === 'fontWeight') return (fallback as any) ?? 'medium';
  } else if (scope === 'description') {
    if (property === 'textColor') return (style.textColor as any) ?? fallback;
    if (property === 'fontSize') return (style.fontSize as any) ?? fallback;
    if (property === 'fontWeight') return (fallback as any) ?? 'normal';
  } else if (scope === 'cards') {
    if (property === 'backgroundColor') return (style.cardBackground as any) ?? fallback;
    if (property === 'textColor') return (style.cardTextColor as any) ?? fallback;
    if (property === 'borderColor') return (style.cardBorderColor as any) ?? fallback;
    if (property === 'borderRadius') return (style.cardBorderRadius as any) ?? fallback;
    if (property === 'fontSize') return (fallback as any) ?? 'base';
    if (property === 'fontWeight') return (fallback as any) ?? 'normal';
  } else if (scope === 'button') {
    if (property === 'backgroundColor') return (style.accentColor as any) ?? fallback;
    if (property === 'borderRadius') return (fallback as any) ?? '12px';
  } else if (scope === 'container') {
    if (property === 'backgroundColor') return (style.backgroundColor as any) ?? fallback;
    if (property === 'textColor') return (style.textColor as any) ?? fallback;
    if (property === 'gradient') return (style.gradient as any) ?? fallback;
    if (property === 'borderRadius') return (style.borderRadius as any) ?? fallback;
    if (property === 'borderColor') return (style.borderColor as any) ?? fallback;
  }

  return fallback;
}


