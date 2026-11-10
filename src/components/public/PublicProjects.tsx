import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectItem, BuilderElement } from '../../types';
import { ProjectDetailModal } from './ProjectDetailModal';
import { MotionLeft } from '../common/MotionLeft';
import { DirectImageEditor } from '../common/DirectImageEditor';
import { ArrowLeft, ExternalLink, Sparkles, Eye, Layers, ChevronDown, ChevronUp, RefreshCw, Play, Video } from 'lucide-react';
import { getVideoEmbedInfo } from '../../utils/mediaUtils';
import { 
  getTitleFontSizeClass, 
  getBodyFontSizeClass, 
  getFontWeightClass, 
  getGradientBackground,
  getScopedValue 
} from '../../utils/typography';

interface PublicProjectsProps {
  title?: string;
  subtitle?: string;
  description?: string;
  layout?: BuilderElement['layout'];
  style?: BuilderElement['style'];
}

export const PublicProjects: React.FC<PublicProjectsProps> = ({ 
  title, 
  subtitle, 
  description,
  layout,
  style 
}) => {
  const { projects, theme, updateProject, isLiveEditMode } = useApp();
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  const INITIAL_COUNT = 6;
  const LOAD_INCREMENT = 3;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const categories: string[] = ['الكل', ...Array.from(new Set<string>(projects.map(p => p.category)))];

  const filteredProjects = selectedCategory === 'الكل'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleCount(INITIAL_COUNT);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + LOAD_INCREMENT);
      setIsLoadingMore(false);
    }, 300);
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
      id="projects"
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
        
        {/* Section Title & Subtitle */}
        <MotionLeft distance={-50} className="mb-12">
          <div className={`flex flex-col ${layout?.align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end justify-between'} gap-6`}>
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
                <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{subtitle || 'معرض الأعمال'}</span>
              </div>
              <h2 
                style={{ color: titleColor || undefined }}
                className={`${titleFontSize} ${titleFontWeight} tracking-tight font-serif-display`}
              >
                {title || 'أعمال مختارة'}
              </h2>
              <p 
                style={{ color: descColor ? `${descColor}cc` : undefined }}
                className={`mt-2 ${descFontSize} ${descFontWeight} max-w-xl ${
                  !descColor ? (theme === 'dark' ? 'text-[#C7C1B7]' : 'text-[#5A554E]') : ''
                }`}
              >
                {description || 'مجموعة منتقاة من المشاريع المؤسسية والتطبيقات الرقمية المبتكرة التي صممت وطوّرت وفق أعلى المعايير الهندسية.'}
              </p>
            </div>

            {/* Categories Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? theme === 'dark'
                        ? 'bg-[#C5A059] text-[#121212] font-bold border border-[#C5A059] shadow-xs'
                        : 'bg-[#121212] text-[#F9F7F2] border border-[#121212] shadow-xs'
                      : theme === 'dark'
                        ? 'bg-[#1A1917] text-[#C7C1B7] border border-[#282622] hover:text-[#DFCA9B] hover:border-[#C5A059]/30'
                        : 'bg-[#FFFFFF] text-[#5A554E] border border-[#E5E0D8] hover:text-[#121212] hover:border-[#C5A059]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </MotionLeft>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProjects.map((project, idx) => {
            const projectUrl = (project.externalUrl || project.link || project.videoUrl || '').trim();
            const videoInfo = getVideoEmbedInfo(projectUrl);

            return (
              <MotionLeft
                key={project.id}
                distance={-40}
                delay={(idx % 6) * 0.08}
                className="h-full"
              >
                <div
                  id={`project-card-${project.id}`}
                  style={cardCustomStyle}
                  className={`h-full group relative rounded-3xl border overflow-hidden transition-all duration-300 ease-out ${
                    isLiveEditMode ? '' : 'hover:-translate-y-2 hover:scale-[1.018]'
                  } flex flex-col ${
                    !style?.cardBackground ? (
                      theme === 'dark'
                        ? 'bg-[#1A1917]/90 hover:bg-[#1E1C18] border-[#282622] hover:border-[#C5A059]/50 shadow-md hover:shadow-2xl hover:shadow-[#C5A059]/5'
                        : 'bg-[#FFFFFF]/90 hover:bg-[#FAF8F5] border-[#E5E0D8] hover:border-[#C5A059]/50 shadow-sm hover:shadow-xl hover:shadow-stone-900/5'
                    ) : ''
                  }`}
                >
                  {/* Subtle top edge glass light highlight */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                  {/* Image Preview with Direct Image Editor */}
                  <DirectImageEditor
                    currentImageUrl={project.imageUrl}
                    onImageChange={(newUrl) => updateProject(project.id, { imageUrl: newUrl })}
                    fitMode={project.imageFit || 'contain'}
                    onFitModeChange={(newFit) => updateProject(project.id, { imageFit: newFit })}
                    label="استبدال صورة المشروع"
                    badgePosition="bottom-right"
                  >
                    <div 
                      className="relative aspect-video overflow-hidden bg-[#0F0E0C] cursor-pointer flex items-center justify-center"
                      onClick={() => setSelectedProject(project)}
                    >
                      {/* Ambient Glowing Background (Eliminates empty gaps elegantly matching image colors) */}
                      <img
                        src={project.imageUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 scale-110 pointer-events-none"
                      />

                      {/* Foreground Image - Complete and Uncropped */}
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className={`relative z-10 max-h-full max-w-full w-auto h-auto ${
                          project.imageFit === 'cover' ? 'w-full h-full object-cover' : 'object-contain p-1'
                        } transition-transform duration-500 ease-out ${
                          isLiveEditMode ? '' : 'group-hover:scale-105'
                        }`}
                        loading="lazy"
                      />
                    
                    {/* Glassmorphism Frosted Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/40 to-[#121212]/15 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out flex items-center justify-center p-4">
                      <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl backdrop-blur-md bg-[#121212]/80 border border-[#C5A059]/50 text-[#F9F7F2] font-bold text-xs shadow-xl transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 ease-out">
                        <span className="p-1 rounded-lg bg-[#C5A059] text-[#121212]">
                          {videoInfo.isVideo ? <Play className="w-3.5 h-3.5 fill-current" /> : <Eye className="w-3.5 h-3.5" />}
                        </span>
                        <span className="text-[#DFCA9B]">
                          {videoInfo.isVideo ? 'مشاهدة الفيديو وتفاصيل المشروع' : 'استعراض تفاصيل المشروع'}
                        </span>
                      </div>
                    </div>

                    {/* Floating Direct Link Action Button on Top-Left */}
                    {projectUrl && (
                      <a
                        href={projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md bg-[#121212]/85 hover:bg-[#C5A059] text-[#DFCA9B] hover:text-[#121212] border border-[#C5A059]/40 shadow-md transition-all duration-300 hover:scale-110 z-20 flex items-center gap-1 cursor-pointer"
                        title={videoInfo.isVideo ? 'تشغيل الفيديو مباشرة في نافذة جديدة' : 'فتح الرابط الخارجي مباشرة'}
                      >
                        {videoInfo.isVideo ? (
                          <Play className="w-3.5 h-3.5 fill-current text-rose-400 hover:text-[#121212]" />
                        ) : (
                          <ExternalLink className="w-3.5 h-3.5" />
                        )}
                      </a>
                    )}

                    {/* Floating Glassmorphic Category Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide backdrop-blur-md bg-[#121212]/75 text-[#E8D4A8] border border-[#C5A059]/40 shadow-sm transition-opacity duration-300 pointer-events-none">
                      {project.category}
                    </div>
                  </div>
                </DirectImageEditor>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between relative">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#8E877D] mb-2">
                        <span>{project.year}</span>
                        <span className="font-mono">{project.role}</span>
                      </div>

                      <h3 
                        onClick={() => setSelectedProject(project)}
                        style={{ color: style?.cardTextColor || undefined }}
                        className="text-lg font-bold mb-2 cursor-pointer transition-colors group-hover:text-[#C5A059] line-clamp-1 font-serif-display"
                      >
                        {project.title}
                      </h3>

                      <p 
                        style={{ color: style?.cardTextColor ? `${style.cardTextColor}bb` : undefined }}
                        className={`text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2 ${
                          !style?.cardTextColor ? (theme === 'dark' ? 'text-[#C7C1B7]' : 'text-[#5A554E]') : ''
                        }`}
                      >
                        {project.description}
                      </p>
                    </div>

                    {/* Tech chips & Action Links */}
                    <div className="pt-4 border-t border-[#E5E0D8] dark:border-[#282622] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {project.tools.slice(0, 2).map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F2EFE9] dark:bg-[#24221E] text-[#5A554E] dark:text-[#C7C1B7] border border-[#E5E0D8] dark:border-[#2E2B26]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Interactive Direct Link / Video Button if URL is configured */}
                        {projectUrl && (
                          <a
                            href={projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#C5A059]/15 hover:bg-[#C5A059] text-[#C5A059] hover:text-[#121212] font-bold text-[11px] transition-all border border-[#C5A059]/30 cursor-pointer"
                            title={videoInfo.isVideo ? 'مشاهدة الفيديو المباشر' : 'زيارة الرابط المباشر'}
                          >
                            {videoInfo.isVideo ? (
                              <>
                                <Play className="w-3 h-3 fill-current" />
                                <span>فيديو</span>
                              </>
                            ) : (
                              <>
                                <span>الرابط</span>
                                <ExternalLink className="w-3 h-3" />
                              </>
                            )}
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className="flex items-center gap-1.5 text-xs font-bold text-[#8F6E30] dark:text-[#DFCA9B] group-hover:text-[#C5A059] transition-all group-hover:translate-x-[-2px] cursor-pointer"
                        >
                          <span>التفاصيل</span>
                          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </MotionLeft>
            );
          })}
        </div>

        {/* Load More & Progressive Navigation Controls */}
        {filteredProjects.length > INITIAL_COUNT && (
          <MotionLeft distance={-30} delay={0.2} className="mt-14 flex flex-col items-center justify-center gap-4">
            {/* Progress Bar & Counter */}
            <div className="flex items-center gap-3 text-xs text-[#8E877D] dark:text-[#9E988D]">
              <span className="font-mono text-[11px]">
                عرض <strong className="text-[#DFCA9B] dark:text-[#E8D4A8] font-bold">{Math.min(visibleCount, filteredProjects.length)}</strong> من <strong className="text-[#DFCA9B] dark:text-[#E8D4A8] font-bold">{filteredProjects.length}</strong> مشروع
              </span>
              <div className="w-24 sm:w-36 h-1.5 rounded-full bg-[#E5E0D8] dark:bg-[#282622] overflow-hidden">
                <div 
                  className="h-full bg-[#C5A059] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(Math.min(visibleCount, filteredProjects.length) / filteredProjects.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Load More / Finished State Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {hasMore ? (
                <button
                  id="load-more-projects-btn"
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className={`group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
                    theme === 'dark'
                      ? 'bg-[#1A1917] hover:bg-[#22201D] text-[#E8D4A8] border border-[#C5A059]/40 hover:border-[#C5A059] shadow-[#C5A059]/5'
                      : 'bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#121212] border border-[#C5A059]/50 hover:border-[#C5A059] shadow-stone-900/5'
                  }`}
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="w-4 h-4 text-[#C5A059] animate-spin" />
                      <span>جاري جلب المشاريع...</span>
                    </>
                  ) : (
                    <>
                      <span className="p-1 rounded-lg bg-[#C5A059]/20 text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#121212] transition-colors">
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                      </span>
                      <span>تحميل المزيد من المشاريع ({filteredProjects.length - visibleCount}+)</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#DFCA9B]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>تم استعراض كافة المشاريع بنجاح ({filteredProjects.length})</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleShowLess}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#8E877D] hover:text-[#DFCA9B] border border-transparent hover:border-[#282622] transition-all"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>عرض أقل</span>
                  </button>
                </div>
              )}
            </div>
          </MotionLeft>
        )}

      </div>

      {/* Case Study Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

