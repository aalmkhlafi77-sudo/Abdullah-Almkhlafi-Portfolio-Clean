import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArticleItem, BuilderElement } from '../../types';
import { ArticleReaderModal } from './ArticleReaderModal';
import { MotionLeft } from '../common/MotionLeft';
import { DirectImageEditor } from '../common/DirectImageEditor';
import { ArrowLeft, BookOpen, Calendar, Clock } from 'lucide-react';
import { 
  getTitleFontSizeClass, 
  getBodyFontSizeClass, 
  getFontWeightClass, 
  getGradientBackground,
  getScopedValue 
} from '../../utils/typography';

interface PublicArticlesProps {
  title?: string;
  subtitle?: string;
  description?: string;
  layout?: BuilderElement['layout'];
  style?: BuilderElement['style'];
}

export const PublicArticles: React.FC<PublicArticlesProps> = ({ 
  title, 
  subtitle, 
  description, 
  layout, 
  style 
}) => {
  const { articles, theme, updateArticle, isLiveEditMode } = useApp();
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  const publishedArticles = articles.filter(a => a.status === 'published');

  const maxWidthClass = 
    layout?.maxWidth === '3xl' ? 'max-w-3xl' :
    layout?.maxWidth === '5xl' ? 'max-w-5xl' :
    layout?.maxWidth === 'full' ? 'max-w-full' : 'max-w-7xl';

  const flexAlignClass = 
    layout?.align === 'center' ? 'items-center text-center' :
    layout?.align === 'end' ? 'items-end text-left' : 'items-start text-right';

  const paddingClass = layout?.paddingY || 'py-24';

  // Scoped Container Style
  const containerBg = getScopedValue(style, 'container', 'backgroundColor', style?.backgroundColor);
  const containerColor = getScopedValue(style, 'container', 'textColor', style?.textColor);
  const containerGradient = getScopedValue(style, 'container', 'gradient', style?.gradient);
  const gradientBg = getGradientBackground(containerGradient);

  // Scoped Title Style
  const titleColor = getScopedValue(style, 'title', 'textColor', style?.textColor);
  const titleSize = getScopedValue(style, 'title', 'fontSize', style?.fontSize);
  const titleWeight = getScopedValue(style, 'title', 'fontWeight', style?.fontWeight);
  const titleFontSize = getTitleFontSizeClass(titleSize);
  const titleFontWeight = getFontWeightClass(titleWeight);

  // Scoped Subtitle Style
  const subtitleColor = getScopedValue(style, 'subtitle', 'textColor', style?.accentColor || (theme === 'dark' ? '#E8D4A8' : '#8F6E30'));
  const subtitleBg = getScopedValue(style, 'subtitle', 'backgroundColor');
  const subtitleBorder = getScopedValue(style, 'subtitle', 'borderColor');
  const subtitleSize = getScopedValue(style, 'subtitle', 'fontSize', 'sm');
  const subtitleWeight = getScopedValue(style, 'subtitle', 'fontWeight', 'semibold');

  // Scoped Description Style
  const descColor = getScopedValue(style, 'description', 'textColor', style?.textColor);
  const descSize = getScopedValue(style, 'description', 'fontSize', style?.fontSize);
  const descWeight = getScopedValue(style, 'description', 'fontWeight', 'normal');
  const descFontSize = getBodyFontSizeClass(descSize);
  const descFontWeight = getFontWeightClass(descWeight);

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
  };

  return (
    <section 
      id="articles"
      style={{
        background: gradientBg || containerBg || undefined,
        backgroundColor: !gradientBg ? (containerBg || undefined) : undefined,
        color: containerColor || undefined,
      }}
      className={`${paddingClass} transition-colors duration-300 relative ${
        !containerBg && !gradientBg ? (
          theme === 'dark' 
            ? 'bg-[#121212] text-[#F9F7F2]' 
            : 'bg-[#F9F7F2] text-[#121212]'
        ) : ''
      }`}
    >
      <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8`}>
        
        {/* Section Header */}
        <MotionLeft distance={-50} className="mb-12">
          <div className={`flex flex-col ${layout?.align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end justify-between'} gap-4`}>
            <div className={flexAlignClass}>
              <div 
                style={{
                  backgroundColor: subtitleBg || undefined,
                  borderColor: subtitleBorder || undefined,
                  color: subtitleColor || undefined,
                }}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getBodyFontSizeClass(subtitleSize)} ${getFontWeightClass(subtitleWeight)} mb-3 border ${
                !subtitleBg ? (
                  theme === 'dark'
                    ? 'bg-[#1A1917] border-[#C5A059]/30 text-[#E8D4A8]'
                    : 'bg-[#F2EFE9] border-[#E5E0D8] text-[#8F6E30]'
                ) : ''
              }`}>
                <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{subtitle || 'المعرفة والأفكار'}</span>
              </div>
              <h2 
                style={{ color: titleColor || undefined }}
                className={`${titleFontSize} ${titleFontWeight} tracking-tight font-serif-display`}
              >
                {title || 'أحدث المقالات والرؤى'}
              </h2>
              <p 
                style={{ color: descColor ? `${descColor}cc` : undefined }}
                className={`mt-2 ${descFontSize} ${descFontWeight} max-w-xl ${
                  !descColor ? (theme === 'dark' ? 'text-[#C7C1B7]' : 'text-[#5A554E]') : ''
                }`}
              >
                {description || 'أشارك أفكاري ورؤاي حول تصميم الواجهات، هندسة البرمجيات، والذكاء الاصطناعي التطبيقي.'}
              </p>
            </div>

            <button
              onClick={() => setSelectedArticle(publishedArticles[0] || null)}
              className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                theme === 'dark' ? 'text-[#DFCA9B] hover:text-[#C5A059]' : 'text-[#8F6E30] hover:text-[#C5A059]'
              }`}
            >
              <span>استعراض جميع المقالات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </MotionLeft>

        {/* Articles List / Grid (Matching Reference 1 & Reference 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedArticles.map((article, idx) => (
            <MotionLeft
              key={article.id}
              distance={-40}
              delay={(idx % 6) * 0.08}
              className="h-full"
            >
              <div
                id={`article-card-${article.id}`}
                onClick={() => setSelectedArticle(article)}
                style={cardCustomStyle}
                className={`h-full group cursor-pointer rounded-3xl border overflow-hidden transition-all duration-300 ${
                  isLiveEditMode ? '' : 'hover:-translate-y-1.5'
                } flex flex-col justify-between ${
                  !style?.cardBackground ? (
                    theme === 'dark'
                      ? 'bg-[#1A1917] hover:bg-[#201E1A] border-[#282622] hover:border-[#C5A059]/40 shadow-xs'
                      : 'bg-[#FFFFFF] hover:bg-[#FAF8F5] border-[#E5E0D8] hover:border-[#C5A059]/40 artistic-shadow-sm'
                  ) : ''
                }`}
              >
                <div>
                  {/* Thumbnail Preview with Direct Image Editor */}
                  <DirectImageEditor
                    currentImageUrl={article.coverImage}
                    onImageChange={(newUrl) => updateArticle(article.id, { coverImage: newUrl })}
                    fitMode={article.imageFit || 'contain'}
                    onFitModeChange={(newFit) => updateArticle(article.id, { imageFit: newFit })}
                    label="استبدال غلاف المقال"
                    badgePosition="bottom-right"
                  >
                    <div className="relative aspect-video overflow-hidden bg-[#0F0E0C] flex items-center justify-center">
                      {/* Ambient Glowing Background */}
                      <img
                        src={article.coverImage}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 scale-110 pointer-events-none"
                      />
                      {/* Complete uncropped foreground image */}
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className={`relative z-10 max-h-full max-w-full w-auto h-auto ${
                          article.imageFit === 'cover' ? 'w-full h-full object-cover' : 'object-contain p-1'
                        } transition-transform duration-500 ${
                          isLiveEditMode ? '' : 'group-hover:scale-105'
                        }`}
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md bg-[#121212]/80 text-[#E8D4A8] border border-[#C5A059]/30 pointer-events-none z-20">
                        {article.category}
                      </div>
                    </div>
                  </DirectImageEditor>

                  {/* Article Info */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-[#8E877D] mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.publishDate}
                      </span>
                      <span className="opacity-40">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                    </div>

                    <h3 
                      style={{ color: style?.cardTextColor || undefined }}
                      className="text-base sm:text-lg font-bold mb-2 transition-colors group-hover:text-[#C5A059] line-clamp-2 font-serif-display"
                    >
                      {article.title}
                    </h3>

                    <p 
                      style={{ color: style?.cardTextColor ? `${style.cardTextColor}bb` : undefined }}
                      className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${
                        !style?.cardTextColor ? (theme === 'dark' ? 'text-[#C7C1B7]' : 'text-[#5A554E]') : ''
                      }`}
                    >
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="px-6 pb-6 pt-2 border-t border-[#E5E0D8] dark:border-[#282622] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8F6E30] dark:text-[#DFCA9B] group-hover:text-[#C5A059] flex items-center gap-1">
                    <span>قراءة المقال كاملاً</span>
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                  </span>
                  <span className="text-[11px] text-[#8E877D]">
                    #{article.tags[0] || 'تقنية'}
                  </span>
                </div>

              </div>
            </MotionLeft>
          ))}
        </div>

      </div>

      {/* Full Article Reader Modal */}
      <ArticleReaderModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </section>
  );
};

