import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { optimizeImage } from '../../utils/mediaUtils';
import { 
  Camera, 
  Upload, 
  Link, 
  Check, 
  X, 
  Sparkles, 
  RotateCcw, 
  Image as ImageIcon 
} from 'lucide-react';

interface DirectImageEditorProps {
  currentImageUrl?: string;
  onImageChange: (newUrl: string) => void;
  children: React.ReactNode;
  label?: string;
  className?: string;
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  suggestedPresets?: Array<{ label: string; url: string }>;
  fitMode?: 'contain' | 'cover';
  onFitModeChange?: (fit: 'contain' | 'cover') => void;
}

const DEFAULT_PRESETS = [
  {
    label: 'تقنية وسحاب',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80'
  },
  {
    label: 'برمجة وواجهات',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80'
  },
  {
    label: 'ذكاء اصطناعي',
    url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1000&auto=format&fit=crop&q=80'
  },
  {
    label: 'تحليلات بيانات',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80'
  },
  {
    label: 'هندسة معمارية',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80'
  }
];

export const DirectImageEditor: React.FC<DirectImageEditorProps> = ({
  currentImageUrl,
  onImageChange,
  children,
  label = 'استبدال الصورة',
  className = 'relative group/img-editor',
  badgePosition = 'bottom-right',
  suggestedPresets = DEFAULT_PRESETS,
  fitMode = 'contain',
  onFitModeChange
}) => {
  const { isLiveEditMode, isAuthenticated, notify, setDraftStatus } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Position classes for the edit badge - completely stationary to prevent hover jitter
  const positionClasses = {
    'top-right': 'top-3 right-3',
    'top-left': 'top-3 left-3',
    'bottom-right': 'bottom-3 right-3',
    'bottom-left': 'bottom-3 left-3',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  }[badgePosition];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (< 15MB before optimization)
    if (file.size > 15 * 1024 * 1024) {
      notify('حجم الملف كبير جداً، يرجى اختيار صورة أقل من 15 ميجابايت', 'warning');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const rawBase64 = event.target?.result as string;
      if (!rawBase64) {
        setIsProcessing(false);
        return;
      }

      try {
        // High-efficiency optimization: 800x600 WebP/JPEG at 0.76 quality for fast upload.
        const optimized = await optimizeImage(rawBase64, 800, 600, 0.76);
        onImageChange(optimized);
        setDraftStatus('unsaved');
        notify(`تم استبدال ${label} بنجاح! لا تنسَ حفظ المسودة أو النشر`);
        setShowModal(false);
      } catch (err) {
        console.warn('Image optimization fallback:', err);
        onImageChange(rawBase64);
        setDraftStatus('unsaved');
        notify(`تم استبدال ${label}`);
        setShowModal(false);
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      setIsProcessing(false);
      notify('حدث خطأ أثناء قراءة ملف الصورة', 'warning');
    };

    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onImageChange(urlInput.trim());
    setDraftStatus('unsaved');
    notify(`تم تحديث ${label} بنجاح!`);
    setUrlInput('');
    setShowModal(false);
  };

  const handleSelectPreset = (url: string) => {
    onImageChange(url);
    setDraftStatus('unsaved');
    notify(`تم تطبيق الصورة المختارة بنجاح!`);
    setShowModal(false);
  };

  return (
    <div className={className}>
      {children}

      {/* Direct In-Place Edit Trigger Badge (Visible Strictly for Authenticated Admin in Live Edit Mode) */}
      {isAuthenticated && isLiveEditMode && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setShowModal(true);
            }}
            onMouseEnter={(e) => e.stopPropagation()}
            onMouseLeave={(e) => e.stopPropagation()}
            className={`absolute ${positionClasses} z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/90 hover:bg-[#C5A059] text-white hover:text-black border border-[#C5A059]/70 backdrop-blur-md shadow-xl transition-colors duration-200 text-xs font-bold cursor-pointer opacity-95 hover:opacity-100 ring-1 ring-black/50 pointer-events-auto select-none`}
            title={label}
          >
            <Camera className="w-3.5 h-3.5 text-[#C5A059] hover:text-inherit" />
            <span className="whitespace-nowrap">{label}</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml,image/gif"
            onChange={handleFileUpload}
            className="hidden"
          />
        </>
      )}

      {/* In-Place Image Management Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
          dir="rtl"
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
        >
          <div 
            className="relative w-full max-w-lg bg-[#181818] border border-[#C5A059]/40 rounded-3xl p-6 shadow-2xl text-white space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#C5A059]/20 text-[#C5A059]">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{label}</h3>
                  <p className="text-xs text-white/60">اختر رفع صورة من جهازك أو أدخل رابط ويب مباشر</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Image Preview - Full Uncropped View with Ambient Background */}
            {currentImageUrl && (
              <div className="space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0F0E0C] border border-white/10 flex items-center justify-center">
                  {/* Ambient Glow */}
                  <img 
                    src={currentImageUrl} 
                    alt="" 
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 scale-110 pointer-events-none"
                  />
                  {/* Full Foreground Image */}
                  <img 
                    src={currentImageUrl} 
                    alt="المعاينة الحالية" 
                    className={`relative z-10 max-h-full max-w-full w-auto h-auto ${
                      fitMode === 'cover' ? 'w-full h-full object-cover' : 'object-contain p-2'
                    }`}
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] text-[#C5A059] font-medium border border-white/10 z-20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                    {fitMode === 'cover' ? 'ملء الإطار' : 'كامل الصورة بدون قص'}
                  </div>
                </div>

                {/* Optional Fit Mode Toggle */}
                {onFitModeChange && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-xs text-white/70">تناسب أبعاد الصورة:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onFitModeChange('contain')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          fitMode === 'contain'
                            ? 'bg-[#C5A059] text-black shadow-sm'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        احتواء كامل (بدون أي قص)
                      </button>
                      <button
                        type="button"
                        onClick={() => onFitModeChange('cover')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          fitMode === 'cover'
                            ? 'bg-[#C5A059] text-black shadow-sm'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        ملء الإطار
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Option 1: File Upload from Computer */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">الخيار الأول: رفع ملف من جهازك</label>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-[#C5A059]/50 hover:border-[#C5A059] bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-white flex items-center justify-center gap-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer group"
              >
                <Upload className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
                <span>{isProcessing ? 'جارٍ المعالجة وضغط الصورة...' : 'انقر لاختيار صورة من جهازك (PNG, JPG, WebP)'}</span>
              </button>
            </div>

            {/* Option 2: Image URL Input */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">الخيار الثاني: رابط صورة مباشر (URL)</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... أو أي رابط صورة"
                    className="w-full pl-3 pr-9 py-2.5 bg-black/50 border border-white/15 focus:border-[#C5A059] rounded-xl text-xs text-white placeholder-white/40 focus:outline-none transition-colors"
                  />
                  <Link className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  disabled={!urlInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#d6b46b] text-black font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  تطبيق
                </button>
              </div>
            </div>

            {/* Option 3: Curated Presets */}
            {suggestedPresets && suggestedPresets.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>صور احترافية مقترحة (نقرة واحدة للتطبيق):</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {suggestedPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset.url)}
                      className="group/preset relative rounded-xl overflow-hidden border border-white/10 hover:border-[#C5A059] aspect-video flex flex-col justify-end text-right p-2 transition-all cursor-pointer"
                    >
                      <img 
                        src={preset.url} 
                        alt={preset.label} 
                        className="absolute inset-0 w-full h-full object-cover group-hover/preset:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <span className="relative z-10 text-[11px] font-bold text-white group-hover/preset:text-[#C5A059] transition-colors line-clamp-1">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Notice */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
              <span>يتم تحسين وضغط الصورة تلقائياً لسرعة التصفح</span>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
