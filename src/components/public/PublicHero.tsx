import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Mail, 
  Github, 
  Linkedin,
  Twitter,
  Youtube,
  Facebook,
  Music2,
  Ghost,
  Camera, 
  Edit3, 
  Sparkles, 
  Sliders 
} from 'lucide-react';
import { IconRenderer } from '../ui/IconRenderer';
import { AnimatedHeroBackground } from './AnimatedHeroBackground';
import { BuilderElement } from '../../types';
import { MotionLeft } from '../common/MotionLeft';
import { TypewriterText } from '../ui/TypewriterText';
import { 
  getTitleFontSizeClass, 
  getBodyFontSizeClass, 
  getFontWeightClass, 
  getGradientBackground,
  getScopedValue 
} from '../../utils/typography';

interface PublicHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  layout?: BuilderElement['layout'];
  style?: BuilderElement['style'];
}

export const PublicHero: React.FC<PublicHeroProps> = ({ 
  title, 
  subtitle, 
  description, 
  buttonText,
  layout,
  style
}) => {
  const { 
    profile, 
    metrics, 
    theme, 
    setShowSettingsModal, 
    setShowProfileModal, 
    isAuthenticated, 
    setShowLoginModal, 
    avatarStatus,
    pages,
    activePageId
  } = useApp();

  // Active hero element from page builder if props are omitted
  const activeHeroElement = React.useMemo(() => {
    const currentPage = (pages || []).find(p => p.id === activePageId) || pages?.[0];
    return currentPage?.elements?.find(e => e.type === 'hero');
  }, [pages, activePageId]);

  const heroTitle = title !== undefined ? title : (activeHeroElement?.content?.title || profile.name);
  const heroSubtitle = subtitle !== undefined ? subtitle : (activeHeroElement?.content?.subtitle || profile.role || '');
  const heroDescription = description !== undefined ? description : (activeHeroElement?.content?.description || profile.bio || profile.tagline);
  const heroButtonText = buttonText !== undefined ? buttonText : (activeHeroElement?.content?.buttonText || 'استعرض أعمالي');

  const outerSizeClass = 
    profile.avatarSize === 'sm' ? 'w-56 h-56 sm:w-64 sm:h-64' :
    profile.avatarSize === 'lg' ? 'w-80 sm:w-96 h-80 sm:h-96' :
    profile.avatarSize === 'xl' ? 'w-96 sm:w-[28rem] h-96 sm:h-[28rem]' :
    'w-72 sm:w-80 h-72 sm:h-80';

  const innerSizeClass = 
    profile.avatarSize === 'sm' ? 'w-48 h-48 sm:w-56 sm:h-56' :
    profile.avatarSize === 'lg' ? 'w-72 sm:w-88 h-72 sm:h-88' :
    profile.avatarSize === 'xl' ? 'w-80 sm:w-96 h-80 sm:h-96' :
    'w-64 h-64 sm:w-72 sm:h-72';

  const avatarShapeClass = 
    profile.avatarShape === 'square' ? 'rounded-2xl' :
    profile.avatarShape === 'rounded' ? 'rounded-3xl' : 'rounded-full';

  const avatarFitClass = profile.avatarFit === 'contain' ? 'object-contain' : 'object-cover';
  const avatarPosClass = 
    profile.avatarPosition === 'top' ? 'object-top' :
    profile.avatarPosition === 'bottom' ? 'object-bottom' : 'object-center';

  const maxWidthClass = 
    layout?.maxWidth === '3xl' ? 'max-w-3xl' :
    layout?.maxWidth === '5xl' ? 'max-w-5xl' :
    layout?.maxWidth === 'full' ? 'max-w-full' : 'max-w-7xl';

  const flexAlignClass = 
    layout?.align === 'center' ? 'items-center text-center' :
    layout?.align === 'end' ? 'items-end text-left' : 'items-start text-right';

  const paddingClass = layout?.paddingY || 'py-16 sm:py-24';

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

  // Scoped Subtitle / Badge Style
  const subtitleColor = getScopedValue(style, 'subtitle', 'textColor', style?.accentColor || (theme === 'dark' ? '#E8D4A8' : '#8F6E30'));
  const subtitleBg = getScopedValue(style, 'subtitle', 'backgroundColor');
  const subtitleBorder = getScopedValue(style, 'subtitle', 'borderColor');
  const subtitleSize = getScopedValue(style, 'subtitle', 'fontSize', 'sm');
  const subtitleWeight = getScopedValue(style, 'subtitle', 'fontWeight', 'medium');

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

  const metricCardCustomStyle: React.CSSProperties = {
    background: cardGradientBg || cardBg || undefined,
    backgroundColor: !cardGradientBg ? (cardBg || undefined) : undefined,
    color: cardColor || undefined,
    borderColor: cardBorder || undefined,
    borderRadius: cardRadius || undefined,
    minHeight: layout?.cardHeightPx ? `${layout.cardHeightPx}px` : undefined,
    width: layout?.cardWidthPx ? `${layout.cardWidthPx}px` : undefined,
  };

  // Scoped Button Style
  const buttonBg = getScopedValue(style, 'button', 'backgroundColor', theme === 'dark' ? '#C5A059' : '#121212');
  const buttonColor = getScopedValue(style, 'button', 'textColor', theme === 'dark' ? '#121212' : '#F9F7F2');
  const buttonRadius = getScopedValue(style, 'button', 'borderRadius', '12px');
  const buttonGradient = getScopedValue(style, 'button', 'gradient');
  const buttonGradientBg = getGradientBackground(buttonGradient);

  return (
    <section 
      id="hero"
      style={{
        background: gradientBg || containerBg || undefined,
        backgroundColor: !gradientBg ? (containerBg || undefined) : undefined,
        color: containerColor || undefined,
      }}
      className={`relative min-h-[92vh] flex items-center justify-center overflow-hidden ${paddingClass} transition-colors duration-300 ${
        !containerBg && !gradientBg ? (
          theme === 'dark' 
            ? 'bg-[#121212] text-[#F9F7F2]' 
            : 'bg-[#F9F7F2] text-[#121212]'
        ) : ''
      }`}
    >
      {/* Smooth Dynamic Tech & AI Animated Background */}
      <AnimatedHeroBackground />

      <div className={`relative z-10 ${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4 sm:mt-12`} id="about">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Right Column (in RTL): Hero Text & CTA */}
          <div className={`lg:col-span-7 flex flex-col ${flexAlignClass} space-y-6 lg:pl-6`}>
            
            {/* Subtitle / Availability Badge */}
            <MotionLeft immediate delay={0.1} distance={-40}>
              <div 
                style={{
                  backgroundColor: subtitleBg || undefined,
                  borderColor: subtitleBorder || undefined,
                  color: subtitleColor || undefined,
                }}
                className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full ${getBodyFontSizeClass(subtitleSize)} ${getFontWeightClass(subtitleWeight)} border backdrop-blur-md transition-all shadow-xs ${
                !subtitleBg ? (
                  theme === 'dark'
                    ? 'bg-[#1A1917] border-[#C5A059]/30 text-[#E8D4A8]'
                    : 'bg-[#F2EFE9] border-[#E5E0D8] text-[#8F6E30]'
                ) : ''
              }`}>
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                <span className="font-semibold">{`مرحباً، أنا ${heroTitle || profile.name}`}</span>
                <span className="opacity-40">|</span>
                <span className={theme === 'dark' ? 'text-[#C7C1B7]' : 'text-[#5A554E]'}>متاح للمشاريع الريادية والابتكارية</span>
              </div>
            </MotionLeft>

            {/* Main Headline */}
            <MotionLeft immediate delay={0.2} distance={-50}>
              <div className="space-y-3">
                <h1 
                  style={{ color: titleColor || undefined }}
                  className={`${titleFontSize} ${titleFontWeight} tracking-tight leading-[1.18] sm:leading-[1.2] font-serif-display`}
                >
                  <span className="block">{heroTitle || profile.name}</span>
                  {heroSubtitle && (
                    <span 
                      id="hero-typewriter-role"
                      className="block text-2xl sm:text-3xl lg:text-4xl font-semibold mt-2.5 min-h-[1.35em]"
                      style={{
                        color: style?.accentColor || (theme === 'dark' ? '#C5A059' : '#8F6E30')
                      }}
                    >
                      <TypewriterText
                        key={heroSubtitle}
                        phrases={heroSubtitle}
                        typingSpeed={45}
                        deletingSpeed={25}
                        pauseDuration={2800}
                        startDelay={250}
                        loop={true}
                        cursorColor={style?.accentColor || (theme === 'dark' ? '#C5A059' : '#8F6E30')}
                        cursorClassName="shadow-[0_0_10px_rgba(197,160,89,0.6)]"
                      />
                    </span>
                  )}
                </h1>
                
                <p 
                  style={{ color: descColor ? `${descColor}cc` : undefined }}
                  className={`${descFontSize} ${descFontWeight} max-w-2xl leading-relaxed pt-2 ${
                    !descColor ? (theme === 'dark' ? 'text-[#C7C1B7]' : 'text-[#5A554E]') : ''
                  }`}
                >
                  {heroDescription}
                </p>
              </div>
            </MotionLeft>

            {/* CTA Action Buttons */}
            <MotionLeft immediate delay={0.3} distance={-40}>
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  id="hero-explore-works-btn"
                  href="#projects"
                  className="flex items-center gap-2.5 px-6 py-3.5 font-bold text-sm sm:text-base transition-all group shadow-xs border"
                  style={{
                    background: buttonGradientBg || buttonBg || undefined,
                    backgroundColor: !buttonGradientBg ? (buttonBg || undefined) : undefined,
                    borderColor: buttonBg || (theme === 'dark' ? '#C5A059' : '#121212'),
                    color: buttonColor || (theme === 'dark' ? '#121212' : '#F9F7F2'),
                    borderRadius: buttonRadius || '12px'
                  }}
                >
                  <span>{heroButtonText || 'استعرض أعمالي'}</span>
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </a>

                <a
                  id="hero-contact-btn"
                  href="#contact"
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base border transition-all ${
                    theme === 'dark'
                      ? 'bg-[#1A1917] hover:bg-[#24221E] border-[#2E2B26] text-[#F9F7F2]'
                      : 'bg-[#FFFFFF] hover:bg-[#F2EFE9] border-[#E5E0D8] text-[#121212]'
                  } shadow-xs`}
                >
                  <Mail className="w-4 h-4 text-[#C5A059]" />
                  <span>تواصل معي</span>
                </a>

                {isAuthenticated && (
                  <button
                    id="hero-customize-animation-btn"
                    type="button"
                    onClick={() => setShowSettingsModal(true)}
                    className={`flex items-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-xs sm:text-sm border transition-all ${
                      theme === 'dark'
                        ? 'bg-[#1A1917]/80 hover:bg-[#24221E] border-[#C5A059]/40 text-[#E8D4A8]'
                        : 'bg-[#FFFFFF]/90 hover:bg-[#F2EFE9] border-[#C5A059]/60 text-[#8F6E30]'
                    } backdrop-blur-md shadow-xs`}
                    title="تخصيص أنيميشن وخلفية الهيرو والإضاءة"
                  >
                    <Sliders className="w-4 h-4 text-[#C5A059]" />
                    <span>تخصيص الأنيميشن والإضاءة</span>
                  </button>
                )}
              </div>
            </MotionLeft>

            {/* Social Channels Row */}
            <MotionLeft immediate delay={0.4} distance={-30}>
              <div className="pt-4 flex items-center gap-3">
                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-[#8E877D]' : 'text-[#8C867D]'}`}>
                  تابعني:
                </span>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'github', url: profile.socials?.github, icon: <Github className="w-4 h-4" />, label: 'GitHub', hoverColor: 'hover:text-black dark:hover:text-white hover:scale-110' },
                    { id: 'facebook', url: profile.socials?.facebook, icon: <Facebook className="w-4 h-4" />, label: 'Facebook', hoverColor: 'hover:text-[#1877F2] hover:scale-110' },
                    { id: 'linkedin', url: profile.socials?.linkedin, icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn', hoverColor: 'hover:text-[#0A66C2] hover:scale-110' },
                    { id: 'x', url: profile.socials?.x, icon: <Twitter className="w-4 h-4" />, label: 'X (Twitter)', hoverColor: 'hover:text-black dark:hover:text-white hover:scale-110' },
                    { id: 'youtube', url: profile.socials?.youtube, icon: <Youtube className="w-4 h-4" />, label: 'YouTube', hoverColor: 'hover:text-[#FF0000] hover:scale-110' },
                    { id: 'tiktok', url: profile.socials?.tiktok, icon: <Music2 className="w-4 h-4" />, label: 'TikTok', hoverColor: 'hover:text-black dark:hover:text-white hover:scale-110' },
                    { id: 'snapchat', url: profile.socials?.snapchat, icon: <Ghost className="w-4 h-4" />, label: 'Snapchat', hoverColor: 'hover:text-[#E8C200] hover:scale-110' },
                    { id: 'email', url: profile.socials?.email || (profile.email ? `mailto:${profile.email}` : undefined), icon: <Mail className="w-4 h-4" />, label: 'Email', hoverColor: 'hover:text-[#EA4335] hover:scale-110' },
                  ].filter(link => link.url).map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`p-2.5 rounded-xl border transition-all duration-200 ${link.hoverColor} ${
                        theme === 'dark' 
                          ? 'bg-[#1A1917] border-[#282622] text-[#C7C1B7] hover:border-[#C5A059]/40' 
                          : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#5A554E] hover:border-[#C5A059]'
                      }`}
                      aria-label={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </MotionLeft>

          </div>

          {/* Left Column (in RTL): Avatar Silhouette & Stats Quad-Grid */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            
            <MotionLeft immediate delay={0.25} distance={-50} className="w-full flex flex-col items-center">
              {/* Visual Silhouette or Photo Portrait with Gold Halo */}
              <div className={`relative ${outerSizeClass} flex items-center justify-center group animate-soft-pulse`}>
                {/* Outer Golden Aura Ring */}
                <div 
                  className={`absolute inset-0 ${avatarShapeClass} border transition-all duration-700 group-hover:scale-105 animate-soft-glow`}
                  style={{
                    borderColor: 'rgba(197, 160, 89, 0.45)',
                    boxShadow: theme === 'dark' 
                      ? '0 0 45px -10px rgba(197, 160, 89, 0.35)' 
                      : '0 0 45px -10px rgba(197, 160, 89, 0.25)'
                  }}
                />

                {/* Concentric subtle decorative ring */}
                <div 
                  className={`absolute inset-4 ${avatarShapeClass} border border-dashed opacity-30 animate-[spin_60s_linear_infinite]`}
                  style={{ borderColor: '#C5A059' }}
                />

                {/* Inner Avatar Graphic or Real Photo */}
                <div 
                  className={`relative ${innerSizeClass} ${avatarShapeClass} overflow-hidden flex items-center justify-center shadow-lg border-2 group/avatar`}
                  style={{
                    background: theme === 'dark'
                      ? 'radial-gradient(circle at 35% 35%, #24221E 0%, #1A1917 70%, #121212 100%)'
                      : 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #F2EFE9 70%, #E5E0D8 100%)',
                    borderColor: 'rgba(197, 160, 89, 0.6)'
                  }}
                >
                  {avatarStatus === 'loading' ? (
                    /* State 1: Neutral Skeleton Loading - Theme-compliant pulse shimmer, NO old stock photo */
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                      <div className={`absolute inset-0 animate-pulse ${
                        theme === 'dark' ? 'bg-[#1C1A17]' : 'bg-[#EAE6DF]'
                      }`} />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#C5A059]/15 to-transparent animate-pulse" />
                      <div className="relative z-10 flex flex-col items-center justify-center gap-2.5 opacity-60">
                        <div className="w-9 h-9 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
                      </div>
                    </div>
                  ) : avatarStatus === 'loaded-with-image' ? (
                    /* State 2: High Quality Confirmed Personal Photo */
                    <div className="relative w-full h-full animate-fade-in flex items-center justify-center overflow-hidden">
                      {/* Subtle ambient backdrop to complement contain fit */}
                      <img 
                        src={profile.avatarUrl} 
                        alt="" 
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-35 scale-110 pointer-events-none"
                      />
                      <img 
                        src={profile.avatarUrl} 
                        alt={profile.name} 
                        onError={(e) => {
                          // Prevent broken image or fallback to stock photo
                          e.currentTarget.style.display = 'none';
                        }}
                        style={{
                          transform: `scale(${(profile.avatarZoom ?? 100) / 100})`,
                          transformOrigin: `${profile.avatarAlign || 'center'} ${profile.avatarPosition || 'center'}`,
                          objectPosition: `${profile.avatarAlign || 'center'} ${profile.avatarPosition || 'center'}`,
                          filter: (() => {
                            const b = profile.avatarBrightness ?? 100;
                            const c = profile.avatarContrast ?? 100;
                            const s = profile.avatarSaturation ?? 100;
                            const rawBlur = profile.avatarBlur ?? 0;
                            const blurPx = rawBlur <= 8 && rawBlur > 0 ? (rawBlur * 0.15) : (rawBlur * 0.015);
                            let str = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
                            if (blurPx > 0) str += ` blur(${blurPx.toFixed(3)}px)`;
                            if (profile.avatarFilter === 'cinematic_gold') str += ` sepia(25%) hue-rotate(-10deg) saturate(120%)`;
                            else if (profile.avatarFilter === 'warm') str += ` sepia(30%) saturate(110%)`;
                            else if (profile.avatarFilter === 'cool') str += ` hue-rotate(180deg) saturate(90%)`;
                            else if (profile.avatarFilter === 'bw') str += ` grayscale(100%) contrast(110%)`;
                            else if (profile.avatarFilter === 'vintage') str += ` sepia(50%) contrast(90%) brightness(105%)`;
                            return str;
                          })()
                        }}
                        className={`relative z-10 ${
                          profile.avatarFit === 'contain' 
                            ? 'max-h-full max-w-full w-auto h-auto object-contain p-1' 
                            : 'w-full h-full object-cover'
                        } transition-transform duration-700 group-hover/avatar:scale-105`}
                      />
                      {/* Subtle golden ambient edge overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none z-20" />
                    </div>
                  ) : (
                    /* State 3: Stylized Modern Silhouette Monogram (No photo uploaded) */
                    <svg viewBox="0 0 200 200" className="w-56 h-56 transition-transform duration-500 group-hover:scale-105 animate-fade-in">
                      <defs>
                        <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={theme === 'dark' ? '#E8D4A8' : '#8F6E30'} />
                          <stop offset="60%" stopColor={theme === 'dark' ? '#C5A059' : '#5A554E'} />
                          <stop offset="100%" stopColor={theme === 'dark' ? '#705322' : '#121212'} />
                        </linearGradient>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#C5A059" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#8F6E30" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>

                      {/* Geometric mesh in head background */}
                      <circle cx="100" cy="100" r="75" fill="none" stroke="url(#lineGrad)" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.4" />
                      <line x1="25" y1="100" x2="175" y2="100" stroke="url(#lineGrad)" strokeWidth="0.5" opacity="0.3" />
                      <line x1="100" y1="25" x2="100" y2="175" stroke="url(#lineGrad)" strokeWidth="0.5" opacity="0.3" />
                      
                      {/* Elegant architectural profile head & shoulders */}
                      <path
                        d="M100 45 C120 45 135 60 135 80 C135 98 122 112 105 115 L105 125 C135 128 158 145 165 175 L35 175 C42 145 65 128 95 125 L95 115 C78 112 65 98 65 80 C65 60 80 45 100 45 Z"
                        fill="url(#avatarGrad)"
                        opacity="0.9"
                      />

                      {/* Sophisticated spectacles & subtle lighting highlights */}
                      <circle cx="88" cy="78" r="8" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
                      <circle cx="112" cy="78" r="8" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
                      <line x1="96" y1="78" x2="104" y2="78" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
                      
                      {/* Neural nodes / constellations */}
                      <circle cx="140" cy="65" r="2.5" fill="#C5A059" />
                      <line x1="140" y1="65" x2="125" y2="60" stroke="#C5A059" strokeWidth="1" opacity="0.6" />
                      <circle cx="60" cy="90" r="2" fill="#DFCA9B" />
                      <line x1="60" y1="90" x2="70" y2="95" stroke="#DFCA9B" strokeWidth="1" opacity="0.6" />
                    </svg>
                  )}

                  {/* Interactive Quick Photo Change Overlay Button (Admin Only) */}
                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(true)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold gap-1.5 cursor-pointer z-20"
                      title="تغيير الصورة الشخصية أو تعديل البيانات"
                    >
                      <Camera className="w-5 h-5 text-[#C5A059]" />
                      <span>تغيير الصورة الشخصية</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Photo Enhancement & Smoothing Trigger Pill (Admin Only) */}
              {isAuthenticated && (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#C5A059]/15 hover:bg-[#C5A059] text-[#DFCA9B] hover:text-[#121212] border border-[#C5A059]/40 transition-all shadow-xs"
                    title="تعديل وتنعيم الصورة الشخصية بدقة 1 بكسل"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059] group-hover:text-[#121212]" />
                    <span>تعديل وتنعيم الصورة</span>
                    <span className="font-mono text-[10px] opacity-80">(1px)</span>
                  </button>
                </div>
              )}
            </MotionLeft>

            {/* Metrics Quad-Grid */}
            <div className="w-full mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {metrics.map((item, idx) => (
                <MotionLeft
                  key={item.id}
                  immediate
                  delay={0.35 + idx * 0.08}
                  distance={-40}
                  className="h-full"
                >
                  <div
                    id={`metric-card-${item.id}`}
                    style={metricCardCustomStyle}
                    className={`h-full p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                      !style?.cardBackground ? (
                        theme === 'dark'
                          ? 'bg-[#1A1917] hover:bg-[#22201D] border-[#282622] hover:border-[#C5A059]/40 shadow-xs'
                          : 'bg-[#FFFFFF] hover:bg-[#FAF8F5] border-[#E5E0D8] hover:border-[#C5A059]/40 artistic-shadow-sm'
                      ) : ''
                    } text-center flex flex-col items-center justify-center`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span 
                        className="text-2xl sm:text-3xl font-bold tracking-tight font-serif-display"
                        style={{ color: style?.cardTextColor || (theme === 'dark' ? '#DFCA9B' : '#121212') }}
                      >
                        {item.value}
                      </span>
                      <div className={`p-1.5 rounded-lg ${
                        theme === 'dark' ? 'bg-[#C5A059]/15 text-[#C5A059]' : 'bg-[#F2EFE9] text-[#8F6E30]'
                      }`}>
                        <IconRenderer name={item.iconName} className="w-4 h-4" />
                      </div>
                    </div>
                    <span 
                      style={{ color: style?.cardTextColor ? `${style.cardTextColor}cc` : undefined }}
                      className={`text-xs font-semibold ${
                        !style?.cardTextColor ? (theme === 'dark' ? 'text-[#C7C1B7]' : 'text-[#5A554E]') : ''
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.subtext && (
                      <span 
                        style={{ color: style?.cardTextColor ? `${style.cardTextColor}88` : undefined }}
                        className="text-[10px] text-[#8E877D] dark:text-[#8E877D] mt-0.5"
                      >
                        {item.subtext}
                      </span>
                    )}
                  </div>
                </MotionLeft>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

