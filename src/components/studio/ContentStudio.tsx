import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { optimizeImage } from '../../utils/imageOptimizer';
import { 
  MediaItem, 
  ArticleItem, 
  ArticleBlock, 
  StudioTab 
} from '../../types';
import { 
  Sliders, 
  Crop, 
  FlipHorizontal, 
  FlipVertical, 
  Sun, 
  Contrast, 
  Droplet, 
  Flame, 
  Eye, 
  Save, 
  Send, 
  Calendar, 
  History, 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Check, 
  Grid, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles, 
  Download, 
  Upload, 
  ArrowLeft, 
  ArrowRight, 
  Tag, 
  BookOpen,
  Bold,
  Italic,
  Underline,
  List,
  Heading2,
  Copy,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  User,
  Camera,
  Layers,
  RotateCw,
  RefreshCw
} from 'lucide-react';

export const ContentStudio: React.FC = () => {
  const { 
    profile,
    updateProfile,
    setAvatarUrl,
    savePortfolioToServer,
    theme, 
    studioTab, 
    setStudioTab, 
    mediaList, 
    selectedMediaId, 
    setSelectedMediaId, 
    updateMediaAdjustments, 
    resetMediaAdjustments, 
    saveMediaVersion, 
    restoreMediaVersion, 
    addMediaItem, 
    deleteMediaItem,
    articles, 
    selectedArticleId, 
    setSelectedArticleId, 
    updateArticle, 
    addArticle, 
    deleteArticle, 
    saveDraft, 
    publishChanges, 
    notify 
  } = useApp();

  // Photo Editor Local States
  const [showGrid, setShowGrid] = useState(true);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeAdjustTab, setActiveAdjustTab] = useState<'adjust' | 'crop'>('adjust');
  const [activeCropRatio, setActiveCropRatio] = useState<'free' | '1:1' | '4:5' | '16:9' | '3:2'>('3:2');
  
  // Media Library Search & Filter State
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [isSavingStudio, setIsSavingStudio] = useState(false);
  const [isPublishingStudio, setIsPublishingStudio] = useState(false);

  const handleSaveDraftStudio = async () => {
    if (isSavingStudio) return;
    setIsSavingStudio(true);
    try {
      await Promise.race([
        saveDraft(),
        new Promise(resolve => setTimeout(resolve, 1200))
      ]);
    } finally {
      setTimeout(() => setIsSavingStudio(false), 300);
    }
  };

  const handlePublishStudio = async () => {
    if (isPublishingStudio) return;
    setIsPublishingStudio(true);
    try {
      await Promise.race([
        publishChanges(),
        new Promise(resolve => setTimeout(resolve, 1200))
      ]);
    } finally {
      setTimeout(() => setIsPublishingStudio(false), 300);
    }
  };

  // Selected items
  const currentMedia = mediaList.find(m => m.id === selectedMediaId) || mediaList[0];
  const currentArticle = articles.find(a => a.id === selectedArticleId) || articles[0];

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply CSS filters computed from adjustments
  const adj = currentMedia?.adjustments || {
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
  };

  const cssFilter = showBeforeAfter 
    ? 'none' 
    : `brightness(${1 + (adj.brightness || 0) / 100}) contrast(${1 + (adj.contrast || 0) / 100}) saturate(${1 + (adj.saturation || 0) / 100}) ${
        (adj.temperature || 0) > 0 ? `sepia(${(adj.temperature || 0) / 150}) hue-rotate(-${(adj.temperature || 0) / 4}deg)` : `hue-rotate(${Math.abs(adj.temperature || 0) / 2}deg)`
      } ${
        (adj.sharpness || 0) < 0 ? `blur(${((Math.abs(adj.sharpness || 0)) * 0.03).toFixed(2)}px)` : ''
      } opacity(${1 - (adj.opacity || 0) / 100})`;

  const transformStyle = showBeforeAfter 
    ? 'none' 
    : `rotate(${adj.rotate || 0}deg) scaleX(${adj.flipH ? -1 : 1}) scaleY(${adj.flipV ? -1 : 1})`;

  // Preset filter configurations
  const FILTER_PRESETS = [
    { name: 'أصلي', desc: 'الوضع الافتراضي', adj: { brightness: 0, contrast: 0, saturation: 0, temperature: 0, sharpness: 0, opacity: 0 } },
    { name: 'فخامة ذهبية', desc: 'دفء ملكي فاخر', adj: { brightness: 6, contrast: 20, saturation: 15, temperature: 28, sharpness: 0, opacity: 0 } },
    { name: 'سينمائي درامي', desc: 'أبيض وأسود عالي التباين', adj: { brightness: -5, contrast: 40, saturation: -100, temperature: 0, sharpness: 0, opacity: 0 } },
    { name: 'نضارة وتألق', desc: 'ألوان مشرقة وحيوية', adj: { brightness: 10, contrast: 15, saturation: 30, temperature: -8, sharpness: 0, opacity: 0 } },
    { name: 'سيبيا عتيق', desc: 'طابع كلاسيكي تراثي', adj: { brightness: 4, contrast: 16, saturation: -25, temperature: 45, sharpness: 0, opacity: 0 } },
    { name: 'بارد هادئ', desc: 'أجواء عصرية ناصعة', adj: { brightness: 8, contrast: 18, saturation: 10, temperature: -30, sharpness: 0, opacity: 0 } },
  ];

  // Set Profile Avatar directly from current photo adjustments
  const applyAsProfileAvatar = () => {
    if (!currentMedia) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const size = Math.min(img.naturalWidth || 800, img.naturalHeight || 800, 800);
      canvas.width = size;
      canvas.height = size;

      ctx.filter = `brightness(${1 + (adj.brightness || 0) / 100}) contrast(${1 + (adj.contrast || 0) / 100}) saturate(${1 + (adj.saturation || 0) / 100}) ${
        (adj.temperature || 0) > 0 ? `sepia(${(adj.temperature || 0) / 150}) hue-rotate(-${(adj.temperature || 0) / 4}deg)` : `hue-rotate(${Math.abs(adj.temperature || 0) / 2}deg)`
      }`;

      ctx.translate(size / 2, size / 2);
      ctx.rotate(((adj.rotate || 0) * Math.PI) / 180);
      ctx.scale(adj.flipH ? -1 : 1, adj.flipV ? -1 : 1);
      ctx.drawImage(img, -size / 2, -size / 2, size, size);

      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const optimized = await optimizeImage(dataUrl, 800, 800, 0.82);
        setAvatarUrl(optimized);
      } catch (e) {
        setAvatarUrl(currentMedia.url);
      }
    };
    img.src = currentMedia.url;
  };

  // Handle uploading a new photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await optimizeImage(file, 1200, 1200, 0.82);
      const newItem: MediaItem = {
        id: 'med_' + Date.now(),
        name: file.name,
        url,
        originalUrl: url,
        type: (file.type.split('/')[1]?.toUpperCase() || 'JPG') as any,
        dimensions: '1200 × 800',
        fileSize: `${(url.length / 1024).toFixed(0)} KB`,
        addedDate: new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
        altText: 'صورة جديدة تم رفعها وتحسينها تلقائياً لاستوديو المحتوى.',
        keywords: ['جديد', 'محتوى', 'استوديو'],
        license: 'الاستخدام الشخصي والتجاري المعتمد',
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
        versions: [
          {
            id: 'v_init',
            timestamp: new Date().toLocaleTimeString('ar-SA'),
            label: 'النسخة الأصلية المحسنة',
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
            }
          }
        ]
      };
      addMediaItem(newItem);
      notify('تم رفع الصورة وتحسين حجمها لتوفير مساحة سحابية فائقة السرعة!');
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newItem: MediaItem = {
          id: 'med_' + Date.now(),
          name: file.name,
          url,
          originalUrl: url,
          type: (file.type.split('/')[1]?.toUpperCase() || 'JPG') as any,
          dimensions: '1920 × 1080',
          fileSize: `${(file.size / 1024).toFixed(0)} KB`,
          addedDate: new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
          altText: 'صورة جديدة تم رفعها إلى استوديو المحتوى.',
          keywords: ['جديد', 'محتوى', 'استوديو'],
          license: 'الاستخدام الشخصي والتجاري المعتمد',
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
        addMediaItem(newItem);
      };
      reader.readAsDataURL(file);
    }
  };

  // Export / Download edited image via canvas
  const exportEditedImage = () => {
    if (!currentMedia) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = img.naturalWidth || 1200;
      canvas.height = img.naturalHeight || 800;

      ctx.filter = `brightness(${1 + adj.brightness / 100}) contrast(${1 + adj.contrast / 100}) saturate(${1 + adj.saturation / 100}) ${
        adj.temperature > 0 ? `sepia(${adj.temperature / 150}) hue-rotate(-${adj.temperature / 4}deg)` : `hue-rotate(${Math.abs(adj.temperature) / 2}deg)`
      }`;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((adj.rotate * Math.PI) / 180);
      ctx.scale(adj.flipH ? -1 : 1, adj.flipV ? -1 : 1);
      ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

      try {
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement('a');
        link.download = `edited-${currentMedia.name || 'image'}.jpg`;
        link.href = dataUrl;
        link.click();
        notify('تم تصدير وتحميل الصورة المعدلة بنجاح');
      } catch (err) {
        notify('تم حفظ تعديلات الصورة في سجل الإصدارات بنجاح', 'info');
      }
    };
    img.src = currentMedia.url;
  };

  // Add block to article
  const handleAddArticleBlock = (type: ArticleBlock['type']) => {
    if (!currentArticle) return;
    const newBlock: ArticleBlock = {
      id: 'b_' + Date.now(),
      type,
      content: 
        type === 'h2' ? 'عنوان فرعي جديد للمقال' :
        type === 'quote' ? '«التصميم الحقيقي يكمن في البساطة التي تخفي وراءها جهداً فكرياً عميقاً.»' :
        type === 'image' ? (currentMedia?.url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80') :
        type === 'table' ? 'المعيار | القيمة | الحالة\nالأداء البصري | 99% | متفوق\nزمن الاستجابة | 80ms | فائق السرعة' :
        type === 'cta' ? 'هل تود مناقشة شراكة أو مشروع جديد؟ تواصل معنا مباشرة.' :
        'اكتب هنا نص الفقرة التوضيحية مع سرد الأفكار والنتائج بوضوح وسلاسة للقارئ.',
      meta: type === 'cta' ? { buttonText: 'ابدأ المحادثة', buttonLink: '#contact' } : {}
    };

    updateArticle(currentArticle.id, {
      blocks: [...(currentArticle.blocks || []), newBlock]
    });
    notify('تمت إضافة كتلة جديدة إلى المقال');
  };

  // Delete block
  const handleDeleteArticleBlock = (blockId: string) => {
    if (!currentArticle) return;
    updateArticle(currentArticle.id, {
      blocks: currentArticle.blocks.filter(b => b.id !== blockId)
    });
    notify('تم حذف الكتلة', 'info');
  };

  // Create new article
  const handleCreateArticle = () => {
    const newArt: ArticleItem = {
      id: 'art_' + Date.now(),
      title: 'مقال تحليلي جديد في التصميم والتقنية',
      slug: 'new-article-' + Date.now(),
      excerpt: 'استكشاف منهجي لأحدث ممارسات التصميم والتطوير المعاصر في المشهد الرقمي العربي.',
      category: 'فكر وتصميم',
      tags: ['تصميم', 'تطوير', 'ابتكار'],
      readTime: '4 دقائق قراءة',
      publishDate: new Date().toISOString().slice(0, 10),
      status: 'draft',
      seoTitle: 'مقال تحليلي جديد في التصميم والتقنية',
      seoDescription: 'استكشاف منهجي لأحدث ممارسات التصميم والتطوير المعاصر في المشهد الرقمي العربي.',
      coverImage: currentMedia?.url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      blocks: [
        {
          id: 'b1',
          type: 'paragraph',
          content: 'المقدمة: يستعرض هذا المقال المبادئ التوجيهية لبناء هوية رقمية متميزة تجمع بين الحرفية الجمالية والأداء العملي الفائق.'
        },
        {
          id: 'b2',
          type: 'h2',
          content: 'أهمية الرؤية الجمالية في تجربة المستخدم'
        },
        {
          id: 'b3',
          type: 'paragraph',
          content: 'إن التوازن بين الألوان، التباين، والمساحات البيضاء يمنح القارئ شعوراً بالراحة والاحترافية التي تعزز مصداقية المحتوى.'
        }
      ]
    };
    addArticle(newArt);
  };

  // Filter media items
  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
      item.keywords.some(k => k.toLowerCase().includes(mediaSearchQuery.toLowerCase()));
    if (selectedTagFilter === 'all') return matchesSearch;
    return matchesSearch && item.keywords.includes(selectedTagFilter);
  });

  // Extract all unique tags
  const allMediaTags = Array.from(new Set(mediaList.flatMap(m => m.keywords)));

  return (
    <div className={`flex flex-col h-[calc(100vh-50px)] overflow-hidden transition-colors ${
      theme === 'dark' ? 'bg-[#0E0E0E] text-[#F9F7F2]' : 'bg-[#F4F1EA] text-[#121212]'
    }`}>
      
      {/* Top Header Bar */}
      <div className={`h-14 px-4 border-b flex items-center justify-between z-30 shrink-0 ${
        theme === 'dark' ? 'bg-[#161513] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E5E0D8] shadow-xs'
      }`}>
        
        {/* Right side in RTL: Brand & Tabs */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm sm:text-base">استوديو المحتوى</span>
          </div>

          {/* Navigation Tabs (المقالات, محرر الصور, مكتبة الوسائط) */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border mr-2 ${
            theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824]' : 'bg-[#F0ECE1] border-[#E5E0D8]'
          }`}>
            <button
              onClick={() => setStudioTab('articles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                studioTab === 'articles' ? 'bg-[#C5A059] text-[#121212] shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              المقالات
            </button>
            <button
              onClick={() => setStudioTab('photo_editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                studioTab === 'photo_editor' ? 'bg-[#C5A059] text-[#121212] shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              محرر الصور
            </button>
            <button
              onClick={() => setStudioTab('media_library')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                studioTab === 'media_library' ? 'bg-[#C5A059] text-[#121212] shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              مكتبة الوسائط
            </button>
          </div>
        </div>

        {/* Left side in RTL: Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraftStudio}
            disabled={isSavingStudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all active:scale-95 ${
              theme === 'dark' ? 'border-[#2E2B26] hover:bg-[#201E1A] text-[#C7C1B7]' : 'border-[#E5E0D8] hover:bg-[#F2EFE9] text-[#5A554E]'
            }`}
          >
            {isSavingStudio ? (
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 text-[#C5A059]" />
            )}
            <span className="hidden sm:inline">{isSavingStudio ? 'جارٍ الحفظ...' : 'حفظ المسودة'}</span>
          </button>

          <button
            onClick={() => notify('تمت جدولة نشر المحتوى بنجاح للموعد المحدد')}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors active:scale-95 ${
              theme === 'dark' ? 'border-[#2E2B26] hover:bg-[#201E1A] text-[#8E877D]' : 'border-[#E5E0D8] hover:bg-[#F2EFE9] text-[#5A554E]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>جدولة</span>
          </button>

          <button
            onClick={handlePublishStudio}
            disabled={isPublishingStudio}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] text-xs font-bold shadow-xs transition-all active:scale-95 disabled:opacity-75"
          >
            {isPublishingStudio ? (
              <Sparkles className="w-3.5 h-3.5 text-[#121212] animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isPublishingStudio ? 'جارٍ النشر...' : 'نشر'}</span>
          </button>
        </div>

      </div>

      {/* Main Studio Workspace - Mode Responsive */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* ========================================================= */}
        {/* MODE 1: PHOTO EDITOR                                      */}
        {/* ========================================================= */}
        {studioTab === 'photo_editor' && (
          <>
            {/* Right Panel: Media Selector & Metadata Panel */}
            <div className={`w-72 border-l flex flex-col shrink-0 z-20 transition-colors ${
              theme === 'dark' ? 'bg-[#141311] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E5E0D8] shadow-xs'
            }`}>
              {/* Media Header with Upload Button */}
              <div className="p-3 border-b border-slate-500/20 flex items-center justify-between">
                <span className="text-xs font-bold">الوسائط المتاحة</span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 text-[11px] font-bold"
                >
                  <Upload className="w-3 h-3" />
                  <span>رفع صورة</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Media Thumbnails Grid */}
              <div className="p-3 border-b border-slate-500/20 overflow-y-auto max-h-52">
                <div className="grid grid-cols-2 gap-2">
                  {mediaList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMediaId(item.id)}
                      className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedMediaId === item.id 
                          ? 'border-[#C5A059] scale-105 shadow-md' 
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      {selectedMediaId === item.id && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C5A059] text-[#121212] flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Metadata Details */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-right text-xs">
                {currentMedia && (
                  <>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#C5A059] block border-b border-slate-500/20 pb-1">
                        بيانات الصورة النشطة
                      </span>
                      <div className="flex justify-between py-0.5 opacity-80">
                        <span className="text-slate-400">الاسم:</span>
                        <span className="font-mono text-[11px] truncate max-w-[130px]">{currentMedia.name}</span>
                      </div>
                      <div className="flex justify-between py-0.5 opacity-80">
                        <span className="text-slate-400">الصيغة:</span>
                        <span className="font-mono">{currentMedia.type}</span>
                      </div>
                      <div className="flex justify-between py-0.5 opacity-80">
                        <span className="text-slate-400">الأبعاد:</span>
                        <span className="font-mono">{currentMedia.dimensions}</span>
                      </div>
                      <div className="flex justify-between py-0.5 opacity-80">
                        <span className="text-slate-400">الحجم:</span>
                        <span className="font-mono">{currentMedia.fileSize}</span>
                      </div>
                    </div>

                    {/* Alt text */}
                    <div className="space-y-1 pt-2">
                      <span className="text-slate-400 font-bold block">النص البديل (SEO):</span>
                      <p className={`text-[11px] p-2.5 rounded-xl border leading-relaxed ${
                        theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824]' : 'bg-white border-[#E5E0D8]'
                      }`}>
                        {currentMedia.altText}
                      </p>
                    </div>

                    {/* Keywords */}
                    <div className="space-y-1 pt-2">
                      <span className="text-slate-400 font-bold block">الوسوم:</span>
                      <div className="flex flex-wrap gap-1">
                        {currentMedia.keywords.map((k, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] border ${
                            theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-[#C7C1B7]' : 'bg-white border-[#E5E0D8] text-[#5A554E]'
                          }`}>
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Avatar Set Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (currentMedia) {
                            setAvatarUrl(currentMedia.url);
                          }
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] transition-colors shadow-xs cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>تعيين كصورة شخصية للبروفايل</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Center Panel: Non-Destructive Live Photo Editor Canvas */}
            <div className={`flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-between relative ${
              theme === 'dark' ? 'bg-[#0A0A09]' : 'bg-[#ECE8DF]'
            }`}>
              
              {/* Top Canvas Toolbar */}
              <div className="w-full flex items-center justify-between mb-4 px-2">
                {/* Before / After Toggle Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      showBeforeAfter 
                        ? 'bg-[#C5A059] text-[#121212] border-[#C5A059] shadow-md' 
                        : theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-slate-300' : 'bg-white border-[#E5E0D8] text-slate-700'
                    }`}
                  >
                    {showBeforeAfter ? 'عرض الأصل (قبل)' : 'عرض التعديلات (بعد)'}
                  </button>

                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`p-1.5 rounded-xl border text-xs transition-colors ${
                      showGrid ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]' : theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26] text-slate-400' : 'bg-white border-[#E5E0D8] text-slate-600'
                    }`}
                    title="إظهار شبكة الأثلاث"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className={`flex items-center gap-1.5 border rounded-xl p-1 text-xs ${
                  theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-white border-[#E5E0D8]'
                }`}>
                  <button
                    onClick={() => setZoomLevel(Math.max(25, zoomLevel - 15))}
                    className="p-1 text-slate-400 hover:text-slate-200"
                    title="تصغير"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 font-mono text-[11px]">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 15))}
                    className="p-1 text-slate-400 hover:text-slate-200"
                    title="تكبير"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Actions: Save Version, Export Edited, Reset */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => saveMediaVersion(currentMedia.id, 'لقطة تعديل')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/30 text-xs font-bold transition-colors"
                    title="حفظ لقطة في سجل الإصدارات"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">حفظ إصدار</span>
                  </button>

                  <button
                    onClick={exportEditedImage}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] text-xs font-bold shadow-xs transition-colors"
                    title="تحميل وتصدير الصورة بالتعديلات"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير الصورة</span>
                  </button>

                  <button
                    onClick={() => resetMediaAdjustments(currentMedia.id)}
                    className={`p-1.5 rounded-xl border transition-colors ${
                      theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:text-[#C5A059]' : 'border-[#E5E0D8] text-slate-600 hover:text-[#C5A059]'
                    }`}
                    title="إعادة ضبط الكل"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Photo Display Frame with Dynamic Aspect Ratio and Crop Framing */}
              <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center overflow-hidden my-auto p-2">
                {currentMedia && (
                  <div 
                    className={`relative rounded-2xl overflow-hidden border-2 border-[#C5A059]/60 shadow-2xl transition-all duration-300 flex items-center justify-center bg-black/40 ${
                      adj.cropRatio === '1:1' 
                        ? 'aspect-square max-w-[380px] w-full' 
                        : adj.cropRatio === '4:5'
                          ? 'aspect-[4/5] max-w-[340px] w-full'
                          : adj.cropRatio === '16:9'
                            ? 'aspect-video max-w-[620px] w-full'
                            : adj.cropRatio === '3:2'
                              ? 'aspect-[3/2] max-w-[540px] w-full'
                              : 'max-h-[50vh] max-w-3xl w-auto'
                    }`}
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: 'center center'
                    }}
                  >
                    <img
                      src={currentMedia.url}
                      alt={currentMedia.name}
                      className={`transition-all duration-300 pointer-events-none ${
                        adj.cropRatio === 'free' ? 'max-h-[50vh] w-auto object-contain' : 'w-full h-full object-cover'
                      }`}
                      style={{
                        filter: cssFilter,
                        transform: transformStyle
                      }}
                    />

                    {/* Rule of Thirds Grid Overlay */}
                    {showGrid && (
                      <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10">
                        <div className="border-r border-b border-white/40" />
                        <div className="border-r border-b border-white/40" />
                        <div className="border-b border-white/40" />
                        <div className="border-r border-b border-white/40" />
                        <div className="border-r border-b border-white/40 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full border-2 border-[#C5A059] flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                          </div>
                        </div>
                        <div className="border-b border-white/40" />
                        <div className="border-r border-white/40" />
                        <div className="border-r border-white/40" />
                        <div className="" />
                      </div>
                    )}

                    {/* Crop corner guides */}
                    {adj.cropRatio !== 'free' && (
                      <div className="absolute inset-0 pointer-events-none border-2 border-[#C5A059]/80 rounded-2xl z-20">
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#C5A059]" />
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#C5A059]" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#C5A059]" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#C5A059]" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Filmstrip Carousel */}
              <div className="w-full flex items-center justify-center gap-3 pt-3 border-t border-slate-500/20">
                <button 
                  onClick={() => {
                    const idx = mediaList.findIndex(m => m.id === selectedMediaId);
                    if (idx > 0) setSelectedMediaId(mediaList[idx - 1].id);
                  }}
                  className="p-1 opacity-60 hover:opacity-100"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-md">
                  {mediaList.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedMediaId(item.id)}
                      className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        selectedMediaId === item.id ? 'border-[#C5A059] scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    const idx = mediaList.findIndex(m => m.id === selectedMediaId);
                    if (idx < mediaList.length - 1) setSelectedMediaId(mediaList[idx + 1].id);
                  }}
                  className="p-1 opacity-60 hover:opacity-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Left Panel: Adjustments Sliders & Version History */}
            <div className={`w-84 border-r flex flex-col shrink-0 z-20 transition-colors ${
              theme === 'dark' ? 'bg-[#141311] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E5E0D8] shadow-xs'
            }`}>
              {/* Photo Adjustments Tab Headers */}
              <div className="grid grid-cols-2 p-2 gap-1 border-b border-slate-500/20 text-xs font-bold">
                <button
                  onClick={() => setActiveAdjustTab('adjust')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    activeAdjustTab === 'adjust' ? 'bg-[#C5A059] text-[#121212]' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>الضبط والألوان</span>
                </button>
                <button
                  onClick={() => setActiveAdjustTab('crop')}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                    activeAdjustTab === 'crop' ? 'bg-[#C5A059] text-[#121212]' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>القص والتحويل</span>
                </button>
              </div>

              {/* Adjustments Sliders Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-right text-xs">
                {activeAdjustTab === 'adjust' ? (
                  <>
                    {/* Preset Filters Section */}
                    <div>
                      <label className="block text-slate-400 font-bold mb-2">الفلاتر الجاهزة (Presets)</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {FILTER_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => updateMediaAdjustments(currentMedia.id, preset.adj)}
                            className={`p-2 rounded-xl border text-center transition-all ${
                              adj.brightness === preset.adj.brightness && adj.contrast === preset.adj.contrast && adj.saturation === preset.adj.saturation && adj.temperature === preset.adj.temperature
                                ? 'bg-[#C5A059] text-[#121212] border-[#C5A059] font-bold shadow-xs'
                                : theme === 'dark' ? 'border-[#2E2B26] hover:bg-[#1E1C18] text-slate-300' : 'border-[#E5E0D8] hover:bg-[#F2EFE9] text-slate-700'
                            }`}
                          >
                            <span className="text-[11px] font-bold block">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Brightness */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-bold flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>السطوع (Brightness)</span>
                        </span>
                        <span className="font-mono">{adj.brightness}</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={adj.brightness}
                        onChange={(e) => updateMediaAdjustments(currentMedia.id, { brightness: Number(e.target.value) })}
                        className="w-full accent-[#C5A059]"
                      />
                    </div>

                    {/* Contrast */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-bold flex items-center gap-1">
                          <Contrast className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>التباين (Contrast)</span>
                        </span>
                        <span className="font-mono">{adj.contrast}</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={adj.contrast}
                        onChange={(e) => updateMediaAdjustments(currentMedia.id, { contrast: Number(e.target.value) })}
                        className="w-full accent-[#C5A059]"
                      />
                    </div>

                    {/* Saturation */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-bold flex items-center gap-1">
                          <Droplet className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>التشبع اللوني (Saturation)</span>
                        </span>
                        <span className="font-mono">{adj.saturation}</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        step="1"
                        value={adj.saturation}
                        onChange={(e) => updateMediaAdjustments(currentMedia.id, { saturation: Number(e.target.value) })}
                        className="w-full accent-[#C5A059]"
                      />
                    </div>

                    {/* Temperature */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-bold flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>الحرارة اللونية (Temperature)</span>
                        </span>
                        <span className="font-mono">{adj.temperature}</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        step="1"
                        value={adj.temperature}
                        onChange={(e) => updateMediaAdjustments(currentMedia.id, { temperature: Number(e.target.value) })}
                        className="w-full accent-[#C5A059]"
                      />
                    </div>

                    {/* Sharpness & Blur */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>الضبابية / النعومة (Blur)</span>
                        </span>
                        <span className="font-mono">{adj.sharpness}</span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        step="1"
                        value={adj.sharpness}
                        onChange={(e) => updateMediaAdjustments(currentMedia.id, { sharpness: Number(e.target.value) })}
                        className="w-full accent-[#C5A059]"
                      />
                    </div>

                    {/* Opacity */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-bold flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>الشفافية والتعتيم (Opacity)</span>
                        </span>
                        <span className="font-mono">{100 - (adj.opacity || 0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        step="1"
                        value={adj.opacity || 0}
                        onChange={(e) => updateMediaAdjustments(currentMedia.id, { opacity: Number(e.target.value) })}
                        className="w-full accent-[#C5A059]"
                      />
                    </div>

                    {/* Quick Avatar Set Button */}
                    <button
                      type="button"
                      onClick={applyAsProfileAvatar}
                      className="w-full py-2.5 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/40 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <User className="w-4 h-4" />
                      <span>تعيين الصورة الحالية كصورة شخصية (Avatar)</span>
                    </button>

                    {/* Reset Button */}
                    <button
                      onClick={() => resetMediaAdjustments(currentMedia.id)}
                      className={`w-full py-2 rounded-xl border font-bold text-xs transition-colors ${
                        theme === 'dark' ? 'border-[#2E2B26] hover:bg-[#201E1A] text-slate-300' : 'border-[#E5E0D8] hover:bg-[#F2EFE9] text-slate-700'
                      }`}
                    >
                      إعادة ضبط المؤشرات للوضع الافتراضي
                    </button>
                  </>
                ) : (
                  <>
                    {/* Crop Ratios Buttons */}
                    <div>
                      <label className="block text-slate-400 font-bold mb-2">نسبة أبعاد القص (Crop Aspect Ratio)</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['free', '1:1', '4:5', '16:9', '3:2'] as const).map((ratio) => (
                          <button
                            key={ratio}
                            onClick={() => {
                              setActiveCropRatio(ratio);
                              updateMediaAdjustments(currentMedia.id, { cropRatio: ratio });
                            }}
                            className={`py-2 rounded-lg border font-bold text-xs transition-all ${
                              (adj.cropRatio || activeCropRatio) === ratio
                                ? 'bg-[#C5A059] text-[#121212] border-[#C5A059] shadow-xs'
                                : theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:bg-[#1E1C18]' : 'border-[#E5E0D8] text-slate-600 hover:bg-[#F2EFE9]'
                            }`}
                          >
                            {ratio === 'free' ? 'حر (طبيعي)' : ratio === '1:1' ? '1:1 (مربع/بروفايل)' : ratio === '4:5' ? '4:5 (بورتريه)' : ratio === '16:9' ? '16:9 (عريض)' : '3:2 (فوتوغرافي)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Rotation Buttons */}
                    <div>
                      <label className="block text-slate-400 font-bold mb-2">أدوات التدوير السريع</label>
                      <div className="grid grid-cols-4 gap-1.5 mb-3">
                        <button
                          type="button"
                          onClick={() => updateMediaAdjustments(currentMedia.id, { rotate: ((adj.rotate || 0) - 90 + 360) % 360 })}
                          className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] ${
                            theme === 'dark' ? 'border-[#2E2B26] hover:bg-[#1E1C18] text-slate-300' : 'border-[#E5E0D8] hover:bg-[#F2EFE9] text-slate-700'
                          }`}
                          title="تدوير 90 درجة لليسار"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>-90° يسار</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateMediaAdjustments(currentMedia.id, { rotate: ((adj.rotate || 0) + 90) % 360 })}
                          className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] ${
                            theme === 'dark' ? 'border-[#2E2B26] hover:bg-[#1E1C18] text-slate-300' : 'border-[#E5E0D8] hover:bg-[#F2EFE9] text-slate-700'
                          }`}
                          title="تدوير 90 درجة لليمين"
                        >
                          <RotateCw className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>+90° يمين</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateMediaAdjustments(currentMedia.id, { rotate: ((adj.rotate || 0) + 180) % 360 })}
                          className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] ${
                            theme === 'dark' ? 'border-[#2E2B26] hover:bg-[#1E1C18] text-slate-300' : 'border-[#E5E0D8] hover:bg-[#F2EFE9] text-slate-700'
                          }`}
                          title="تدوير 180 درجة"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>180° دوران</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateMediaAdjustments(currentMedia.id, { rotate: 0 })}
                          className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-1 font-bold text-[11px] ${
                            adj.rotate === 0 
                              ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]' 
                              : theme === 'dark' ? 'border-[#2E2B26] hover:bg-[#1E1C18] text-slate-300' : 'border-[#E5E0D8] hover:bg-[#F2EFE9] text-slate-700'
                          }`}
                          title="إعادة التدوير للصفر"
                        >
                          <span className="font-mono text-xs text-[#C5A059]">0°</span>
                          <span>إعادة للصفر</span>
                        </button>
                      </div>

                      {/* Rotate Slider */}
                      <div className="flex justify-between mb-1">
                        <span className="font-bold">التدوير المخصص (0° - 360°)</span>
                        <span className="font-mono font-bold text-[#C5A059]">{adj.rotate || 0}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={adj.rotate || 0}
                        onChange={(e) => updateMediaAdjustments(currentMedia.id, { rotate: Number(e.target.value) })}
                        className="w-full accent-[#C5A059]"
                      />
                    </div>

                    {/* Flip */}
                    <div>
                      <label className="block text-slate-400 font-bold mb-2">قلب الاتجاه (Flip)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updateMediaAdjustments(currentMedia.id, { flipH: !adj.flipH })}
                          className={`py-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                            adj.flipH 
                              ? 'bg-[#C5A059] text-[#121212] border-[#C5A059] shadow-xs' 
                              : theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:bg-[#1E1C18]' : 'border-[#E5E0D8] text-slate-600 hover:bg-[#F2EFE9]'
                          }`}
                        >
                          <FlipHorizontal className="w-4 h-4" />
                          <span>قلب أفقي (Horizontal)</span>
                        </button>
                        <button
                          onClick={() => updateMediaAdjustments(currentMedia.id, { flipV: !adj.flipV })}
                          className={`py-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                            adj.flipV 
                              ? 'bg-[#C5A059] text-[#121212] border-[#C5A059] shadow-xs' 
                              : theme === 'dark' ? 'border-[#2E2B26] text-slate-400 hover:bg-[#1E1C18]' : 'border-[#E5E0D8] text-slate-600 hover:bg-[#F2EFE9]'
                          }`}
                        >
                          <FlipVertical className="w-4 h-4" />
                          <span>قلب عمودي (Vertical)</span>
                        </button>
                      </div>
                    </div>

                    {/* Set Avatar directly from Crop */}
                    <button
                      type="button"
                      onClick={applyAsProfileAvatar}
                      className="w-full py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <User className="w-4 h-4" />
                      <span>تعيين القص الحالي كصورة شخصية</span>
                    </button>
                  </>
                )}

                {/* Version History Log */}
                <div className="pt-4 border-t border-slate-500/20">
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold mb-3">
                    <History className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>سجل الإصدارات</span>
                  </div>

                  <div className="space-y-1.5">
                    {currentMedia.versions?.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => restoreMediaVersion(currentMedia.id, v.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-colors ${
                          theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824] hover:border-[#C5A059]/50' : 'bg-white border-[#E5E0D8] hover:border-[#C5A059]/50'
                        }`}
                      >
                        <span className="text-[11px] font-bold block">{v.label}</span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{v.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* MODE 2: ARTICLES EDITOR & LIVE PREVIEW                    */}
        {/* ========================================================= */}
        {studioTab === 'articles' && (
          <>
            {/* Right Panel: Articles Selector & Settings */}
            <div className={`w-72 border-l flex flex-col shrink-0 z-20 transition-colors ${
              theme === 'dark' ? 'bg-[#141311] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E5E0D8] shadow-xs'
            }`}>
              <div className="p-3 border-b border-slate-500/20 flex items-center justify-between">
                <span className="text-xs font-bold">المقالات ({articles.length})</span>
                <button
                  onClick={handleCreateArticle}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 text-[11px] font-bold"
                >
                  <Plus className="w-3 h-3" />
                  <span>مقال جديد</span>
                </button>
              </div>

              {/* Articles List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {articles.map((art) => {
                  const isSelected = selectedArticleId === art.id;
                  return (
                    <div
                      key={art.id}
                      onClick={() => setSelectedArticleId(art.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                        isSelected
                          ? 'bg-[#C5A059]/20 border-[#C5A059] font-bold shadow-xs'
                          : theme === 'dark'
                            ? 'bg-[#1A1917] border-[#2A2824] hover:bg-[#201E1A]'
                            : 'bg-white border-[#E5E0D8] hover:bg-[#F2EFE9]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#C5A059]">{art.category}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          art.status === 'published' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
                        }`}>
                          {art.status === 'published' ? 'منشور' : 'مسودة'}
                        </span>
                      </div>
                      <h4 className="font-bold line-clamp-2 leading-snug">{art.title}</h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>{art.publishDate}</span>
                        <span>{art.readTime}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Article Meta Settings */}
              {currentArticle && (
                <div className="p-3 border-t border-slate-500/20 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">حالة النشر:</span>
                    <button
                      onClick={() => updateArticle(currentArticle.id, {
                        status: currentArticle.status === 'published' ? 'draft' : 'published'
                      })}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                        currentArticle.status === 'published' 
                          ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                      }`}
                    >
                      {currentArticle.status === 'published' ? 'نشط (منشور)' : 'مسودة'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-xs font-semibold">صورة الغلاف:</span>
                      <label className="text-[11px] text-[#C5A059] hover:underline cursor-pointer flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>رفع غلاف جديد</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const optimizedUrl = await optimizeImage(file, 1200, 800, 0.82);
                                const newMedia: MediaItem = {
                                  id: 'med_' + Date.now(),
                                  name: file.name,
                                  url: optimizedUrl,
                                  originalUrl: optimizedUrl,
                                  type: (file.type.split('/')[1]?.toUpperCase() || 'JPG') as any,
                                  dimensions: '1200 × 800',
                                  fileSize: `${(optimizedUrl.length / 1024).toFixed(0)} KB`,
                                  addedDate: new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
                                  altText: 'غلاف مقال مخصص',
                                  keywords: ['غلاف', 'مقال', 'جديد'],
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
                                await addMediaItem(newMedia);
                                updateArticle(currentArticle.id, { coverImage: optimizedUrl });
                                notify('تم رفع وتعيين صورة الغلاف بنجاح!');
                              } catch {
                                notify('تعذر رفع الصورة', 'warning');
                              }
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto p-1 rounded-xl bg-black/10 border border-slate-500/20">
                      {mediaList.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            updateArticle(currentArticle.id, { coverImage: m.url });
                            notify('تم اختيار الغلاف للمقال');
                          }}
                          className={`aspect-video rounded-lg overflow-hidden border relative transition-all ${
                            currentArticle.coverImage === m.url 
                              ? 'border-[#C5A059] ring-2 ring-[#C5A059]/60 opacity-100' 
                              : 'border-transparent opacity-65 hover:opacity-100'
                          }`}
                        >
                          <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                          {currentArticle.coverImage === m.url && (
                            <div className="absolute top-1 right-1 bg-[#C5A059] text-black rounded-full p-0.5 shadow-xs">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (articles.length > 1) {
                        deleteArticle(currentArticle.id);
                        notify('تم حذف المقال', 'info');
                      } else {
                        notify('يجب الاحتفاظ بمقال واحد على الأقل', 'warning');
                      }
                    }}
                    className="w-full py-1.5 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold mt-1"
                  >
                    حذف هذا المقال
                  </button>
                </div>
              )}
            </div>

            {/* Center Panel: Live Article Formatted Canvas */}
            <div className={`flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center ${
              theme === 'dark' ? 'bg-[#0A0A09]' : 'bg-[#ECE8DF]'
            }`}>
              <article className={`w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden border p-6 sm:p-10 space-y-6 ${
                theme === 'dark' ? 'bg-[#141311] border-[#2A2824]' : 'bg-white border-[#E5E0D8]'
              }`}>
                {/* Cover Image */}
                {currentArticle?.coverImage && (
                  <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden shadow-md bg-[#0F0E0C] flex items-center justify-center">
                    <img
                      src={currentArticle.coverImage}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 scale-110 pointer-events-none"
                    />
                    <img 
                      src={currentArticle.coverImage} 
                      alt={currentArticle.title} 
                      className={`relative z-10 max-h-full max-w-full w-auto h-auto ${
                        currentArticle.imageFit === 'cover' ? 'w-full h-full object-cover' : 'object-contain p-2'
                      }`} 
                    />
                  </div>
                )}

                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs opacity-75">
                  <span className="px-2.5 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] font-bold">
                    {currentArticle?.category}
                  </span>
                  <span>{currentArticle?.publishDate}</span>
                  <span>•</span>
                  <span>{currentArticle?.readTime}</span>
                </div>

                {/* Title & Excerpt */}
                <h1 className="text-2xl sm:text-4xl font-serif font-black leading-tight">
                  {currentArticle?.title}
                </h1>
                <p className="text-base leading-relaxed opacity-85 pb-4 border-b border-slate-500/20 font-serif italic">
                  {currentArticle?.excerpt}
                </p>

                {/* Render Article Blocks */}
                <div className="space-y-6 pt-2">
                  {currentArticle?.blocks?.map((block) => (
                    <div key={block.id} className="space-y-2">
                      {block.type === 'h2' && (
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#C5A059] pt-4">
                          {block.content}
                        </h2>
                      )}

                      {block.type === 'paragraph' && (
                        <p className="text-sm sm:text-base leading-relaxed opacity-90 whitespace-pre-line">
                          {block.content}
                        </p>
                      )}

                      {block.type === 'quote' && (
                        <blockquote className="p-4 sm:p-6 rounded-2xl border-r-4 border-[#C5A059] bg-[#C5A059]/10 font-serif text-base sm:text-lg italic leading-relaxed">
                          {block.content}
                        </blockquote>
                      )}

                      {block.type === 'image' && (
                        <div className="relative rounded-xl overflow-hidden border border-slate-500/20 shadow-md bg-[#0F0E0C] flex items-center justify-center min-h-64">
                          <img
                            src={block.content}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 scale-110 pointer-events-none"
                          />
                          <img src={block.content} alt="مقال" className="relative z-10 max-h-80 max-w-full w-auto h-auto object-contain p-2" />
                        </div>
                      )}

                      {block.type === 'table' && (
                        <div className="overflow-x-auto rounded-xl border border-slate-500/20">
                          <table className="w-full text-xs text-right">
                            <tbody>
                              {block.content.split('\n').map((row, rIdx) => (
                                <tr key={rIdx} className={rIdx === 0 ? 'bg-[#C5A059]/20 font-bold' : 'border-t border-slate-500/20'}>
                                  {row.split('|').map((col, cIdx) => (
                                    <td key={cIdx} className="p-2.5">{col.trim()}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {block.type === 'cta' && (
                        <div className="p-6 rounded-2xl border border-[#C5A059]/30 bg-[#C5A059]/15 text-center space-y-3">
                          <p className="font-serif font-bold text-base">{block.content}</p>
                          <button className="px-6 py-2.5 rounded-xl bg-[#C5A059] text-[#121212] font-bold text-xs">
                            {block.meta?.buttonText || 'تواصل الآن'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            </div>

            {/* Left Panel: Block Editor & Formatter */}
            <div className={`w-84 border-r flex flex-col shrink-0 z-20 transition-colors ${
              theme === 'dark' ? 'bg-[#141311] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E5E0D8] shadow-xs'
            }`}>
              {/* Header */}
              <div className="p-3 border-b border-slate-500/20 space-y-2">
                <span className="text-xs font-bold text-slate-400 block">محرر المقال بالكتل</span>
                <input
                  type="text"
                  value={currentArticle?.title || ''}
                  onChange={(e) => currentArticle && updateArticle(currentArticle.id, { title: e.target.value })}
                  placeholder="عنوان المقال..."
                  className={`w-full text-sm font-bold bg-transparent border-b pb-1 outline-none focus:border-[#C5A059] ${
                    theme === 'dark' ? 'border-[#2E2B26] text-white' : 'border-[#E5E0D8] text-slate-900'
                  }`}
                />
              </div>

              {/* Blocks Editor */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 text-right text-xs">
                {currentArticle?.blocks?.map((block, idx) => (
                  <div 
                    key={block.id}
                    className={`p-3 rounded-xl border space-y-2 ${
                      theme === 'dark' ? 'bg-[#1A1917] border-[#2A2824]' : 'bg-white border-[#E5E0D8]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-[#C5A059]">كتلة: {block.type}</span>
                      <button
                        onClick={() => handleDeleteArticleBlock(block.id)}
                        className="text-slate-400 hover:text-rose-500"
                        title="حذف الكتلة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <textarea
                      rows={block.type === 'paragraph' ? 3 : 2}
                      value={block.content}
                      onChange={(e) => {
                        const updated = currentArticle.blocks.map(b => b.id === block.id ? { ...b, content: e.target.value } : b);
                        updateArticle(currentArticle.id, { blocks: updated });
                      }}
                      className={`w-full p-2 rounded-lg border outline-none text-xs ${
                        theme === 'dark' ? 'bg-[#141311] border-[#2E2B26] text-slate-200 focus:border-[#C5A059]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-slate-800 focus:border-[#C5A059]'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Add Block Footer */}
              <div className="p-3 border-t border-slate-500/20">
                <span className="text-[11px] font-bold text-slate-400 block mb-2">إضافة كتلة جديدة</span>
                <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                  <button onClick={() => handleAddArticleBlock('paragraph')} className="py-2 rounded-lg border border-slate-500/20 hover:bg-[#C5A059]/20 hover:text-[#C5A059]">فقرة</button>
                  <button onClick={() => handleAddArticleBlock('h2')} className="py-2 rounded-lg border border-slate-500/20 hover:bg-[#C5A059]/20 hover:text-[#C5A059]">عنوان فرعي</button>
                  <button onClick={() => handleAddArticleBlock('quote')} className="py-2 rounded-lg border border-slate-500/20 hover:bg-[#C5A059]/20 hover:text-[#C5A059]">اقتباس</button>
                  <button onClick={() => handleAddArticleBlock('image')} className="py-2 rounded-lg border border-slate-500/20 hover:bg-[#C5A059]/20 hover:text-[#C5A059]">صورة</button>
                  <button onClick={() => handleAddArticleBlock('table')} className="py-2 rounded-lg border border-slate-500/20 hover:bg-[#C5A059]/20 hover:text-[#C5A059]">جدول</button>
                  <button onClick={() => handleAddArticleBlock('cta')} className="py-2 rounded-lg border border-slate-500/20 hover:bg-[#C5A059]/20 hover:text-[#C5A059]">دعوة إجراء</button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* MODE 3: MEDIA LIBRARY MANAGER                             */}
        {/* ========================================================= */}
        {studioTab === 'media_library' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Library Filter & Search Toolbar */}
            <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
              theme === 'dark' ? 'bg-[#141311] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                  theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-white border-[#E5E0D8]'
                }`}>
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={mediaSearchQuery}
                    onChange={(e) => setMediaSearchQuery(e.target.value)}
                    placeholder="البحث بالاسم أو الوسوم..."
                    className="bg-transparent text-xs outline-none w-48"
                  />
                </div>

                {/* Tag Chips */}
                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedTagFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                      selectedTagFilter === 'all' ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]' : 'border-transparent opacity-70'
                    }`}
                  >
                    الكل ({mediaList.length})
                  </button>
                  {allMediaTags.slice(0, 4).map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTagFilter(t)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-semibold border ${
                        selectedTagFilter === t ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]' : 'border-slate-500/20 opacity-70'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] font-bold text-xs shadow-xs transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>رفع وسائط جديدة</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Media Grid */}
            <div className={`flex-1 overflow-y-auto p-4 sm:p-6 ${
              theme === 'dark' ? 'bg-[#0E0E0E]' : 'bg-[#F4F1EA]'
            }`}>
              <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl overflow-hidden border shadow-sm transition-all group ${
                      theme === 'dark' ? 'bg-[#141311] border-[#2A2824] hover:border-[#C5A059]/60' : 'bg-white border-[#E5E0D8] hover:border-[#C5A059]/60'
                    }`}
                  >
                    <div className="relative aspect-video overflow-hidden bg-black/10">
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono">
                        {item.dimensions}
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs truncate max-w-[150px]">{item.name}</h4>
                        <span className="text-[10px] opacity-60 font-mono">{item.fileSize}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {item.keywords.slice(0, 3).map((k, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#C5A059]/10 text-[#C5A059]">
                            {k}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-500/20 flex flex-col gap-2">
                        {/* Direct Usage Actions */}
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          <button
                            type="button"
                            onClick={async () => {
                              await setAvatarUrl(item.url);
                            }}
                            className="px-2 py-1 rounded bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            title="تعيين كصورة البروفايل الشخصية"
                          >
                            <User className="w-3 h-3" />
                            <span>صورة شخصية</span>
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const optLogo = await optimizeImage(item.url, 400, 400, 0.85, true);
                                updateProfile({ logoUrl: optLogo, useImageLogo: true });
                                await savePortfolioToServer({ profileOverride: { ...profile, logoUrl: optLogo, useImageLogo: true } });
                                notify('تم تعيين الصورة كشعار رسمي للموقع وحفظها بنجاح!');
                              } catch {
                                updateProfile({ logoUrl: item.url, useImageLogo: true });
                                await savePortfolioToServer({ profileOverride: { ...profile, logoUrl: item.url, useImageLogo: true } });
                                notify('تم تعيين الصورة كشعار للموقع بنجاح!');
                              }
                            }}
                            className="px-2 py-1 rounded bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            title="تعيين كشعار الموقع"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>شعار الموقع</span>
                          </button>
                        </div>

                        {/* Bottom Row Controls */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => {
                              setSelectedMediaId(item.id);
                              setStudioTab('photo_editor');
                            }}
                            className="flex items-center gap-1 text-[11px] text-[#C5A059] font-bold hover:underline cursor-pointer"
                          >
                            <Sliders className="w-3 h-3" />
                            <span>تحرير الفلاتر</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText(item.url);
                                notify('تم نسخ رابط الصورة إلى الحافظة');
                              }}
                              className="p-1 rounded text-slate-400 hover:text-slate-200 cursor-pointer"
                              title="نسخ الرابط"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (mediaList.length > 1) {
                                  deleteMediaItem(item.id);
                                } else {
                                  notify('يجب الاحتفاظ بصورة واحدة على الأقل', 'warning');
                                }
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-500 cursor-pointer"
                              title="حذف الصورة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

