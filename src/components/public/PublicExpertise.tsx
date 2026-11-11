import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem, BuilderElement } from '../../types';
import { ServicesHero } from './services/ServicesHero';
import { ServicesSearchFilter } from './services/ServicesSearchFilter';
import { ServicesGrid } from './services/ServicesGrid';
import { ServicesIntegratedSolutions } from './services/ServicesIntegratedSolutions';
import { ServicesMethodology } from './services/ServicesMethodology';
import { ServicesRelatedProjects } from './services/ServicesRelatedProjects';
import { ServicesClosingCTA } from './services/ServicesClosingCTA';
import { ServiceDetailModal } from './services/ServiceDetailModal';
import { ServiceInquiryModal } from './services/ServiceInquiryModal';
import { ContextualEditWrapper } from './services/ContextualEditWrapper';
import { 
  Plus, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Video, 
  Upload, 
  Youtube, 
  Sparkles, 
  Settings2, 
  X, 
  Check, 
  RotateCcw,
  Film
} from 'lucide-react';
import { getBrandVideoEmbedInfo, GUIDANCE_VIDEO_PRESETS } from '../../utils/mediaUtils';
import { apiClient } from '../../lib/apiClient';
import { persistBrandVideoFile } from '../../lib/videoUpload';

interface PublicExpertiseProps {
  title?: string;
  subtitle?: string;
  description?: string;
  layout?: BuilderElement['layout'];
  style?: BuilderElement['style'];
}

