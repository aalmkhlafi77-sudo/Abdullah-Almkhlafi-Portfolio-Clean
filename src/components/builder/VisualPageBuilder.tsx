import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { optimizeImage } from '../../utils/imageOptimizer';
import { getVideoEmbedInfo } from '../../utils/mediaUtils';
import { BuilderElement, DeviceMode, ElementScope, ScopeStyle, GradientConfig, MediaItem, ProjectItem } from '../../types';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Save, 
  Send, 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Lock, 
  Unlock, 
  Layers, 
  Sliders, 
  Type, 
  Layout, 
  FileText, 
  Check, 
  CheckCircle2,
  Image as ImageIcon, 
  Activity, 
  Minus, 
  ExternalLink,
  Sparkles,
  Palette,
  User,
  FolderGit2,
  Cpu,
  BookOpen,
  Quote,
  Upload,
  Camera,
  Edit3,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  RotateCw,
  Sparkle,
  MousePointer,
  AlertCircle,
  Keyboard,
  Play,
  Scissors,
  ClipboardPaste,
  SlidersHorizontal,
  Command,
  X,
  Compass,
  RefreshCw,
  PaintBucket
} from 'lucide-react';
import { PublicHero } from '../public/PublicHero';
import { PublicExpertise } from '../public/PublicExpertise';
import { PublicProjects } from '../public/PublicProjects';
import { PublicArticles } from '../public/PublicArticles';
import { PublicQuote } from '../public/PublicQuote';
import { PublicContact } from '../public/PublicContact';
import { PreviewPageFrame } from './PreviewPageFrame';
import { ProfileModal } from '../common/ProfileModal';
import { getTitleFontSizeClass, getBodyFontSizeClass, getFontWeightClass, getMotionConfig, getGradientBackground, getScopedValue } from '../../utils/typography';

const GRADIENT_PRESETS = [
  {
    name: 'ذهبي كوزميك فاخر',
    start: '#2B2313',
    middle: '#1B1710',
    end: '#0D0C0A',
    angle: 135,
    type: 'linear',
    useMiddle: true,
  },
  {
    name: 'الذهب الأسود الملكي',
    start: '#3D3117',
    end: '#121212',
    angle: 145,
    type: 'linear',
    useMiddle: false,
  },
  {
    name: 'تدرج فحمي سينمائي',
    start: '#2A2926',
    middle: '#1C1B18',
    end: '#12110F',
    angle: 180,
    type: 'linear',
    useMiddle: true,
  },
  {
    name: 'زمردي نخبوي داكن',
    start: '#0F2C20',
    end: '#0B1511',
    angle: 135,
    type: 'linear',
    useMiddle: false,
  },
  {
    name: 'ياقوتي عميق وفخم',
    start: '#361118',
    end: '#14070A',
    angle: 135,
    type: 'linear',
    useMiddle: false,
  },
  {
    name: 'كحلي وسماء الليل',
    start: '#151D2F',
    end: '#0A0D15',
    angle: 135,
    type: 'linear',
    useMiddle: false,
  },
  {
    name: 'إشعاعي ذهبي مركزي',
    start: '#3A2E16',
    middle: '#1F1A10',
    end: '#0F0E0C',
    angle: 0,
    type: 'radial',
    useMiddle: true,
  },
  {
    name: 'عاجي رملي مشرق',
    start: '#FCF9F3',
    middle: '#F4ECE0',
    end: '#E7DDD0',
    angle: 135,
    type: 'linear',
    useMiddle: true,
  },
  {
    name: 'ذهبي حريري ناعم',
    start: '#FAF5EA',
    end: '#EDE2CC',
    angle: 120,
    type: 'linear',
    useMiddle: false,
  },
  {
    name: 'بلاتينيوم معاصر',
    start: '#F5F5F7',
    end: '#E5E5EA',
    angle: 90,
    type: 'linear',
    useMiddle: false,
  },
];

const PRO_COLOR_PALETTES = [
  { name: 'الذهبي الملكي', hex: '#C5A059' },
  { name: 'الذهبي البراق', hex: '#DFCA9B' },
  { name: 'العسلي الدافئ', hex: '#E8D4A8' },
  { name: 'البرونز الفاخر', hex: '#8F6E30' },
  { name: 'الأسود الحبري', hex: '#121212' },
  { name: 'الفحمي الأنيق', hex: '#1A1917' },
  { name: 'الأردواز الداكن', hex: '#24221E' },
  { name: 'الأبيض العاجي', hex: '#F9F7F2' },
  { name: 'الرملي الناعم', hex: '#FAF8F5' },
  { name: 'البيج الطبيعي', hex: '#E5E0D8' },
  { name: 'الرمادي الهادئ', hex: '#8E877D' },
  { name: 'الفضي الصافي', hex: '#C7C1B7' },
  { name: 'الأزرق النيلي', hex: '#1E293B' },
  { name: 'الأزرق الكوبالت', hex: '#3B82F6' },
  { name: 'الأخضر الزمردي', hex: '#065F46' },
  { name: 'الأخضر النعناعي', hex: '#10B981' },
  { name: 'الأحمر الياقوتي', hex: '#881337' },
  { name: 'الوردي الأنيق', hex: '#F43F5E' },
  { name: 'الأرجواني الفاخر', hex: '#6B21A8' },
  { name: 'البنفسجي الإشعاعي', hex: '#8B5CF6' },
];

const SCOPE_OPTIONS: { id: ElementScope; label: string; desc: string }[] = [
  { id: 'container', label: 'الحاوية الرئيسية', desc: 'خلفية وهيكل القسم العام' },
  { id: 'title', label: 'العنوان الرئيسي', desc: 'حجم ولون ووزن العنوان الأساسي' },
  { id: 'subtitle', label: 'العنوان الفرعي / الشارة', desc: 'النص التعريفي وشارات التصنيف' },
  { id: 'description', label: 'النص والوصف', desc: 'الفقرة التوضيحية ومحتوى الشرح' },
  { id: 'cards', label: 'البطاقات الداخلية', desc: 'بطاقات الخدمات، المشاريع والمقالات' },
  { id: 'button', label: 'الزر التفاعلي (CTA)', desc: 'أزرار الإجراء، الألوان والتدرجات' },
];

