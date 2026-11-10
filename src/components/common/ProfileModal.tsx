import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { optimizeImage } from '../../utils/imageOptimizer';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Check, 
  User, 
  Briefcase, 
  MapPin, 
  Phone, 
  Mail, 
  Link, 
  Sparkles,
  RefreshCw,
  Sliders,
  Lock,
  KeyRound
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, savePortfolioToServer, mediaList, theme, notify, isAuthenticated, setShowLoginModal, deleteAvatar } = useApp();
  const [formData, setFormData] = useState({ ...profile });
  const [activeTab, setActiveTab] = useState<'photo' | 'info' | 'social'>('photo');
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync formData whenever modal opens or profile updates
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...profile });
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div 
        className="fixed inset-0 z-[99999] overflow-y-auto p-4 flex min-h-screen items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl text-center space-y-5 transition-all ${
            theme === 'dark' ? 'bg-[#161513] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212]'
          }`}
        >
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-serif-display text-[#C5A059]">تعديل الملف الشخصي محمي</h3>
            <p className="text-xs text-[#8E877D] mt-2 leading-relaxed">
              تعديل الصورة الشخصية والسيرة والبيانات مقتصر على مدير الموقع. يرجى تسجيل الدخول بحساب المسؤول للمتابعة.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                setShowLoginModal(true);
              }}
              className="w-full py-3 rounded-2xl bg-[#C5A059] hover:bg-[#DFCA9B] text-[#121212] font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <KeyRound className="w-4 h-4" />
              <span>تسجيل الدخول كمسؤول الآن</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`w-full py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                theme === 'dark' ? 'border-[#2E2B26] text-[#8E877D] hover:bg-[#22201D]' : 'border-[#E5E0D8] text-[#5A554E] hover:bg-[#F4F1EA]'
              }`}
            >
              إلغاء والعودة للموقع
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Compress and optimize photo for high resolution display with minimal file size (~60KB)
      const optimizedUrl = await optimizeImage(file, 800, 800, 0.85);
      setFormData(prev => ({ ...prev, avatarUrl: optimizedUrl }));
      notify('تم تحسين وضغط الصورة الشخصية بنجاح بجودة عالية وحجم خفيف!');
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setFormData(prev => ({ ...prev, avatarUrl: dataUrl }));
          notify('تم تحميل الصورة بنجاح! انقر على "حفظ التغييرات" لتطبيقها');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      // Clean up input value to prevent memory leaks and allow selecting the same file again
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    let finalData = { ...formData };
    if (finalData.avatarUrl && finalData.avatarUrl.includes('1507003211169-0a1dd7228f2d')) {
      finalData.avatarUrl = '';
    } else if (finalData.avatarUrl && finalData.avatarUrl.startsWith('data:image/') && finalData.avatarUrl.length > 60000) {
      try {
        finalData.avatarUrl = await optimizeImage(finalData.avatarUrl, 800, 800, 0.82);
      } catch (e) {
        console.warn('Avatar compression error:', e);
      }
    }
    finalData.avatarUrl = finalData.avatarUrl || '';
    updateProfile(finalData);
    try {
      await savePortfolioToServer({ profileOverride: finalData });
      notify('تم حفظ الملف الشخصي وتحديث الصورة ومزامنتها بنجاح!');
    } catch (err) {
      console.warn('Server profile save failed:', err);
      notify('تم تعديل الملف الشخصي، لكن تعذر حفظه على الخادم', 'warning');
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto p-3 sm:p-6 flex min-h-screen items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="profile-editor-modal"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl my-auto max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden shrink-0 z-10 ${
          theme === 'dark' ? 'bg-[#181715] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212]'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 sm:px-6 py-4 border-b shrink-0 ${
          theme === 'dark' ? 'border-[#282622] bg-[#141312]' : 'border-[#E5E0D8] bg-[#FAF8F5]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg font-serif-display">تعديل الملف الشخصي والصورة</h3>
              <p className="text-xs text-[#8E877D] dark:text-[#9E988D]">خصص صورتك الشخصية، نبذتك، وروابط تواصلك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-colors ${
              theme === 'dark' ? 'border-[#2E2B26] text-[#8E877D] hover:text-[#F9F7F2] hover:bg-[#22201D]' : 'border-[#E5E0D8] text-[#5A554E] hover:text-[#121212] hover:bg-[#F2EFE9]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 border-b text-xs font-semibold shrink-0 ${
          theme === 'dark' ? 'border-[#282622] bg-[#1A1917]' : 'border-[#E5E0D8] bg-[#F4F1EA]'
        }`}>
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'photo'
                ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs'
                : 'text-[#8E877D] hover:text-[#C5A059]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>الصورة الشخصية</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'info'
                ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs'
                : 'text-[#8E877D] hover:text-[#C5A059]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>البيانات والمسميات</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'social'
                ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs'
                : 'text-[#8E877D] hover:text-[#C5A059]'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>روابط التواصل</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'photo' && (
            <div className="space-y-6">
              {/* Photo Preview & Main Actions */}
              <div className={`sticky top-0 z-35 flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border shadow-xl backdrop-blur-xl transition-all ${
                theme === 'dark' ? 'bg-[#141312]/95 border-[#C5A059]/50 shadow-black/40' : 'bg-[#FAF8F5]/95 border-[#C5A059]/50 shadow-amber-900/10'
              }`}>
                <div className={`relative w-32 h-32 overflow-hidden border-2 border-[#C5A059] shadow-lg flex items-center justify-center bg-[#1A1917] shrink-0 group ${
                  formData.avatarShape === 'square' ? 'rounded-2xl' :
                  formData.avatarShape === 'rounded' ? 'rounded-3xl' : 'rounded-full'
                }`}>
                  {formData.avatarUrl ? (
                    <>
                      <img 
                        src={formData.avatarUrl} 
                        alt="معاينة الصورة الشخصية" 
                        style={{
                          transform: `scale(${(formData.avatarZoom ?? 100) / 100})`,
                          transformOrigin: `${formData.avatarAlign || 'center'} ${formData.avatarPosition || 'center'}`,
                          objectPosition: `${formData.avatarAlign || 'center'} ${formData.avatarPosition || 'center'}`,
                          filter: (() => {
                            const b = formData.avatarBrightness ?? 100;
                            const c = formData.avatarContrast ?? 100;
                            const s = formData.avatarSaturation ?? 100;
                            const rawBlur = formData.avatarBlur ?? 0;
                            const blurPx = rawBlur <= 8 && rawBlur > 0 ? (rawBlur * 0.15) : (rawBlur * 0.015);
                            let str = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
                            if (blurPx > 0) str += ` blur(${blurPx.toFixed(3)}px)`;
                            if (formData.avatarFilter === 'cinematic_gold') str += ` sepia(25%) hue-rotate(-10deg) saturate(120%)`;
                            else if (formData.avatarFilter === 'warm') str += ` sepia(30%) saturate(110%)`;
                            else if (formData.avatarFilter === 'cool') str += ` hue-rotate(180deg) saturate(90%)`;
                            else if (formData.avatarFilter === 'bw') str += ` grayscale(100%) contrast(110%)`;
                            else if (formData.avatarFilter === 'vintage') str += ` sepia(50%) contrast(90%) brightness(105%)`;
                            return str;
                          })()
                        }}
                        className={`w-full h-full ${formData.avatarFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                        onLoad={(e) => {
                          setImageDimensions({
                            width: e.currentTarget.naturalWidth,
                            height: e.currentTarget.naturalHeight
                          });
                        }}
                      />
                      {imageDimensions && (
                        <div className="absolute bottom-0 inset-x-0 bg-black/75 backdrop-blur-xs text-[9px] text-[#C5A059] font-mono font-bold text-center py-0.5 px-1 border-t border-[#C5A059]/30">
                          {imageDimensions.width} × {imageDimensions.height} px
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-2">
                      <User className="w-12 h-12 text-[#C5A059]/60 mb-1" />
                      <span className="text-[10px] text-[#C5A059] font-medium">الشعار الافتراضي</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 flex-1 text-center sm:text-right">
                  <h4 className="font-bold text-sm sm:text-base">تخصيص الصورة الشخصية للبروفايل</h4>
                  <p className="text-xs text-[#8E877D] dark:text-[#9E988D] leading-relaxed">
                    تظهر هذه الصورة في ترويسة الموقع الرئيسية، صفحات السيرة الذاتية، وقسم منشئ الصفحات.
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] transition-colors shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع صورة من جهازك</span>
                    </button>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    {formData.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, avatarUrl: '' }));
                          notify('تمت إزالة الصورة واستعادة الشعار الفني', 'info');
                        }}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>إزالة الصورة</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Direct Image URL input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#8E877D] dark:text-[#9E988D]">
                  أو أدخل رابط صورة مباشر (URL):
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.avatarUrl || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                    placeholder="https://example.com/my-photo.jpg"
                    className={`flex-1 px-3.5 py-2 rounded-xl border text-xs font-mono outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                    }`}
                  />
                  {formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatarUrl: '' }))}
                      className="px-2.5 py-1 text-xs text-[#8E877D] hover:text-rose-500"
                    >
                      مسح
                    </button>
                  )}
                </div>
              </div>

              {/* Choose from Media Library Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#8E877D] dark:text-[#9E988D]">
                  أو اختر من مكتبة الوسائط الحالية:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {mediaList.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, avatarUrl: item.url }));
                        notify(`تم اختيار "${item.name}" كصورة شخصية`);
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                        formData.avatarUrl === item.url 
                          ? 'border-[#C5A059] ring-2 ring-[#C5A059]/50 scale-105' 
                          : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      {formData.avatarUrl === item.url && (
                        <div className="absolute inset-0 bg-[#C5A059]/30 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white bg-[#C5A059] rounded-full p-0.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar Size & Positioning Controls */}
              <div className={`p-4 rounded-2xl border space-y-4 ${
                theme === 'dark' ? 'bg-[#141312] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
              }`}>
                <h5 className="font-bold text-xs sm:text-sm text-[#C5A059] flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  <span>التحكم في حجم وموضع وإطار الصورة الشخصية</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Size Control */}
                  <div>
                    <label className="block font-semibold mb-1 text-[#8E877D]">حجم الصورة في الهيرو:</label>
                    <select
                      value={formData.avatarSize || 'md'}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatarSize: e.target.value as any }))}
                      className={`w-full px-3 py-2 rounded-xl border outline-none ${
                        theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-white border-[#E5E0D8] text-[#121212]'
                      }`}
                    >
                      <option value="sm">صغير (Compact)</option>
                      <option value="md">متوسط (Standard - افتراضي)</option>
                      <option value="lg">كبير (Prominent)</option>
                      <option value="xl">كبير جداً (Maximum)</option>
                    </select>
                  </div>

                  {/* Shape Control */}
                  <div>
                    <label className="block font-semibold mb-1 text-[#8E877D]">شكل الإطار:</label>
                    <select
                      value={formData.avatarShape || 'circle'}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatarShape: e.target.value as any }))}
                      className={`w-full px-3 py-2 rounded-xl border outline-none ${
                        theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-white border-[#E5E0D8] text-[#121212]'
                      }`}
                    >
                      <option value="circle">دائري بالكامل (Circle)</option>
                      <option value="rounded">زوايا مستديرة (Rounded)</option>
                      <option value="square">مربع هندسي (Square)</option>
                    </select>
                  </div>

                  {/* Object Fit */}
                  <div>
                    <label className="block font-semibold mb-1 text-[#8E877D]">طريقة ملاءمة الصورة داخل الإطار:</label>
                    <select
                      value={formData.avatarFit || 'cover'}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatarFit: e.target.value as any }))}
                      className={`w-full px-3 py-2 rounded-xl border outline-none ${
                        theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-white border-[#E5E0D8] text-[#121212]'
                      }`}
                    >
                      <option value="cover">تغطية كاملة (Cover - ملء الإطار)</option>
                      <option value="contain">احتواء كامل (Contain - بدون قص)</option>
                    </select>
                  </div>

                  {/* Object Position (Vertical) */}
                  <div>
                    <label className="block font-semibold mb-1 text-[#8E877D]">الموضع الرأسي (Vertical):</label>
                    <select
                      value={formData.avatarPosition || 'center'}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatarPosition: e.target.value as any }))}
                      className={`w-full px-3 py-2 rounded-xl border outline-none ${
                        theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-white border-[#E5E0D8] text-[#121212]'
                      }`}
                    >
                      <option value="center">الوسط (Center)</option>
                      <option value="top">الأعلى (Top)</option>
                      <option value="bottom">الأسفل (Bottom)</option>
                    </select>
                  </div>

                  {/* Object Alignment (Horizontal) */}
                  <div>
                    <label className="block font-semibold mb-1 text-[#8E877D]">محاذاة الصورة (أفقي):</label>
                    <select
                      value={formData.avatarAlign || 'center'}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatarAlign: e.target.value as any }))}
                      className={`w-full px-3 py-2 rounded-xl border outline-none ${
                        theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-white border-[#E5E0D8] text-[#121212]'
                      }`}
                    >
                      <option value="right">يمين (Right)</option>
                      <option value="center">وسط (Center)</option>
                      <option value="left">يسار (Left)</option>
                    </select>
                  </div>

                  {/* Zoom Control */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-semibold text-[#8E877D]">تخصيص تكبير الصورة (Zoom):</label>
                      <span className="font-mono text-xs text-[#C5A059] font-bold">{formData.avatarZoom ?? 100}%</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="200"
                      step="5"
                      value={formData.avatarZoom ?? 100}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatarZoom: Number(e.target.value) }))}
                      className="w-full accent-[#C5A059] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Live Preview Display Box */}
                <div className="mt-4 pt-4 border-t border-[#C5A059]/20 flex items-center justify-between gap-4 bg-black/10 dark:bg-white/5 p-3 rounded-xl">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#C5A059] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>معاينة مباشرة للتنسيق الحالي في البورتفوليو:</span>
                    </span>
                    <span className="text-[10px] text-[#8E877D] block leading-relaxed">
                      الحجم: <strong className="text-[#C5A059]">{formData.avatarSize === 'sm' ? 'صغير (Compact)' : formData.avatarSize === 'lg' ? 'كبير (Prominent)' : formData.avatarSize === 'xl' ? 'كبير جداً (Maximum)' : 'متوسط (Standard)'}</strong> | 
                      الإطار: <strong className="text-[#C5A059]">{formData.avatarShape === 'square' ? 'مربع' : formData.avatarShape === 'rounded' ? 'زوايا مستديرة' : 'دائري'}</strong>
                      {imageDimensions && (
                        <>
                          <br />
                          أبعاد الصورة الأصلية: <span className="font-mono font-bold text-amber-500">{imageDimensions.width} × {imageDimensions.height} بكسل (px)</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className={`relative w-16 h-16 bg-[#1A1917] border-2 border-[#C5A059]/70 overflow-hidden flex items-center justify-center shrink-0 shadow-md ${
                    formData.avatarShape === 'square' ? 'rounded-lg' :
                    formData.avatarShape === 'rounded' ? 'rounded-xl' : 'rounded-full'
                  }`}>
                    {formData.avatarUrl ? (
                      <img 
                        src={formData.avatarUrl} 
                        alt="Live preview" 
                        style={{
                          transform: `scale(${(formData.avatarZoom ?? 100) / 100})`,
                          transformOrigin: `${formData.avatarAlign || 'center'} ${formData.avatarPosition || 'center'}`,
                          objectPosition: `${formData.avatarAlign || 'center'} ${formData.avatarPosition || 'center'}`,
                          filter: (() => {
                            const b = formData.avatarBrightness ?? 100;
                            const c = formData.avatarContrast ?? 100;
                            const s = formData.avatarSaturation ?? 100;
                            const rawBlur = formData.avatarBlur ?? 0;
                            const blurPx = rawBlur <= 8 && rawBlur > 0 ? (rawBlur * 0.15) : (rawBlur * 0.015);
                            let str = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
                            if (blurPx > 0) str += ` blur(${blurPx.toFixed(3)}px)`;
                            if (formData.avatarFilter === 'cinematic_gold') str += ` sepia(25%) hue-rotate(-10deg) saturate(120%)`;
                            else if (formData.avatarFilter === 'warm') str += ` sepia(30%) saturate(110%)`;
                            else if (formData.avatarFilter === 'cool') str += ` hue-rotate(180deg) saturate(90%)`;
                            else if (formData.avatarFilter === 'bw') str += ` grayscale(100%) contrast(110%)`;
                            else if (formData.avatarFilter === 'vintage') str += ` sepia(50%) contrast(90%) brightness(105%)`;
                            return str;
                          })()
                        }}
                        className={`w-full h-full ${formData.avatarFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                      />
                    ) : (
                      <User className="w-8 h-8 text-[#C5A059]/60" />
                    )}
                    {imageDimensions && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/85 backdrop-blur-xs text-[7px] text-[#C5A059] font-mono font-bold text-center py-0.5">
                        {imageDimensions.width}px
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Advanced Visual Image Editing Studio */}
              <div className={`p-4 rounded-2xl border space-y-4 ${
                theme === 'dark' ? 'bg-[#141312] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
              }`}>
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs sm:text-sm text-[#C5A059] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>أدوات تعديل وتحسين الصورة (Brightness, Contrast, Skin Smoothing & Filters)</span>
                  </h5>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      avatarBrightness: 100,
                      avatarContrast: 100,
                      avatarSaturation: 100,
                      avatarBlur: 0,
                      avatarFilter: 'normal'
                    }))}
                    className="text-[11px] text-[#8E877D] hover:text-[#C5A059] underline transition-colors"
                  >
                    إعادة ضبط الإعدادات
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Brightness */}
                  <div className="space-y-1.5 p-3 rounded-xl border border-[#C5A059]/20 bg-[#1A1917]/40">
                    <div className="flex justify-between text-[#8E877D] font-semibold">
                      <span>السطوع (Brightness)</span>
                      <span className="font-mono text-[#C5A059] font-bold">{formData.avatarBrightness ?? 100}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatarBrightness: Math.max(50, (prev.avatarBrightness ?? 100) - 1) }))}
                        className="px-2 py-0.5 rounded border border-[#C5A059]/30 text-[10px] font-mono hover:bg-[#C5A059]/20 text-[#C5A059]"
                        title="-1%"
                      >
                        -1%
                      </button>
                      <input 
                        type="range" 
                        min="50" 
                        max="150" 
                        step="1"
                        value={formData.avatarBrightness ?? 100}
                        onChange={(e) => setFormData(prev => ({ ...prev, avatarBrightness: Number(e.target.value) }))}
                        className="w-full accent-[#C5A059] cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatarBrightness: Math.min(150, (prev.avatarBrightness ?? 100) + 1) }))}
                        className="px-2 py-0.5 rounded border border-[#C5A059]/30 text-[10px] font-mono hover:bg-[#C5A059]/20 text-[#C5A059]"
                        title="+1%"
                      >
                        +1%
                      </button>
                    </div>
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1.5 p-3 rounded-xl border border-[#C5A059]/20 bg-[#1A1917]/40">
                    <div className="flex justify-between text-[#8E877D] font-semibold">
                      <span>التباين (Contrast)</span>
                      <span className="font-mono text-[#C5A059] font-bold">{formData.avatarContrast ?? 100}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatarContrast: Math.max(50, (prev.avatarContrast ?? 100) - 1) }))}
                        className="px-2 py-0.5 rounded border border-[#C5A059]/30 text-[10px] font-mono hover:bg-[#C5A059]/20 text-[#C5A059]"
                        title="-1%"
                      >
                        -1%
                      </button>
                      <input 
                        type="range" 
                        min="50" 
                        max="150" 
                        step="1"
                        value={formData.avatarContrast ?? 100}
                        onChange={(e) => setFormData(prev => ({ ...prev, avatarContrast: Number(e.target.value) }))}
                        className="w-full accent-[#C5A059] cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatarContrast: Math.min(150, (prev.avatarContrast ?? 100) + 1) }))}
                        className="px-2 py-0.5 rounded border border-[#C5A059]/30 text-[10px] font-mono hover:bg-[#C5A059]/20 text-[#C5A059]"
                        title="+1%"
                      >
                        +1%
                      </button>
                    </div>
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1.5 p-3 rounded-xl border border-[#C5A059]/20 bg-[#1A1917]/40">
                    <div className="flex justify-between text-[#8E877D] font-semibold">
                      <span>تشبع الألوان (Saturation)</span>
                      <span className="font-mono text-[#C5A059] font-bold">{formData.avatarSaturation ?? 100}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatarSaturation: Math.max(0, (prev.avatarSaturation ?? 100) - 1) }))}
                        className="px-2 py-0.5 rounded border border-[#C5A059]/30 text-[10px] font-mono hover:bg-[#C5A059]/20 text-[#C5A059]"
                        title="-1%"
                      >
                        -1%
                      </button>
                      <input 
                        type="range" 
                        min="0" 
                        max="200" 
                        step="1"
                        value={formData.avatarSaturation ?? 100}
                        onChange={(e) => setFormData(prev => ({ ...prev, avatarSaturation: Number(e.target.value) }))}
                        className="w-full accent-[#C5A059] cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatarSaturation: Math.min(200, (prev.avatarSaturation ?? 100) + 1) }))}
                        className="px-2 py-0.5 rounded border border-[#C5A059]/30 text-[10px] font-mono hover:bg-[#C5A059]/20 text-[#C5A059]"
                        title="+1%"
                      >
                        +1%
                      </button>
                    </div>
                  </div>

                  {/* Skin Smoothing / Soft Focus - Strict 1% Micro-Step (0% to 100%) */}
                  <div className="space-y-1.5 p-3 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/10">
                    <div className="flex justify-between text-[#DFCA9B] font-bold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>تنعيم البشرة وتحسين النعومة (Skin Smoothing)</span>
                      </span>
                      <span className="font-mono text-[#C5A059] font-extrabold text-sm">
                        {formData.avatarBlur ?? 0}% <span className="text-[10px] font-normal text-[#8E877D]">({(((formData.avatarBlur ?? 0) <= 8 && (formData.avatarBlur ?? 0) > 0 ? (formData.avatarBlur ?? 0) * 0.15 : (formData.avatarBlur ?? 0) * 0.015)).toFixed(2)}px)</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatarBlur: Math.max(0, (prev.avatarBlur ?? 0) - 1) }))}
                        className="px-2.5 py-1 rounded-lg border border-[#C5A059]/40 bg-[#1A1917] text-xs font-mono font-bold hover:bg-[#C5A059] hover:text-[#121212] text-[#C5A059] transition-all"
                        title="إنقاص بنسبة 1% (-1%)"
                      >
                        -1%
                      </button>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="1"
                        value={formData.avatarBlur ?? 0}
                        onChange={(e) => setFormData(prev => ({ ...prev, avatarBlur: Number(e.target.value) }))}
                        className="w-full accent-[#C5A059] cursor-pointer h-2 bg-[#2E2B26] rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatarBlur: Math.min(100, (prev.avatarBlur ?? 0) + 1) }))}
                        className="px-2.5 py-1 rounded-lg border border-[#C5A059]/40 bg-[#1A1917] text-xs font-mono font-bold hover:bg-[#C5A059] hover:text-[#121212] text-[#C5A059] transition-all"
                        title="زيادة بنسبة 1% (+1%)"
                      >
                        +1%
                      </button>
                    </div>
                    <div className="flex justify-between text-[10px] text-[#8E877D] pt-0.5">
                      <span>طبيعي بدون تنعيم (0%)</span>
                      <span>نعومة خفيفة وطبيعية (15-25%)</span>
                      <span>تنعيم كامل (100%)</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                      {[
                        { label: 'إلغاء (0%)', val: 0 },
                        { label: 'خفيف (15%)', val: 15 },
                        { label: 'متوازن (30%)', val: 30 },
                        { label: 'سينمائي (50%)', val: 50 },
                        { label: 'أقصى (100%)', val: 100 }
                      ].map((chip) => (
                        <button
                          key={chip.val}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, avatarBlur: chip.val }))}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                            (formData.avatarBlur ?? 0) === chip.val
                              ? 'bg-[#C5A059] text-[#121212] border-[#C5A059] font-bold'
                              : 'border-[#C5A059]/20 text-[#DFCA9B] hover:bg-[#C5A059]/20'
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color Filters Presets */}
                <div className="pt-2">
                  <label className="block font-semibold mb-2 text-[#8E877D]">مرشحات الألوان الأساسية (Color Filters):</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'normal', name: 'عادي (Normal)', desc: 'الأصلية بدون تأثير' },
                      { id: 'cinematic_gold', name: 'ذهبي سينمائي (Cinematic)', desc: 'تناسق مع هوية الموقع' },
                      { id: 'warm', name: 'دافئ (Warm)', desc: 'لمسة دافئة وناعمة' },
                      { id: 'cool', name: 'بارد (Cool)', desc: 'نغمات احترافية هادئة' },
                      { id: 'vintage', name: 'كلاسيكي (Vintage)', desc: 'طابع فني قديم راقي' },
                      { id: 'bw', name: 'أبيض وأسود (B&W)', desc: 'أناقة الأحادية الفنية' },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, avatarFilter: filter.id as any }))}
                        className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                          (formData.avatarFilter || 'normal') === filter.id
                            ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-sm'
                            : theme === 'dark' ? 'border-[#2E2B26] bg-[#1A1917]/50 hover:bg-[#1A1917]' : 'border-[#E5E0D8] bg-white hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <span className="font-bold text-[11px] text-[#C5A059]">{filter.name}</span>
                        <span className="text-[9px] text-[#8E877D] mt-0.5">{filter.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">الاسم الكامل (عربي)</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    value={formData.englishName}
                    onChange={(e) => setFormData(prev => ({ ...prev, englishName: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">المسمى المهني والتخصص</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">النبذة الموجزة (Hero Bio)</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                  }`}
                />
              </div>

              <div>
                <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">النبذة الشاملة والمسيرة المهنية</label>
                <textarea
                  rows={3}
                  value={formData.longBio}
                  onChange={(e) => setFormData(prev => ({ ...prev, longBio: e.target.value }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">الموقع الجغرافي</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">اقتباس ملهم (Quote)</label>
                  <input
                    type="text"
                    value={formData.quote}
                    onChange={(e) => setFormData(prev => ({ ...prev, quote: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">البريد الإلكتروني الرسمي</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">رقم الواتساب (بدون +)</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">رابط GitHub</label>
                <input
                  type="url"
                  value={formData.socials.github || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    socials: { ...prev.socials, github: e.target.value } 
                  }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                  }`}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">رابط LinkedIn</label>
                  <input
                    type="url"
                    value={formData.socials.linkedin || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socials: { ...prev.socials, linkedin: e.target.value } 
                    }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                    }`}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">رابط X (تويتر)</label>
                  <input
                    type="url"
                    value={formData.socials.x || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socials: { ...prev.socials, x: e.target.value } 
                    }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                    }`}
                    placeholder="https://x.com/username"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">رابط فيسبوك (Facebook)</label>
                <input
                  type="url"
                  value={formData.socials.facebook || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    socials: { ...prev.socials, facebook: e.target.value } 
                  }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                  }`}
                  placeholder="https://facebook.com/profile"
                />
              </div>

              <div>
                <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">رابط يوتيوب (YouTube)</label>
                <input
                  type="url"
                  value={formData.socials.youtube || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    socials: { ...prev.socials, youtube: e.target.value } 
                  }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                  }`}
                  placeholder="https://youtube.com/@channel"
                />
              </div>

              <div>
                <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">رابط تيك توك (TikTok)</label>
                <input
                  type="url"
                  value={formData.socials.tiktok || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    socials: { ...prev.socials, tiktok: e.target.value } 
                  }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                  }`}
                  placeholder="https://tiktok.com/@username"
                />
              </div>

              <div>
                <label className="block font-bold text-[#8E877D] dark:text-[#9E988D] mb-1">رابط سناب شات (Snapchat)</label>
                <input
                  type="url"
                  value={formData.socials.snapchat || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    socials: { ...prev.socials, snapchat: e.target.value } 
                  }))}
                  className={`w-full px-3.5 py-2.5 rounded-xl border outline-none ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                  }`}
                  placeholder="https://snapchat.com/add/username"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`flex items-center justify-between px-6 py-4 border-t shrink-0 ${
          theme === 'dark' ? 'border-[#282622] bg-[#141312]' : 'border-[#E5E0D8] bg-[#FAF8F5]'
        }`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              theme === 'dark' ? 'border-[#2E2B26] text-[#C7C1B7] hover:bg-[#1A1917]' : 'border-[#E5E0D8] text-[#5A554E] hover:bg-[#F2EFE9]'
            }`}
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] shadow-md transition-all"
          >
            <Check className="w-4 h-4" />
            <span>حفظ التغييرات وتطبيقها</span>
          </button>
        </div>
      </div>
    </div>
  );
};
