import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { optimizeImage } from '../../utils/imageOptimizer';
import { 
  X, 
  Settings, 
  Sparkles, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Check, 
  Sun, 
  Clock, 
  Zap, 
  Layers, 
  Image as ImageIcon, 
  Cpu, 
  Code2, 
  TrendingUp, 
  Palette,
  KeyRound,
  Download,
  Upload,
  Trees,
  Briefcase,
  User,
  AppWindow,
  Globe,
  Smartphone,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Wand2,
  Sliders,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Lock,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { HeroThemePreset, HeroMotionStyle, ShowcaseAppItem } from '../../types';
import { AnimatedHeroBackground } from '../public/AnimatedHeroBackground';
import { ServicesManageTab } from './ServicesManageTab';
import { ICON_PRESET_COLLECTIONS } from './IconPresets';
import { IconRenderer } from '../ui/IconRenderer';
import { BackupImportCard } from './BackupImportCard';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'profile' | 'hero' | 'showcase' | 'services' | 'icons' | 'security' | 'backup';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, defaultTab }) => {
  const { 
    theme, 
    profile,
    updateProfile,
    heroConfig, 
    updateHeroConfig, 
    resetHeroConfig,
    showcaseApps,
    showcaseBarConfig,
    updateShowcaseBarConfig,
    updateShowcaseApp,
    addShowcaseApp,
    deleteShowcaseApp,
    services,
    applyPresetPackToServices,
    applyIconToTarget,
    adminCredentials, 
    updateAdminCredentials,
    isAuthenticated,
    logout,
    setShowLoginModal,
    exportBackup,
    importBackup,
    previewLegacyMigration,
    mergeLegacyMigration,
    clearLegacyData,
    savePortfolioToServer,
    resetToDefaults,
    settingsModalTab,
    setSettingsModalTab,
    setShowProfileModal,
    notify
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'hero' | 'showcase' | 'services' | 'icons' | 'security' | 'backup'>(() => {
    return defaultTab || settingsModalTab || 'hero';
  });

  React.useEffect(() => {
    if (isOpen) {
      const target = defaultTab || settingsModalTab || 'hero';
      setActiveTab(target);
    }
  }, [isOpen, defaultTab, settingsModalTab]);

  const handleTabChange = (tab: 'profile' | 'hero' | 'showcase' | 'services' | 'icons' | 'security' | 'backup') => {
    setActiveTab(tab);
    setSettingsModalTab(tab);
  };
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({ ...profile });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  React.useEffect(() => {
    setProfileForm({ ...profile });
  }, [profile]);

  // Security form state
  const [usernameInput, setUsernameInput] = useState(adminCredentials.username);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [passwordInput, setPasswordInput] = useState(adminCredentials.password);
  const [confirmPasswordInput, setConfirmPasswordInput] = useState(adminCredentials.password);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [legacyDifferences, setLegacyDifferences] = useState<string[] | null>(null);
  const [isMergingLegacy, setIsMergingLegacy] = useState(false);
  const [secondDeviceVerified, setSecondDeviceVerified] = useState(false);

  // Keep security inputs in sync with adminCredentials
  useEffect(() => {
    if (isOpen) {
      setUsernameInput(adminCredentials.username);
      setCurrentPasswordInput('');
      setPasswordInput('');
      setConfirmPasswordInput('');
    }
  }, [isOpen, adminCredentials.username, adminCredentials.password]);

  // Showcase state
  const [editingApp, setEditingApp] = useState<ShowcaseAppItem | null>(null);
  const [isAddingNewApp, setIsAddingNewApp] = useState(false);
  const [appName, setAppName] = useState('');
  const [appCategory, setAppCategory] = useState('');
  const [appDesc, setAppDesc] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const [appLogoUrl, setAppLogoUrl] = useState('');
  const [appIconName, setAppIconName] = useState('AppWindow');
  const [appStatus, setAppStatus] = useState<'live' | 'beta' | 'in_development'>('live');

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    let finalProfile = { ...profileForm };

    if (finalProfile.logoUrl && finalProfile.logoUrl.startsWith('data:image/') && finalProfile.logoUrl.length > 40000) {
      try {
        finalProfile.logoUrl = await optimizeImage(finalProfile.logoUrl, 400, 400, 0.85, true);
      } catch (err) {
        console.warn('Error compressing logo on save:', err);
      }
    }
    if (finalProfile.avatarUrl && finalProfile.avatarUrl.startsWith('data:image/') && finalProfile.avatarUrl.length > 60000) {
      try {
        finalProfile.avatarUrl = await optimizeImage(finalProfile.avatarUrl, 800, 800, 0.82);
      } catch (err) {
        console.warn('Error compressing avatar on save:', err);
      }
    }

    updateProfile(finalProfile);

    try {
      await savePortfolioToServer({ profileOverride: finalProfile });
      notify('تم حفظ الشعار وبيانات الملف الشخصي ومزامنتها بنجاح!', 'success');
    } catch (err) {
      console.warn('Server profile save failed:', err);
      notify('تعذر حفظ بيانات الملف الشخصي على الخادم', 'warning');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim();
    const cleanPass = passwordInput.trim();
    const cleanConfirm = confirmPasswordInput.trim();

    if (!cleanUser || !currentPasswordInput || !cleanPass) {
      notify('يرجى كتابة اسم مستخدم وكلمة مرور صحيحة وغير فارغة', 'warning');
      return;
    }

    if (cleanPass.length < 12) {
      notify('يجب أن تكون كلمة المرور 12 حرفاً على الأقل', 'warning');
      return;
    }

    if (cleanPass !== cleanConfirm) {
      notify('كلمتا المرور غير متطابقتين، يرجى التأكد من كتابتها بشكل متطابق', 'warning');
      return;
    }

    setIsSavingSecurity(true);
    try {
      await updateAdminCredentials({
        username: cleanUser,
        password: cleanPass
      }, currentPasswordInput);
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const startEditShowcaseApp = (app: ShowcaseAppItem) => {
    setEditingApp(app);
    setAppName(app.name);
    setAppCategory(app.category || 'تطبيق رقمي');
    setAppDesc(app.description || '');
    setAppUrl(app.url || 'https://');
    setAppLogoUrl(app.logoUrl || '');
    setAppIconName(app.iconName || 'AppWindow');
    setAppStatus(app.status || 'live');
    setIsAddingNewApp(false);
  };

  const startAddNewShowcaseApp = () => {
    setEditingApp(null);
    setAppName('');
    setAppCategory('تطبيق ويب');
    setAppDesc('');
    setAppUrl('');
    setAppLogoUrl('');
    setAppIconName('AppWindow');
    setAppStatus('live');
    setIsAddingNewApp(true);
  };

  const handleSaveShowcaseApp = () => {
    if (!appName.trim()) {
      notify('يرجى إدخال اسم التطبيق أو المنصة', 'warning');
      return;
    }

    if (editingApp) {
      updateShowcaseApp(editingApp.id, {
        name: appName.trim(),
        category: appCategory.trim(),
        description: appDesc.trim(),
        url: appUrl.trim() || undefined,
        logoUrl: appLogoUrl.trim() || undefined,
        iconName: appIconName,
        status: appStatus
      });
      notify('تم تحديث بيانات التطبيق بنجاح!');
      setEditingApp(null);
    } else if (isAddingNewApp) {
      addShowcaseApp({
        name: appName.trim(),
        category: appCategory.trim(),
        description: appDesc.trim(),
        url: appUrl.trim() || undefined,
        logoUrl: appLogoUrl.trim() || undefined,
        iconName: appIconName,
        status: appStatus
      });
      notify('تمت إضافة المنصة الجديدة بنجاح!');
      setIsAddingNewApp(false);
    }
  };

  const presetsList: { id: HeroThemePreset; name: string; desc: string; icon: any }[] = [
    { 
      id: 'ai_forest', 
      name: 'غابة الذكاء الاصطناعي والأكواد المضيئة (Cyber AI Forest)', 
      desc: 'جذور ذهبية مشعة، عقد حيوية للأشجار، بطاقات Gemini و OpenAI و GitHub وأكواد عائمة ثلاثية الأبعاد', 
      icon: Trees 
    },
    { 
      id: 'neural_core', 
      name: 'النواة العصبية والذكاء الاصطناعي (Neural Core AI)', 
      desc: 'معالج ذكاء اصطناعي نابض، إشارات كهربائية، أعمدة بيانية ثلاثية الأبعاد وشفرات برمجية', 
      icon: Cpu 
    },
    { 
      id: 'ai_matrix', 
      name: 'الذكاء الاصطناعي والمصفوفة (AI Matrix)', 
      desc: 'شبكات عصبية، عقد متصلة وإضاءة ذكية', 
      icon: Cpu 
    },
    { 
      id: 'tech_entrepreneur', 
      name: 'ريادة الأعمال والتقنية', 
      desc: 'منحنيات نمو استثماري وخطوط هندسية مبتكرة', 
      icon: TrendingUp 
    },
    { 
      id: 'code_software', 
      name: 'هندسة البرمجيات والكود', 
      desc: 'بطاقات أكواد عائمة ومحركات برمجية', 
      icon: Code2 
    },
    { 
      id: 'golden_flow', 
      name: 'التدفق الذهبي الفاخر', 
      desc: 'تموجات حريرية وجزيئات ذهبية دافئة', 
      icon: Sparkles 
    },
    { 
      id: 'cyber_mesh', 
      name: 'شبكة السايبر المتطورة', 
      desc: 'منظور رقمي مستقبلي ومسح خطي', 
      icon: Layers 
    },
    { 
      id: 'custom_image', 
      name: 'صورة مخصصة من الرابط', 
      desc: 'استخدام رابط صورة خارجية من اختيارك', 
      icon: ImageIcon 
    }
  ];

  if (!isOpen) return null;

  // Security Barrier: Only authenticated admins may access the settings and control center
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
            <h3 className="text-lg sm:text-xl font-bold font-serif-display text-[#C5A059]">لوحة التحكم والإعدادات محمية</h3>
            <p className="text-xs text-[#8E877D] mt-2 leading-relaxed">
              هذه الإعدادات مخصصة لمدير الموقع فقط. للوصول إلى أدوات التخصيص، الهوية، الخدمات، المشاهد والأمان، يجب تسجيل الدخول بحساب المسؤول أولاً.
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

  return (
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto p-2 sm:p-4 md:p-6 flex min-h-screen items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="settings-admin-modal"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-5xl my-auto max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden shrink-0 z-10 transition-all duration-300 ${
          theme === 'dark' ? 'bg-[#161513] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212]'
        }`}
      >
        {/* Top Header */}
        <div className={`flex items-center justify-between px-5 sm:px-6 py-4 border-b shrink-0 ${
          theme === 'dark' ? 'border-[#282622] bg-[#121110]' : 'border-[#E5E0D8] bg-[#FAF8F5]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shadow-xs">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg font-serif-display flex items-center gap-2">
                <span>لوحة التحكم والإعدادات المركزية</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 font-sans font-semibold hidden sm:inline">
                  Admin Dashboard
                </span>
              </h3>
              <p className="text-xs text-[#8E877D] dark:text-[#9E988D]">
                إدارة الهوية، أنيميشن الهيرو، المنصات، الخدمات الـ 9، الأيقونات، والأمان بنظام وترتيب منظم
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Authenticated Admin Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>جلسة موثقة ({adminCredentials.username})</span>
            </div>

            {/* Fast Logout Button */}
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all cursor-pointer"
              title="تسجيل الخروج وتأمين لوحة التحكم"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                theme === 'dark' ? 'border-[#2E2B26] text-[#8E877D] hover:text-[#F9F7F2] hover:bg-[#22201D]' : 'border-[#E5E0D8] text-[#5A554E] hover:text-[#121212] hover:bg-[#F2EFE9]'
              }`}
              title="إغلاق لوحة التحكم"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Professional Navigation Header with Dropdown Selector & Category Pills */}
        <div className={`px-4 sm:px-6 py-3 border-b space-y-2.5 shrink-0 ${
          theme === 'dark' ? 'border-[#282622] bg-[#1A1917]' : 'border-[#E5E0D8] bg-[#F4F1EA]'
        }`}>
          {/* Main Section Dropdown Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#C5A059] shrink-0">اختر القسم للتعديل:</span>
              <div className="relative w-full sm:w-80">
                <select
                  id="settings-section-dropdown-selector"
                  value={activeTab === 'backup' ? 'security' : activeTab}
                  onChange={(e) => handleTabChange(e.target.value as any)}
                  className={`w-full appearance-none pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-xs ${
                    theme === 'dark' 
                      ? 'bg-[#121110] border-[#3D382F] text-[#F9F7F2] hover:border-[#C5A059]' 
                      : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] hover:border-[#C5A059]'
                  }`}
                >
                  <option value="profile">👤 1. الهوية والملف الشخصي والسيرة المهنية</option>
                  <option value="hero">🎨 2. أنيميشن وإضاءة مشهد الهيرو</option>
                  <option value="showcase">🚀 3. شريط المنصات والتطبيقات الذكية</option>
                  <option value="services">💼 4. إدارة الخدمات والاستشارات الـ 9</option>
                  <option value="icons">✨ 5. استوديو وباقات الأيقونات المتناسقة</option>
                  <option value="security">🔒 6. الأمان والنسخ الاحتياطي واستعادة المصنع</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#C5A059] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <span className="text-[11px] text-[#8E877D] hidden md:inline">
              مرتبة منطقياً في 6 أقسام رئيسية لمنع التداخل والعشوائية
            </span>
          </div>

          {/* Quick-Jump Category Tab Pills */}
          <div className="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto no-scrollbar pt-1">
            {/* 1. Profile & Bio */}
            <button
              onClick={() => handleTabChange('profile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs'
                  : 'text-[#8E877D] hover:text-[#C5A059] hover:bg-black/10 dark:hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>الهوية والملف</span>
            </button>

            {/* 2. Hero & Animation */}
            <button
              onClick={() => handleTabChange('hero')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeTab === 'hero'
                  ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs'
                  : 'text-[#8E877D] hover:text-[#C5A059] hover:bg-black/10 dark:hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>أنيميشن الهيرو</span>
            </button>

            {/* 3. Showcase Apps */}
            <button
              onClick={() => handleTabChange('showcase')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeTab === 'showcase'
                  ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs'
                  : 'text-[#8E877D] hover:text-[#C5A059] hover:bg-black/10 dark:hover:bg-white/5'
              }`}
            >
              <AppWindow className="w-3.5 h-3.5" />
              <span>شريط المنصات</span>
            </button>

            {/* 4. Services 9 */}
            <button
              onClick={() => handleTabChange('services')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs'
                  : 'text-[#8E877D] hover:text-[#C5A059] hover:bg-black/10 dark:hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>الخدمات الـ 9</span>
            </button>

            {/* 5. Icon Presets Studio */}
            <button
              onClick={() => handleTabChange('icons')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                activeTab === 'icons'
                  ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs'
                  : 'text-[#8E877D] hover:text-[#C5A059] hover:bg-black/10 dark:hover:bg-white/5'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>باقات الأيقونات</span>
            </button>

            {/* 6. Security & Backup */}
            <button
              onClick={() => handleTabChange('security')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                (activeTab === 'security' || activeTab === 'backup')
                  ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs'
                  : 'text-[#8E877D] hover:text-[#C5A059] hover:bg-black/10 dark:hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>الأمان والنسخ</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* ========================================================
              CATEGORY 1: PROFILE & IDENTITY
             ======================================================== */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Photo & Smoothing Quick Banner */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#C5A059] shadow-md shrink-0">
                    <img 
                      src={profile.avatarUrl} 
                      alt={profile.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#C5A059]">استوديو الصورة الشخصية وتنعيم البشرة</h4>
                    <p className="text-xs text-[#8E877D]">تغيير الصورة، ضبط السطوع، التباين وتطبيق فلتر التنعيم الذكي</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-[#121212] hover:bg-[#DFCA9B] transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>فتح استوديو الصورة والتنعيم</span>
                </button>
              </div>

              {/* Brand Logo & Visual Identity Studio */}
              <div className={`p-4 rounded-2xl border ${
                theme === 'dark' ? 'bg-[#141414] border-[#2A2722]' : 'bg-[#F7F5F0] border-[#E8E3DA]'
              } space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#C5A059]/40 bg-[#1A1917] flex items-center justify-center p-1 shadow-sm shrink-0">
                      {profileForm.logoUrl ? (
                        <img 
                          src={profileForm.logoUrl} 
                          alt="Brand Logo" 
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="font-bold text-lg text-[#C5A059]">A</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#C5A059] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>شعار الهوية الرقمية (Brand Logo)</span>
                      </h4>
                      <p className="text-xs text-[#8E877D]">تخصيص شعار الموقع الذي يظهر في الترويسة والتذييل</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#8E877D] hover:text-[#C5A059]">
                      <input 
                        type="checkbox"
                        checked={profileForm.useImageLogo ?? true}
                        onChange={(e) => setProfileForm(p => ({ ...p, useImageLogo: e.target.checked }))}
                        className="rounded border-[#C5A059] text-[#C5A059] focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <span>تفعيل الشعار الصوري</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold">رابط صورة الشعار (Logo URL):</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="مثال: /brand-logo.jpg أو رابط خارجي"
                        value={profileForm.logoUrl || ''}
                        onChange={(e) => setProfileForm(p => ({ ...p, logoUrl: e.target.value }))}
                        className={`flex-1 px-3 py-2 rounded-xl text-xs border outline-none ${
                          theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setProfileForm(p => ({ ...p, logoUrl: '/brand-logo.jpg', useImageLogo: true }))}
                        className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/10 shrink-0"
                        title="استعادة الشعار الرسمي ثلاثي الأبعاد"
                      >
                        الشعار الرسمي
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold">رفع شعار مخصص من جهازك:</label>
                    <label className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[#C5A059]/40 cursor-pointer hover:border-[#C5A059] transition-all text-xs text-[#C5A059] ${
                      theme === 'dark' ? 'bg-[#1A1917]/50' : 'bg-white/50'
                    }`}>
                      <Upload className="w-3.5 h-3.5" />
                      <span>اختيار ملف شعار (PNG / JPG / SVG)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const optimized = await optimizeImage(file, 400, 400, 0.85, true);
                              setProfileForm(p => ({ ...p, logoUrl: optimized, useImageLogo: true }));
                              notify('تم تجهيز وضغط الشعار بنجاح بجودة فائقة!');
                            } catch {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setProfileForm(p => ({ ...p, logoUrl: reader.result as string, useImageLogo: true }));
                                  notify('تم تحميل الشعار بنجاح');
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Logo Height Adjuster */}
                <div className="pt-2 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold">ارتفاع الشعار في الترويسة:</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#C5A059]/20 text-[#C5A059] font-mono font-bold text-[11px]">
                      {profileForm.logoHeight || 38}px
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="24"
                    max="56"
                    step="2"
                    value={profileForm.logoHeight || 38}
                    onChange={(e) => setProfileForm(p => ({ ...p, logoHeight: Number(e.target.value) }))}
                    className="w-48 accent-[#C5A059] cursor-pointer"
                  />
                </div>
              </div>

              {/* Personal Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold">الاسم بالعربية:</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold">الاسم بالإنجليزية:</label>
                  <input
                    type="text"
                    value={profileForm.englishName}
                    onChange={(e) => setProfileForm(p => ({ ...p, englishName: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold">المسمى المهني (العربي):</label>
                  <input
                    type="text"
                    value={profileForm.title}
                    onChange={(e) => setProfileForm(p => ({ ...p, title: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold">المسمى المهني (الإنجليزي):</label>
                  <input
                    type="text"
                    value={profileForm.englishTitle}
                    onChange={(e) => setProfileForm(p => ({ ...p, englishTitle: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>البريد الإلكتروني:</span>
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>رقم الهاتف / واتساب:</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                    }`}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>الموقع الجغرافي والإقامة:</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm(p => ({ ...p, location: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                    }`}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-semibold">النبذة التعريفية السريعة (الهيرو):</label>
                  <textarea
                    rows={2}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                    }`}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-semibold">النبذة المفصلة (قسم عني):</label>
                  <textarea
                    rows={4}
                    value={profileForm.aboutLong}
                    onChange={(e) => setProfileForm(p => ({ ...p, aboutLong: e.target.value }))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                    }`}
                  />
                </div>

              </div>

              {/* Social Links Sub-Grid */}
              <div className="space-y-3 pt-3 border-t border-[#C5A059]/20">
                <h4 className="font-bold text-xs text-[#C5A059] uppercase tracking-wider">
                  روابط التواصل والشبكات المهنية:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#8E877D]">رابط LinkedIn:</label>
                    <input
                      type="url"
                      value={profileForm.socials.linkedin || ''}
                      onChange={(e) => setProfileForm(p => ({ ...p, socials: { ...p.socials, linkedin: e.target.value } }))}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                        theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#8E877D]">رابط GitHub:</label>
                    <input
                      type="url"
                      value={profileForm.socials.github || ''}
                      onChange={(e) => setProfileForm(p => ({ ...p, socials: { ...p.socials, github: e.target.value } }))}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                        theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#8E877D]">رابط منصة X (تويتر):</label>
                    <input
                      type="url"
                      value={profileForm.socials.twitter || ''}
                      onChange={(e) => setProfileForm(p => ({ ...p, socials: { ...p.socials, twitter: e.target.value } }))}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                        theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-[#8E877D]">رابط Behance / معرض التصاميم:</label>
                    <input
                      type="url"
                      value={profileForm.socials.behance || ''}
                      onChange={(e) => setProfileForm(p => ({ ...p, socials: { ...p.socials, behance: e.target.value } }))}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                        theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#C5A059] text-[#121212] hover:bg-[#DFCA9B] transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSavingProfile ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>جارٍ الحفظ والمزامنة السحابية...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>حفظ تعديلات الملف الشخصي والشعار</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* ========================================================
              CATEGORY 2: HERO ANIMATION & LIGHTING CONTROLS
             ======================================================== */}
          {activeTab === 'hero' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* SIDE 1: SEPARATED STICKY LIVE PREVIEW */}
              <div className="lg:col-span-5 lg:sticky lg:top-0 z-20 space-y-3">
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#C5A059]/60 shadow-2xl h-56 sm:h-64 lg:h-[390px] flex flex-col justify-between p-4 group bg-black/90">
                  
                  {/* Live Rendered Canvas Background */}
                  <AnimatedHeroBackground />
                  
                  {/* Top Status Header Badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#C5A059]/50 text-[#E8D4A8] text-xs font-bold shadow-md">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>معاينة حية ومباشرة</span>
                    </div>

                    <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-[#C5A059] font-mono border border-white/10 font-bold">
                      {heroConfig.animationSpeed}x • {heroConfig.lightingIntensity}%
                    </div>
                  </div>

                  {/* Center Badge with Selected Preset Name */}
                  <div className="relative z-10 self-center text-center">
                    <div className="px-3.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-[#C5A059]/40 text-white text-xs font-bold shadow-lg">
                      <span className="text-[#E8D4A8]">{presetsList.find(p => p.id === heroConfig.preset)?.name}</span>
                    </div>
                  </div>

                  {/* Bottom Live Specs Overlay Box */}
                  <div className="relative z-10 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/15 text-right space-y-1.5 shadow-xl">
                    <div className="flex items-center justify-between text-xs text-[#E8D4A8] font-bold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>مواصفات المشهد الحركي</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">مباشر ومستمر</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-300 pt-1.5 border-t border-white/10">
                      <div>السطوع: <span className="text-[#C5A059] font-bold">{heroConfig.lightingIntensity}%</span></div>
                      <div>السرعة: <span className="text-[#C5A059] font-bold">{heroConfig.animationSpeed}x</span></div>
                      <div>الدورة: <span className="text-[#C5A059] font-bold">{heroConfig.motionDuration} ثواني</span></div>
                      <div>التعتيم: <span className="text-[#C5A059] font-bold">{heroConfig.overlayOpacity}%</span></div>
                    </div>
                  </div>
                </div>

                {/* Quick Hint Bar */}
                <div className={`p-2.5 rounded-xl border text-[11px] text-right flex items-center justify-between ${
                  theme === 'dark' ? 'bg-[#1A1917]/90 border-[#282622] text-[#8E877D]' : 'bg-[#F4F1EA] border-[#E5E0D8] text-[#5A554E]'
                }`}>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>المعاينة ثابتة أمامك أثناء التمرير والتحكم بالأدوات</span>
                  </span>
                  <button
                    type="button"
                    onClick={resetHeroConfig}
                    className="text-[#C5A059] hover:underline flex items-center gap-1 font-semibold shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>استعادة الافتراضي</span>
                  </button>
                </div>
              </div>

              {/* SIDE 2: SCROLLABLE CONTROLS */}
              <div className="lg:col-span-7 space-y-6">

                {/* Dropdowns Bar for Hero Presets and Motion Style */}
                <div className={`p-4 rounded-2xl border space-y-3 ${
                  theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 sm:w-1/2">
                      <label className="block text-xs font-bold text-[#C5A059] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>قائمة المشاهد الجاهزة (Preset):</span>
                      </label>
                      <div className="relative">
                        <select
                          value={heroConfig.preset}
                          onChange={(e) => updateHeroConfig({ preset: e.target.value as HeroThemePreset })}
                          className={`w-full appearance-none pl-8 pr-3 py-2 rounded-xl text-xs font-bold border outline-none cursor-pointer ${
                            theme === 'dark' ? 'bg-[#121110] border-[#3D382F] text-[#F9F7F2]' : 'bg-white border-[#E5E0D8] text-[#121212]'
                          }`}
                        >
                          {presetsList.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#C5A059] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1 sm:w-1/2">
                      <label className="block text-xs font-bold text-[#C5A059] flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>نمط حركة وأنيميشن المشهد:</span>
                      </label>
                      <div className="relative">
                        <select
                          value={heroConfig.motionStyle || 'wave'}
                          onChange={(e) => updateHeroConfig({ motionStyle: e.target.value as HeroMotionStyle })}
                          className={`w-full appearance-none pl-8 pr-3 py-2 rounded-xl text-xs font-bold border outline-none cursor-pointer ${
                            theme === 'dark' ? 'bg-[#121110] border-[#3D382F] text-[#F9F7F2]' : 'bg-white border-[#E5E0D8] text-[#121212]'
                          }`}
                        >
                          <option value="wave">تموجات انسيابية ناعمة (Wave)</option>
                          <option value="pulse">نبضات سينمائية مضيئة (Pulse)</option>
                          <option value="drift">طفو هادئ وتدفق أفقي (Drift)</option>
                          <option value="dynamic">حركة ديناميكية نشطة (Dynamic)</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#C5A059] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Presets Grid */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                    بطاقات المشاهد التفاعلية (أو انقر مباشرة للاختيار):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {presetsList.map(preset => {
                      const Icon = preset.icon;
                      const isSelected = heroConfig.preset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => updateHeroConfig({ preset: preset.id })}
                          className={`p-3 rounded-xl border text-right flex flex-col gap-1.5 transition-all text-xs cursor-pointer ${
                            isSelected
                              ? 'border-[#C5A059] bg-[#C5A059]/15 shadow-sm ring-1 ring-[#C5A059]'
                              : theme === 'dark'
                              ? 'border-[#282622] bg-[#1A1917] hover:border-[#C5A059]/40'
                              : 'border-[#E5E0D8] bg-[#FAF8F5] hover:border-[#C5A059]/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-bold">
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#C5A059]' : 'text-[#8E877D]'}`} />
                              <span className={isSelected ? 'text-[#C5A059]' : ''}>{preset.name}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#C5A059]" />}
                          </div>
                          <p className="text-[10px] text-[#8E877D] line-clamp-2">{preset.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Image URL */}
                {heroConfig.preset === 'custom_image' && (
                  <div className="p-4 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 space-y-2">
                    <label className="block text-xs font-bold text-[#C5A059]">
                      رابط الصورة المخصصة (URL):
                    </label>
                    <input
                      type="url"
                      value={heroConfig.customImageUrl || ''}
                      onChange={(e) => updateHeroConfig({ customImageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className={`w-full px-3.5 py-2 rounded-xl text-xs border outline-none ${
                        theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212]'
                      }`}
                    />
                  </div>
                )}

                {/* Precise Sliders Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Lighting Intensity */}
                  <div className={`p-4 rounded-xl border space-y-2.5 ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#282622]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-1.5">
                        <Sun className="w-4 h-4 text-[#C5A059]" />
                        <span>شدة الإضاءة والسطوع</span>
                      </div>
                      <span className="text-[#C5A059] font-bold">{heroConfig.lightingIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="140"
                      step="1"
                      value={heroConfig.lightingIntensity}
                      onChange={(e) => updateHeroConfig({ lightingIntensity: Number(e.target.value) })}
                      className="w-full accent-[#C5A059] cursor-pointer"
                    />
                  </div>

                  {/* Animation Speed */}
                  <div className={`p-4 rounded-xl border space-y-2.5 ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#282622]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-[#C5A059]" />
                        <span>سرعة الحركة</span>
                      </div>
                      <span className="text-[#C5A059] font-bold">{heroConfig.animationSpeed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="2.5"
                      step="0.1"
                      value={heroConfig.animationSpeed}
                      onChange={(e) => updateHeroConfig({ animationSpeed: Number(e.target.value) })}
                      className="w-full accent-[#C5A059] cursor-pointer"
                    />
                  </div>

                  {/* Motion Duration */}
                  <div className={`p-4 rounded-xl border space-y-2.5 ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#282622]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#C5A059]" />
                        <span>دورة الحركة الكاملة</span>
                      </div>
                      <span className="text-[#C5A059] font-bold">{heroConfig.motionDuration}s</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="45"
                      step="1"
                      value={heroConfig.motionDuration}
                      onChange={(e) => updateHeroConfig({ motionDuration: Number(e.target.value) })}
                      className="w-full accent-[#C5A059] cursor-pointer"
                    />
                  </div>

                  {/* Overlay Darkness */}
                  <div className={`p-4 rounded-xl border space-y-2.5 ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#282622]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-[#C5A059]" />
                        <span>طبقة التعتيم والتباين</span>
                      </div>
                      <span className="text-[#C5A059] font-bold">{heroConfig.overlayOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      step="1"
                      value={heroConfig.overlayOpacity}
                      onChange={(e) => updateHeroConfig({ overlayOpacity: Number(e.target.value) })}
                      className="w-full accent-[#C5A059] cursor-pointer"
                    />
                  </div>

                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#282622]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                  }`}>
                    <span className="text-xs font-semibold">الجزيئات العائمة</span>
                    <input
                      type="checkbox"
                      checked={heroConfig.particlesEnabled}
                      onChange={(e) => updateHeroConfig({ particlesEnabled: e.target.checked })}
                      className="accent-[#C5A059] w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#282622]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                  }`}>
                    <span className="text-xs font-semibold">أكواد الذكاء الاصطناعي</span>
                    <input
                      type="checkbox"
                      checked={heroConfig.codeSnippetEffect}
                      onChange={(e) => updateHeroConfig({ codeSnippetEffect: e.target.checked })}
                      className="accent-[#C5A059] w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#282622]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                  }`}>
                    <span className="text-xs font-semibold">الهالات الضوئية</span>
                    <input
                      type="checkbox"
                      checked={heroConfig.ambientGlow}
                      onChange={(e) => updateHeroConfig({ ambientGlow: e.target.checked })}
                      className="accent-[#C5A059] w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================
              CATEGORY 3: SHOWCASE APPS & PLATFORMS
             ======================================================== */}
          {activeTab === 'showcase' && (
            <div className="space-y-6">
              
              {/* Showcase Bar Config Banner */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
              }`}>
                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#C5A059]">
                    <AppWindow className="w-4 h-4" />
                    <span>تخصيص شريط التطبيقات والمنصات (Showcase Bar)</span>
                  </div>
                  <p className="text-xs text-[#8E877D]">
                    تحكم في العنوان والظهور وسرعة التمرير التلقائي للشريط
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <span>إظهار الشريط في الموقع:</span>
                    <input
                      type="checkbox"
                      checked={showcaseBarConfig.enabled}
                      onChange={(e) => updateShowcaseBarConfig({ enabled: e.target.checked })}
                      className="w-4 h-4 accent-[#C5A059]"
                    />
                  </label>
                </div>
              </div>

              {/* Showcase Header Controls */}
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#C5A059] flex items-center gap-2">
                  <span>المنصات والتطبيقات المعروضة ({showcaseApps.length}):</span>
                </h4>

                <button
                  type="button"
                  onClick={startAddNewShowcaseApp}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-[#121212] hover:bg-[#DFCA9B] transition-all shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة تطبيق / منصة جديدة</span>
                </button>
              </div>

              {/* Add / Edit Form if active */}
              {(isAddingNewApp || editingApp) && (
                <div className={`p-5 rounded-2xl border space-y-4 animate-fade-in ${
                  theme === 'dark' ? 'bg-[#1A1917] border-[#C5A059]/40 ring-1 ring-[#C5A059]/30' : 'bg-[#FAF8F5] border-[#C5A059]/40'
                }`}>
                  <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-2">
                    <h5 className="font-bold text-xs text-[#C5A059]">
                      {editingApp ? `تعديل المنصة: ${editingApp.name}` : 'إضافة منصة جديدة'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => { setEditingApp(null); setIsAddingNewApp(false); }}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      إلغاء
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold">اسم التطبيق / المنصة:</label>
                      <input
                        type="text"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        placeholder="مثال: منصة ريادة تك"
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                          theme === 'dark' ? 'bg-[#121110] border-[#2E2B26]' : 'bg-[#FFFFFF] border-[#E5E0D8]'
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold">التصنيف / المجال:</label>
                      <input
                        type="text"
                        value={appCategory}
                        onChange={(e) => setAppCategory(e.target.value)}
                        placeholder="مثال: ذكاء اصطناعي، SaaS"
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                          theme === 'dark' ? 'bg-[#121110] border-[#2E2B26]' : 'bg-[#FFFFFF] border-[#E5E0D8]'
                        }`}
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold">رابط المنصة (اختياري - اتركه فارغاً بدون رابط):</label>
                        {appUrl && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const url = appUrl.startsWith('http') ? appUrl : 'https://' + appUrl;
                                window.open(url, '_blank', 'noopener,noreferrer');
                              }}
                              className="text-[10px] text-[#C5A059] hover:underline flex items-center gap-1 font-semibold"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>اختبار</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setAppUrl('')}
                              className="text-[10px] text-red-400 hover:underline"
                            >
                              إزالة الرابط
                            </button>
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={appUrl}
                        onChange={(e) => setAppUrl(e.target.value)}
                        placeholder="https://example.com"
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-mono ${
                          theme === 'dark' ? 'bg-[#121110] border-[#2E2B26]' : 'bg-[#FFFFFF] border-[#E5E0D8]'
                        }`}
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-semibold">وصف مختصر:</label>
                      <input
                        type="text"
                        value={appDesc}
                        onChange={(e) => setAppDesc(e.target.value)}
                        placeholder="نبذة سريعة عن النظام..."
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                          theme === 'dark' ? 'bg-[#121110] border-[#2E2B26]' : 'bg-[#FFFFFF] border-[#E5E0D8]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setEditingApp(null); setIsAddingNewApp(false); }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveShowcaseApp}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-[#121212] hover:bg-[#DFCA9B] shadow-sm"
                    >
                      {editingApp ? 'حفظ التعديلات' : 'إضافة الآن'}
                    </button>
                  </div>
                </div>
              )}

              {/* Apps List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {showcaseApps.map((app) => (
                  <div
                    key={app.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] hover:border-[#C5A059]/40' : 'bg-[#FAF8F5] border-[#E5E0D8] hover:border-[#C5A059]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] shrink-0">
                          <AppWindow className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs">{app.name}</h5>
                          <span className="text-[10px] text-[#8E877D]">{app.category}</span>
                        </div>
                      </div>

                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                        {app.status === 'live' ? 'منشور' : app.status === 'beta' ? 'تجريبي' : 'تطوير'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#8E877D] line-clamp-2">
                      {app.description || 'منصة رقمية رائدة'}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#C5A059]/15 text-xs">
                      {app.url ? (
                        <a 
                          href={app.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#C5A059] hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>زيارة الرابط</span>
                        </a>
                      ) : (
                        <span className="text-[10px] text-[#8E877D]">
                          بدون رابط خارجي
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEditShowcaseApp(app)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#C5A059] hover:bg-black/10"
                          title="تعديل"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteShowcaseApp(app.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================
              CATEGORY 4: SERVICES & 9 CONSULTATIONS
             ======================================================== */}
          {activeTab === 'services' && (
            <ServicesManageTab />
          )}

          {/* ========================================================
              CATEGORY 5: ICON PRESETS & STUDIO
             ======================================================== */}
          {activeTab === 'icons' && (
            <div className="space-y-6">
              
              {/* Presets Studio Intro Banner */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
              }`}>
                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#C5A059]">
                    <Wand2 className="w-4 h-4" />
                    <span>حزم الأيقونات المتناسقة الجاهزة (One-Click Preset Packs)</span>
                  </div>
                  <p className="text-xs text-[#8E877D]">
                    اختر حزمة متناسقة لتطبيقها بنقرة واحدة على جميع بطاقات الخدمات والاستشارات الـ 9
                  </p>
                </div>
              </div>

              {/* Collections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ICON_PRESET_COLLECTIONS.map((collection) => (
                  <div
                    key={collection.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 transition-all ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: collection.accentColor }} />
                          <span>{collection.title}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full border text-xs font-mono" style={{ color: collection.accentColor, borderColor: `${collection.accentColor}40` }}>
                          {collection.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#8E877D] leading-relaxed mb-4">
                        {collection.description}
                      </p>

                      {/* Icons Preview Grid */}
                      <div className="grid grid-cols-6 gap-2 p-2.5 rounded-xl bg-black/10 dark:bg-black/30 border border-white/5">
                        {collection.icons.slice(0, 12).map((item) => (
                          <div 
                            key={item.id} 
                            className="flex flex-col items-center justify-center p-2 rounded-lg bg-black/20 text-[#C5A059] hover:scale-110 transition-transform"
                            title={item.label}
                          >
                            <IconRenderer 
                              name={item.name} 
                              size={item.size || 20} 
                              color={item.color || collection.accentColor} 
                              rotation={item.rotation || 0} 
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        applyPresetPackToServices({
                          title: collection.title,
                          icons: collection.icons.map(i => ({
                            name: i.name,
                            color: i.color || collection.accentColor,
                            size: i.size || 24,
                            rotation: i.rotation || 0
                          }))
                        });
                        notify(`تم تطبيق ${collection.title} بنجاح على بطاقات الخدمات!`);
                      }}
                      className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-[#C5A059] text-[#121212] hover:bg-[#DFCA9B] transition-all shadow-xs active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>تطبيق هذه الحزمة على الخدمات الـ 9</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================
              CATEGORY 6: SECURITY, ADMIN CREDENTIALS & BACKUP
             ======================================================== */}
          {(activeTab === 'security' || activeTab === 'backup') && (
            <div className="space-y-6">
              
              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isAuthenticated 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-[#C5A059]/30 bg-[#C5A059]/10 text-[#E8D4A8]'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black/40 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm">
                      {isAuthenticated ? 'أنت مسجل حالياً كمسؤول النظام' : 'جلسة ضيف (يتطلب تسجيل الدخول للتحرير المتقدم)'}
                    </h4>
                    <p className="text-[11px] opacity-80">
                      اسم المستخدم الحالي: <span className="font-mono font-bold underline">{adminCredentials.username}</span>
                    </p>
                  </div>
                </div>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={logout}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40 transition-colors cursor-pointer"
                  >
                    تسجيل الخروج
                  </button>
                )}
              </div>

              {/* Change Credentials Form */}
              <form onSubmit={handleSaveSecurity} className="space-y-4">
                <h4 className="font-bold text-sm text-[#C5A059] flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  <span>تعديل اسم المستخدم وكلمة المرور للوحة التحكم:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold">اسم المستخدم الجديد:</label>
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none ${
                        theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                      }`}
                      placeholder="admin"
                      required
                      readOnly
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold">كلمة المرور الحالية:</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none pl-10 ${
                          theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                        }`}
                        placeholder="••••••••••••"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                        title={showCurrentPassword ? 'إخفاء' : 'إظهار'}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold">كلمة المرور الجديدة:</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none pl-10 ${
                          theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                        }`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                        title={showPassword ? 'إخفاء' : 'إظهار'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold">تأكيد كلمة المرور:</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none pl-10 ${
                          passwordInput && confirmPasswordInput && passwordInput !== confirmPasswordInput
                            ? 'border-red-500 bg-red-500/5'
                            : theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
                        }`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                        title={showConfirmPassword ? 'إخفاء' : 'إظهار'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-[#8E877D]">
                    {passwordInput && confirmPasswordInput && passwordInput !== confirmPasswordInput ? (
                      <span className="text-red-400 font-medium">⚠️ كلمتا المرور غير متطابقتين</span>
                    ) : (
                      <span>سيتم حفظ بيانات الاعتماد فورياً في السحابة والمتصفح.</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingSecurity}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] transition-colors shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSavingSecurity ? 'جارٍ الحفظ والمزامنة...' : 'تحديث وحفظ بيانات الدخول'}</span>
                  </button>
                </div>
              </form>

              {/* Backup & Restore Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#C5A059]/20">
                
                {/* Export Card */}
                <div className={`p-5 rounded-2xl border space-y-3 ${
                  theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                }`}>
                  <div className="flex items-center gap-2.5 text-[#C5A059] font-bold text-sm">
                    <Download className="w-5 h-5" />
                    <span>تصدير نسخة احتياطية كاملة</span>
                  </div>
                  <p className="text-xs text-[#8E877D] leading-relaxed">
                    تحميل ملف JSON يحتوي على كافة الصفحات، المقالات، المشاريع، إعدادات الهيرو، المنصات والملف الشخصي.
                  </p>
                  <button
                    type="button"
                    onClick={exportBackup}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] transition-colors shadow-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>تنزيل ملف النسخة الاحتياطية (.json)</span>
                  </button>
                </div>

                <BackupImportCard theme={theme} onImport={importBackup} />

              </div>

              <div className={`p-5 rounded-2xl border space-y-4 ${
                theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
              }`}>
                <div>
                  <h4 className="font-bold text-sm text-[#C5A059]">ترحيل البيانات المحلية القديمة بأمان</h4>
                  <p className="mt-1 text-xs text-[#8E877D] leading-relaxed">
                    ابدأ بالمعاينة، ثم ادمج الحقول الناقصة فقط. بيانات الخادم الموجودة لن تُستبدل بقيم محلية قديمة.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setLegacyDifferences(previewLegacyMigration())}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/10"
                  >
                    معاينة الحقول القابلة للدمج
                  </button>
                  <button
                    type="button"
                    disabled={isMergingLegacy}
                    onClick={async () => {
                      setIsMergingLegacy(true);
                      try {
                        if (await mergeLegacyMigration()) setLegacyDifferences([]);
                      } finally {
                        setIsMergingLegacy(false);
                      }
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-[#121212] disabled:opacity-50"
                  >
                    {isMergingLegacy ? 'جارٍ الدمج والحفظ...' : 'دمج الناقص في مسودة الخادم'}
                  </button>
                </div>
                {legacyDifferences !== null && (
                  <div className="rounded-xl border border-[#C5A059]/20 p-3 text-xs">
                    {legacyDifferences.length > 0 ? (
                      <>
                        <p className="mb-2 font-bold">الحقول المحلية التي يمكن ملؤها ({legacyDifferences.length}):</p>
                        <ul className="max-h-32 overflow-auto space-y-1 font-mono text-[11px] text-[#8E877D]" dir="ltr">
                          {legacyDifferences.map((path) => <li key={path}>{path}</li>)}
                        </ul>
                      </>
                    ) : <p className="text-emerald-500">لا توجد حقول محلية ناقصة تحتاج إلى دمج.</p>}
                  </div>
                )}
                <div className="pt-3 border-t border-[#C5A059]/20 space-y-3">
                  <label className="flex items-start gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={secondDeviceVerified}
                      onChange={(event) => setSecondDeviceVerified(event.target.checked)}
                      className="mt-0.5 accent-[#C5A059]"
                    />
                    <span>تحققت من جهاز ثانٍ أن المسودة والوسائط محفوظة وتظهر بصورة صحيحة على الخادم.</span>
                  </label>
                  <button
                    type="button"
                    disabled={!secondDeviceVerified}
                    onClick={() => {
                      if (clearLegacyData(secondDeviceVerified)) {
                        setSecondDeviceVerified(false);
                        setLegacyDifferences([]);
                      }
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-red-500/30 text-red-500 hover:bg-red-500/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    تنظيف التخزين المحلي القديم نهائياً
                  </button>
                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                theme === 'dark' ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-200'
              }`}>
                <div>
                  <h5 className="font-bold text-xs text-red-500">إعادة ضبط المصنع الافتراضية</h5>
                  <p className="text-[11px] text-[#8E877D]">استرجاع النصوص والخدمات والبيانات الأصلية للموقع</p>
                </div>
                <button
                  type="button"
                  onClick={resetToDefaults}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 transition-colors cursor-pointer"
                >
                  استعادة الإعدادات الأصلية
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between px-6 py-4 border-t shrink-0 ${
          theme === 'dark' ? 'border-[#282622] bg-[#121110]' : 'border-[#E5E0D8] bg-[#FAF8F5]'
        }`}>
          <div className="text-xs text-[#8E877D] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>يتم حفظ كافة التغييرات ومزامنتها تلقائياً.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] transition-colors shadow-md cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>تم وإغلاق</span>
          </button>
        </div>
      </div>
    </div>
  );
};
