import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShowcaseAppItem } from '../../types';
import { IconRenderer } from '../ui/IconRenderer';
import { 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Plus, 
  Settings2, 
  Edit3, 
  CheckCircle2, 
  ArrowUpRight,
  Globe,
  AppWindow,
  LayoutGrid
} from 'lucide-react';

interface ProjectShowcaseBarProps {
  className?: string;
  isEditable?: boolean;
}

export const ProjectShowcaseBar: React.FC<ProjectShowcaseBarProps> = ({ 
  className = '',
  isEditable = false 
}) => {
  const { 
    showcaseApps, 
    showcaseBarConfig, 
    updateShowcaseBarConfig, 
    setShowShowcaseModal, 
    theme,
    isAuthenticated
  } = useApp();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(showcaseBarConfig.title);
  const [tempSubtitle, setTempSubtitle] = useState(showcaseBarConfig.subtitle || '');

  if (!showcaseBarConfig.enabled && !isAuthenticated) {
    return null;
  }

  const handleSaveTitle = () => {
    updateShowcaseBarConfig({
      title: tempTitle,
      subtitle: tempSubtitle
    });
    setIsEditingTitle(false);
  };

  const renderAppIcon = (app: ShowcaseAppItem) => {
    if (app.logoUrl) {
      return (
        <img 
          src={app.logoUrl} 
          alt={app.name} 
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      );
    }

    return (
      <IconRenderer name={app.iconName || 'AppWindow'} className="w-6 h-6 sm:w-7 sm:h-7 text-[#C5A059] transition-transform duration-300 group-hover:scale-110" />
    );
  };

  return (
    <section 
      id="project-showcase-bar" 
      className={`w-full py-8 transition-all duration-300 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Rectangular Container */}
        <div className="relative rounded-3xl p-6 sm:p-8 border backdrop-blur-xl transition-all duration-300 bg-gradient-to-b from-[#FFFFFF]/95 to-[#FAF8F5]/95 border-[#E5E0D8] artistic-shadow-md dark:from-[#1A1917]/95 dark:to-[#151412]/95 dark:border-[#2E2B26] dark:shadow-2xl dark:shadow-black/40">
          
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-1/4 w-72 h-24 bg-[#C5A059]/10 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-1/4 w-72 h-24 bg-[#C5A059]/5 blur-3xl pointer-events-none rounded-full" />

          {/* Bar Header with title, subtitle & quick management actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#E5E0D8] dark:border-[#282622]">
            
            {/* Title block */}
            <div className="flex-1">
              {isEditingTitle ? (
                <div className="space-y-2 bg-[#F2EFE9] dark:bg-[#201E1A] p-3 rounded-2xl border border-[#C5A059]/40">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      placeholder="عنوان شريط التطبيقات..."
                      className="w-full px-3 py-1.5 text-sm font-bold bg-white dark:bg-[#151412] text-[#121212] dark:text-white rounded-xl border border-[#E5E0D8] dark:border-[#2E2B26] focus:outline-none focus:border-[#C5A059]"
                    />
                    <button
                      onClick={handleSaveTitle}
                      className="px-3 py-1.5 bg-[#C5A059] text-[#121212] font-bold text-xs rounded-xl shrink-0 cursor-pointer"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => setIsEditingTitle(false)}
                      className="px-3 py-1.5 bg-black/10 dark:bg-zinc-800 text-xs rounded-xl shrink-0 cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                  <input
                    type="text"
                    value={tempSubtitle}
                    onChange={(e) => setTempSubtitle(e.target.value)}
                    placeholder="وصف فرعي اختياري..."
                    className="w-full px-3 py-1 text-xs bg-white dark:bg-[#151412] text-[#121212] dark:text-white rounded-lg border border-[#E5E0D8] dark:border-[#2E2B26] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              ) : (
                <div className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/15 text-[#8F6E30] dark:text-[#C5A059] flex items-center justify-center shrink-0 border border-[#C5A059]/30">
                    <AppWindow className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#121212] dark:text-[#F9F7F2] font-serif-display">
                        {showcaseBarConfig.title}
                      </h3>
                      {isAuthenticated && (
                        <button
                          onClick={() => {
                            setTempTitle(showcaseBarConfig.title);
                            setTempSubtitle(showcaseBarConfig.subtitle || '');
                            setIsEditingTitle(true);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#8C867D] hover:text-[#C5A059] transition-opacity cursor-pointer"
                          title="تعديل عنوان الشريط"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    {showcaseBarConfig.subtitle && (
                      <p className="text-xs text-[#8C867D] dark:text-[#9E988E] mt-0.5">
                        {showcaseBarConfig.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#C5A059]/10 text-[#8F6E30] dark:text-[#E8D4A8] border border-[#C5A059]/25">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{showcaseApps.length} تطبيقات ومنصات حية</span>
              </span>

              {isAuthenticated && (
                <button
                  onClick={() => setShowShowcaseModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-black/5 dark:bg-[#2A2824] text-[#8F6E30] dark:text-[#E8D4A8] hover:bg-[#C5A059] hover:text-[#121212] border border-[#C5A059]/30 transition-all shadow-xs cursor-pointer"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>إدارة التطبيقات والشعارات</span>
                </button>
              )}
            </div>

          </div>

          {/* Rectangular Apps Grid / Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {showcaseApps.map((app) => {
              const hasValidUrl = !!(app.url && app.url.trim() && app.url !== '#' && app.url !== 'https://' && app.url !== 'http://');
              const CardTag = hasValidUrl ? 'a' : 'div';
              const cardProps = hasValidUrl ? {
                href: app.url,
                target: app.url?.startsWith('http') ? '_blank' : '_self',
                rel: 'noopener noreferrer'
              } : {};

              return (
                <CardTag
                  key={app.id}
                  {...cardProps}
                  id={`showcase-app-${app.id}`}
                  className={`group relative flex flex-col p-4 rounded-2xl border transition-all duration-300 ${
                    hasValidUrl ? 'hover:-translate-y-1 hover:shadow-lg hover:border-[#C5A059]/60 cursor-pointer' : 'cursor-default'
                  } bg-[#FFFFFF] ${hasValidUrl ? 'hover:bg-[#FAF8F5]' : ''} border-[#EAE6DF] artistic-shadow-sm dark:bg-[#151412]/80 ${
                    hasValidUrl ? 'dark:hover:bg-[#1E1D19] dark:hover:border-[#C5A059]/50' : ''
                  } dark:border-[#2A2722]`}
                >
                  {/* External Link hover badge if has valid URL */}
                  {hasValidUrl && (
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-1 rounded-lg bg-[#C5A059] text-[#121212] shadow-xs">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}

                  {/* Logo / Icon Dedicated Centered Container with transparency support */}
                  <div className="flex items-center gap-3.5 mb-3">
                    <div 
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-[#E5E0D8] dark:border-[#2E2B26] transition-all duration-300 ${
                        hasValidUrl ? 'group-hover:border-[#C5A059]' : ''
                      } overflow-hidden bg-black/[0.02] dark:bg-white/[0.04]`}
                      style={app.logoBgColor ? { backgroundColor: app.logoBgColor } : undefined}
                    >
                      {renderAppIcon(app)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className={`text-sm font-bold text-[#121212] dark:text-[#F9F7F2] truncate ${
                          hasValidUrl ? 'group-hover:text-[#C5A059]' : ''
                        } transition-colors`}>
                          {app.name}
                        </h4>
                      </div>
                      <span className="text-[11px] text-[#8C867D] dark:text-[#9E988E] block truncate">
                        {app.category}
                      </span>
                    </div>
                  </div>

                  {/* Optional short description */}
                  {app.description && (
                    <p className="text-[11px] text-[#6B655B] dark:text-[#ACA497] line-clamp-2 leading-relaxed mb-3 flex-1">
                      {app.description}
                    </p>
                  )}

                  {/* Footer tags and status */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-[#EAE6DF] dark:border-[#262420] text-[10px] mt-auto">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium ${
                      app.status === 'live'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                        : app.status === 'beta'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>
                        {app.status === 'live' ? 'منصة حية' : app.status === 'beta' ? 'نسخة تجريبية' : 'قيد التطوير'}
                      </span>
                    </span>

                    {hasValidUrl ? (
                      <span className="text-[#8C867D] group-hover:text-[#C5A059] font-mono flex items-center gap-1 transition-colors">
                        <span>زيارة</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[#8C867D] font-mono text-[9px]">
                        منصة معتمدة
                      </span>
                    )}
                  </div>

                </CardTag>
              );
            })}

            {/* Quick Add Card when authenticated */}
            {isAuthenticated && (
              <button
                onClick={() => setShowShowcaseModal(true)}
                className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-[#C5A059]/40 hover:border-[#C5A059] transition-all duration-300 min-h-[140px] text-center group bg-[#FAF8F5] hover:bg-[#FFFFFF] dark:bg-[#151412]/40 dark:hover:bg-[#1A1917] cursor-pointer"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#121212] dark:text-[#F9F7F2]">
                  إضافة تطبيق أو موقع جديد
                </span>
                <span className="text-[10px] text-[#8C867D] mt-0.5">
                  رفع الشعار وإضافة الرابط المباشر
                </span>
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

