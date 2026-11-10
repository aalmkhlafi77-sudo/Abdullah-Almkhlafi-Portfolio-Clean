import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ShowcaseAppItem } from '../../types';
import { optimizeImage } from '../../utils/imageOptimizer';
import * as Icons from 'lucide-react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  ExternalLink, 
  Image as ImageIcon, 
  Check, 
  Sparkles, 
  Layers, 
  Globe, 
  Smartphone, 
  LayoutGrid, 
  AppWindow,
  Eye,
  Sliders,
  Lock,
  KeyRound
} from 'lucide-react';

const COMMON_APP_ICONS = [
  'AppWindow', 'Globe', 'Smartphone', 'Brain', 'BarChart3', 'Sparkles', 
  'Layers', 'Code2', 'Cpu', 'Database', 'ShieldCheck', 'Cloud', 
  'Terminal', 'Compass', 'Rocket', 'Zap', 'Bot', 'Wrench'
];

export const ShowcaseManageModal: React.FC = () => {
  const { 
    showShowcaseModal, 
    setShowShowcaseModal, 
    showcaseApps, 
    showcaseBarConfig, 
    updateShowcaseBarConfig, 
    updateShowcaseApp, 
    addShowcaseApp, 
    deleteShowcaseApp, 
    notify,
    theme,
    isAuthenticated,
    setShowLoginModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'apps' | 'settings'>('apps');
  const [editingApp, setEditingApp] = useState<ShowcaseAppItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form states
  const [appName, setAppName] = useState('');
  const [appCategory, setAppCategory] = useState('');
  const [appDesc, setAppDesc] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [appLogoUrl, setAppLogoUrl] = useState('');
  const [appIconName, setAppIconName] = useState('AppWindow');
  const [appStatus, setAppStatus] = useState<'live' | 'beta' | 'in_development'>('live');
  const [appLogoBg, setAppLogoBg] = useState('');
  const [appTagsString, setAppTagsString] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!showShowcaseModal) return null;

  if (!isAuthenticated) {
    return (
      <div 
        className="fixed inset-0 z-[99999] overflow-y-auto p-4 flex min-h-screen items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in"
        onClick={() => setShowShowcaseModal(false)}
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
            <h3 className="text-lg sm:text-xl font-bold font-serif-display text-[#C5A059]">إدارة المنصات والتطبيقات محمية</h3>
            <p className="text-xs text-[#8E877D] mt-2 leading-relaxed">
              إضافة وتعديل تطبيقات المعرض الرقمي وشعاراتها مقتصر على مدير الموقع. يرجى تسجيل الدخول بحساب المسؤول أولاً.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => {
                setShowShowcaseModal(false);
                setShowLoginModal(true);
              }}
              className="w-full py-3 rounded-2xl bg-[#C5A059] hover:bg-[#DFCA9B] text-[#121212] font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <KeyRound className="w-4 h-4" />
              <span>تسجيل الدخول كمسؤول الآن</span>
            </button>
            <button
              type="button"
              onClick={() => setShowShowcaseModal(false)}
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

  const startAddNew = () => {
    setEditingApp(null);
    setAppName('');
    setAppCategory('تطبيق ويب');
    setAppDesc('');
    setAppUrl('');
    setAppLogoUrl('');
    setAppIconName('AppWindow');
    setAppStatus('live');
    setAppLogoBg('');
    setAppTagsString('React, Tailwind');
    setIsAddingNew(true);
  };

  const startEditApp = (app: ShowcaseAppItem) => {
    setEditingApp(app);
    setAppName(app.name);
    setAppCategory(app.category || 'تطبيق رقمي');
    setAppDesc(app.description || '');
    setAppUrl(app.url || '');
    setAppLogoUrl(app.logoUrl || '');
    setAppIconName(app.iconName || 'AppWindow');
    setAppStatus(app.status || 'live');
    setAppLogoBg(app.logoBgColor || '');
    setAppTagsString(app.tags ? app.tags.join(', ') : '');
    setIsAddingNew(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify('يرجى رفع ملف صورة بصيغة PNG أو SVG أو WebP أو JPG', 'warning');
      return;
    }

    try {
      const optimized = await optimizeImage(file, 256, 256, 0.85);
      setAppLogoUrl(optimized);
      notify('تم تحميل الشعار وضغطه بحجم خفيف جداً!');
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAppLogoUrl(event.target.result as string);
          notify('تم تحميل الشعار بنجاح! يدعم الشفافية.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim()) {
      notify('يرجى إدخال اسم التطبيق أو الموقع', 'warning');
      return;
    }

    const tags = appTagsString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingApp) {
      updateShowcaseApp(editingApp.id, {
        name: appName.trim(),
        category: appCategory.trim(),
        description: appDesc.trim(),
        url: appUrl.trim() || undefined,
        logoUrl: appLogoUrl.trim() || undefined,
        iconName: appIconName,
        status: appStatus,
        logoBgColor: appLogoBg || undefined,
        tags
      });
      setEditingApp(null);
    } else {
      const newApp: ShowcaseAppItem = {
        id: 'app_' + Date.now(),
        name: appName.trim(),
        category: appCategory.trim() || 'تطبيق ويب',
        description: appDesc.trim(),
        url: appUrl.trim() || undefined,
        logoUrl: appLogoUrl.trim() || undefined,
        iconName: appIconName,
        status: appStatus,
        logoBgColor: appLogoBg || undefined,
        tags,
        order: showcaseApps.length + 1
      };
      addShowcaseApp(newApp);
      setIsAddingNew(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
          theme === 'dark' 
            ? 'bg-[#181715] border-[#2E2B26] text-[#F9F7F2]' 
            : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
        }`}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E5E0D8] dark:border-[#282622] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/30">
              <AppWindow className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif-display">
                إدارة شريط وتطبيقات المعرض الرقمي
              </h2>
              <p className="text-xs text-[#8C867D] dark:text-[#9E988E]">
                إضافة روابط وتطبيقات مع شعارات مفرغة وخلفيات متناسقة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShowcaseModal(false)}
              className="p-2 rounded-xl text-[#8C867D] hover:text-[#121212] dark:hover:text-[#F9F7F2] hover:bg-[#EAE6DF] dark:hover:bg-[#282622] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Subnav */}
        <div className="px-6 py-2.5 border-b border-[#E5E0D8] dark:border-[#282622] bg-[#F2EFE9]/50 dark:bg-[#1E1D1A]/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('apps'); setIsAddingNew(false); setEditingApp(null); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'apps' && !isAddingNew && !editingApp
                  ? 'bg-[#C5A059] text-[#121212]'
                  : 'text-[#8C867D] hover:text-[#121212] dark:hover:text-[#F9F7F2]'
              }`}
            >
              قائمة التطبيقات ({showcaseApps.length})
            </button>
            <button
              onClick={startAddNew}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isAddingNew
                  ? 'bg-[#C5A059] text-[#121212]'
                  : 'text-[#8C867D] hover:text-[#121212] dark:hover:text-[#F9F7F2]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة تطبيق جديد</span>
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setIsAddingNew(false); setEditingApp(null); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#C5A059] text-[#121212]'
                  : 'text-[#8C867D] hover:text-[#121212] dark:hover:text-[#F9F7F2]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>إعدادات الشريط والعنوان</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto max-h-[calc(90vh-140px)]">
          
          {/* TAB 1: ADD / EDIT APP FORM */}
          {(isAddingNew || editingApp) && (
            <form onSubmit={handleSaveApp} className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8] dark:border-[#282622]">
                <h3 className="font-bold text-sm text-[#C5A059] flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  <span>{editingApp ? `تعديل بيانات: ${editingApp.name}` : 'إضافة تطبيق أو موقع جديد إلى المعرض'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setEditingApp(null); }}
                  className="text-xs text-[#8C867D] hover:underline"
                >
                  العودة للقائمة
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* App Name */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#5A554E] dark:text-[#C7C1B7]">
                    اسم التطبيق / الموقع <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="مثال: ركيزة للذكاء الاصطناعي"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E5E0D8] dark:border-[#2E2B26] bg-white dark:bg-[#151412] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#5A554E] dark:text-[#C7C1B7]">
                    التصنيف / نوع المنتج
                  </label>
                  <input
                    type="text"
                    value={appCategory}
                    onChange={(e) => setAppCategory(e.target.value)}
                    placeholder="مثال: منصة ويب سحابية، تطبيق جوال"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E5E0D8] dark:border-[#2E2B26] bg-white dark:bg-[#151412] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Live URL */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#5A554E] dark:text-[#C7C1B7]">
                      الرابط المباشر للتطبيق أو الموقع (اختياري - اتركه فارغاً إذا كان بدون رابط)
                    </label>
                    <div className="flex items-center gap-2">
                      {appUrl && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              if (appUrl.startsWith('http://') || appUrl.startsWith('https://')) {
                                window.open(appUrl, '_blank', 'noopener,noreferrer');
                              } else {
                                window.open('https://' + appUrl, '_blank', 'noopener,noreferrer');
                              }
                            }}
                            className="text-[11px] text-[#C5A059] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>اختبار الرابط</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setAppUrl('')}
                            className="text-[11px] text-red-500 hover:underline"
                          >
                            إزالة الرابط
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={appUrl}
                      onChange={(e) => setAppUrl(e.target.value)}
                      placeholder="https://example.com (أو اتركه فارغاً بدون رابط)"
                      className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl border border-[#E5E0D8] dark:border-[#2E2B26] bg-white dark:bg-[#151412] focus:outline-none focus:border-[#C5A059] font-mono text-left"
                      dir="ltr"
                    />
                    <ExternalLink className="absolute left-3 top-2.5 w-4 h-4 text-[#8C867D]" />
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5 text-[#5A554E] dark:text-[#C7C1B7]">
                    وصف مختصر للمنتج
                  </label>
                  <textarea
                    rows={2}
                    value={appDesc}
                    onChange={(e) => setAppDesc(e.target.value)}
                    placeholder="شرح موجز لأهمية المنصة والميزات التي تقدمها..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E5E0D8] dark:border-[#2E2B26] bg-white dark:bg-[#151412] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                {/* Logo & Icon section */}
                <div className="md:col-span-2 p-4 rounded-2xl border border-[#E5E0D8] dark:border-[#2E2B26] bg-[#F2EFE9]/40 dark:bg-[#151412]/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#121212] dark:text-[#F9F7F2]">
                      شعار وأيقونة المنتج (يدعم رفع شعار مفرغ بدون خلفية)
                    </span>
                    {appLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setAppLogoUrl('')}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        إزالة الشعار والاعتماد على الأيقونة
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Live Preview Container */}
                    <div className="flex flex-col items-center gap-1.5">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center border border-[#C5A059]/40 overflow-hidden shadow-inner relative"
                        style={{
                          backgroundColor: appLogoBg || (theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')
                        }}
                      >
                        {appLogoUrl ? (
                          <img 
                            src={appLogoUrl} 
                            alt="Logo preview" 
                            className="w-12 h-12 object-contain"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          React.createElement((Icons as any)[appIconName] || Icons.AppWindow, {
                            className: 'w-8 h-8 text-[#C5A059]'
                          })
                        )}
                      </div>
                      <span className="text-[10px] text-[#8C867D]">معاينة الحاوية</span>
                    </div>

                    {/* Upload button & URL input */}
                    <div className="flex-1 w-full space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/png,image/svg+xml,image/webp,image/jpeg"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#C5A059] text-[#121212] hover:bg-[#DFCA9B] transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>رفع شعار المنتج (PNG مفرغ / SVG)</span>
                        </button>

                        <span className="text-xs text-[#8C867D]">أو الصق رابط الصورة:</span>
                      </div>

                      <input
                        type="url"
                        value={appLogoUrl}
                        onChange={(e) => setAppLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png (أو اتركه فارغاً لاستخدام أيقونة جاهزة)"
                        className="w-full px-3.5 py-1.5 text-xs rounded-xl border border-[#E5E0D8] dark:border-[#2E2B26] bg-white dark:bg-[#181715] font-mono text-left"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Icon Selector fallback */}
                  {!appLogoUrl && (
                    <div className="pt-3 border-t border-[#E5E0D8] dark:border-[#2E2B26]">
                      <span className="block text-[11px] font-semibold text-[#8C867D] mb-2">
                        أو اختر أيقونة رمزية بديلة:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_APP_ICONS.map((iconName) => {
                          const IconC = (Icons as any)[iconName] || Icons.AppWindow;
                          const isSelected = appIconName === iconName;
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => setAppIconName(iconName)}
                              className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs transition-all ${
                                isSelected
                                  ? 'bg-[#C5A059] text-[#121212] font-bold border-[#C5A059]'
                                  : 'bg-white dark:bg-[#1E1D1A] border-[#E5E0D8] dark:border-[#2E2B26] text-[#5A554E] dark:text-[#C7C1B7]'
                              }`}
                            >
                              <IconC className="w-4 h-4" />
                              <span className="text-[10px] font-mono">{iconName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status & Tags */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#5A554E] dark:text-[#C7C1B7]">
                    حالة المنتج
                  </label>
                  <select
                    value={appStatus}
                    onChange={(e: any) => setAppStatus(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E5E0D8] dark:border-[#2E2B26] bg-white dark:bg-[#151412] focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="live">منصة حية ومباشرة (Live)</option>
                    <option value="beta">إصدار تجريبي (Beta)</option>
                    <option value="in_development">قيد التطوير (In Progress)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#5A554E] dark:text-[#C7C1B7]">
                    التقنيات المستخدمة (مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={appTagsString}
                    onChange={(e) => setAppTagsString(e.target.value)}
                    placeholder="React, Gemini AI, Tailwind, Cloud Run"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E5E0D8] dark:border-[#2E2B26] bg-white dark:bg-[#151412] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Form Action buttons */}
              <div className="pt-4 border-t border-[#E5E0D8] dark:border-[#282622] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setEditingApp(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#E5E0D8] dark:border-[#2E2B26] hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-[#121212] hover:bg-[#DFCA9B] transition-colors shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingApp ? 'حفظ التعديلات' : 'إضافة التطبيق إلى المعرض'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: APPS LIST VIEW */}
          {activeTab === 'apps' && !isAddingNew && !editingApp && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs text-[#8C867D]">
                  جميع التطبيقات والمنصات المعروضة بشريط الصفحة الرئيسية:
                </span>
                <button
                  onClick={startAddNew}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C5A059] text-[#121212] text-xs font-bold hover:bg-[#DFCA9B] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة تطبيق جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {showcaseApps.map((app) => (
                  <div
                    key={app.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-3.5 transition-all ${
                      theme === 'dark' 
                        ? 'bg-[#151412] border-[#2E2B26]' 
                        : 'bg-white border-[#E5E0D8] artistic-shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-[#C5A059]/30 bg-[#C5A059]/10 overflow-hidden">
                        {app.logoUrl ? (
                          <img 
                            src={app.logoUrl} 
                            alt={app.name} 
                            className="w-9 h-9 object-contain"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          React.createElement((Icons as any)[app.iconName || 'AppWindow'] || Icons.AppWindow, {
                            className: 'w-6 h-6 text-[#C5A059]'
                          })
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#121212] dark:text-[#F9F7F2] truncate">
                          {app.name}
                        </h4>
                        <span className="text-[11px] text-[#8C867D] block truncate">
                          {app.category}
                        </span>
                        {app.url ? (
                          <a 
                            href={app.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[10px] text-[#C5A059] hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span className="truncate max-w-[160px]">{app.url}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-[#8C867D] block mt-0.5">
                            بدون رابط خارجي
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEditApp(app)}
                        className="p-2 rounded-lg text-[#8C867D] hover:text-[#C5A059] hover:bg-[#F2EFE9] dark:hover:bg-[#201E1A] transition-colors"
                        title="تعديل التطبيق"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteShowcaseApp(app.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {showcaseApps.length === 0 && (
                <div className="p-8 text-center border border-dashed rounded-2xl">
                  <AppWindow className="w-10 h-10 mx-auto text-[#8C867D] mb-2" />
                  <p className="text-xs text-[#8C867D]">لا توجد تطبيقات في المعرض حالياً.</p>
                  <button
                    onClick={startAddNew}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-[#C5A059] text-[#121212] text-xs font-bold"
                  >
                    أضف أول تطبيق الآن
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BAR SETTINGS VIEW */}
          {activeTab === 'settings' && !isAddingNew && !editingApp && (
            <div className="space-y-5 max-w-xl">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[#5A554E] dark:text-[#C7C1B7]">
                  عنوان شريط التطبيقات
                </label>
                <input
                  type="text"
                  value={showcaseBarConfig.title}
                  onChange={(e) => updateShowcaseBarConfig({ title: e.target.value })}
                  placeholder="تطبيقات ومنصات قمت بتطويرها وإطلاقها"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E5E0D8] dark:border-[#2E2B26] bg-white dark:bg-[#151412] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[#5A554E] dark:text-[#C7C1B7]">
                  الوصف الفرعي للشريط
                </label>
                <input
                  type="text"
                  value={showcaseBarConfig.subtitle || ''}
                  onChange={(e) => updateShowcaseBarConfig({ subtitle: e.target.value })}
                  placeholder="منتجات برمجية وحلول حية تعمل بكفاءة في بيئات الإنتاج"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E5E0D8] dark:border-[#2E2B26] bg-white dark:bg-[#151412] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-[#E5E0D8] dark:border-[#2E2B26] bg-[#F2EFE9]/40 dark:bg-[#151412]/60">
                <div>
                  <span className="text-xs font-bold block text-[#121212] dark:text-[#F9F7F2]">
                    تفعيل وظهور شريط التطبيقات في الموقع
                  </span>
                  <span className="text-[11px] text-[#8C867D]">
                    إظهار أو إخفاء الحاوية المستطيلة للتطبيقات في الصفحة الرئيسية
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showcaseBarConfig.enabled}
                  onChange={(e) => updateShowcaseBarConfig({ enabled: e.target.checked })}
                  className="w-5 h-5 accent-[#C5A059] rounded"
                />
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

