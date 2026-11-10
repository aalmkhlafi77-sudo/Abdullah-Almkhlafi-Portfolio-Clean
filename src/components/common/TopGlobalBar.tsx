import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Globe, 
  Layout, 
  Palette, 
  Image as ImageIcon, 
  RotateCcw, 
  RotateCw,
  Download, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Save, 
  Send,
  User,
  Settings,
  Lock,
  Unlock,
  Sparkles,
  Sliders,
  FileText,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit3
} from 'lucide-react';

export const TopGlobalBar: React.FC = () => {
  const { 
    profile,
    theme, 
    toggleTheme, 
    viewMode, 
    requestViewMode,
    isAuthenticated,
    logout,
    setShowLoginModal,
    openSettingsModal,
    setShowProfileModal,
    setShowResumeModal,
    draftStatus, 
    saveDraft, 
    publishChanges, 
    resetToDefaults, 
    restoreDraft,
    exportBackup, 
    importBackup,
    notify,
    isLiveEditMode,
    setIsLiveEditMode,
    setStudioTab
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // If visitor is NOT authenticated, NEVER show administrative top bar
  if (!isAuthenticated) {
    return null;
  }

  const handleSaveDraftClick = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await saveDraft();
    } finally {
      setTimeout(() => setIsSaving(false), 300);
    }
  };

  const handlePublishClick = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
      await publishChanges();
    } finally {
      setTimeout(() => setIsPublishing(false), 300);
    }
  };

  const handleUndo = () => {
    const success = restoreDraft();
    if (success) {
      notify('تم التراجع إلى آخر نسخة محفوظة', 'info');
    } else {
      notify('لا توجد نسخة سابقة للتراجع إليها', 'warning');
    }
  };

  const handleRedo = () => {
    notify('تم تحديث التغييرات الأخيرة', 'info');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        await importBackup(content);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div 
      id="top-global-bar"
      className="sticky top-0 z-50 w-full transition-all duration-200 border-b border-[#C5A059]/30 bg-[#141414]/95 backdrop-blur-md text-white font-sans"
      dir="rtl"
    >
      {/* Collapsed Bar State */}
      {isCollapsed ? (
        <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-[#C5A059]">لوحة الإدارة نشطة</span>
            <span className="text-[10px] text-white/50">
              ({draftStatus === 'published' ? 'منشورة' : draftStatus === 'saved' ? 'مسودة محفوظة' : 'تعديلات جديدة'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLiveEditMode(!isLiveEditMode)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                isLiveEditMode ? 'bg-[#C5A059] text-black' : 'bg-white/10 text-white/70'
              }`}
            >
              التحرير: {isLiveEditMode ? 'مفعل' : 'معطل'}
            </button>

            <button
              type="button"
              onClick={handlePublishClick}
              disabled={isPublishing}
              className="px-2.5 py-0.5 rounded bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-[11px]"
            >
              {isPublishing ? 'جارٍ النشر...' : 'نشر'}
            </button>

            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="p-1 text-white/60 hover:text-white rounded transition-colors flex items-center gap-1 text-[11px]"
              title="توسيع شريط الإدارة"
            >
              <span>توسيع</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Full Compact Admin Bar */
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Section 1: Navigation & Main Admin Hubs */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {/* Control Center */}
            <button
              id="global-control-center-btn"
              onClick={() => openSettingsModal('profile')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#C5A059] border border-[#C5A059]/30 font-bold transition-all"
              title="لوحة التحكم والإعدادات الشاملة"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>لوحة التحكم</span>
            </button>

            {/* Page Builder Mode */}
            <button
              id="view-mode-builder-btn"
              onClick={() => requestViewMode('builder')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'builder'
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layout className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>منشئ الصفحات</span>
            </button>

            {/* Content Studio Mode */}
            <button
              id="view-mode-studio-btn"
              onClick={() => requestViewMode('studio')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                viewMode === 'studio'
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>استوديو المحتوى</span>
            </button>

            {/* Media & Image Library Trigger */}
            <button
              id="global-media-library-btn"
              type="button"
              onClick={() => {
                setStudioTab('media_library');
                requestViewMode('studio');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
              title="مكتبة الصور والوسائط"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="hidden sm:inline">مكتبة الصور</span>
            </button>

            {/* Live Contextual Editing Toggle Button */}
            <button
              type="button"
              onClick={() => setIsLiveEditMode(!isLiveEditMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all border ${
                isLiveEditMode
                  ? 'bg-[#C5A059] text-black border-[#C5A059] shadow-sm'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
              }`}
              title="تفعيل وضع التحرير المباشر فوق عناصر الصفحة"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>وضع التحرير {isLiveEditMode ? 'مفعل' : 'معطل'}</span>
            </button>
          </div>

          {/* Section 2: Undo, Redo, Draft Status & Saving */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Undo / Redo */}
            <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-0.5 border border-white/10">
              <button
                type="button"
                onClick={handleUndo}
                className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded"
                title="تراجع (Undo)"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded"
                title="إعادة (Redo)"
              >
                <RotateCw className="w-3 h-3" />
              </button>
            </div>

            {/* Save Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px]">
              {draftStatus === 'published' ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-white/80">الموقع منشور</span>
                </>
              ) : draftStatus === 'saved' ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-[#C5A059]" />
                  <span className="text-[#C5A059]">المسودة محفوظة</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span className="text-amber-400">تعديلات غير محفوظة</span>
                </>
              )}
            </div>

            {/* Save Draft Button */}
            <button
              type="button"
              onClick={handleSaveDraftClick}
              disabled={isSaving}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all"
              title="حفظ المسودة"
            >
              <Save className="w-3 h-3 text-[#C5A059]" />
              <span className="hidden sm:inline">{isSaving ? 'جارٍ الحفظ...' : 'حفظ مسودة'}</span>
            </button>

            {/* Preview (Public Switch) */}
            <button
              type="button"
              onClick={() => requestViewMode('public')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'public'
                  ? 'bg-white/10 text-[#C5A059]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
              title="معاينة الموقع للزائر"
            >
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">المعاينة</span>
            </button>

            {/* Publish Button */}
            <button
              type="button"
              onClick={handlePublishClick}
              disabled={isPublishing}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-black text-xs font-bold shadow transition-all"
              title="نشر فوري لكافة التعديلات إلى السحابة والموقع الحي"
            >
              {isPublishing ? (
                <Sparkles className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
              <span>{isPublishing ? 'جارٍ النشر...' : 'نشر'}</span>
            </button>

            {/* Backup / Export */}
            <button
              id="top-bar-export-backup-btn"
              type="button"
              onClick={exportBackup}
              className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="تصدير نسخة احتياطية (JSON)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Backup / Import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              id="top-bar-import-backup-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="استيراد نسخة احتياطية (JSON)"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              title="تسجيل الخروج"
            >
              <Unlock className="w-3.5 h-3.5" />
            </button>

            {/* Collapse Bar Button */}
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="طي شريط الإدارة"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* In-app Reset Confirmation Modal */}
      {showResetModal && (
        <div 
          className="fixed inset-0 z-[99999] overflow-y-auto p-4 flex items-center justify-center bg-black/85 backdrop-blur-md"
          onClick={() => setShowResetModal(false)}
        >
          <div 
            className="w-full max-w-sm p-6 rounded-2xl bg-[#1A1A1A] border border-[#C5A059]/30 text-white shadow-2xl text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3 text-[#C5A059]">
              <RotateCcw className="w-5 h-5" />
              <h3 className="font-bold text-base">استعادة البيانات الافتراضية</h3>
            </div>
            <p className="text-xs leading-relaxed text-white/70 mb-6">
              هل أنت متأكد من استعادة كافة بيانات المنصة والخدمات إلى حالتها الأصلية؟
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-white/10 text-white/70 hover:bg-white/5"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  void resetToDefaults();
                  setShowResetModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-black hover:bg-[#D4AF37]"
              >
                تأكيد الاستعادة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
