import React, { useState } from 'react';
import { ProjectItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  CheckCircle2, 
  Target, 
  Wrench, 
  Play, 
  Image as ImageIcon,
  Video,
  Sparkles
} from 'lucide-react';
import { getVideoEmbedInfo } from '../../utils/mediaUtils';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const { theme } = useApp();
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'media' | 'video'>('media');

  if (!project) return null;

  const projectUrl = (project.externalUrl || project.link || project.videoUrl || '').trim();
  const videoInfo = getVideoEmbedInfo(project.videoUrl || project.externalUrl || project.link);
  const currentImage = activeImage || project.imageUrl;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex min-h-screen items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto backdrop-blur-md bg-black/85 animate-in fade-in duration-200"
      onClick={onClose}
      dir="rtl"
    >
      <div 
        className={`relative w-full max-w-4xl my-auto max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all z-10 ${
          theme === 'dark'
            ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]'
            : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212]'
        } p-6 sm:p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-6 left-6 p-2 rounded-full border transition-colors cursor-pointer z-20 ${
            theme === 'dark'
              ? 'bg-[#24221E] border-[#2E2B26] text-[#C7C1B7] hover:text-[#F9F7F2] hover:border-[#C5A059]'
              : 'bg-[#F2EFE9] border-[#E5E0D8] text-[#5A554E] hover:text-[#121212] hover:border-[#C5A059]'
          }`}
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 mb-6 text-right">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              theme === 'dark'
                ? 'bg-[#C5A059]/20 text-[#DFCA9B] border-[#C5A059]/30'
                : 'bg-[#F2EFE9] text-[#8F6E30] border-[#E5E0D8]'
            }`}>
              {project.category}
            </span>
            {project.year && (
              <span className="text-xs text-[#8E877D] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {project.year}
              </span>
            )}
            {videoInfo.isVideo && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-500 font-semibold flex items-center gap-1">
                <Play className="w-3 h-3 fill-current" />
                <span>فيديو توضيحي متاح</span>
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif-display text-[#121212] dark:text-[#F9F7F2]">{project.title}</h2>
          <p className="text-sm text-[#8E877D]">{project.description}</p>
        </div>

        {/* Media Switcher Tabs if Video Exists */}
        {videoInfo.isVideo && (
          <div className="flex items-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-[#C5A059] text-black shadow-md'
                  : 'bg-black/5 dark:bg-white/5 text-[#5A554E] dark:text-white/70 hover:bg-black/10'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>مشاهدة الفيديو المضمن</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-[#C5A059] text-black shadow-md'
                  : 'bg-black/5 dark:bg-white/5 text-[#5A554E] dark:text-white/70 hover:bg-black/10'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>معاينة الصور والتصاميم</span>
            </button>
          </div>
        )}

        {/* Video Player OR Main Image Showcase */}
        {videoInfo.isVideo && activeTab === 'video' ? (
          <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video bg-black border border-[#2E2B26] shadow-xl">
            {videoInfo.provider === 'direct' ? (
              <video
                src={videoInfo.embedUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <iframe
                src={videoInfo.embedUrl}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            )}
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video bg-[#0F0E0C] border border-[#2E2B26] flex items-center justify-center">
            {currentImage ? (
              <>
                {/* Ambient glow matching photo colors */}
                <img
                  src={currentImage}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 scale-110 pointer-events-none"
                />
                {/* Full Uncropped Foreground Image */}
                <img
                  src={currentImage}
                  alt={project.title}
                  className={`relative z-10 max-h-full max-w-full w-auto h-auto ${
                    project.imageFit === 'cover' ? 'w-full h-full object-cover' : 'object-contain p-2'
                  }`}
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                <ImageIcon className="w-10 h-10 stroke-1" />
                <span className="text-xs">لا توجد صورة محددة</span>
              </div>
            )}
          </div>
        )}

        {/* Thumbnails Filmstrip if multiple images exist */}
        {project.galleryUrls && project.galleryUrls.length > 1 && activeTab === 'media' && (
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {project.galleryUrls.map((url, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(url)}
                className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  currentImage === url
                    ? 'border-[#C5A059] scale-105 shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`عرض ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Detailed Breakdown: Challenge, Solution, Results (if available) */}
        {(project.challenge || project.solution || project.results) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-right">
            {project.challenge && (
              <div className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-[#201E1A] border-[#2E2B26]' : 'bg-[#F9F7F2] border-[#E5E0D8]'
              }`}>
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm mb-2 font-serif-display">
                  <Target className="w-4 h-4" />
                  <span>التحدي</span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-[#C7C1B7]' : 'text-[#5A554E]'}`}>
                  {project.challenge}
                </p>
              </div>
            )}

            {project.solution && (
              <div className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-[#201E1A] border-[#2E2B26]' : 'bg-[#F9F7F2] border-[#E5E0D8]'
              }`}>
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm mb-2 font-serif-display">
                  <Wrench className="w-4 h-4" />
                  <span>الحل والمنهجية</span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-[#C7C1B7]' : 'text-[#5A554E]'}`}>
                  {project.solution}
                </p>
              </div>
            )}

            {project.results && (
              <div className={`p-5 rounded-2xl border ${
                theme === 'dark' ? 'bg-[#201E1A] border-[#2E2B26]' : 'bg-[#F9F7F2] border-[#E5E0D8]'
              }`}>
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm mb-2 font-serif-display">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>النتائج والأثر</span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${theme === 'dark' ? 'text-[#C7C1B7]' : 'text-[#5A554E]'}`}>
                  {project.results}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tech Stack & External Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E5E0D8] dark:border-[#2E2B26]">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {project.tools && project.tools.length > 0 && (
              <>
                <span className="text-xs text-[#8E877D] font-medium ml-2">الأدوات:</span>
                {project.tools.map((tool, i) => (
                  <span
                    key={i}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-[#24221E] border-[#2E2B26] text-[#C7C1B7]' 
                        : 'bg-[#F2EFE9] border-[#E5E0D8] text-[#5A554E]'
                    }`}
                  >
                    {tool}
                  </span>
                ))}
              </>
            )}
          </div>

          {projectUrl ? (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] font-black text-xs sm:text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              {videoInfo.isVideo ? (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>مشاهدة الفيديو على المنصة الأصلية</span>
                </>
              ) : (
                <>
                  <span>فتح الرابط المباشر للمشروع</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </a>
          ) : (
            <div className="text-xs text-[#8E877D] dark:text-[#C7C1B7]/60 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>مشروع موثّق ومعتمد</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