export const PublicExpertise: React.FC<PublicExpertiseProps> = ({
  title,
  subtitle,
  description,
  layout,
  style
}) => {
  const { 
    services, 
    addService, 
    isAuthenticated, 
    isLiveEditMode,
    selectedLiveElementId,
    setSelectedLiveElementId,
    setShowLivePropertiesPanel,
    brandVideoUrl,
    updateBrandVideoUrl,
    notify
  } = useApp();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeType, setActiveType] = useState<'all' | 'consulting' | 'service'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const [videoModalTab, setVideoModalTab] = useState<'url' | 'upload' | 'presets'>('url');
  const [videoUrlDraft, setVideoUrlDraft] = useState<string>('');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse current video info (supports YouTube loop, Vimeo, and direct video files)
  const videoInfo = useMemo(() => {
    return getBrandVideoEmbedInfo(brandVideoUrl, true);
  }, [brandVideoUrl]);

  useEffect(() => {
    setVideoError(false);
  }, [brandVideoUrl]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        void videoRef.current.play().catch(() => setVideoError(true));
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleApplyVideoUrl = (urlToApply: string) => {
    const trimmed = urlToApply.trim();
    if (!getBrandVideoEmbedInfo(trimmed).isVideo) {
      notify('أدخل رابط YouTube أو Vimeo صالحًا، أو رابط HTTPS مباشرًا لملف MP4/WebM.', 'warning');
      return;
    }
    updateBrandVideoUrl(trimmed);
    setVideoError(false);
    setShowVideoModal(false);
  };

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    if (isUploadingVideo) return;
    if (file.size > 50 * 1024 * 1024 || file.size === 0) {
      notify('يجب أن يكون الفيديو صالحًا ولا يتجاوز 50 ميجابايت.', 'warning');
      return;
    }
    setIsUploadingVideo(true);
    try {
      const stored = await persistBrandVideoFile(file, apiClient.uploadVideo, updateBrandVideoUrl, (message) => notify(message, 'success'));
      if (stored) {
        setVideoError(false);
        setShowVideoModal(false);
      } else {
        notify('تعذر رفع الفيديو أو لم يؤكد الخادم تخزينه. لم تتغير المسودة.', 'warning');
      }
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Modals state
  const [detailService, setDetailService] = useState<ServiceItem | null>(null);
  const [inquiryService, setInquiryService] = useState<ServiceItem | null>(null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState<boolean>(false);

  // Derive unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    services.forEach(s => {
      if (s.category) cats.add(s.category);
    });
    return Array.from(cats);
  }, [services]);

  // Check if current user has administrative / editor privileges (Strictly authenticated admin)
  const isAdmin = isAuthenticated;

  // Counts
  const consultingCount = useMemo(() => services.filter(s => s.type === 'consulting').length, [services]);
  const serviceCount = useMemo(() => services.filter(s => s.type === 'service' || !s.type).length, [services]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      // 1. Type Filter
      if (activeType === 'consulting' && s.type !== 'consulting') return false;
      if (activeType === 'service' && s.type === 'consulting') return false;

      // 2. Category Domain Filter
      if (activeCategory !== 'all' && s.category !== activeCategory) return false;

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = s.title?.toLowerCase().includes(query);
        const matchesDesc = s.description?.toLowerCase().includes(query);
        const matchesCat = s.category?.toLowerCase().includes(query);
        const matchesTags = s.tags?.some(t => t.toLowerCase().includes(query));
        const matchesDeliverables = s.deliverables?.some(d => d.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesTags && !matchesDeliverables) {
          return false;
        }
      }

      return true;
    });
  }, [services, activeType, activeCategory, searchQuery]);

  const handleAddNewService = () => {
    const newService: ServiceItem = {
      id: 'service_' + Date.now(),
      title: 'خدمة أو استشارة جديدة',
      description: 'وصف موجز يوضح القيمة المقدمة ونطاق العمل المنجز في هذه الخدمة.',
      category: activeCategory !== 'all' ? activeCategory : 'أنظمة وبرمجيات',
      type: activeType === 'consulting' ? 'consulting' : 'service',
      iconName: 'Sparkles',
      deliverables: [
        'تسليم المخرج البرمجي أو الاستشاري المعتمد.',
        'جلسة مراجعة ونقل المعرفة.',
        'وثيقة المواصفات والضمان.'
      ],
      tags: ['جديد', 'مهني'],
      order: services.length + 1
    };
    addService(newService);
    setSelectedLiveElementId(`service-card-${newService.id}`);
    setShowLivePropertiesPanel(true);
  };

  return (
    <section id="expertise" className="w-full bg-[#F9F7F2] text-[#121212] dark:bg-[#121212] dark:text-[#F9F7F2] relative transition-colors duration-300 selection:bg-[#C5A059]/30 selection:text-inherit" dir="rtl">
      {/* 1. Services Hero Section */}
      <ServicesHero />

      {/* Glass Video Container Slot (Continuous looping video with polished glass frame & YouTube support) */}
      <div
        className={`max-w-5xl mx-auto px-4 sm:px-6 my-8 sm:my-12 transition-all ${isAdmin && isLiveEditMode && selectedLiveElementId === 'animated-brand-icon' ? 'ring-2 ring-[#C5A059] rounded-[30px] p-1 bg-[#C5A059]/10' : ''}`}
        data-editor-target="animated-brand-icon"
        data-edit-mode={isAdmin && isLiveEditMode ? "true" : "false"}
        aria-label="حاوية الفيديو الزجاجي"
      >
        <div className="relative group rounded-[28px] p-3 sm:p-5 backdrop-blur-2xl bg-white/20 dark:bg-[#181818]/75 border border-white/40 dark:border-[#C5A059]/40 shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-500 hover:border-[#C5A059]/70">
          {/* Polished edge highlight & inner bevel */}
          <div className="absolute inset-0 rounded-[28px] border border-white/30 pointer-events-none z-10"></div>
          <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-r from-[#C5A059]/30 via-[#33C7E8]/30 to-[#C5A059]/30 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
          
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.4/1] rounded-2xl overflow-hidden bg-black/85 shadow-inner flex items-center justify-center group/video">
            {!videoError && videoInfo.isVideo ? (
              <>
                {videoInfo.provider === 'youtube' ? (
                  <iframe
                    key={videoInfo.embedUrl}
                    src={videoInfo.embedUrl}
                    title="فيديو تعريفي واستشاري (تكرار مستمر)"
                    className="w-full h-full object-cover border-0 pointer-events-auto"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : videoInfo.provider === 'vimeo' ? (
                  <iframe
                    key={videoInfo.embedUrl}
                    src={videoInfo.embedUrl}
                    title="فيديو استعراضي"
                    className="w-full h-full object-cover border-0 pointer-events-auto"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    key={brandVideoUrl}
                    src={videoInfo.embedUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-102"
                    onError={() => setVideoError(true)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >متصفحك لا يدعم عرض الفيديو.</video>
                )}

                {/* Hover Play/Pause Control Button (For direct video) */}
                {videoInfo.provider === 'direct' && (
                  <div className="absolute z-30 bottom-4 left-4 flex items-center gap-2 opacity-0 group-hover/video:opacity-100 transition-all duration-300">
                    <button
                      type="button"
                      onClick={togglePlayPause}
                      className="px-3.5 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xl hover:bg-black/90 hover:scale-105 active:scale-95 cursor-pointer"
                      title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-4 h-4 text-[#C5A059]" />
                          <span>إيقاف مؤقت</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 text-[#C5A059]" />
                          <span>تشغيل</span>
                        </>
                      )}
                    </button>

                    {/* Mute/Unmute Audio Toggle */}
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-white hover:text-[#C5A059] shadow-xl hover:bg-black/90 hover:scale-105 active:scale-95 cursor-pointer"
                      title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C5A059]" />}
                    </button>
                  </div>
                )}

                {/* Direct In-Place Video Config Button (Strictly for Administrator / Live Edit Mode) */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoUrlDraft(brandVideoUrl);
                      setShowVideoModal(true);
                    }}
                    className="absolute z-30 bottom-4 right-4 px-3.5 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-[#C5A059]/60 text-white text-xs font-bold flex items-center gap-2 shadow-2xl hover:bg-[#C5A059] hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer opacity-90 group-hover/video:opacity-100"
                    title="تغيير رابط الفيديو أو رفعه أو اختيار فيديو إرشادي"
                  >
                    <Settings2 className="w-4 h-4 text-[#C5A059] group-hover:text-black" />
                    <span>تخصيص واستبدال الفيديو</span>
                  </button>
                )}
              </>
            ) : isAdmin ? (
              /* Admin-Only Fallback & Management Screen when video is missing or broken */
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-gray-950 via-[#111] to-black text-white">
                <div className="w-16 h-16 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center mb-3 shadow-lg shadow-[#C5A059]/10">
                  <Film className="w-8 h-8 text-[#C5A059]" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">{videoError ? 'تعذر تشغيل الفيديو' : 'شاشة الفيديو التفاعلية (لوحة تحكم المسؤول)'}</h4>
                <p className="text-xs text-white/70 max-w-md mb-4 leading-relaxed">
                  {videoError ? 'تحقق من الرابط أو ترميز الملف، ثم اختر فيديو آخر. ملفات MP4 تعمل عادةً بترميز H.264.' : 'يمكنك كمسؤول ربط الشاشة برابط يوتيوب أو رفع فيديو قصير إرشادي بتكرار مستمر.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoUrlDraft(brandVideoUrl);
                      setShowVideoModal(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#d6b46b] text-black font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>ربط برابط يوتيوب أو فيديو مباشر</span>
                  </button>
                  <label className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#C5A059]" />
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      className="hidden"
                      onChange={handleVideoFileUpload}
                      disabled={isUploadingVideo}
                    />
                    <span>{isUploadingVideo ? 'جارٍ رفع الفيديو...' : 'رفع فيديو من جهازك'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      updateBrandVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                      setVideoError(false);
                      notify('تم تعيين الفيديو الإرشادي الافتراضي في المسودة. احفظ المسودة وانشرها لتظهر للزوار.', 'success');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>فيديو إرشادي افتراضي</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Public Visitors View: Clean, elegant showcase card with ZERO editing or upload controls */
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-gray-950 via-[#121212] to-black text-white select-none">
                <div className="w-16 h-16 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center mb-3 shadow-xl shadow-[#C5A059]/10">
                  <Film className="w-8 h-8 text-[#C5A059]" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-2 tracking-wide">
                  الاستشارات الهندسية والحلول التقنية المتكاملة
                </h4>
                <p className="text-xs sm:text-sm text-white/70 max-w-lg leading-relaxed">
                  نقدم معمارية برمجية متقدمة وحلول رقمية رائدة تعزز كفاءة الأعمال وترتقي بالأداء المؤسسي.
                </p>
              </div>
            )}

            {/* Glossy gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5 pointer-events-none"></div>
            
            {/* Live Indicator Badge (Shown only when video is active) */}
            {!videoError && videoInfo.isVideo && (
              <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white/90 text-[11px] font-semibold flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{videoInfo.provider === 'youtube' ? 'فيديو يوتيوب (تشغيل مستمر)' : 'عرض الوسائط (Loop)'}</span>
              </div>
            )}
          </div>
        </div>

        {/* In-Place Video Settings & Management Modal (Strictly Administrator) */}
        {isAdmin && showVideoModal && (
          <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
            dir="rtl"
            onClick={() => setShowVideoModal(false)}
          >
            <div 
              className="relative w-full max-w-xl bg-[#161616] border border-[#C5A059]/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#C5A059]/20 text-[#C5A059]">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">إعدادات شاشة الفيديو والتشغيل المستمر</h3>
                    <p className="text-xs text-white/60">اختر الطريقة الأنسب لعرض الفيديو (يوتيوب / رفع ملف / نماذج إرشادية)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/60 border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setVideoModalTab('url')}
                  className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    videoModalTab === 'url'
                      ? 'bg-[#C5A059] text-black shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Youtube className="w-4 h-4" />
                  <span>رابط YouTube / ويب</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVideoModalTab('upload')}
                  className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    videoModalTab === 'upload'
                      ? 'bg-[#C5A059] text-black shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>رفع فيديو من جهازك</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVideoModalTab('presets')}
                  className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    videoModalTab === 'presets'
                      ? 'bg-[#C5A059] text-black shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>فيديوهات إرشادية جاهزة</span>
                </button>
              </div>

              {/* Tab 1: YouTube / Web URL */}
              {videoModalTab === 'url' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-2">
                      أدخل رابط يوتيوب (Watch / Shorts / Embed) أو رابط ملف مباشر:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={videoUrlDraft}
                        onChange={(e) => setVideoUrlDraft(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
                        className="w-full px-4 py-3 bg-black/60 border border-white/20 focus:border-[#C5A059] rounded-xl text-xs text-white placeholder-white/40 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyVideoUrl(videoUrlDraft)}
                        disabled={!videoUrlDraft.trim()}
                        className="px-5 py-3 rounded-xl bg-[#C5A059] hover:bg-[#d6b46b] text-black font-bold text-xs shrink-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                      >
                        تطبيق
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/70 space-y-1.5 leading-relaxed">
                    <p className="font-semibold text-[#C5A059]">✨ ميزة التكرار المستمر الذكي (YouTube Loop):</p>
                    <p>يتم تضمين معلمات التشغيل التلقائي وإعادة التشغيل المتكرر (Loop + Autoplay + Muted) فورياً ليعمل الفيديو بشكل مستمر دون توقف في خلفية الإطار الزجاجي.</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Upload Video File */}
              {videoModalTab === 'upload' && (
                <div className="space-y-4 text-center">
                  <div className="p-6 rounded-2xl border-2 border-dashed border-[#C5A059]/40 bg-[#C5A059]/5 hover:bg-[#C5A059]/10 transition-all flex flex-col items-center justify-center">
                    <Upload className="w-10 h-10 text-[#C5A059] mb-3 animate-bounce" />
                    <h4 className="text-sm font-bold text-white mb-1">اختر ملف فيديو قصير من جهازك</h4>
                    <p className="text-xs text-white/60 mb-4 max-w-sm">
                      يدعم MP4 وWebM حتى 50 ميجابايت. حوّل MOV إلى MP4 قبل الرفع؛ ثم احفظ المسودة وانشرها ليراها الزوار.
                    </p>
                    <label className="px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#d6b46b] text-black font-bold text-xs shadow-lg transition-all cursor-pointer">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="video/mp4,video/webm"
                        className="hidden"
                        onChange={handleVideoFileUpload}
                        disabled={isUploadingVideo}
                      />
                      <span>{isUploadingVideo ? 'جارٍ رفع الفيديو...' : 'تصفح ملفات الفيديو'}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Tab 3: Curated Guidance Loop Videos */}
              {videoModalTab === 'presets' && (
                <div className="space-y-3">
                  <p className="text-xs text-white/70">انقر على أي نموذج لتطبيقه مباشرة كفيديو إرشادي مستمر:</p>
                  <div className="space-y-2.5">
                    {GUIDANCE_VIDEO_PRESETS.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => handleApplyVideoUrl(preset.url)}
                        className="group/item flex items-center gap-3 p-3 rounded-2xl bg-black/40 hover:bg-[#C5A059]/15 border border-white/10 hover:border-[#C5A059]/60 transition-all cursor-pointer"
                      >
                        <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-black/70">
                          <img 
                            src={preset.thumbnail} 
                            alt={preset.title}
                            className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white fill-current" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-white group-hover/item:text-[#C5A059] transition-colors truncate">
                            {preset.title}
                          </h5>
                          <p className="text-[11px] text-white/60 line-clamp-1 mt-0.5">
                            {preset.description}
                          </p>
                        </div>
                        <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white group-hover/item:bg-[#C5A059] group-hover/item:text-black text-xs font-bold transition-colors shrink-0">
                          تطبيق
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                <button
                  type="button"
                  onClick={() => {
                    updateBrandVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                    setShowVideoModal(false);
                  }}
                  className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة الفيديو الافتراضي</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Main Services Directory Container */}
      <section className="services-directory max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Section Header with Quick Add for Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#8F6E30] dark:text-[#C5A059] tracking-wider uppercase block mb-1">
              دليل الخدمات والاستشارات
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#121212] dark:text-white tracking-tight">
              استكشف نطاقات العمل التخصصية
            </h2>
          </div>

          {isAuthenticated && isLiveEditMode && (
            <button
              type="button"
              onClick={handleAddNewService}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5A059] text-black text-xs sm:text-sm font-bold shadow-md hover:bg-[#D4AF37] transition-all self-start sm:self-auto shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة خدمة / استشارة جديدة</span>
            </button>
          )}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mb-10 p-5 rounded-2xl bg-[#FFFFFF] dark:bg-[#161616] border border-[#E5E0D8] dark:border-white/10 artistic-shadow-sm dark:shadow-lg transition-colors duration-300">
          <ServicesSearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeType={activeType}
            onTypeChange={setActiveType}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            categories={categories}
            totalServicesCount={services.length}
            consultingCount={consultingCount}
            serviceCount={serviceCount}
            filteredCount={filteredServices.length}
          />
        </div>

        {/* Services & Consulting Cards Grid */}
        <ServicesGrid
          services={filteredServices}
          onSelectServiceForDetail={(srv) => setDetailService(srv)}
          onSelectServiceForInquiry={(srv) => {
            setInquiryService(srv);
            setIsInquiryModalOpen(true);
          }}
        />
      </section>

      {/* 3. Integrated Solutions Section (Includes Showcase Platforms) */}
      <ServicesIntegratedSolutions />

      {/* 4. Methodology Workflow Section (5 Stages) */}
      <ServicesMethodology />

      {/* 5. Related Projects & Execution Case Studies */}
      <ServicesRelatedProjects />

      {/* 6. Closing High-Impact CTA Section */}
      <ServicesClosingCTA />

      {/* Modals & Slide-over Panels */}
      <ServiceDetailModal
        service={detailService}
        onClose={() => setDetailService(null)}
        onInquire={(srv) => {
          setInquiryService(srv);
          setIsInquiryModalOpen(true);
        }}
      />

      <ServiceInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => {
          setIsInquiryModalOpen(false);
          setInquiryService(null);
        }}
        serviceTitle={inquiryService?.title || 'طلب استشارة عامة'}
        serviceType={inquiryService?.type || 'service'}
        serviceCategory={inquiryService?.category || 'حلول عامة'}
      />
    </section>
  );
};