export const VisualPageBuilder: React.FC = () => {
  const { 
    profile,
    updateProfile,
    theme, 
    deviceMode, 
    setDeviceMode, 
    pages, 
    activePageId, 
    setActivePageId,
    addPage,
    deletePage,
    populatePageWithTemplate,
    selectedElementId, 
    setSelectedElementId,
    updateBuilderElement,
    reorderBuilderElement,
    duplicateBuilderElement,
    deleteBuilderElement,
    addBuilderElement,
    undoBuilder,
    redoBuilder,
    canUndo,
    canRedo,
    clipboardElement,
    copyBuilderElement,
    cutBuilderElement,
    pasteBuilderElement,
    mediaList,
    addMediaItem,
    setAvatarUrl,
    savePortfolioToServer,
    projects,
    updateProject,
    addProject,
    deleteProject,
    services,
    updateService,
    addService,
    deleteService,
    draftStatus,
    lastSavedTime,
    saveDraft,
    restoreDraft,
    publishChanges,
    notify,
    setShowSettingsModal,
    openIconLibrary,
    applyPresetPackToServices
  } = useApp();

  const [activeTab, setActiveTab] = useState<'content' | 'layout' | 'appearance' | 'typography' | 'motion' | 'responsive'>('content');
  const [showAddElementModal, setShowAddElementModal] = useState(false);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [animationCycleKey, setAnimationCycleKey] = useState(0);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [rightSidebarTab, setRightSidebarTab] = useState<'pages' | 'layers'>('layers');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [copiedGradient, setCopiedGradient] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewScrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    previewScrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    if (previewScrollContainerRef.current) {
      previewScrollContainerRef.current.scrollTo({
        top: previewScrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const scrollToElement = (elementId: string) => {
    setSelectedElementId(elementId);
    const target = document.getElementById(`builder-el-${elementId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleManualSaveDraft = () => {
    setIsSaving(true);
    saveDraft();
    setTimeout(() => {
      setIsSaving(false);
    }, 600);
  };

  const handleManualPublish = async () => {
    setIsPublishing(true);
    await publishChanges();
    setTimeout(() => {
      setIsPublishing(false);
    }, 600);
  };

  const currentPage = pages.find(p => p.id === activePageId) || pages[0];
  const selectedElement = currentPage?.elements?.find(el => el.id === selectedElementId);

  // Scoped Styling Helpers
  const activeScope: ElementScope = selectedElement?.style?.activeScope || 'container';

  const setActiveScope = (scope: ElementScope) => {
    if (!selectedElement) return;
    updateBuilderElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        activeScope: scope
      }
    });
  };

  const getEffectiveScopedValue = <K extends keyof ScopeStyle>(property: K, fallback?: ScopeStyle[K]): ScopeStyle[K] | undefined => {
    if (!selectedElement) return fallback;
    return getScopedValue(selectedElement.style, activeScope, property, fallback);
  };

  const updateActiveScopeStyle = (updates: Partial<ScopeStyle>) => {
    if (!selectedElement) return;
    const currentScoped = selectedElement.style?.scopedStyles || {};
    const currentForScope = currentScoped[activeScope] || {};
    const updatedForScope = { ...currentForScope, ...updates };

    const newScopedStyles: Partial<Record<ElementScope, ScopeStyle>> = {
      ...currentScoped,
      [activeScope]: updatedForScope
    };

    // If activeScope is 'container', also keep top-level base style fields in sync for backward compatibility
    const baseUpdates: Partial<BuilderElement['style']> = {};
    if (activeScope === 'container') {
      if (updates.backgroundColor !== undefined) baseUpdates.backgroundColor = updates.backgroundColor;
      if (updates.textColor !== undefined) baseUpdates.textColor = updates.textColor;
      if (updates.fontSize !== undefined) baseUpdates.fontSize = updates.fontSize;
      if (updates.fontWeight !== undefined) baseUpdates.fontWeight = updates.fontWeight;
      if (updates.borderRadius !== undefined) baseUpdates.borderRadius = updates.borderRadius;
      if (updates.borderColor !== undefined) baseUpdates.borderColor = updates.borderColor;
      if (updates.gradient !== undefined) baseUpdates.gradient = updates.gradient;
      if (updates.glow !== undefined) baseUpdates.glow = updates.glow;
    } else if (activeScope === 'cards') {
      if (updates.backgroundColor !== undefined) baseUpdates.cardBackground = updates.backgroundColor;
      if (updates.textColor !== undefined) baseUpdates.cardTextColor = updates.textColor;
      if (updates.borderColor !== undefined) baseUpdates.cardBorderColor = updates.borderColor;
      if (updates.borderRadius !== undefined) baseUpdates.cardBorderRadius = updates.borderRadius;
    }

    updateBuilderElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        ...baseUpdates,
        activeScope,
        scopedStyles: newScopedStyles
      }
    });
  };

  const resetActiveScope = () => {
    if (!selectedElement) return;
    const currentScoped = { ...(selectedElement.style?.scopedStyles || {}) };
    delete currentScoped[activeScope];
    updateBuilderElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        scopedStyles: currentScoped
      }
    });
    notify(`تمت إعادة تعيين تنسيقات نطاق "${SCOPE_OPTIONS.find(s => s.id === activeScope)?.label}" إلى الوضع التلقائي`);
  };

  const applyActiveScopeToAll = () => {
    if (!selectedElement) return;
    const currentForScope = selectedElement.style?.scopedStyles?.[activeScope] || {};
    const allScopes: ElementScope[] = ['container', 'title', 'subtitle', 'description', 'cards', 'button'];
    const newScopedStyles: Partial<Record<ElementScope, ScopeStyle>> = {
      ...(selectedElement.style?.scopedStyles || {})
    };

    allScopes.forEach(s => {
      newScopedStyles[s] = {
        ...(newScopedStyles[s] || {}),
        ...(currentForScope.textColor ? { textColor: currentForScope.textColor } : {}),
        ...(currentForScope.fontSize ? { fontSize: currentForScope.fontSize } : {}),
        ...(currentForScope.fontWeight ? { fontWeight: currentForScope.fontWeight } : {}),
      };
    });

    updateBuilderElement(selectedElement.id, {
      style: {
        ...selectedElement.style,
        ...(currentForScope.textColor ? { textColor: currentForScope.textColor, cardTextColor: currentForScope.textColor } : {}),
        ...(currentForScope.fontSize ? { fontSize: currentForScope.fontSize } : {}),
        ...(currentForScope.fontWeight ? { fontWeight: currentForScope.fontWeight } : {}),
        scopedStyles: newScopedStyles
      }
    });
    notify('تم تطبيق التنسيقات على كافة نصوص وبطاقات القسم بنجاح');
  };

  // Auto-select first element if none selected or if active page changed
  React.useEffect(() => {
    if (currentPage && currentPage.elements.length > 0) {
      const exists = currentPage.elements.some(el => el.id === selectedElementId);
      if (!exists) {
        setSelectedElementId(currentPage.elements[0].id);
      }
    }
  }, [activePageId, currentPage?.elements, selectedElementId, setSelectedElementId]);

  // Global Keyboard Shortcuts (Copy, Paste, Cut, Undo, Redo, Duplicate, Delete, Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable);

      const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Save Draft: Ctrl+S / Cmd+S
      if (isCmdOrCtrl && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleManualSaveDraft();
        return;
      }

      // Undo: Ctrl+Z / Cmd+Z (without shift)
      if (isCmdOrCtrl && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        if (!isInput) {
          e.preventDefault();
          undoBuilder();
          return;
        }
      }

      // Redo: Ctrl+Y / Cmd+Y or Ctrl+Shift+Z / Cmd+Shift+Z
      if (
        (isCmdOrCtrl && (e.key === 'y' || e.key === 'Y')) ||
        (isCmdOrCtrl && e.shiftKey && (e.key === 'z' || e.key === 'Z'))
      ) {
        if (!isInput) {
          e.preventDefault();
          redoBuilder();
          return;
        }
      }

      // Copy: Ctrl+C / Cmd+C (when element selected and not typing in text field)
      if (isCmdOrCtrl && (e.key === 'c' || e.key === 'C') && !isInput && selectedElementId) {
        e.preventDefault();
        copyBuilderElement(selectedElementId);
        return;
      }

      // Cut: Ctrl+X / Cmd+X
      if (isCmdOrCtrl && (e.key === 'x' || e.key === 'X') && !isInput && selectedElementId) {
        e.preventDefault();
        cutBuilderElement(selectedElementId);
        return;
      }

      // Paste: Ctrl+V / Cmd+V
      if (isCmdOrCtrl && (e.key === 'v' || e.key === 'V') && !isInput) {
        e.preventDefault();
        pasteBuilderElement();
        return;
      }

      // Duplicate: Ctrl+D / Cmd+D
      if (isCmdOrCtrl && (e.key === 'd' || e.key === 'D') && !isInput && selectedElementId) {
        e.preventDefault();
        duplicateBuilderElement(selectedElementId);
        return;
      }

      // Delete: Delete or Backspace (when not in input)
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput && selectedElementId) {
        e.preventDefault();
        deleteBuilderElement(selectedElementId);
        return;
      }

      // Deselect: Escape
      if (e.key === 'Escape') {
        setSelectedElementId(null);
        return;
      }

      // Reorder Up: Alt + ArrowUp
      if (e.altKey && e.key === 'ArrowUp' && selectedElementId) {
        e.preventDefault();
        reorderBuilderElement(selectedElementId, 'up');
        return;
      }

      // Reorder Down: Alt + ArrowDown
      if (e.altKey && e.key === 'ArrowDown' && selectedElementId) {
        e.preventDefault();
        reorderBuilderElement(selectedElementId, 'down');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, undoBuilder, redoBuilder, copyBuilderElement, cutBuilderElement, pasteBuilderElement, duplicateBuilderElement, deleteBuilderElement, reorderBuilderElement]);

  // Available element presets to add
  const newElementOptions = [
    { type: 'hero', name: 'الترويسة والصورة الشخصية', desc: 'الواجهة الرئيسية متضمنة صورتك الشخصية والنبذة والأرقام', icon: User },
    { type: 'projects', name: 'معرض المشاريع والأعمال', desc: 'استعراض للمشاريع المصممة والمنجزة مع وسوم وفلاتر', icon: FolderGit2 },
    { type: 'expertise', name: 'الخبرات والمهارات والتقنيات', desc: 'بطاقات التخصصات التقنية ومؤشرات التمكن', icon: Cpu },
    { type: 'articles', name: 'الأفكار والمقالات المكتوبة', desc: 'شبكة المقالات المعرفية وقارئ المحتوى المدمج', icon: BookOpen },
    { type: 'quote', name: 'الاقتباس والرؤية الفلسفية', desc: 'كتلة نصية فخمة ومميزة مع التوقيع الرقمي', icon: Quote },
    { type: 'contact', name: 'نموذج التواصل السريع والبيانات', desc: 'بطاقة الاتصال، أرقام الهاتف، ومراسلة مباشرة', icon: Send },
    { type: 'heading', name: 'عنوان رئيسي مخصص', desc: 'عنوان أنيق بخط فني راقٍ وعنوان فرعي', icon: Type },
    { type: 'paragraph', name: 'فقرة نصية مخصصة', desc: 'نص غني ومريح للقراءة مع محاذاة مرنة', icon: FileText },
    { type: 'button', name: 'زر تفاعلي (CTA)', desc: 'زر دعوة لإجراء بتنسيق ذهبي جذاب', icon: Sliders },
    { type: 'image', name: 'صورة وسائط', desc: 'إطار صور متجاوب مع اختيار من المكتبة', icon: ImageIcon },
    { type: 'stats', name: 'شريط إحصاءات', desc: 'أرقام وإنجازات رئيسية بتصميم عصري', icon: Activity },
    { type: 'divider', name: 'فاصل فني وزخرفي', desc: 'خط فاصل ذهبي بنقش ألماسي راقٍ', icon: Minus }
  ];

  const handleCreateElement = (type: any, name: string) => {
    const defaultImage = mediaList.length > 0 
      ? mediaList[0].url 
      : 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80';

    const newEl: BuilderElement = {
      id: 'el_' + Date.now(),
      name,
      type,
      visible: true,
      locked: false,
      content: {
        title: type === 'image' ? 'لقطة فنية من الأرشيف' : type === 'hero' ? profile.name : 'عنصر جديد مخصص',
        subtitle: type === 'hero' ? profile.role : 'المستوى الرفيع في التصميم',
        description: type === 'hero' ? profile.bio : 'يمكنك تحرير هذا النص بحرية من لوحة الخصائص لتخصيص المحتوى والأسلوب.',
        buttonText: 'تواصل الآن',
        imageUrl: defaultImage,
        avatarUrl: profile.avatarUrl
      },
      layout: {
        paddingY: 'py-12',
        maxWidth: 'max-w-5xl',
        align: 'center'
      },
      style: {
        material: 'glass',
        glow: false
      },
      motion: {
        animationType: 'fade-up',
        duration: 0.5,
        delay: 0.1
      }
    };
    addBuilderElement(newEl);
    setShowAddElementModal(false);
    notify(`تمت إضافة عنصر "${name}" بنجاح!`);
  };

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await optimizeImage(file, 800, 800, 0.82);
      await setAvatarUrl(dataUrl);
    } catch {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          await setAvatarUrl(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;
    addPage(newPageTitle.trim());
    setNewPageTitle('');
    setShowNewPageModal(false);
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-50px)] overflow-hidden transition-colors ${
      theme === 'dark' ? 'bg-[#0E0E0E] text-[#F9F7F2]' : 'bg-[#F4F1EA] text-[#121212]'
    }`}>
      
      {/* Top Page Builder Bar */}
      <div className={`h-14 px-4 border-b flex items-center justify-between z-30 shrink-0 ${
        theme === 'dark' ? 'bg-[#161513] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E5E0D8] shadow-xs'
      }`}>
        {/* Right side in RTL: Title & Save/Publish Actions */}
        {/* Right side in RTL: Brand & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center font-bold">
              <Layout className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm sm:text-base hidden sm:inline">منشئ الصفحات المرئي</span>
          </div>

          {/* Undo / Redo buttons */}
          <div className="flex items-center gap-1 border-r border-slate-500/20 pr-2 mr-1">
            <button
              type="button"
              onClick={undoBuilder}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                canUndo 
                  ? 'border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/15' 
                  : 'border-transparent text-slate-500 opacity-40 cursor-not-allowed'
              }`}
              title="تراجع عن الإجراء الأخير (Ctrl+Z)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={redoBuilder}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                canRedo 
                  ? 'border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059]/15' 
                  : 'border-transparent text-slate-500 opacity-40 cursor-not-allowed'
              }`}
              title="إعادة الإجراء (Ctrl+Y أو Ctrl+Shift+Z)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 border-r border-slate-500/20 pr-2">
            {/* Status indicator badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-slate-500/20">
              {draftStatus === 'unsaved' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-500 font-semibold">تغييرات غير محفوظة</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">
                    {lastSavedTime ? `مسودة محفوظة (${lastSavedTime})` : 'المسودة محفوظة'}
                  </span>
                </>
              )}
            </div>

            {/* Save Draft Button */}
            <button
              onClick={handleManualSaveDraft}
              disabled={isSaving}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-xs ${
                draftStatus === 'unsaved'
                  ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059]/30 ring-1 ring-[#C5A059]/50 animate-pulse'
                  : theme === 'dark' 
                    ? 'border-[#2E2B26] hover:bg-[#201E1A] text-[#C7C1B7]' 
                    : 'border-[#E5E0D8] hover:bg-[#F2EFE9] text-[#5A554E]'
              }`}
              title="حفظ كافة التغييرات والتخطيطات الحالية كمسودة في المتصفح (Ctrl+S)"
            >
              {isSaving ? (
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5 text-[#C5A059]" />
              )}
              <span>{isSaving ? 'جارٍ الحفظ...' : 'حفظ المسودة'}</span>
            </button>

            {/* Restore Draft Button */}
            <button
              onClick={() => restoreDraft()}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors opacity-80 hover:opacity-100 ${
                theme === 'dark' ? 'border-[#2E2B26] hover:bg-[#201E1A] text-slate-300' : 'border-[#E5E0D8] hover:bg-[#F2EFE9] text-slate-600'
              }`}
              title="استعادة آخر مسودة محفوظة للتخطيط"
            >
              <RotateCcw className="w-3 h-3 text-[#C5A059]" />
              <span className="hidden md:inline">استعادة</span>
            </button>

            {/* Publish Button */}
            <button
              onClick={handleManualPublish}
              disabled={isPublishing}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-75"
              title="نشر كافة التغييرات والتخطيطات فوراً إلى السحابة والموقع"
            >
              {isPublishing ? (
                <Sparkles className="w-3.5 h-3.5 text-[#121212] animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{isPublishing ? 'جارٍ النشر...' : 'نشر فوري'}</span>
            </button>
          </div>
        </div>

        {/* Center: Device Preview Switcher (Desktop, Tablet, Mobile) */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border ${
          theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824]' : 'bg-[#F0ECE1] border-[#E5E0D8]'
        }`}>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'desktop' ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="سطح المكتب (Desktop)"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'tablet' ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="جهاز لوحي (Tablet)"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceMode === 'mobile' ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="هاتف جوال (Mobile)"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Left side in RTL: Shortcuts & Quick Add Element */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowShortcutsModal(true)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              theme === 'dark' ? 'border-[#2E2B26] hover:bg-[#201E1A] text-slate-300' : 'border-[#E5E0D8] hover:bg-[#F2EFE9] text-slate-600'
            }`}
            title="دليل اختصارات لوحة المفاتيح"
          >
            <Keyboard className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="hidden md:inline">الاختصارات</span>
          </button>

          <button
            onClick={() => setShowAddElementModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/30 text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة عنصر</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio Workspace */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        
        {/* Right Column (in RTL): Pages & Layers Tree */}
        <div className={`w-72 border-l flex flex-col shrink-0 z-20 transition-colors ${
          theme === 'dark' ? 'bg-[#141311] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E5E0D8] shadow-xs'
        }`}>
          {/* Tabs: Pages / Layers */}
          <div className="grid grid-cols-2 p-2 gap-1 border-b border-slate-500/20 text-xs font-bold">
            <button
              onClick={() => setRightSidebarTab('layers')}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                rightSidebarTab === 'layers' 
                  ? 'bg-[#C5A059] text-[#121212]' 
                  : theme === 'dark' ? 'text-[#8E877D] hover:text-[#F9F7F2]' : 'text-[#5A554E] hover:text-[#121212]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>الطبقات</span>
            </button>
            <button
              onClick={() => setRightSidebarTab('pages')}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                rightSidebarTab === 'pages' 
                  ? 'bg-[#C5A059] text-[#121212]' 
                  : theme === 'dark' ? 'text-[#8E877D] hover:text-[#F9F7F2]' : 'text-[#5A554E] hover:text-[#121212]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>الصفحات</span>
            </button>
          </div>

          {/* Content of Layers or Pages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {rightSidebarTab === 'layers' ? (
              <>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
                  <span>طبقات الصفحة النشطة ({currentPage?.elements.length || 0})</span>
                  <span className="text-[10px] text-[#C5A059]">انقر للتحديد والتعديل</span>
                </div>

                {currentPage?.elements.map((el, idx) => {
                  const isSelected = selectedElementId === el.id;
                  return (
                    <div
                      key={el.id}
                      onClick={() => setSelectedElementId(el.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#C5A059]/20 border-[#C5A059] font-bold shadow-xs'
                          : theme === 'dark'
                            ? 'bg-[#1A1917] border-[#2A2824] hover:bg-[#22201C]'
                            : 'bg-white border-[#E5E0D8] hover:bg-[#F2EFE9]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="opacity-50 text-[10px] w-3">{idx + 1}</span>
                        <Type className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span className="truncate max-w-[110px]">{el.name}</span>
                      </div>

                      <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => updateBuilderElement(el.id, { locked: !el.locked })}
                          className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ${el.locked ? 'text-amber-400' : 'opacity-40'}`}
                          title={el.locked ? 'مقفل من التعديل' : 'مفتوح للتعديل'}
                        >
                          {el.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => updateBuilderElement(el.id, { visible: !el.visible })}
                          className={`p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ${!el.visible ? 'text-rose-400' : 'opacity-40'}`}
                          title={el.visible ? 'إخفاء' : 'إظهار'}
                        >
                          {el.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => reorderBuilderElement(el.id, 'up')}
                          disabled={idx === 0}
                          className="p-1 opacity-40 hover:opacity-100 disabled:opacity-10"
                          title="نقل لأعلى"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => reorderBuilderElement(el.id, 'down')}
                          disabled={idx === (currentPage?.elements.length || 0) - 1}
                          className="p-1 opacity-40 hover:opacity-100 disabled:opacity-10"
                          title="نقل لأسفل"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
                  <span>صفحات الموقع</span>
                  <button 
                    onClick={() => setShowNewPageModal(true)}
                    className="text-[#C5A059] hover:text-[#B8934A] font-bold text-xs flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>صفحة جديدة</span>
                  </button>
                </div>

                {pages.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setActivePageId(p.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      activePageId === p.id
                        ? 'bg-[#C5A059]/20 border-[#C5A059] font-bold'
                        : theme === 'dark'
                          ? 'bg-[#1A1917] border-[#2A2824] hover:bg-[#22201C]'
                          : 'bg-white border-[#E5E0D8] hover:bg-[#F2EFE9]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{p.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {p.isHome ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C5A059]/20 text-[#C5A059] font-medium">
                          الرئيسية
                        </span>
                      ) : (
                        <button
                          onClick={() => deletePage(p.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded"
                          title="حذف هذه الصفحة"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Bottom Add Element Trigger */}
          <div className="p-3 border-t border-slate-500/20">
            <button
              onClick={() => setShowAddElementModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#C5A059] border border-[#C5A059]/30 text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عنصر للقسم</span>
            </button>
          </div>
        </div>

        {/* Center Canvas: Interactive Visual Preview with Full Scroll */}
        <div 
          ref={previewScrollContainerRef}
          aria-label="معاينة الصفحة القابلة للتمرير"
          className={`flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain scroll-smooth p-4 sm:p-6 flex flex-col items-center justify-start relative ${
            theme === 'dark' ? 'bg-[#0D0D0C]' : 'bg-[#EFEAE1]'
          }`}
        >
          <PreviewPageFrame theme={theme} deviceMode={deviceMode}>
            {/* Elements list rendered live */}
            {(!currentPage?.elements || currentPage.elements.length === 0) ? (
              <div className="py-20 px-6 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shadow-inner">
                  <Layout className="w-8 h-8" />
                </div>
                
                <div className="space-y-2 max-w-md">
                  <h3 className="font-bold text-lg sm:text-xl font-serif-display">هذه الصفحة لا تحتوي على عناصر بعد</h3>
                  <p className="text-xs sm:text-sm text-[#8E877D] dark:text-[#9E988D] leading-relaxed">
                    صفحة <span className="text-[#C5A059] font-bold font-mono">"{currentPage?.title}"</span> جاهزة. يمكنك توليد محتوى متكامل ومقترح تلقائياً بنقرة زر واحدة أو إضافة عناصرك الخاصة.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (currentPage?.id) {
                        populatePageWithTemplate(currentPage.id);
                        notify(`تم توليد وتجهيز محتوى صفحة "${currentPage.title}" بنجاح!`);
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] shadow-md transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>توليد محتوى افتراضي متكامل</span>
                  </button>

                  <button
                    onClick={() => setShowAddElementModal(true)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      theme === 'dark' ? 'border-[#2E2B26] text-[#F9F7F2] hover:bg-[#1A1917]' : 'border-[#E5E0D8] text-[#121212] hover:bg-[#F2EFE9]'
                    }`}
                  >
                    <Plus className="w-4 h-4 text-[#C5A059]" />
                    <span>إضافة عنصر من المكتبة</span>
                  </button>
                </div>
              </div>
            ) : (
              currentPage.elements.map((element, idx) => {
                if (!element.visible) return null;
                const isSelected = selectedElementId === element.id;

                const animType = element.motion?.animationType || 'fade-up';
                const duration = element.motion?.duration || 0.6;
                const delay = element.motion?.delay || 0;

                const motionConfig = getMotionConfig(animType, duration, delay);
                const gradientBg = getGradientBackground(element.style?.gradient);

                const customStyle: React.CSSProperties = {
                  width: element.layout?.customWidth || '100%',
                  height: element.layout?.customHeight || 'auto',
                  maxWidth: element.layout?.maxWidth || '100%',
                  background: gradientBg || element.style?.backgroundColor || undefined,
                  backgroundColor: !gradientBg ? (element.style?.backgroundColor || undefined) : undefined,
                  color: element.style?.textColor || undefined,
                  borderColor: element.style?.borderColor || undefined,
                  borderRadius: element.style?.borderRadius || undefined,
                  margin: '0 auto',
                };

                return (
                  <motion.div
                    key={`${element.id}-${animType}-${duration}-${delay}-${animationCycleKey}`}
                    id={`builder-el-${element.id}`}
                    initial={motionConfig.initial}
                    animate={motionConfig.animate}
                    transition={motionConfig.transition}
                    style={customStyle}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElementId(element.id);
                    }}
                    className={`relative transition-all cursor-pointer group ${
                      gradientBg ? 'border border-[#C5A059]/30 rounded-2xl my-2 overflow-hidden' :
                      element.style?.material === 'metal' ? 'bg-gradient-to-r from-[#C5A059]/15 via-[#DFCA9B]/10 to-[#C5A059]/15 border-y border-[#C5A059]/40' :
                      element.style?.material === 'matte' ? 'bg-slate-900/20 dark:bg-black/40 border border-slate-700/30 rounded-2xl my-2 overflow-hidden' :
                      element.style?.material === 'translucent' ? 'bg-white/40 dark:bg-[#1A1917]/40 backdrop-blur-sm border border-white/10 rounded-2xl my-2 overflow-hidden' :
                      'backdrop-blur-md bg-white/60 dark:bg-[#1A1917]/60 border border-[#C5A059]/20 rounded-2xl my-2 overflow-hidden'
                    } ${
                      element.style?.glow ? 'shadow-[0_0_35px_rgba(197,160,89,0.3)] ring-1 ring-[#C5A059]/60' : ''
                    } ${
                      isSelected 
                        ? 'ring-2 ring-[#C5A059] shadow-[0_0_30px_rgba(197,160,89,0.2)] z-20' 
                        : 'hover:ring-1 hover:ring-[#C5A059]/40 hover:shadow-md'
                    }`}
                  >
                    {/* Active Selection Visual Frame & Floating Contextual Actions */}
                    {isSelected && (
                      <>
                        {/* Top Contextual Edit Options Bar */}
                        <div 
                          className="absolute -top-11 right-2 left-2 z-40 flex items-center justify-between gap-2 p-1.5 rounded-xl bg-[#141311]/95 text-[#F9F7F2] border border-[#C5A059]/50 shadow-2xl backdrop-blur-md animate-fade-in"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Element Badge */}
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#C5A059] text-[#121212] text-xs font-bold shrink-0">
                            <Type className="w-3.5 h-3.5" />
                            <span>{element.name}</span>
                            {element.locked && <Lock className="w-3 h-3 text-[#121212]" />}
                          </div>

                          {/* Direct Tab Switchers */}
                          <div className="hidden sm:flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
                            <button
                              type="button"
                              onClick={() => setActiveTab('content')}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                                activeTab === 'content' ? 'bg-[#C5A059] text-[#121212]' : 'text-slate-300 hover:text-white'
                              }`}
                            >
                              المحتوى
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab('layout')}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                                activeTab === 'layout' ? 'bg-[#C5A059] text-[#121212]' : 'text-slate-300 hover:text-white'
                              }`}
                            >
                              التخطيط
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab('appearance')}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                                activeTab === 'appearance' ? 'bg-[#C5A059] text-[#121212]' : 'text-slate-300 hover:text-white'
                              }`}
                            >
                              المظهر
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab('typography')}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                                activeTab === 'typography' ? 'bg-[#C5A059] text-[#121212]' : 'text-slate-300 hover:text-white'
                              }`}
                            >
                              الخطوط والألوان
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab('motion')}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                                activeTab === 'motion' ? 'bg-[#C5A059] text-[#121212]' : 'text-slate-300 hover:text-white'
                              }`}
                            >
                              الحركة
                            </button>
                          </div>

                          {/* Quick Action Icons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => reorderBuilderElement(element.id, 'up')}
                              className="p-1.5 hover:bg-[#2A2824] rounded-lg text-slate-300 hover:text-white transition-colors"
                              title="رفع للأعلى"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => reorderBuilderElement(element.id, 'down')}
                              className="p-1.5 hover:bg-[#2A2824] rounded-lg text-slate-300 hover:text-white transition-colors"
                              title="خفض للأسفل"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => duplicateBuilderElement(element.id)}
                              className="p-1.5 hover:bg-[#2A2824] rounded-lg text-[#C5A059] transition-colors"
                              title="تكرار العنصر"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => updateBuilderElement(element.id, { locked: !element.locked })}
                              className="p-1.5 hover:bg-[#2A2824] rounded-lg text-slate-300 hover:text-white transition-colors"
                              title={element.locked ? 'إلغاء القفل' : 'قفل العنصر'}
                            >
                              {element.locked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteBuilderElement(element.id)}
                              className="p-1.5 hover:bg-rose-500/20 rounded-lg text-rose-400 transition-colors"
                              title="حذف العنصر"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Bounding Box Corner Marks */}
                        <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#C5A059] z-30 pointer-events-none shadow-xs" />
                        <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#C5A059] z-30 pointer-events-none shadow-xs" />
                        <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#C5A059] z-30 pointer-events-none shadow-xs" />
                        <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#C5A059] z-30 pointer-events-none shadow-xs" />
                      </>
                    )}

                    {/* Render Public Component Sections with live Layout & Style bindings */}
                    {element.type === 'hero' && (
                      <PublicHero 
                        title={element.content.title} 
                        subtitle={element.content.subtitle} 
                        description={element.content.description} 
                        buttonText={element.content.buttonText} 
                        layout={element.layout}
                        style={element.style}
                      />
                    )}
                    {element.type === 'expertise' && (
                      <PublicExpertise 
                        title={element.content.title} 
                        subtitle={element.content.subtitle} 
                        description={element.content.description} 
                        layout={element.layout}
                        style={element.style}
                      />
                    )}
                    {element.type === 'projects' && (
                      <PublicProjects 
                        title={element.content.title} 
                        subtitle={element.content.subtitle} 
                        description={element.content.description} 
                        layout={element.layout}
                        style={element.style}
                      />
                    )}
                    {element.type === 'articles' && (
                      <PublicArticles 
                        title={element.content.title} 
                        subtitle={element.content.subtitle} 
                        description={element.content.description} 
                        layout={element.layout}
                        style={element.style}
                      />
                    )}
                    {element.type === 'quote' && (
                      <PublicQuote 
                        title={element.content.title} 
                        description={element.content.description} 
                        layout={element.layout}
                        style={element.style}
                      />
                    )}
                    {element.type === 'contact' && (
                      <PublicContact 
                        title={element.content.title} 
                        subtitle={element.content.subtitle} 
                        description={element.content.description} 
                        layout={element.layout}
                        style={element.style}
                      />
                    )}

                    {/* Custom Heading Element */}
                    {element.type === 'heading' && (
                      <div className={`p-8 ${element.layout.paddingY} text-${element.layout.align || 'center'} space-y-3`}>
                        {element.content.subtitle && (
                          <span 
                            className="text-xs uppercase tracking-widest font-bold block"
                            style={{ color: element.style?.accentColor || '#C5A059' }}
                          >
                            {element.content.subtitle}
                          </span>
                        )}
                        <h2 
                          className={`font-serif tracking-tight ${getTitleFontSizeClass(element.style?.fontSize || 'text-3xl')} ${getFontWeightClass(element.style?.fontWeight || 'font-black')}`}
                          style={{ color: element.style?.textColor || undefined }}
                        >
                          {element.content.title || 'عنوان رئيسي'}
                        </h2>
                        {element.content.description && (
                          <p 
                            className={`opacity-75 max-w-2xl mx-auto leading-relaxed ${getBodyFontSizeClass(element.style?.fontSize)}`}
                            style={{ color: element.style?.textColor || undefined }}
                          >
                            {element.content.description}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Custom Paragraph Element */}
                    {element.type === 'paragraph' && (
                      <div className={`p-8 ${element.layout.paddingY} max-w-3xl mx-auto text-${element.layout.align || 'center'} space-y-3`}>
                        {element.content.title && (
                          <h3 
                            className={`font-serif ${getTitleFontSizeClass(element.style?.fontSize || 'text-xl')} ${getFontWeightClass(element.style?.fontWeight || 'font-bold')}`}
                            style={{ color: element.style?.textColor || undefined }}
                          >
                            {element.content.title}
                          </h3>
                        )}
                        <p 
                          className={`leading-relaxed opacity-85 ${getBodyFontSizeClass(element.style?.fontSize)}`}
                          style={{ color: element.style?.textColor || undefined }}
                        >
                          {element.content.description || 'فقرة نصية غنية مصممة لتوضيح الفكرة وتفاصيل المشروع.'}
                        </p>
                      </div>
                    )}

                    {/* Custom CTA Button Element */}
                    {element.type === 'button' && (
                      <div className={`p-8 ${element.layout.paddingY} flex justify-${element.layout.align === 'start' ? 'start' : element.layout.align === 'end' ? 'end' : 'center'}`}>
                        <button 
                          className={`px-8 py-3.5 rounded-xl text-[#121212] font-bold text-sm shadow-md transition-all ${getFontWeightClass(element.style?.fontWeight || 'font-bold')}`}
                          style={{
                            backgroundColor: element.style?.accentColor || '#C5A059',
                            color: element.style?.textColor || '#121212'
                          }}
                        >
                          {element.content.buttonText || element.content.title || 'زر الإجراء الرئيسي'}
                        </button>
                      </div>
                    )}

                    {/* Custom Image Element */}
                    {element.type === 'image' && (
                      <div className={`p-8 ${element.layout.paddingY} max-w-4xl mx-auto text-center space-y-2`}>
                        <div className="relative rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-lg bg-[#0F0E0C] flex items-center justify-center min-h-64 max-h-[500px]">
                          <img 
                            src={element.content.imageUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80'} 
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 scale-110 pointer-events-none"
                          />
                          <img 
                            src={element.content.imageUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80'} 
                            alt={element.content.title || 'صورة وسائط'} 
                            className="relative z-10 max-h-[500px] max-w-full w-auto h-auto object-contain p-2"
                          />
                        </div>
                        {element.content.title && (
                          <p 
                            className={`opacity-70 italic font-serif ${getBodyFontSizeClass(element.style?.fontSize)}`}
                            style={{ color: element.style?.textColor || undefined }}
                          >
                            {element.content.title}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Custom Stats Block */}
                    {element.type === 'stats' && (
                      <div className={`p-8 ${element.layout.paddingY} max-w-5xl mx-auto`}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { val: '+10', label: 'سنوات من الريادة' },
                            { val: '50+', label: 'مشروع إبداعي منجز' },
                            { val: '99%', label: 'مؤشر رضا الشركاء' },
                            { val: '24/7', label: 'استشارات تقنية وتصميمية' }
                          ].map((stat, i) => (
                            <div 
                              key={i} 
                              className="p-5 rounded-2xl border border-[#C5A059]/20 text-center bg-black/5 dark:bg-white/5"
                              style={{
                                backgroundColor: element.style?.cardBackground || undefined,
                                borderColor: element.style?.borderColor || undefined
                              }}
                            >
                              <span 
                                className={`font-serif block mb-1 ${getTitleFontSizeClass(element.style?.fontSize || 'text-2xl')} ${getFontWeightClass(element.style?.fontWeight || 'font-black')}`}
                                style={{ color: element.style?.accentColor || '#C5A059' }}
                              >
                                {stat.val}
                              </span>
                              <span 
                                className={`font-medium opacity-75 ${getBodyFontSizeClass(element.style?.fontSize)}`}
                                style={{ color: element.style?.cardTextColor || element.style?.textColor || undefined }}
                              >
                                {stat.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Custom Divider Block */}
                    {element.type === 'divider' && (
                      <div className="py-8 flex items-center justify-center gap-4 opacity-70">
                        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#C5A059]" />
                        <div className="w-2 h-2 rotate-45 border border-[#C5A059] bg-[#C5A059]/30" />
                        <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#C5A059]" />
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </PreviewPageFrame>

          {/* Floating Glass Navigation & Scrolling Controller */}
          <div className="sticky bottom-3 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#141311]/90 text-white border border-[#2E2B26]/80 shadow-2xl backdrop-blur-md">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#C5A059] hover:text-[#121212] text-xs font-bold transition-all"
              title="التمرير إلى أعلى الصفحة"
            >
              <ChevronUp className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">أعلى الصفحة</span>
            </button>
            
            <div className="h-4 w-[1px] bg-white/20 mx-1" />

            {/* Quick Section Switcher Pills */}
            <div className="flex items-center gap-1 max-w-[260px] sm:max-w-[380px] overflow-x-auto py-0.5 no-scrollbar">
              {currentPage?.elements?.map((el, idx) => (
                <button
                  key={el.id}
                  type="button"
                  onClick={() => scrollToElement(el.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                    selectedElementId === el.id
                      ? 'bg-[#C5A059] text-[#121212] shadow-xs'
                      : 'bg-white/5 hover:bg-white/15 text-slate-300'
                  }`}
                  title={`الانتقال إلى: ${el.name}`}
                >
                  <span className="opacity-70">{idx + 1}.</span>
                  <span className="max-w-[80px] truncate">{el.name}</span>
                </button>
              ))}
            </div>

            <div className="h-4 w-[1px] bg-white/20 mx-1" />

            <button
              type="button"
              onClick={scrollToBottom}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#C5A059] hover:text-[#121212] text-xs font-bold transition-all"
              title="التمرير إلى أسفل الصفحة"
            >
              <ChevronDown className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">أسفل الصفحة</span>
            </button>
          </div>
        </div>

        {/* Left Column (in RTL): Properties Inspector */}
        <div className={`w-84 border-r flex flex-col shrink-0 z-20 transition-colors ${
          theme === 'dark' ? 'bg-[#141311] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E5E0D8] shadow-xs'
        }`}>
          {/* Inspector Header & Active Element Switcher */}
          <div className="p-3 border-b border-slate-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">لوحة خصائص العناصر</span>
              <span className="text-[10px] text-[#C5A059] font-mono font-bold bg-[#C5A059]/10 px-2 py-0.5 rounded-md">
                {currentPage?.elements.length || 0} عنصر
              </span>
            </div>

            {/* Element Quick Selector Dropdown */}
            {currentPage && currentPage.elements.length > 0 && (
              <div>
                <select
                  value={selectedElement?.id || ''}
                  onChange={(e) => setSelectedElementId(e.target.value)}
                  className={`w-full px-2.5 py-1.5 rounded-xl border text-xs font-bold outline-none transition-colors ${
                    theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-white focus:border-[#C5A059]' : 'bg-white border-[#E5E0D8] text-slate-900 focus:border-[#C5A059]'
                  }`}
                >
                  {currentPage.elements.map((el, idx) => (
                    <option key={el.id} value={el.id}>
                      {idx + 1}. {el.name} ({el.type})
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Category Tabs */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-[10px] font-bold pt-1">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-1.5 rounded-lg text-center transition-colors ${
                  activeTab === 'content' 
                    ? 'bg-[#C5A059] text-[#121212]' 
                    : theme === 'dark' ? 'text-[#8E877D] hover:text-[#F9F7F2]' : 'text-[#5A554E] hover:text-[#121212]'
                }`}
                title="المحتوى"
              >
                المحتوى
              </button>
              <button
                onClick={() => setActiveTab('layout')}
                className={`py-1.5 rounded-lg text-center transition-colors ${
                  activeTab === 'layout' 
                    ? 'bg-[#C5A059] text-[#121212]' 
                    : theme === 'dark' ? 'text-[#8E877D] hover:text-[#F9F7F2]' : 'text-[#5A554E] hover:text-[#121212]'
                }`}
                title="التخطيط"
              >
                التخطيط
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`py-1.5 rounded-lg text-center transition-colors ${
                  activeTab === 'appearance' 
                    ? 'bg-[#C5A059] text-[#121212]' 
                    : theme === 'dark' ? 'text-[#8E877D] hover:text-[#F9F7F2]' : 'text-[#5A554E] hover:text-[#121212]'
                }`}
                title="المظهر"
              >
                المظهر
              </button>
              <button
                onClick={() => setActiveTab('typography')}
                className={`py-1.5 rounded-lg text-center transition-colors ${
                  activeTab === 'typography' 
                    ? 'bg-[#C5A059] text-[#121212]' 
                    : theme === 'dark' ? 'text-[#8E877D] hover:text-[#F9F7F2]' : 'text-[#5A554E] hover:text-[#121212]'
                }`}
                title="الخطوط"
              >
                الخطوط
              </button>
              <button
                onClick={() => setActiveTab('motion')}
                className={`py-1.5 rounded-lg text-center transition-colors ${
                  activeTab === 'motion' 
                    ? 'bg-[#C5A059] text-[#121212]' 
                    : theme === 'dark' ? 'text-[#8E877D] hover:text-[#F9F7F2]' : 'text-[#5A554E] hover:text-[#121212]'
                }`}
                title="الحركة"
              >
                الحركة
              </button>
              <button
                onClick={() => setActiveTab('responsive')}
                className={`py-1.5 rounded-lg text-center transition-colors ${
                  activeTab === 'responsive' 
                    ? 'bg-[#C5A059] text-[#121212]' 
                    : theme === 'dark' ? 'text-[#8E877D] hover:text-[#F9F7F2]' : 'text-[#5A554E] hover:text-[#121212]'
                }`}
                title="الاستجابة"
              >
                الاستجابة
              </button>
            </div>
          </div>

          {/* Inspector Body Inputs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-right text-xs">
            {selectedElement ? (
              <>
                <div className={`p-2.5 rounded-xl border flex items-center justify-between font-bold ${
                  theme === 'dark' ? 'bg-[#1A1917] border-[#C5A059]/30 text-[#C5A059]' : 'bg-[#FAF5EB] border-[#C5A059]/40 text-[#8F6E30]'
                }`}>
                  <span className="truncate">العنصر المحدد: {selectedElement.name}</span>
                  <span className="text-[10px] font-mono opacity-70 bg-[#C5A059]/20 px-1.5 py-0.5 rounded shrink-0">{selectedElement.type}</span>
                </div>

                {activeTab === 'content' && (
                  <div className="space-y-4">
                    {/* Hero Specific Animation Settings Quick Jump */}
                    {selectedElement.type === 'hero' && (
                      <div className="p-3 rounded-xl border border-[#C5A059]/40 bg-[#C5A059]/10 space-y-2">
                        <div className="flex items-center gap-2 text-[#C5A059] font-bold">
                          <Sparkles className="w-4 h-4" />
                          <span>أنيميشن وإضاءة خلفية الهيرو التفاعلية</span>
                        </div>
                        <p className="text-[11px] text-[#8E877D] dark:text-[#E8D4A8] leading-relaxed">
                          يمكنك اختيار نمط حركة الكود، الشبكة العصبية للذكاء الاصطناعي، سرعة وانسيابية الحركة والتحكم بشدة الإضاءة.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowSettingsModal(true)}
                          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#C5A059] text-[#121212] font-bold text-xs shadow-xs hover:bg-[#B8934A] transition-all"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>فتح لوحة تخصيص أنيميشن الهيرو</span>
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">اسم الطبقة (Layer Name)</label>
                      <input
                        type="text"
                        value={selectedElement.name}
                        onChange={(e) => updateBuilderElement(selectedElement.id, { name: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border outline-none ${
                          theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white focus:border-[#C5A059]' : 'bg-white border-[#E5E0D8] text-slate-900 focus:border-[#C5A059]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">العنوان الرئيسي (Title)</label>
                      <input
                        type="text"
                        value={selectedElement.content.title || ''}
                        onChange={(e) => updateBuilderElement(selectedElement.id, {
                          content: { ...selectedElement.content, title: e.target.value }
                        })}
                        placeholder="أدخل العنوان الرئيسي..."
                        className={`w-full px-3 py-2 rounded-lg border outline-none ${
                          theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white focus:border-[#C5A059]' : 'bg-white border-[#E5E0D8] text-slate-900 focus:border-[#C5A059]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">العنوان الفرعي أو الشارة (Subtitle)</label>
                      <input
                        type="text"
                        value={selectedElement.content.subtitle || ''}
                        onChange={(e) => updateBuilderElement(selectedElement.id, {
                          content: { ...selectedElement.content, subtitle: e.target.value }
                        })}
                        placeholder="أدخل العنوان الفرعي..."
                        className={`w-full px-3 py-2 rounded-lg border outline-none ${
                          theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white focus:border-[#C5A059]' : 'bg-white border-[#E5E0D8] text-slate-900 focus:border-[#C5A059]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">الوصف أو الفقرة النصية</label>
                      <textarea
                        rows={3}
                        value={selectedElement.content.description || ''}
                        onChange={(e) => updateBuilderElement(selectedElement.id, {
                          content: { ...selectedElement.content, description: e.target.value }
                        })}
                        placeholder="أدخل الوصف أو النص التوضيحي..."
                        className={`w-full px-3 py-2 rounded-lg border outline-none ${
                          theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white focus:border-[#C5A059]' : 'bg-white border-[#E5E0D8] text-slate-900 focus:border-[#C5A059]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">نص الزر التفاعلي (Button CTA)</label>
                      <input
                        type="text"
                        value={selectedElement.content.buttonText || ''}
                        onChange={(e) => updateBuilderElement(selectedElement.id, {
                          content: { ...selectedElement.content, buttonText: e.target.value }
                        })}
                        placeholder="مثال: تواصل الآن / تصفح المشاريع"
                        className={`w-full px-3 py-2 rounded-lg border outline-none ${
                          theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white focus:border-[#C5A059]' : 'bg-white border-[#E5E0D8] text-slate-900 focus:border-[#C5A059]'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-slate-400 font-semibold text-xs">رابط الزر التفاعلي (Button Link):</label>
                        {selectedElement.content.buttonLink && (
                          <a
                            href={selectedElement.content.buttonLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#C5A059] hover:underline flex items-center gap-1 font-bold"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>تجربة الرابط</span>
                          </a>
                        )}
                      </div>
                      <input
                        type="text"
                        value={selectedElement.content.buttonLink || ''}
                        onChange={(e) => updateBuilderElement(selectedElement.id, {
                          content: { ...selectedElement.content, buttonLink: e.target.value }
                        })}
                        placeholder="#contact أو #projects أو رابط خارجي https://..."
                        className={`w-full px-3 py-2 rounded-lg border outline-none font-mono text-xs ${
                          theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white focus:border-[#C5A059]' : 'bg-white border-[#E5E0D8] text-slate-900 focus:border-[#C5A059]'
                        }`}
                      />
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {[
                          { label: 'المشاريع', val: '#projects' },
                          { label: 'التواصل', val: '#contact' },
                          { label: 'الخبرات', val: '#expertise' },
                          { label: 'المقالات', val: '#articles' },
                        ].map((sug) => (
                          <button
                            key={sug.val}
                            type="button"
                            onClick={() => updateBuilderElement(selectedElement.id, {
                              content: { ...selectedElement.content, buttonLink: sug.val }
                            })}
                            className="px-2 py-0.5 text-[10px] rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-[#C5A059] hover:text-black transition-colors"
                          >
                            {sug.label} ({sug.val})
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Direct Video or YouTube/Vimeo Embed Field */}
                    <div className="pt-2 border-t border-slate-500/25 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-400 font-semibold text-xs flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5 text-rose-400" />
                          <span>رابط فيديو قابل للتشغيل (YouTube / Vimeo / MP4):</span>
                        </label>
                        {selectedElement.content.videoUrl && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                            فيديو مفعل
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={selectedElement.content.videoUrl || ''}
                        onChange={(e) => updateBuilderElement(selectedElement.id, {
                          content: { ...selectedElement.content, videoUrl: e.target.value }
                        })}
                        placeholder="مثال: https://www.youtube.com/watch?v=... أو رابط فيديو مباشر"
                        className={`w-full px-3 py-2 rounded-lg border outline-none font-mono text-xs ${
                          theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white focus:border-[#C5A059]' : 'bg-white border-[#E5E0D8] text-slate-900 focus:border-[#C5A059]'
                        }`}
                      />
                    </div>

                    {/* Image selector if element has imageUrl or is image type */}
                    <div className="space-y-2 pt-2 border-t border-slate-500/25">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-400 font-semibold text-xs">صورة العنصر:</label>
                        <label className="text-[11px] text-[#C5A059] hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                          <Upload className="w-3 h-3" />
                          <span>رفع صورة جديدة</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const optUrl = await optimizeImage(file, 1200, 800, 0.82);
                                  const newItem: MediaItem = {
                                    id: 'med_' + Date.now(),
                                    name: file.name,
                                    url: optUrl,
                                    originalUrl: optUrl,
                                    type: (file.type.split('/')[1]?.toUpperCase() || 'JPG') as any,
                                    dimensions: '1200 × 800',
                                    fileSize: `${(optUrl.length / 1024).toFixed(0)} KB`,
                                    addedDate: new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
                                    altText: 'صورة منشورة في الباني',
                                    keywords: ['باني', 'صفحات'],
                                    license: 'شخصي',
                                    adjustments: {
                                      brightness: 0,
                                      contrast: 0,
                                      saturation: 0,
                                      temperature: 0,
                                      sharpness: 0,
                                      opacity: 0,
                                      cropRatio: 'free',
                                      rotate: 0,
                                      flipH: false,
                                      flipV: false,
                                      focalPoint: { x: 50, y: 50 }
                                    },
                                    versions: []
                                  };
                                  const savedMedia = await addMediaItem(newItem);
                                  if (!savedMedia) return;
                                  updateBuilderElement(selectedElement.id, {
                                    content: { ...selectedElement.content, imageUrl: savedMedia.url }
                                  });
                                  notify('تم رفع الصورة وإدراجها في العنصر بنجاح!');
                                } catch {
                                  notify('تعذر رفع الصورة', 'warning');
                                }
                              }
                            }}
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        value={selectedElement.content.imageUrl || ''}
                        onChange={(e) => updateBuilderElement(selectedElement.id, {
                          content: { ...selectedElement.content, imageUrl: e.target.value }
                        })}
                        placeholder="https://... أو مسار الصورة"
                        className={`w-full px-3 py-2 rounded-lg border outline-none font-mono text-[11px] ${
                          theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white focus:border-[#C5A059]' : 'bg-white border-[#E5E0D8] text-slate-900 focus:border-[#C5A059]'
                        }`}
                      />

                      <span className="text-[11px] text-slate-400 block font-semibold">اختر من مكتبة الوسائط:</span>
                      <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto p-1 rounded-xl bg-black/10 border border-slate-500/20">
                        {mediaList.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              updateBuilderElement(selectedElement.id, {
                                content: { ...selectedElement.content, imageUrl: item.url }
                              });
                              notify('تم اختيار الصورة للعنصر');
                            }}
                            className={`relative aspect-video rounded-lg overflow-hidden border transition-all cursor-pointer ${
                              selectedElement.content.imageUrl === item.url 
                                ? 'border-[#C5A059] ring-2 ring-[#C5A059]/60 opacity-100' 
                                : 'border-transparent opacity-65 hover:opacity-100'
                            }`}
                          >
                            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                            {selectedElement.content.imageUrl === item.url && (
                              <div className="absolute top-1 right-1 bg-[#C5A059] text-black rounded-full p-0.5 shadow-xs">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Projects Section Manager when selected element is 'projects' */}
                    {selectedElement.type === 'projects' && (
                      <div className="mt-6 pt-4 border-t border-[#C5A059]/30 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[#C5A059] font-bold text-xs">
                            <FolderGit2 className="w-4 h-4" />
                            <span>إدارة مشاريع المعرض والأعمال ({projects.length})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newProj: ProjectItem = {
                                id: 'proj_' + Date.now(),
                                title: 'مشروع جديد مبتكر',
                                category: 'حلول رقمية',
                                description: 'وصف تفصيلي للمشروع والقيمة المضافة التي يقدمها للمستخدمين والعملاء...',
                                imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
                                year: '2026',
                                role: 'Lead Architect',
                                tools: ['React', 'TypeScript', 'Tailwind CSS'],
                                externalUrl: '',
                                link: '',
                                videoUrl: ''
                              };
                              addProject(newProj);
                              notify('تمت إضافة مشروع جديد لمعرض الأعمال!');
                            }}
                            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#C5A059] text-black hover:bg-[#b8934a] transition-all cursor-pointer shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>إضافة مشروع</span>
                          </button>
                        </div>

                        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                          {projects.map((proj) => {
                            const pUrl = (proj.externalUrl || proj.link || proj.videoUrl || '').trim();
                            const vInfo = getVideoEmbedInfo(pUrl);

                            return (
                              <div
                                key={proj.id}
                                className={`p-3.5 rounded-2xl border space-y-2.5 transition-all ${
                                  theme === 'dark' ? 'bg-[#181614] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                                    <div className="w-10 h-8 rounded-lg overflow-hidden bg-black shrink-0 border border-[#C5A059]/30">
                                      <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                                    </div>
                                    <input
                                      type="text"
                                      value={proj.title}
                                      onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                                      className="font-bold text-xs bg-transparent border-b border-transparent focus:border-[#C5A059] outline-none flex-1 truncate"
                                      placeholder="عنوان المشروع..."
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`هل أنت متأكد من حذف مشروع "${proj.title}"؟`)) {
                                        deleteProject(proj.id);
                                        notify('تم حذف المشروع');
                                      }
                                    }}
                                    className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-500/10 cursor-pointer"
                                    title="حذف المشروع"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Project Link / Video URL Input */}
                                <div className="p-2.5 rounded-xl bg-black/10 dark:bg-black/30 border border-slate-500/20 space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-[#C5A059] flex items-center gap-1">
                                      {vInfo.isVideo ? (
                                        <Play className="w-3 h-3 fill-current text-rose-400" />
                                      ) : (
                                        <ExternalLink className="w-3 h-3" />
                                      )}
                                      <span>رابط المشروع أو الفيديو (URL / YouTube / Demo):</span>
                                    </label>
                                    {pUrl && (
                                      <a
                                        href={pUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-[#C5A059] hover:underline font-bold flex items-center gap-0.5"
                                      >
                                        <span>اختبار وفتح الرابط</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    )}
                                  </div>
                                  <input
                                    type="text"
                                    value={proj.externalUrl || proj.link || ''}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateProject(proj.id, { 
                                        externalUrl: val,
                                        link: val
                                      });
                                    }}
                                    placeholder="مثال: https://youtube.com/watch?v=... أو https://example.com"
                                    className={`w-full px-2.5 py-1.5 rounded-lg border text-[11px] font-mono outline-none ${
                                      theme === 'dark' ? 'bg-[#121212] border-[#2A2824] text-white focus:border-[#C5A059]' : 'bg-white border-[#E5E0D8] text-slate-900 focus:border-[#C5A059]'
                                    }`}
                                  />
                                </div>

                                {/* Project Image URL + Upload */}
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[10px] text-slate-400">صورة المشروع الرئيسية:</label>
                                    <label className="text-[10px] text-[#C5A059] hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                                      <Upload className="w-2.5 h-2.5" />
                                      <span>رفع صورة</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            try {
                                              const optUrl = await optimizeImage(file, 1200, 800, 0.82);
                                              updateProject(proj.id, { imageUrl: optUrl });
                                              notify('تم تحديث صورة المشروع بنجاح!');
                                            } catch {
                                              notify('تعذر معالجة الصورة', 'warning');
                                            }
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                  <input
                                    type="text"
                                    value={proj.imageUrl}
                                    onChange={(e) => updateProject(proj.id, { imageUrl: e.target.value })}
                                    placeholder="https://..."
                                    className={`w-full px-2 py-1 rounded border text-[10px] font-mono outline-none ${
                                      theme === 'dark' ? 'bg-[#121212] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                                    }`}
                                  />
                                </div>

                                {/* Category & Year */}
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">التصنيف / الفئة</label>
                                    <input
                                      type="text"
                                      value={proj.category}
                                      onChange={(e) => updateProject(proj.id, { category: e.target.value })}
                                      className={`w-full px-2 py-1 rounded border text-[11px] outline-none ${
                                        theme === 'dark' ? 'bg-[#121212] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                                      }`}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-slate-400 mb-0.5">سنة التنفيذ</label>
                                    <input
                                      type="text"
                                      value={proj.year || ''}
                                      onChange={(e) => updateProject(proj.id, { year: e.target.value })}
                                      className={`w-full px-2 py-1 rounded border text-[11px] outline-none ${
                                        theme === 'dark' ? 'bg-[#121212] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                                      }`}
                                    />
                                  </div>
                                </div>

                                {/* Description */}
                                <div>
                                  <label className="block text-[10px] text-slate-400 mb-0.5">الوصف المختصر</label>
                                  <textarea
                                    rows={2}
                                    value={proj.description}
                                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                                    className={`w-full px-2 py-1 rounded border text-[11px] outline-none ${
                                      theme === 'dark' ? 'bg-[#121212] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                                    }`}
                                  />
                                </div>

                                {/* Tools */}
                                <div>
                                  <label className="block text-[10px] text-slate-400 mb-0.5">الأدوات والتقنيات (مفصولة بفواصل)</label>
                                  <input
                                    type="text"
                                    value={(proj.tools || []).join(', ')}
                                    onChange={(e) => updateProject(proj.id, { tools: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                    placeholder="React, TypeScript, Figma..."
                                    className={`w-full px-2 py-1 rounded border text-[11px] outline-none ${
                                      theme === 'dark' ? 'bg-[#121212] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                                    }`}
                                  />
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Expertise Section Cards Manager */}
                    {selectedElement.type === 'expertise' && (
                      <div className="mt-6 pt-4 border-t border-[#C5A059]/30 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[#C5A059] font-bold text-xs">
                            <Layers className="w-4 h-4" />
                            <span>إدارة البطاقات الإرشادية ({services.length})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (services.length > 0) {
                                  openIconLibrary({
                                    type: 'service',
                                    id: services[0].id,
                                    currentIconName: services[0].iconName,
                                    currentColor: services[0].iconColor,
                                    currentSize: services[0].iconSize,
                                    currentRotation: services[0].iconRotation
                                  });
                                }
                              }}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059] font-bold text-[11px] hover:bg-[#C5A059]/20 transition-all shadow-xs"
                              title="فتح حزم ومجموعات الأيقونات الجاهزة"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>حزم الأيقونات (Presets)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                addService({
                                  id: 'srv_' + Date.now(),
                                  title: 'بطاقة خدمة جديدة',
                                  description: 'أدخل تفاصيل ووصف هذه الخدمة أو البطاقة الإرشادية هنا.',
                                  iconName: 'Sparkles',
                                  category: 'تطوير',
                                  tags: ['Tech', 'AI'],
                                  order: services.length + 1
                                });
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#C5A059] text-[#121212] font-bold text-[11px] hover:bg-[#B8934A] transition-all shadow-xs"
                            >
                              <Plus className="w-3 h-3" />
                              <span>إضافة بطاقة</span>
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                          {services.map((srv, idx) => (
                            <div 
                              key={srv.id}
                              className={`p-3 rounded-xl border space-y-2 transition-all ${
                                theme === 'dark' ? 'bg-[#1A1917]/90 border-[#2A2824]' : 'bg-[#F9F7F2] border-[#E5E0D8]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#C5A059] font-bold">
                                    بطاقة #{idx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => openIconLibrary({
                                      type: 'service',
                                      id: srv.id,
                                      currentIconName: srv.iconName,
                                      currentColor: srv.iconColor,
                                      currentSize: srv.iconSize,
                                      currentRotation: srv.iconRotation
                                    })}
                                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#C5A059]/15 text-[#C5A059] hover:bg-[#C5A059]/30 text-[10px] font-bold transition-all border border-[#C5A059]/30"
                                    title="تغيير الأيقونة والخصائص"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    <span>{srv.iconName}</span>
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => deleteService(srv.id)}
                                  className="text-rose-400 hover:text-rose-600 p-1 rounded transition-colors"
                                  title="حذف البطاقة"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div>
                                <label className="block text-[11px] text-slate-400 mb-0.5">عنوان البطاقة</label>
                                <input
                                  type="text"
                                  value={srv.title}
                                  onChange={(e) => updateService(srv.id, { title: e.target.value })}
                                  className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                                    theme === 'dark' ? 'bg-[#121212] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                                  }`}
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] text-slate-400 mb-0.5">الوصف والتفاصيل</label>
                                <textarea
                                  rows={2}
                                  value={srv.description}
                                  onChange={(e) => updateService(srv.id, { description: e.target.value })}
                                  className={`w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none ${
                                    theme === 'dark' ? 'bg-[#121212] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                                  }`}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[10px] text-slate-400 mb-0.5">الشارة / القسم</label>
                                  <input
                                    type="text"
                                    value={srv.category}
                                    onChange={(e) => updateService(srv.id, { category: e.target.value })}
                                    className={`w-full px-2 py-1 rounded border text-[11px] outline-none ${
                                      theme === 'dark' ? 'bg-[#121212] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] text-slate-400 mb-0.5">الوسوم (مفصولة بفواصل)</label>
                                  <input
                                    type="text"
                                    value={srv.tags.join(', ')}
                                    onChange={(e) => updateService(srv.id, { tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                    className={`w-full px-2 py-1 rounded border text-[11px] outline-none ${
                                      theme === 'dark' ? 'bg-[#121212] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'layout' && (
                  <div className="space-y-4">
                    {/* Section Container Padding */}
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">الهوامش الرأسية للقسم (Padding Y)</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { val: 'py-6', label: 'مدمج (py-6)' },
                          { val: 'py-12', label: 'متوازن (py-12)' },
                          { val: 'py-16', label: 'قياسي (py-16)' },
                          { val: 'py-24', label: 'فسيح (py-24)' },
                          { val: 'py-32', label: 'فاخر (py-32)' },
                        ].map((pad) => (
                          <button
                            key={pad.val}
                            type="button"
                            onClick={() => updateBuilderElement(selectedElement.id, {
                              layout: { ...selectedElement.layout, paddingY: pad.val }
                            })}
                            className={`py-2 rounded-lg border font-bold text-xs transition-all ${
                              selectedElement.layout?.paddingY === pad.val 
                                ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]' 
                                : theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:bg-[#1E1C18]' : 'border-[#E5E0D8] text-slate-600 hover:bg-[#F2EFE9]'
                            }`}
                          >
                            {pad.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Horizontal Alignment */}
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">المحاذاة الأفقية</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['start', 'center', 'end'] as const).map((align) => (
                          <button
                            key={align}
                            type="button"
                            onClick={() => updateBuilderElement(selectedElement.id, {
                              layout: { ...selectedElement.layout, align }
                            })}
                            className={`py-2 rounded-lg border font-bold transition-all ${
                              selectedElement.layout?.align === align 
                                ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]' 
                                : theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:bg-[#1E1C18]' : 'border-[#E5E0D8] text-slate-600 hover:bg-[#F2EFE9]'
                            }`}
                          >
                            {align === 'start' ? 'يمين' : align === 'center' ? 'وسط' : 'يسار'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Section Max Width */}
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">أقصى عرض للحاوية (Max Width)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: 'max-w-3xl', label: 'مضغوط (3xl)' },
                          { val: 'max-w-5xl', label: 'متوازن (5xl)' },
                          { val: 'max-w-7xl', label: 'عريض (7xl)' },
                          { val: 'max-w-full', label: 'كامل الشاشة (Full)' },
                        ].map((w) => (
                          <button
                            key={w.val}
                            type="button"
                            onClick={() => updateBuilderElement(selectedElement.id, {
                              layout: { ...selectedElement.layout, maxWidth: w.val }
                            })}
                            className={`py-2 rounded-xl border text-center font-bold text-xs transition-all ${
                              selectedElement.layout?.maxWidth === w.val
                                ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]'
                                : theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:bg-[#1E1C18]' : 'border-[#E5E0D8] text-slate-600 hover:bg-[#F2EFE9]'
                            }`}
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Section Container Custom Dimensions with +/- Buttons */}
                    <div className="p-3 rounded-xl border border-slate-500/20 space-y-3">
                      <span className="block font-bold text-xs text-[#C5A059]">أبعاد الحاوية الرئيسية للقسم (Section Box)</span>
                      
                      {/* Width */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-400 font-semibold text-[11px]">العرض (Width)</label>
                          <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.layout?.customWidth || '100%'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const cur = selectedElement.layout?.customWidth || '100%';
                              const num = parseInt(cur, 10);
                              if (cur.endsWith('%')) {
                                const nextVal = Math.max(20, (isNaN(num) ? 100 : num) - 5);
                                updateBuilderElement(selectedElement.id, { layout: { ...selectedElement.layout, customWidth: `${nextVal}%` } });
                              } else {
                                const nextVal = Math.max(200, (isNaN(num) ? 800 : num) - 20);
                                updateBuilderElement(selectedElement.id, { layout: { ...selectedElement.layout, customWidth: `${nextVal}px` } });
                              }
                            }}
                            className={`p-2 rounded-lg border font-bold text-xs ${
                              theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                            }`}
                            title="إنقاص العرض"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="text"
                            value={selectedElement.layout?.customWidth || '100%'}
                            onChange={(e) => updateBuilderElement(selectedElement.id, {
                              layout: { ...selectedElement.layout, customWidth: e.target.value }
                            })}
                            placeholder="100% أو 900px"
                            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs text-center font-mono outline-none ${
                              theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const cur = selectedElement.layout?.customWidth || '100%';
                              const num = parseInt(cur, 10);
                              if (cur.endsWith('%')) {
                                const nextVal = Math.min(100, (isNaN(num) ? 100 : num) + 5);
                                updateBuilderElement(selectedElement.id, { layout: { ...selectedElement.layout, customWidth: `${nextVal}%` } });
                              } else {
                                const nextVal = (isNaN(num) ? 800 : num) + 20;
                                updateBuilderElement(selectedElement.id, { layout: { ...selectedElement.layout, customWidth: `${nextVal}px` } });
                              }
                            }}
                            className={`p-2 rounded-lg border font-bold text-xs ${
                              theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                            }`}
                            title="زيادة العرض"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Height */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-400 font-semibold text-[11px]">الارتفاع الأدنى (Min Height)</label>
                          <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.layout?.customHeight || 'auto'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const cur = selectedElement.layout?.customHeight || 'auto';
                              const num = parseInt(cur, 10);
                              const nextVal = Math.max(100, (isNaN(num) ? 400 : num) - 20);
                              updateBuilderElement(selectedElement.id, { layout: { ...selectedElement.layout, customHeight: `${nextVal}px` } });
                            }}
                            className={`p-2 rounded-lg border font-bold text-xs ${
                              theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                            }`}
                            title="إنقاص الارتفاع"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="text"
                            value={selectedElement.layout?.customHeight || 'auto'}
                            onChange={(e) => updateBuilderElement(selectedElement.id, {
                              layout: { ...selectedElement.layout, customHeight: e.target.value }
                            })}
                            placeholder="auto أو 450px"
                            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs text-center font-mono outline-none ${
                              theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const cur = selectedElement.layout?.customHeight || 'auto';
                              const num = parseInt(cur, 10);
                              const nextVal = (isNaN(num) ? 400 : num) + 20;
                              updateBuilderElement(selectedElement.id, { layout: { ...selectedElement.layout, customHeight: `${nextVal}px` } });
                            }}
                            className={`p-2 rounded-lg border font-bold text-xs ${
                              theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                            }`}
                            title="زيادة الارتفاع"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Inner Cards & Elements Dimensions Controls */}
                    <div className="p-3 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#C5A059]">أبعاد البطاقات الداخلية (Card Dimensions)</span>
                        <span className="text-[10px] text-slate-400">تطبيق على عناصر القسم</span>
                      </div>

                      {/* Card Width */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-400 font-semibold text-[11px]">عرض البطاقة (Card Width Px)</label>
                          <span className="font-mono text-[10px] text-[#C5A059]">
                            {selectedElement.layout?.cardWidthPx ? `${selectedElement.layout.cardWidthPx}px` : 'تلقائي (Auto)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const current = selectedElement.layout?.cardWidthPx || 320;
                              const next = Math.max(160, current - 20);
                              updateBuilderElement(selectedElement.id, { layout: { ...selectedElement.layout, cardWidthPx: next } });
                            }}
                            className={`p-2 rounded-lg border font-bold text-xs ${
                              theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                            }`}
                            title="إنقاص عرض البطاقة"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            value={selectedElement.layout?.cardWidthPx || ''}
                            onChange={(e) => {
                              const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                              updateBuilderElement(selectedElement.id, { layout: { ...selectedElement.layout, cardWidthPx: val } });
                            }}
                            placeholder="تلقائي (مثال: 320)"
                            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs text-center font-mono outline-none ${
                              theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const current = selectedElement.layout?.cardWidthPx || 320;
                              const next = current + 20;
                              updateBuilderElement(selectedElement.id, { layout: { ...selectedElement.layout, cardWidthPx: next } });
                            }}
                            className={`p-2 rounded-lg border font-bold text-xs ${
                              theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                            }`}
                            title="زيادة عرض البطاقة"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Card Height */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-400 font-semibold text-[11px]">ارتفاع البطاقة (Card Height Px)</label>
                          <span className="font-mono text-[10px] text-[#C5A059]">
                            {selectedElement.layout?.cardHeightPx ? `${selectedElement.layout.cardHeightPx}px` : 'تلقائي (Auto)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const current = selectedElement.layout?.cardHeightPx || 280;
                              const next = Math.max(120, current - 20);
                              updateBuilderElement(selectedElement.id, { layout: { ...selectedElement.layout, cardHeightPx: next } });
                            }}
                            className={`p-2 rounded-lg border font-bold text-xs ${
                              theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                            }`}
                            title="إنقاص ارتفاع البطاقة"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            value={selectedElement.layout?.cardHeightPx || ''}
                            onChange={(e) => {
                              const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                              updateBuilderElement(selectedElement.id, { layout: { ...selectedElement.layout, cardHeightPx: val } });
                            }}
                            placeholder="تلقائي (مثال: 280)"
                            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs text-center font-mono outline-none ${
                              theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const current = selectedElement.layout?.cardHeightPx || 280;
                              const next = current + 20;
                              updateBuilderElement(selectedElement.id, { layout: { ...selectedElement.layout, cardHeightPx: next } });
                            }}
                            className={`p-2 rounded-lg border font-bold text-xs ${
                              theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                            }`}
                            title="زيادة ارتفاع البطاقة"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-4">
                    {/* Material Surface */}
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">نوع الخامة والأسلوب البصري</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['glass', 'metal', 'matte', 'translucent'] as const).map((mat) => (
                          <button
                            key={mat}
                            type="button"
                            onClick={() => updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, material: mat }
                            })}
                            className={`py-2.5 rounded-xl border text-center font-bold text-xs capitalize transition-all ${
                              selectedElement.style?.material === mat
                                ? 'bg-[#C5A059] text-[#121212] border-[#C5A059] shadow-xs'
                                : theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:bg-[#1E1C18]' : 'border-[#E5E0D8] text-slate-600 hover:bg-[#F2EFE9]'
                            }`}
                          >
                            {mat === 'glass' ? 'زجاج مصقول (Glass)' : mat === 'metal' ? 'معدن ذهبي (Gold Metal)' : mat === 'matte' ? 'سطح غير لامع (Matte)' : 'خلفية ناعمة (Translucent)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gradient Background Studio */}
                    <div className={`p-3.5 rounded-2xl border transition-all space-y-4 ${
                      selectedElement.style?.gradient?.enabled
                        ? 'border-[#C5A059] bg-[#C5A059]/10 shadow-[0_0_20px_rgba(197,160,89,0.15)]'
                        : theme === 'dark' ? 'border-[#2A2824] bg-[#1A1917]' : 'border-[#E5E0D8] bg-white'
                    }`}>
                      {/* Header & Toggle */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-[#C5A059]/20 text-[#C5A059]">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-xs block text-[#C5A059]">استوديو التدرج اللوني (Gradient Studio)</span>
                            <span className="text-[10px] text-slate-400">تطبيق تدرجات لونية مخصصة وزوايا متقدمة</span>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedElement.style?.gradient?.enabled || false}
                            onChange={(e) => {
                              const enabled = e.target.checked;
                              const currentGrad = selectedElement.style?.gradient || {
                                enabled: false,
                                type: 'linear',
                                angle: 135,
                                startColor: '#2B2313',
                                middleColor: '#1B1710',
                                endColor: '#0D0C0A',
                                useMiddleColor: true,
                              };
                              updateBuilderElement(selectedElement.id, {
                                style: {
                                  ...selectedElement.style,
                                  gradient: {
                                    ...currentGrad,
                                    enabled,
                                  }
                                }
                              });
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-10 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C5A059]"></div>
                        </label>
                      </div>

                      {selectedElement.style?.gradient?.enabled && (
                        <div className="space-y-4 pt-2 border-t border-[#C5A059]/20 animate-fade-in">
                          
                          {/* Live Mini Preview Bar */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-semibold text-slate-300">المعاينة المباشرة للتدرج</span>
                              <span className="text-[10px] font-mono text-[#C5A059]">
                                {selectedElement.style.gradient.type === 'radial' ? 'إشعاعي (Radial)' : `${selectedElement.style.gradient.angle ?? 135}° (Linear)`}
                              </span>
                            </div>
                            <div 
                              className="w-full h-12 rounded-xl border border-white/20 shadow-inner relative overflow-hidden flex items-center justify-between px-3"
                              style={{
                                background: getGradientBackground(selectedElement.style.gradient)
                              }}
                            >
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm shadow-xs font-mono">
                                {selectedElement.style.gradient.startColor || '#2B2313'}
                              </span>
                              {selectedElement.style.gradient.useMiddleColor && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm shadow-xs font-mono">
                                  {selectedElement.style.gradient.middleColor || '#1B1710'}
                                </span>
                              )}
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm shadow-xs font-mono">
                                {selectedElement.style.gradient.endColor || '#0D0C0A'}
                              </span>
                            </div>
                          </div>

                          {/* Preset Curated Gradients */}
                          <div>
                            <label className="block text-slate-400 font-semibold text-[11px] mb-2">تدرجات فاخرة جاهزة (Curated Presets)</label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                              {GRADIENT_PRESETS.map((preset, pIdx) => {
                                const previewBg = preset.type === 'radial'
                                  ? (preset.useMiddle ? `radial-gradient(circle at center, ${preset.start}, ${preset.middle}, ${preset.end})` : `radial-gradient(circle at center, ${preset.start}, ${preset.end})`)
                                  : (preset.useMiddle ? `linear-gradient(${preset.angle}deg, ${preset.start}, ${preset.middle}, ${preset.end})` : `linear-gradient(${preset.angle}deg, ${preset.start}, ${preset.end})`);
                                
                                return (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => {
                                      updateBuilderElement(selectedElement.id, {
                                        style: {
                                          ...selectedElement.style,
                                          gradient: {
                                            enabled: true,
                                            type: preset.type as 'linear' | 'radial',
                                            angle: preset.angle,
                                            startColor: preset.start,
                                            middleColor: preset.middle || '#1B1710',
                                            endColor: preset.end,
                                            useMiddleColor: preset.useMiddle ?? false,
                                          }
                                        }
                                      });
                                    }}
                                    className={`p-2 rounded-xl border text-right transition-all flex items-center gap-2 group hover:border-[#C5A059] ${
                                      theme === 'dark' ? 'bg-[#141311] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
                                    }`}
                                  >
                                    <div 
                                      className="w-8 h-8 rounded-lg border border-white/20 shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                                      style={{ background: previewBg }}
                                    />
                                    <div className="overflow-hidden">
                                      <span className="block text-[11px] font-bold truncate group-hover:text-[#C5A059] transition-colors">{preset.name}</span>
                                      <span className="block text-[9px] text-slate-400 font-mono">{preset.type === 'radial' ? 'Radial' : `${preset.angle}°`}</span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Gradient Type: Linear vs Radial */}
                          <div>
                            <label className="block text-slate-400 font-semibold text-[11px] mb-1.5">نمط التوزيع (Gradient Type)</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  updateBuilderElement(selectedElement.id, {
                                    style: {
                                      ...selectedElement.style,
                                      gradient: {
                                        ...(selectedElement.style.gradient || { enabled: true }),
                                        type: 'linear',
                                      }
                                    }
                                  });
                                }}
                                className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                                  (selectedElement.style.gradient?.type || 'linear') === 'linear'
                                    ? 'bg-[#C5A059] text-[#121212] border-[#C5A059] shadow-xs'
                                    : theme === 'dark' ? 'border-[#2E2B26] text-slate-300 hover:bg-[#1E1C18]' : 'border-[#E5E0D8] text-slate-700 hover:bg-[#F2EFE9]'
                                }`}
                              >
                                خطي (Linear Direction)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateBuilderElement(selectedElement.id, {
                                    style: {
                                      ...selectedElement.style,
                                      gradient: {
                                        ...(selectedElement.style.gradient || { enabled: true }),
                                        type: 'radial',
                                      }
                                    }
                                  });
                                }}
                                className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                                  selectedElement.style.gradient?.type === 'radial'
                                    ? 'bg-[#C5A059] text-[#121212] border-[#C5A059] shadow-xs'
                                    : theme === 'dark' ? 'border-[#2E2B26] text-slate-300 hover:bg-[#1E1C18]' : 'border-[#E5E0D8] text-slate-700 hover:bg-[#F2EFE9]'
                                }`}
                              >
                                إشعاعي دائري (Radial Center)
                              </button>
                            </div>
                          </div>

                          {/* Angle Selector (when Linear) */}
                          {(selectedElement.style.gradient?.type || 'linear') === 'linear' && (
                            <div className="p-3 rounded-xl border border-slate-700/40 bg-black/20 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
                                  <label className="text-slate-300 font-semibold text-[11px]">زاوية واتجاه التدرج (Gradient Angle)</label>
                                </div>
                                <div className="flex items-center gap-1">
                                  {/* Visual Rotation Compass Icon */}
                                  <div 
                                    className="w-5 h-5 rounded-full border border-[#C5A059] flex items-center justify-center transition-transform duration-150"
                                    style={{ transform: `rotate(${selectedElement.style.gradient?.angle ?? 135}deg)` }}
                                    title="مؤشر زاوية التدرج"
                                  >
                                    <div className="w-0.5 h-3 bg-[#C5A059] rounded-full origin-bottom" />
                                  </div>
                                  <span className="font-mono text-xs font-bold text-[#C5A059] px-1.5 py-0.5 rounded bg-black/40 border border-[#C5A059]/40">
                                    {selectedElement.style.gradient?.angle ?? 135}°
                                  </span>
                                </div>
                              </div>

                              {/* Slider & Steppers */}
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const cur = selectedElement.style.gradient?.angle ?? 135;
                                    const next = (cur - 1 + 360) % 360;
                                    updateBuilderElement(selectedElement.id, {
                                      style: {
                                        ...selectedElement.style,
                                        gradient: { ...selectedElement.style.gradient, enabled: true, angle: next }
                                      }
                                    });
                                  }}
                                  className="p-1.5 rounded-lg border border-slate-700 hover:bg-[#C5A059]/20 text-slate-300 hover:text-white"
                                  title="-1 درجة"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <input
                                  type="range"
                                  min="0"
                                  max="360"
                                  step="1"
                                  value={selectedElement.style.gradient?.angle ?? 135}
                                  onChange={(e) => {
                                    const angle = parseInt(e.target.value, 10);
                                    updateBuilderElement(selectedElement.id, {
                                      style: {
                                        ...selectedElement.style,
                                        gradient: { ...selectedElement.style.gradient, enabled: true, angle }
                                      }
                                    });
                                  }}
                                  className="flex-1 accent-[#C5A059] cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const cur = selectedElement.style.gradient?.angle ?? 135;
                                    const next = (cur + 1) % 360;
                                    updateBuilderElement(selectedElement.id, {
                                      style: {
                                        ...selectedElement.style,
                                        gradient: { ...selectedElement.style.gradient, enabled: true, angle: next }
                                      }
                                    });
                                  }}
                                  className="p-1.5 rounded-lg border border-slate-700 hover:bg-[#C5A059]/20 text-slate-300 hover:text-white"
                                  title="+1 درجة"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Quick Angle Presets */}
                              <div className="grid grid-cols-6 gap-1">
                                {[
                                  { angle: 0, label: '0° ↓' },
                                  { angle: 45, label: '45° ↘' },
                                  { angle: 90, label: '90° →' },
                                  { angle: 135, label: '135° ↘' },
                                  { angle: 180, label: '180° ↑' },
                                  { angle: 270, label: '270° ←' },
                                ].map((qa) => (
                                  <button
                                    key={qa.angle}
                                    type="button"
                                    onClick={() => {
                                      updateBuilderElement(selectedElement.id, {
                                        style: {
                                          ...selectedElement.style,
                                          gradient: { ...selectedElement.style.gradient, enabled: true, angle: qa.angle }
                                        }
                                      });
                                    }}
                                    className={`py-1 rounded text-[10px] font-mono font-bold border transition-all ${
                                      (selectedElement.style.gradient?.angle ?? 135) === qa.angle
                                        ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]'
                                        : 'border-slate-700/60 bg-black/20 text-slate-400 hover:text-white'
                                    }`}
                                  >
                                    {qa.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Color Stops Controls */}
                          <div className="space-y-3">
                            {/* Start Color */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-slate-400 font-semibold text-[11px]">لون بداية التدرج (Start Color)</label>
                                <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.style.gradient?.startColor || '#2B2313'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={selectedElement.style.gradient?.startColor && selectedElement.style.gradient.startColor.startsWith('#') ? selectedElement.style.gradient.startColor : '#2B2313'}
                                  onChange={(e) => {
                                    updateBuilderElement(selectedElement.id, {
                                      style: {
                                        ...selectedElement.style,
                                        gradient: { ...selectedElement.style.gradient, enabled: true, startColor: e.target.value }
                                      }
                                    });
                                  }}
                                  className="w-8 h-8 rounded-lg border cursor-pointer shrink-0 bg-transparent"
                                />
                                <input
                                  type="text"
                                  value={selectedElement.style.gradient?.startColor || ''}
                                  onChange={(e) => {
                                    updateBuilderElement(selectedElement.id, {
                                      style: {
                                        ...selectedElement.style,
                                        gradient: { ...selectedElement.style.gradient, enabled: true, startColor: e.target.value }
                                      }
                                    });
                                  }}
                                  placeholder="#2B2313"
                                  className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none font-mono ${
                                    theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                                  }`}
                                />
                              </div>
                            </div>

                            {/* Optional 3rd Middle Color */}
                            <div className="p-2.5 rounded-xl border border-slate-700/30 bg-black/10 space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-slate-300 font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedElement.style.gradient?.useMiddleColor || false}
                                    onChange={(e) => {
                                      updateBuilderElement(selectedElement.id, {
                                        style: {
                                          ...selectedElement.style,
                                          gradient: { ...selectedElement.style.gradient, enabled: true, useMiddleColor: e.target.checked }
                                        }
                                      });
                                    }}
                                    className="w-3.5 h-3.5 accent-[#C5A059] rounded cursor-pointer"
                                  />
                                  <span>إضافة نقطة توقف وسطية (Middle Stop)</span>
                                </label>
                                {selectedElement.style.gradient?.useMiddleColor && (
                                  <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.style.gradient?.middleColor || '#1B1710'}</span>
                                )}
                              </div>

                              {selectedElement.style.gradient?.useMiddleColor && (
                                <div className="flex items-center gap-2 pt-1">
                                  <input
                                    type="color"
                                    value={selectedElement.style.gradient?.middleColor && selectedElement.style.gradient.middleColor.startsWith('#') ? selectedElement.style.gradient.middleColor : '#1B1710'}
                                    onChange={(e) => {
                                      updateBuilderElement(selectedElement.id, {
                                        style: {
                                          ...selectedElement.style,
                                          gradient: { ...selectedElement.style.gradient, enabled: true, middleColor: e.target.value }
                                        }
                                      });
                                    }}
                                    className="w-8 h-8 rounded-lg border cursor-pointer shrink-0 bg-transparent"
                                  />
                                  <input
                                    type="text"
                                    value={selectedElement.style.gradient?.middleColor || ''}
                                    onChange={(e) => {
                                      updateBuilderElement(selectedElement.id, {
                                        style: {
                                          ...selectedElement.style,
                                          gradient: { ...selectedElement.style.gradient, enabled: true, middleColor: e.target.value }
                                        }
                                      });
                                    }}
                                    placeholder="#1B1710"
                                    className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none font-mono ${
                                      theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                                    }`}
                                  />
                                </div>
                              )}
                            </div>

                            {/* End Color */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-slate-400 font-semibold text-[11px]">لون نهاية التدرج (End Color)</label>
                                <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.style.gradient?.endColor || '#0D0C0A'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={selectedElement.style.gradient?.endColor && selectedElement.style.gradient.endColor.startsWith('#') ? selectedElement.style.gradient.endColor : '#0D0C0A'}
                                  onChange={(e) => {
                                    updateBuilderElement(selectedElement.id, {
                                      style: {
                                        ...selectedElement.style,
                                        gradient: { ...selectedElement.style.gradient, enabled: true, endColor: e.target.value }
                                      }
                                    });
                                  }}
                                  className="w-8 h-8 rounded-lg border cursor-pointer shrink-0 bg-transparent"
                                />
                                <input
                                  type="text"
                                  value={selectedElement.style.gradient?.endColor || ''}
                                  onChange={(e) => {
                                    updateBuilderElement(selectedElement.id, {
                                      style: {
                                        ...selectedElement.style,
                                        gradient: { ...selectedElement.style.gradient, enabled: true, endColor: e.target.value }
                                      }
                                    });
                                  }}
                                  placeholder="#0D0C0A"
                                  className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none font-mono ${
                                    theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                                  }`}
                                />
                              </div>
                            </div>

                            {/* Swap / Invert Colors Button */}
                            <button
                              type="button"
                              onClick={() => {
                                const curStart = selectedElement.style.gradient?.startColor || '#2B2313';
                                const curEnd = selectedElement.style.gradient?.endColor || '#0D0C0A';
                                updateBuilderElement(selectedElement.id, {
                                  style: {
                                    ...selectedElement.style,
                                    gradient: {
                                      ...selectedElement.style.gradient,
                                      enabled: true,
                                      startColor: curEnd,
                                      endColor: curStart,
                                    }
                                  }
                                });
                              }}
                              className="w-full py-2 rounded-xl border border-slate-700/60 bg-black/20 hover:bg-[#C5A059]/20 text-xs font-semibold flex items-center justify-center gap-2 text-slate-300 hover:text-white transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
                              <span>عكس اتجاه ألوان التدرج (Reverse Gradient Colors)</span>
                            </button>

                            {/* CSS Code Snippet Copy */}
                            <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between gap-2">
                              <div className="truncate text-[10px] font-mono text-slate-400 bg-black/30 px-2 py-1.5 rounded-lg border border-slate-800 flex-1">
                                {getGradientBackground(selectedElement.style.gradient) || 'none'}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const css = getGradientBackground(selectedElement.style.gradient);
                                  if (css) {
                                    navigator.clipboard.writeText(`background: ${css};`);
                                    setCopiedGradient(true);
                                    setTimeout(() => setCopiedGradient(false), 2000);
                                    notify('تم نسخ كود CSS للتدرج بنجاح', 'success');
                                  }
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-[#C5A059] text-[#121212] text-[11px] font-bold shrink-0 hover:bg-[#B8934A] transition-colors flex items-center gap-1"
                              >
                                {copiedGradient ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedGradient ? 'تم النسخ' : 'نسخ CSS'}</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      )}
                    </div>

                    {/* Section Background Color */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-400 font-semibold text-[11px]">لون خلفية القسم (Section Background)</label>
                        <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.style?.backgroundColor || 'تلقائي'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedElement.style?.backgroundColor && selectedElement.style.backgroundColor.startsWith('#') ? selectedElement.style.backgroundColor : '#121212'}
                          onChange={(e) => updateBuilderElement(selectedElement.id, {
                            style: { ...selectedElement.style, backgroundColor: e.target.value }
                          })}
                          className="w-8 h-8 rounded-lg border cursor-pointer shrink-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={selectedElement.style?.backgroundColor || ''}
                          onChange={(e) => updateBuilderElement(selectedElement.id, {
                            style: { ...selectedElement.style, backgroundColor: e.target.value }
                          })}
                          placeholder="transparent أو #1a1a1a"
                          className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none font-mono ${
                            theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Card Styling Controls */}
                    <div className="p-3 rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/5 space-y-3">
                      <span className="block font-bold text-xs text-[#C5A059]">تخصيص مظهر البطاقات الداخلية (Card Appearance)</span>
                      
                      {/* Card Background */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-400 font-semibold text-[11px]">لون خلفية البطاقات الداخلية (Card BG)</label>
                          <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.style?.cardBackground || 'تلقائي'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElement.style?.cardBackground && selectedElement.style.cardBackground.startsWith('#') ? selectedElement.style.cardBackground : '#1A1917'}
                            onChange={(e) => updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, cardBackground: e.target.value }
                            })}
                            className="w-8 h-8 rounded-lg border cursor-pointer shrink-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={selectedElement.style?.cardBackground || ''}
                            onChange={(e) => updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, cardBackground: e.target.value }
                            })}
                            placeholder="مثال: #1E1C18 أو rgba(255,255,255,0.05)"
                            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none font-mono ${
                              theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Card Border Color */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-400 font-semibold text-[11px]">لون إطار البطاقات (Card Border)</label>
                          <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.style?.cardBorderColor || 'تلقائي'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElement.style?.cardBorderColor && selectedElement.style.cardBorderColor.startsWith('#') ? selectedElement.style.cardBorderColor : '#C5A059'}
                            onChange={(e) => updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, cardBorderColor: e.target.value }
                            })}
                            className="w-8 h-8 rounded-lg border cursor-pointer shrink-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={selectedElement.style?.cardBorderColor || ''}
                            onChange={(e) => updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, cardBorderColor: e.target.value }
                            })}
                            placeholder="مثال: #C5A059 أو #2E2B26"
                            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none font-mono ${
                              theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Card Border Radius with Stepper */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-400 font-semibold text-[11px]">دائرة حواف البطاقات (Border Radius)</label>
                          <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.style?.cardBorderRadius || '16px'}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 mb-2">
                          {['0px', '8px', '16px', '24px'].map((rad) => (
                            <button
                              key={rad}
                              type="button"
                              onClick={() => updateBuilderElement(selectedElement.id, {
                                style: { ...selectedElement.style, cardBorderRadius: rad }
                              })}
                              className={`py-1.5 rounded-lg border text-center font-bold text-xs transition-all ${
                                (selectedElement.style?.cardBorderRadius || '16px') === rad
                                  ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]'
                                  : theme === 'dark' ? 'border-[#2E2B26] text-slate-400' : 'border-[#E5E0D8] text-slate-600'
                              }`}
                            >
                              {rad}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const cur = selectedElement.style?.cardBorderRadius || '16px';
                              const num = parseInt(cur, 10);
                              const next = Math.max(0, (isNaN(num) ? 16 : num) - 2);
                              updateBuilderElement(selectedElement.id, { style: { ...selectedElement.style, cardBorderRadius: `${next}px` } });
                            }}
                            className={`p-2 rounded-lg border font-bold text-xs ${
                              theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                            }`}
                            title="إنقاص دائرة الحواف"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="text"
                            value={selectedElement.style?.cardBorderRadius || '16px'}
                            onChange={(e) => updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, cardBorderRadius: e.target.value }
                            })}
                            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs text-center font-mono outline-none ${
                              theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const cur = selectedElement.style?.cardBorderRadius || '16px';
                              const num = parseInt(cur, 10);
                              const next = (isNaN(num) ? 16 : num) + 2;
                              updateBuilderElement(selectedElement.id, { style: { ...selectedElement.style, cardBorderRadius: `${next}px` } });
                            }}
                            className={`p-2 rounded-lg border font-bold text-xs ${
                              theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                            }`}
                            title="زيادة دائرة الحواف"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Ambient Glow */}
                    <div className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824]' : 'bg-white border-[#E5E0D8]'
                    }`}>
                      <div>
                        <span className="font-bold block">تفعيل التوهج الهادئ (Glow)</span>
                        <span className="text-[10px] text-slate-400">إضاءة ذهبية محيطية خافتة وفاخرة</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedElement.style?.glow || false}
                        onChange={(e) => updateBuilderElement(selectedElement.id, {
                          style: { ...selectedElement.style, glow: e.target.checked }
                        })}
                        className="w-5 h-5 accent-[#C5A059] cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'typography' && (
                  <div className="space-y-4">
                    {/* Professional Color Palette Swatches */}
                    <div className="p-3 rounded-xl border border-[#C5A059]/40 bg-[#C5A059]/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#C5A059]">لوحة الألوان الاحترافية (Pro Palette)</span>
                        <span className="text-[10px] text-slate-400">اختر لتطبيق اللون</span>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2 py-1">
                        {PRO_COLOR_PALETTES.map((p) => (
                          <button
                            key={p.hex}
                            type="button"
                            onClick={() => {
                              updateBuilderElement(selectedElement.id, {
                                style: { 
                                  ...selectedElement.style, 
                                  textColor: p.hex,
                                  cardTextColor: p.hex,
                                  accentColor: p.hex
                                }
                              });
                            }}
                            className="flex flex-col items-center gap-1 group"
                            title={`${p.name} (${p.hex})`}
                          >
                            <span 
                              className="w-7 h-7 rounded-lg border border-white/20 shadow-xs group-hover:scale-110 transition-transform block"
                              style={{ backgroundColor: p.hex }}
                            />
                            <span className="text-[9px] truncate max-w-full text-slate-400 group-hover:text-[#C5A059]">
                              {p.name}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Quick Palette Targets */}
                      <div className="pt-2 border-t border-slate-500/20 grid grid-cols-3 gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => updateBuilderElement(selectedElement.id, {
                            style: { ...selectedElement.style, textColor: '#C5A059', accentColor: '#DFCA9B' }
                          })}
                          className="py-1 rounded bg-[#C5A059]/20 text-[#C5A059] font-bold"
                        >
                          تدرج ذهبي
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBuilderElement(selectedElement.id, {
                            style: { ...selectedElement.style, textColor: '#F9F7F2', cardTextColor: '#E5E0D8' }
                          })}
                          className="py-1 rounded bg-white/10 text-white font-bold"
                        >
                          عاجي ناصع
                        </button>
                        <button
                          type="button"
                          onClick={() => updateBuilderElement(selectedElement.id, {
                            style: { ...selectedElement.style, textColor: '#121212', cardTextColor: '#24221E' }
                          })}
                          className="py-1 rounded bg-black/30 text-slate-300 font-bold"
                        >
                          أسود داكن
                        </button>
                      </div>
                    </div>

                    {/* Independent Color Pickers */}
                    <div className="space-y-3">
                      {/* Section Main Text Color */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-400 font-semibold text-[11px]">لون الخط الرئيسي (Main Text Color)</label>
                          <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.style?.textColor || 'تلقائي'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElement.style?.textColor && selectedElement.style.textColor.startsWith('#') ? selectedElement.style.textColor : '#F9F7F2'}
                            onChange={(e) => updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, textColor: e.target.value }
                            })}
                            className="w-8 h-8 rounded-lg border cursor-pointer shrink-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={selectedElement.style?.textColor || ''}
                            onChange={(e) => updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, textColor: e.target.value }
                            })}
                            placeholder="inherit أو #F9F7F2"
                            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none font-mono ${
                              theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Inner Card Text Color */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-400 font-semibold text-[11px]">لون خط نصوص البطاقات (Card Text Color)</label>
                          <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.style?.cardTextColor || 'تلقائي'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElement.style?.cardTextColor && selectedElement.style.cardTextColor.startsWith('#') ? selectedElement.style.cardTextColor : '#C7C1B7'}
                            onChange={(e) => updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, cardTextColor: e.target.value }
                            })}
                            className="w-8 h-8 rounded-lg border cursor-pointer shrink-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={selectedElement.style?.cardTextColor || ''}
                            onChange={(e) => updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, cardTextColor: e.target.value }
                            })}
                            placeholder="inherit أو #C7C1B7"
                            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none font-mono ${
                              theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Accent Color */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-400 font-semibold text-[11px]">اللون المميز والوسوم (Accent Color)</label>
                          <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.style?.accentColor || '#C5A059'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={selectedElement.style?.accentColor && selectedElement.style.accentColor.startsWith('#') ? selectedElement.style.accentColor : '#C5A059'}
                            onChange={(e) => updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, accentColor: e.target.value }
                            })}
                            className="w-8 h-8 rounded-lg border cursor-pointer shrink-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={selectedElement.style?.accentColor || ''}
                            onChange={(e) => updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, accentColor: e.target.value }
                            })}
                            placeholder="#C5A059"
                            className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none font-mono ${
                              theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white' : 'bg-white border-[#E5E0D8] text-slate-900'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Font Size Selector with Stepper */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-400 font-semibold text-[11px]">حجم الخط (Font Size)</label>
                        <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.style?.fontSize || 'text-base'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <button
                          type="button"
                          onClick={() => {
                            const sizes = ['sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
                            const current = (selectedElement.style?.fontSize || 'base').replace('text-', '');
                            const idx = sizes.indexOf(current);
                            const prevIdx = Math.max(0, (idx === -1 ? 1 : idx) - 1);
                            updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, fontSize: sizes[prevIdx] }
                            });
                          }}
                          className={`p-2 rounded-lg border font-bold text-xs ${
                            theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                          }`}
                          title="تصغير حجم الخط"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid grid-cols-4 gap-1 flex-1">
                          {[
                            { val: 'sm', label: 'sm' },
                            { val: 'base', label: 'base' },
                            { val: 'lg', label: 'lg' },
                            { val: 'xl', label: 'xl' },
                          ].map((sz) => {
                            const isMatch = (selectedElement.style?.fontSize || 'base').replace('text-', '') === sz.val;
                            return (
                              <button
                                key={sz.val}
                                type="button"
                                onClick={() => updateBuilderElement(selectedElement.id, {
                                  style: { ...selectedElement.style, fontSize: sz.val }
                                })}
                                className={`py-1 rounded-lg border text-center font-bold text-xs transition-all ${
                                  isMatch
                                    ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]'
                                    : theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:bg-[#1E1C18]' : 'border-[#E5E0D8] text-slate-600 hover:bg-[#F2EFE9]'
                                }`}
                              >
                                {sz.label}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const sizes = ['sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'];
                            const current = (selectedElement.style?.fontSize || 'base').replace('text-', '');
                            const idx = sizes.indexOf(current);
                            const nextIdx = Math.min(sizes.length - 1, (idx === -1 ? 1 : idx) + 1);
                            updateBuilderElement(selectedElement.id, {
                              style: { ...selectedElement.style, fontSize: sizes[nextIdx] }
                            });
                          }}
                          className={`p-2 rounded-lg border font-bold text-xs ${
                            theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                          }`}
                          title="تكبير حجم الخط"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { val: '2xl', label: 'ضخم (2xl)' },
                          { val: '3xl', label: 'عملاق (3xl)' },
                          { val: '4xl', label: 'هائل (4xl)' },
                        ].map((sz) => {
                          const isMatch = (selectedElement.style?.fontSize || 'base').replace('text-', '') === sz.val;
                          return (
                            <button
                              key={sz.val}
                              type="button"
                              onClick={() => updateBuilderElement(selectedElement.id, {
                                style: { ...selectedElement.style, fontSize: sz.val }
                              })}
                              className={`py-1.5 rounded-lg border text-center font-bold text-xs transition-all ${
                                isMatch
                                  ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]'
                                  : theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:bg-[#1E1C18]' : 'border-[#E5E0D8] text-slate-600 hover:bg-[#F2EFE9]'
                              }`}
                            >
                              {sz.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Font Weight Selector */}
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">سماكة ووزن الخط (Font Weight)</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { val: 'normal', label: 'عادي (400)' },
                          { val: 'medium', label: 'متوسط (500)' },
                          { val: 'semibold', label: 'شبه عريض (600)' },
                          { val: 'bold', label: 'عريض (700)' },
                          { val: 'black', label: 'فائق (900)' },
                        ].map((w) => {
                          const isMatch = (selectedElement.style?.fontWeight || 'normal').replace('font-', '') === w.val;
                          return (
                            <button
                              key={w.val}
                              type="button"
                              onClick={() => updateBuilderElement(selectedElement.id, {
                                style: { ...selectedElement.style, fontWeight: w.val }
                              })}
                              className={`py-1.5 rounded-lg border text-center font-bold text-xs transition-all ${
                                isMatch
                                  ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]'
                                  : theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:bg-[#1E1C18]' : 'border-[#E5E0D8] text-slate-600 hover:bg-[#F2EFE9]'
                              }`}
                            >
                              {w.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'motion' && (
                  <div className="space-y-4">
                    {/* Live Preview Motion Button */}
                    <div className="p-3 rounded-xl border border-[#C5A059]/40 bg-[#C5A059]/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-[#C5A059]" />
                        <span className="text-xs font-bold text-[#C5A059]">معاينة وتجربة الحركة المباشرة</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAnimationCycleKey(k => k + 1);
                          notify('جارٍ تشغيل ومعاينة حركة العنصر...');
                        }}
                        className="px-3 py-1 rounded-lg bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] text-xs font-bold shadow-xs transition-all flex items-center gap-1 active:scale-95"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>تشغيل</span>
                      </button>
                    </div>

                    {/* Entrance Animation Type */}
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">نوع حركة الدخول (Entrance Animation)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { val: 'fade-up', label: 'انزلاق وتلاشي علوي' },
                          { val: 'scale', label: 'تكبير تدريجي (Scale)' },
                          { val: 'slide', label: 'انزلاق جانبي (Slide)' },
                          { val: 'bounce', label: 'ارتداد نابض (Bounce)' },
                          { val: 'fade-right', label: 'تلاشي من اليمين' },
                          { val: 'none', label: 'بدون حركة (ثابت)' },
                        ].map((m) => (
                          <button
                            key={m.val}
                            type="button"
                            onClick={() => {
                              updateBuilderElement(selectedElement.id, {
                                motion: { ...selectedElement.motion, animationType: m.val as any }
                              });
                              setAnimationCycleKey(k => k + 1);
                            }}
                            className={`py-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                              (selectedElement.motion?.animationType || 'fade-up') === m.val
                                ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]'
                                : theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:bg-[#1E1C18]' : 'border-[#E5E0D8] text-slate-600 hover:bg-[#F2EFE9]'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration Stepper */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-400 font-semibold text-[11px]">مدة الحركة (Duration)</label>
                        <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.motion?.duration || 0.6} ثانية</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const cur = selectedElement.motion?.duration || 0.6;
                            const next = Math.max(0.1, Number((cur - 0.1).toFixed(1)));
                            updateBuilderElement(selectedElement.id, { motion: { ...selectedElement.motion, duration: next } });
                            setAnimationCycleKey(k => k + 1);
                          }}
                          className={`p-2 rounded-lg border font-bold text-xs ${
                            theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                          }`}
                          title="إنقاص مدة الحركة"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid grid-cols-4 gap-1 flex-1">
                          {[0.3, 0.6, 0.9, 1.2].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                updateBuilderElement(selectedElement.id, {
                                  motion: { ...selectedElement.motion, duration: d }
                                });
                                setAnimationCycleKey(k => k + 1);
                              }}
                              className={`py-1.5 rounded-lg border font-bold text-xs transition-all ${
                                (selectedElement.motion?.duration || 0.6) === d
                                  ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]'
                                  : theme === 'dark' ? 'border-[#2E2B26] text-slate-400' : 'border-[#E5E0D8] text-slate-600'
                              }`}
                            >
                              {d}s
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = selectedElement.motion?.duration || 0.6;
                            const next = Math.min(3.0, Number((cur + 0.1).toFixed(1)));
                            updateBuilderElement(selectedElement.id, { motion: { ...selectedElement.motion, duration: next } });
                            setAnimationCycleKey(k => k + 1);
                          }}
                          className={`p-2 rounded-lg border font-bold text-xs ${
                            theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                          }`}
                          title="زيادة مدة الحركة"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Delay Stepper */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-400 font-semibold text-[11px]">تأخير الحركة (Delay)</label>
                        <span className="font-mono text-[10px] text-[#C5A059]">{selectedElement.motion?.delay || 0} ثانية</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const cur = selectedElement.motion?.delay || 0;
                            const next = Math.max(0, Number((cur - 0.1).toFixed(1)));
                            updateBuilderElement(selectedElement.id, { motion: { ...selectedElement.motion, delay: next } });
                            setAnimationCycleKey(k => k + 1);
                          }}
                          className={`p-2 rounded-lg border font-bold text-xs ${
                            theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                          }`}
                          title="إنقاص التأخير"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid grid-cols-4 gap-1 flex-1">
                          {[0, 0.1, 0.3, 0.5].map((del) => (
                            <button
                              key={del}
                              type="button"
                              onClick={() => {
                                updateBuilderElement(selectedElement.id, {
                                  motion: { ...selectedElement.motion, delay: del }
                                });
                                setAnimationCycleKey(k => k + 1);
                              }}
                              className={`py-1.5 rounded-lg border font-bold text-xs transition-all ${
                                (selectedElement.motion?.delay || 0) === del
                                  ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]'
                                  : theme === 'dark' ? 'border-[#2E2B26] text-slate-400' : 'border-[#E5E0D8] text-slate-600'
                              }`}
                            >
                              {del}s
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = selectedElement.motion?.delay || 0;
                            const next = Math.min(2.0, Number((cur + 0.1).toFixed(1)));
                            updateBuilderElement(selectedElement.id, { motion: { ...selectedElement.motion, delay: next } });
                            setAnimationCycleKey(k => k + 1);
                          }}
                          className={`p-2 rounded-lg border font-bold text-xs ${
                            theme === 'dark' ? 'border-[#2E2B26] bg-[#1E1C18] text-white hover:bg-[#2A2824]' : 'border-[#E5E0D8] bg-[#F2EFE9] text-slate-800'
                          }`}
                          title="زيادة التأخير"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'responsive' && (
                  <div className="space-y-4">
                    <p className="text-slate-400 text-xs leading-relaxed">
                      هذا القسم يضبط استجابة العنصر عبر شاشات الهواتف والأجهزة اللوحية والمكتبية وفق أفضل المعايير العالمية.
                    </p>
                    <div className={`p-3.5 rounded-xl border space-y-2.5 ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824]' : 'bg-white border-[#E5E0D8]'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">الهاتف الجوال:</span>
                        <span className="text-[#C5A059] font-bold">عرض كامل ومتجاوب 100%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">الأجهزة اللوحية:</span>
                        <span className="text-[#C5A059] font-bold">تنسيق ديناميكي متكيف</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">شاشات سطح المكتب:</span>
                        <span className="text-[#C5A059] font-bold">شبكة فاخرة متكاملة</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Direct Action Buttons at Bottom of Inspector */}
                <div className="pt-4 border-t border-slate-500/20 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => duplicateBuilderElement(selectedElement.id)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        theme === 'dark' ? 'border-[#2E2B26] hover:bg-[#201E1A] text-[#C5A059]' : 'border-[#E5E0D8] hover:bg-[#F2EFE9] text-[#8F6E30]'
                      }`}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>تكرار العنصر</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBuilderElement(selectedElement.id)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-500 text-xs font-semibold transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف العنصر</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Default Inspector View when no single element is selected */
              <div className="space-y-6 animate-fade-in text-right">
                {/* Page Meta Card */}
                <div className={`p-4 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824]' : 'bg-white border-[#E5E0D8]'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#C5A059]">خصائص الصفحة الحالية</span>
                    <span className="text-[10px] font-mono opacity-60">/{currentPage?.slug || ''}</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1 font-serif-display">{currentPage?.title}</h4>
                  <p className="text-[11px] text-[#8E877D] dark:text-[#9E988D] mb-3">
                    عدد العناصر بالصفحة: {currentPage?.elements.length || 0}
                  </p>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setShowAddElementModal(true)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#C5A059] text-[#121212] text-xs font-bold shadow-xs hover:bg-[#B8934A] transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة عنصر إلى هذه الصفحة</span>
                    </button>

                    <button
                      onClick={() => {
                        if (currentPage?.id) {
                          populatePageWithTemplate(currentPage.id);
                          notify(`تم توليد محتوى صفحة "${currentPage.title}" بنجاح!`);
                        }
                      }}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                        theme === 'dark' ? 'border-[#2E2B26] text-[#C5A059] hover:bg-[#201E1A]' : 'border-[#E5E0D8] text-[#8F6E30] hover:bg-[#F2EFE9]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>توليد قالب المحتوى الافتراضي</span>
                    </button>
                  </div>
                </div>

                {/* Personal Photo & Profile Quick Editor */}
                <div className={`p-4 rounded-2xl border ${
                  theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824]' : 'bg-white border-[#E5E0D8]'
                }`}>
                  <div className="flex items-center gap-2 mb-3 text-[#C5A059]">
                    <Camera className="w-4 h-4" />
                    <span className="text-xs font-bold">الصورة الشخصية والبروفايل</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C5A059] flex items-center justify-center bg-[#C5A059]/10 shrink-0">
                      {profile.avatarUrl ? (
                        <img 
                          src={profile.avatarUrl} 
                          alt={profile.name} 
                          style={{
                            filter: (() => {
                              const b = profile.avatarBrightness ?? 100;
                              const c = profile.avatarContrast ?? 100;
                              const s = profile.avatarSaturation ?? 100;
                              const blur = profile.avatarBlur ?? 0;
                              let str = `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
                              if (blur > 0) str += ` blur(${blur}px)`;
                              if (profile.avatarFilter === 'cinematic_gold') str += ` sepia(25%) hue-rotate(-10deg) saturate(120%)`;
                              else if (profile.avatarFilter === 'warm') str += ` sepia(30%) saturate(110%)`;
                              else if (profile.avatarFilter === 'cool') str += ` hue-rotate(180deg) saturate(90%)`;
                              else if (profile.avatarFilter === 'bw') str += ` grayscale(100%) contrast(110%)`;
                              else if (profile.avatarFilter === 'vintage') str += ` sepia(50%) contrast(90%) brightness(105%)`;
                              return str;
                            })()
                          }}
                          className={`w-full h-full ${profile.avatarFit === 'contain' ? 'object-contain p-0.5' : 'object-cover'}`} 
                        />
                      ) : (
                        <User className="w-6 h-6 text-[#C5A059]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{profile.name}</p>
                      <p className="text-[10px] text-[#8E877D] dark:text-[#9E988D] truncate">{profile.role}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border border-[#C5A059]/40 hover:bg-[#C5A059]/10 text-[#C5A059] transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع صورة شخصية جديدة</span>
                    </button>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarFileUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => setShowProfileModal(true)}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        theme === 'dark' ? 'border-[#2E2B26] text-[#F9F7F2] hover:bg-[#201E1A]' : 'border-[#E5E0D8] text-[#121212] hover:bg-[#F2EFE9]'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>تعديل كافة بيانات الملف الشخصي</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 text-center text-[#8E877D] dark:text-[#9E988D] text-[11px] leading-relaxed">
                  💡 انقر على أي عنصر داخل شاشة العرض لاختياره وتعديل خصائصه الدقيقة، أو استخدم قائمة الطبقات بالجانب الأيمن.
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Profile & Photo Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />

      {/* Modal: Add Element to Page */}
      {showAddElementModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex min-h-full items-start sm:items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={() => setShowAddElementModal(false)}
        >
          <div 
            className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl text-right my-auto shrink-0 ${
              theme === 'dark' ? 'bg-[#161513] border-[#2A2824] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C5A059]" />
                <span>إضافة عنصر جديد إلى الصفحة</span>
              </h3>
              <button onClick={() => setShowAddElementModal(false)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {newElementOptions.map((opt) => {
                const IconComponent = opt.icon;
                return (
                  <button
                    key={opt.type}
                    onClick={() => handleCreateElement(opt.type, opt.name)}
                    className={`p-3.5 rounded-xl border text-right transition-all group hover:scale-[1.02] ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] hover:border-[#C5A059]' : 'bg-white border-[#E5E0D8] hover:border-[#C5A059]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-md bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center">
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs">{opt.name}</span>
                    </div>
                    <p className="text-[11px] opacity-70 leading-relaxed">{opt.desc}</p>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowAddElementModal(false)}
              className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:text-white' : 'border-[#E5E0D8] text-slate-600 hover:text-black'
              }`}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Modal: Add New Page */}
      {showNewPageModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex min-h-full items-start sm:items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={() => setShowNewPageModal(false)}
        >
          <form 
            onSubmit={handleCreatePage}
            className={`w-full max-w-sm p-6 rounded-2xl border shadow-2xl text-right my-auto shrink-0 ${
              theme === 'dark' ? 'bg-[#161513] border-[#2A2824] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C5A059]" />
              <span>إضافة صفحة جديدة</span>
            </h3>
            <p className="text-xs opacity-75 mb-4 leading-relaxed">
              أدخل عنوان الصفحة الجديدة التي ترغب في إضافتها إلى مسودة الموقع.
            </p>
            <input
              type="text"
              required
              autoFocus
              placeholder="مثال: المعرض الخاص، الرؤية المستقبلية..."
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-xs outline-none mb-4 ${
                theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] text-white focus:border-[#C5A059]' : 'bg-white border-[#E5E0D8] text-slate-900 focus:border-[#C5A059]'
              }`}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewPageModal(false)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                  theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:bg-[#201E1A]' : 'border-[#E5E0D8] text-slate-600 hover:bg-[#F2EFE9]'
                }`}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C5A059] hover:bg-[#B8934A] text-[#121212]"
              >
                إنشاء الصفحة
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Keyboard Shortcuts Cheat Sheet */}
      {showShortcutsModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex min-h-full items-start sm:items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={() => setShowShortcutsModal(false)}
        >
          <div 
            className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl text-right my-auto shrink-0 ${
              theme === 'dark' ? 'bg-[#161513] border-[#2A2824] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Command className="w-4 h-4 text-[#C5A059]" />
                <span>اختصارات لوحة المفاتيح الاحترافية</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs opacity-75 mb-4 leading-relaxed">
              تحكم بمرونة فائقة في المحرر المرئي وسرّع من وتيرة بناء الموقع عبر هذه الاختصارات:
            </p>
            <div className="space-y-2 mb-6">
              {[
                { keys: ['Ctrl', 'Z'], desc: 'تراجع عن آخر تعديل (Undo)' },
                { keys: ['Ctrl', 'Y'], desc: 'إعادة التعديل المتراجع عنه (Redo)' },
                { keys: ['Ctrl', 'C'], desc: 'نسخ العنصر المحدد (Copy)' },
                { keys: ['Ctrl', 'V'], desc: 'لصق العنصر المنسوخ (Paste)' },
                { keys: ['Ctrl', 'X'], desc: 'قص العنصر المحدد (Cut)' },
                { keys: ['Ctrl', 'D'], desc: 'تكرار ومضاعفة العنصر فوراً (Duplicate)' },
                { keys: ['Delete'], desc: 'حذف العنصر المحدد' },
                { keys: ['Alt', '↑'], desc: 'تحريك العنصر المحدد للأعلى' },
                { keys: ['Alt', '↓'], desc: 'تحريك العنصر المحدد للأسفل' },
                { keys: ['Ctrl', 'S'], desc: 'حفظ مسودة الموقع فورياً' },
              ].map((sc, i) => (
                <div key={i} className={`flex items-center justify-between p-2 rounded-xl border ${
                  theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824]' : 'bg-white border-[#E5E0D8]'
                }`}>
                  <span className="text-xs font-medium">{sc.desc}</span>
                  <div className="flex items-center gap-1">
                    {sc.keys.map((k, ki) => (
                      <kbd key={ki} className="px-2 py-0.5 rounded-md bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] font-mono text-[11px] font-bold">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowShortcutsModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] text-xs font-bold transition-colors"
            >
              فهمت ذلك، إغلاق
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

