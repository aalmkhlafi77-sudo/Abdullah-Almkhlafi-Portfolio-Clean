import React from 'react';
import { useApp } from '../../context/AppContext';
import { Quote } from 'lucide-react';
import { BuilderElement } from '../../types';
import { MotionLeft } from '../common/MotionLeft';
import { 
  getTitleFontSizeClass, 
  getBodyFontSizeClass, 
  getFontWeightClass, 
  getGradientBackground,
  getScopedValue 
} from '../../utils/typography';

interface PublicQuoteProps {
  title?: string;
  description?: string;
  layout?: BuilderElement['layout'];
  style?: BuilderElement['style'];
}

export const PublicQuote: React.FC<PublicQuoteProps> = ({ 
  title, 
  description,
  layout,
  style
}) => {
  const { profile, theme } = useApp();

  const maxWidthClass = 
    layout?.maxWidth === '3xl' ? 'max-w-3xl' :
    layout?.maxWidth === '5xl' ? 'max-w-5xl' :
    layout?.maxWidth === 'full' ? 'max-w-full' : 'max-w-4xl';

  const paddingClass = layout?.paddingY || 'py-16';

  // Scoped Container Style
  const containerBg = getScopedValue(style, 'container', 'backgroundColor', style?.backgroundColor);
  const containerColor = getScopedValue(style, 'container', 'textColor', style?.textColor);
  const containerGradient = getScopedValue(style, 'container', 'gradient', style?.gradient);
  const gradientBg = getGradientBackground(containerGradient);

  // Scoped Title / Quote Text Style
  const titleColor = getScopedValue(style, 'title', 'textColor', style?.textColor);
  const titleSize = getScopedValue(style, 'title', 'fontSize', style?.fontSize);
  const titleWeight = getScopedValue(style, 'title', 'fontWeight', style?.fontWeight);
  const titleFontSize = getTitleFontSizeClass(titleSize);
  const titleFontWeight = getFontWeightClass(titleWeight);

  // Scoped Subtitle Style (attribution line)
  const subtitleColor = getScopedValue(style, 'subtitle', 'textColor', style?.accentColor || (theme === 'dark' ? '#DFCA9B' : '#8F6E30'));

  // Scoped Cards Style
  const cardBg = getScopedValue(style, 'cards', 'backgroundColor', style?.cardBackground);
  const cardColor = getScopedValue(style, 'cards', 'textColor', style?.cardTextColor);
  const cardBorder = getScopedValue(style, 'cards', 'borderColor', style?.cardBorderColor);
  const cardRadius = getScopedValue(style, 'cards', 'borderRadius', style?.cardBorderRadius);
  const cardGradient = getScopedValue(style, 'cards', 'gradient');
  const cardGradientBg = getGradientBackground(cardGradient);

  const cardCustomStyle: React.CSSProperties = {
    background: cardGradientBg || cardBg || undefined,
    backgroundColor: !cardGradientBg ? (cardBg || undefined) : undefined,
    color: cardColor || undefined,
    borderColor: cardBorder || undefined,
    borderRadius: cardRadius || undefined,
    minHeight: layout?.cardHeightPx ? `${layout.cardHeightPx}px` : undefined,
    width: layout?.cardWidthPx ? `${layout.cardWidthPx}px` : undefined,
    boxShadow: theme === 'dark' ? '0 0 35px -10px rgba(197, 160, 89, 0.15)' : undefined,
  };

  return (
    <section 
      id="quote"
      style={{
        background: gradientBg || containerBg || undefined,
        backgroundColor: !gradientBg ? (containerBg || undefined) : undefined,
        color: containerColor || undefined,
      }}
      className={`${paddingClass} transition-colors duration-300 relative ${
        !containerBg && !gradientBg ? (
          theme === 'dark' 
            ? 'bg-[#151412] text-[#F9F7F2]' 
            : 'bg-[#F4F1EA] text-[#121212]'
        ) : ''
      }`}
    >
      <div className={`${maxWidthClass} mx-auto px-4 sm:px-6`}>
        <MotionLeft distance={-50}>
          <div 
            className={`relative p-8 sm:p-12 rounded-3xl border text-center transition-all ${
              !cardBg && !cardGradientBg ? (
                theme === 'dark'
                  ? 'bg-[#1A1917] border-[#C5A059]/30'
                  : 'bg-[#FFFFFF] border-[#E5E0D8] artistic-shadow-sm'
              ) : ''
            }`}
            style={cardCustomStyle}
          >
            <div className={`w-12 h-12 rounded-2xl mx-auto mb-6 flex items-center justify-center border ${
              theme === 'dark'
                ? 'bg-[#24221E] border-[#C5A059]/40 text-[#DFCA9B]'
                : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#8F6E30]'
            }`}>
              <Quote className="w-6 h-6 rotate-180" />
            </div>

            <blockquote 
              style={{ color: cardColor || titleColor || undefined }}
              className={`${titleFontSize} ${titleFontWeight} leading-relaxed tracking-tight mb-4 font-serif-display`}
            >
              "{description || profile.quote}"
            </blockquote>

            <div className="flex items-center justify-center gap-2">
              <span className="w-6 h-[1px] bg-[#C5A059]/50" />
              <span 
                style={{ color: subtitleColor || undefined }}
                className="text-xs sm:text-sm font-semibold font-serif-display"
              >
                {title || `${profile.name} — فلسفة العمل والإنتاج`}
              </span>
              <span className="w-6 h-[1px] bg-[#C5A059]/50" />
            </div>
          </div>
        </MotionLeft>
      </div>
    </section>
  );
};

