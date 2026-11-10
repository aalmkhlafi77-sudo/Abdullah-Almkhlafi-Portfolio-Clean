import React, { useState } from 'react';
import { 
  Sparkles, Palette, Code, Circle, TrendingUp, Share2, 
  Check, Copy, ArrowRight, Wand2, Sliders, Layers, Search
} from 'lucide-react';
import { IconRenderer } from '../ui/IconRenderer';

export interface IconPresetItem {
  id: string;
  name: string; // Lucide icon name
  label: string;
  category: 'Artistic' | 'Technical' | 'Minimalist' | 'Business' | 'Media';
  color: string;
  size: number;
  rotation: number;
  tags: string[];
  description: string;
}

export interface IconPresetCollection {
  id: string;
  title: string;
  titleEn: 'Artistic' | 'Technical' | 'Minimalist' | 'Business' | 'Media';
  description: string;
  accentColor: string;
  badge: string;
  icons: IconPresetItem[];
}

export const ICON_PRESET_COLLECTIONS: IconPresetCollection[] = [
  {
    id: 'artistic',
    title: 'مجموعة فنية وإبداعية',
    titleEn: 'Artistic',
    description: 'أيقونات إبداعية مزينة بلمسات لونية فاخرة تناسب المصممين، الرسامين والمبدعين.',
    accentColor: '#C5A059',
    badge: 'Artistic & Creative',
    icons: [
      { id: 'art-1', name: 'Palette', label: 'لوحة ألوان', category: 'Artistic', color: '#C5A059', size: 26, rotation: 0, tags: ['art', 'color', 'design'], description: 'رمز الفن والتصميم والتلوين' },
      { id: 'art-2', name: 'Sparkles', label: 'بريق سحري', category: 'Artistic', color: '#DFCA9B', size: 26, rotation: 15, tags: ['magic', 'shine', 'ai'], description: 'إبراز التميز والابتكار' },
      { id: 'art-3', name: 'Feather', label: 'ريشة فنية', category: 'Artistic', color: '#C5A059', size: 24, rotation: -15, tags: ['write', 'feather', 'light'], description: 'خفة اليد والأصالة في الكتابة' },
      { id: 'art-4', name: 'Wand2', label: 'عصا سحرية', category: 'Artistic', color: '#F43F5E', size: 26, rotation: 45, tags: ['magic', 'transform', 'create'], description: 'تحويل الأفكار إلى واقع إبداعي' },
      { id: 'art-5', name: 'Paintbrush', label: 'فرشاة رسم', category: 'Artistic', color: '#F59E0B', size: 26, rotation: 0, tags: ['brush', 'paint', 'craft'], description: 'لمسات فنية متقنة' },
      { id: 'art-6', name: 'PenTool', label: 'أداة بن تول', category: 'Artistic', color: '#8B5CF6', size: 26, rotation: -30, tags: ['vector', 'bezier', 'pen'], description: 'دقة الفيكتور والرسم الهندسي' },
      { id: 'art-7', name: 'Shapes', label: 'أشكال بصرية', category: 'Artistic', color: '#EC4899', size: 26, rotation: 0, tags: ['geometry', 'abstract', 'composition'], description: 'تناغم التكوين البصري' },
      { id: 'art-8', name: 'Gem', label: 'جوهرة', category: 'Artistic', color: '#10B981', size: 26, rotation: 0, tags: ['luxury', 'value', 'crystal'], description: 'قيمة فنية استثنائية' },
      { id: 'art-9', name: 'Crown', label: 'تاج التميز', category: 'Artistic', color: '#EAB308', size: 28, rotation: 0, tags: ['premium', 'gold', 'royal'], description: 'تصاميم رفيعة المستوى' },
      { id: 'art-10', name: 'Camera', label: 'عدسة فوتوغرافية', category: 'Artistic', color: '#38BDF8', size: 24, rotation: 0, tags: ['photo', 'lens', 'capture'], description: 'التقاط اللحظات والجمال' },
      { id: 'art-11', name: 'Music', label: 'نغمة موسيقية', category: 'Artistic', color: '#A855F7', size: 24, rotation: 15, tags: ['audio', 'harmony', 'sound'], description: 'الإيقاع والهارموني الإبداعي' },
      { id: 'art-12', name: 'Flame', label: 'شعلة الإلهام', category: 'Artistic', color: '#EF4444', size: 26, rotation: 0, tags: ['fire', 'passion', 'energy'], description: 'شغف وحماس لا ينطفئ' },
    ]
  },
  {
    id: 'technical',
    title: 'مجموعة تقنية وبرمجية',
    titleEn: 'Technical',
    description: 'أيقونات برمجية وتقنية عالية الدقة تناسب المطورين، مهندسي النظم وحلول السحابة.',
    accentColor: '#3B82F6',
    badge: 'Technical & Engineering',
    icons: [
      { id: 'tech-1', name: 'Code', label: 'شفرة برمجية', category: 'Technical', color: '#3B82F6', size: 26, rotation: 0, tags: ['coding', 'syntax', 'dev'], description: 'تطوير وبرمجة الواجهات' },
      { id: 'tech-2', name: 'Terminal', label: 'طرفية الأوامر', category: 'Technical', color: '#10B981', size: 24, rotation: 0, tags: ['cli', 'bash', 'console'], description: 'أتمتة وتحكم مباشر' },
      { id: 'tech-3', name: 'Cpu', label: 'معالج دقيق', category: 'Technical', color: '#06B6D4', size: 26, rotation: 0, tags: ['hardware', 'processor', 'logic'], description: 'أداء فائق وحوسبة سريعة' },
      { id: 'tech-4', name: 'Database', label: 'قاعدة بيانات', category: 'Technical', color: '#6366F1', size: 26, rotation: 0, tags: ['sql', 'nosql', 'storage'], description: 'تخزين وإدارة البيانات الضخمة' },
      { id: 'tech-5', name: 'Server', label: 'خادم سحابي', category: 'Technical', color: '#3B82F6', size: 26, rotation: 0, tags: ['cloud', 'backend', 'api'], description: 'بنية تحتية سحابية موثوقة' },
      { id: 'tech-6', name: 'Binary', label: 'شفرة ثنائية', category: 'Technical', color: '#0EA5E9', size: 24, rotation: 0, tags: ['data', 'bits', 'algorithm'], description: 'المنطق الرياضي والخوارزميات' },
      { id: 'tech-7', name: 'GitBranch', label: 'تفريعات جيت', category: 'Technical', color: '#F97316', size: 26, rotation: 0, tags: ['version', 'git', 'collab'], description: 'إدارة الإصدارات والتعاون' },
      { id: 'tech-8', name: 'Workflow', label: 'سير العمل الآلي', category: 'Technical', color: '#8B5CF6', size: 26, rotation: 0, tags: ['pipeline', 'ci/cd', 'automation'], description: 'مسارات بناء مؤتمتة' },
      { id: 'tech-9', name: 'Shield', label: 'أمان وحماية', category: 'Technical', color: '#10B981', size: 26, rotation: 0, tags: ['security', 'auth', 'firewall'], description: 'حماية وتشفير عالي الأمان' },
      { id: 'tech-10', name: 'Zap', label: 'سرعة البرق', category: 'Technical', color: '#EAB308', size: 26, rotation: 0, tags: ['speed', 'fast', 'instant'], description: 'استجابة فائقة السرعة' },
      { id: 'tech-11', name: 'Network', label: 'شبكة مترابطة', category: 'Technical', color: '#38BDF8', size: 26, rotation: 0, tags: ['mesh', 'distributed', 'connect'], description: 'أنظمة متصلة وموزعة' },
      { id: 'tech-12', name: 'Smartphone', label: 'تطبيقات الجوال', category: 'Technical', color: '#64748B', size: 24, rotation: 0, tags: ['mobile', 'ios', 'android'], description: 'تجارب متنقلة عبر الأجهزة' },
    ]
  },
  {
    id: 'minimalist',
    title: 'مجموعة مينيمال وبسيطة',
    titleEn: 'Minimalist',
    description: 'أيقونات نقية وخطوط هندسية هادئة تعزز التبسيط والوضوح البصري العصري.',
    accentColor: '#94A3B8',
    badge: 'Minimalist & Clean',
    icons: [
      { id: 'min-1', name: 'Circle', label: 'دائرة نقية', category: 'Minimalist', color: '#E2E8F0', size: 24, rotation: 0, tags: ['circle', 'pure', 'dot'], description: 'تركيز على الجوهر والصفاء' },
      { id: 'min-2', name: 'Square', label: 'مربع هندسي', category: 'Minimalist', color: '#CBD5E1', size: 24, rotation: 0, tags: ['square', 'block', 'grid'], description: 'توازن وبناء مستقر' },
      { id: 'min-3', name: 'ArrowUpRight', label: 'سهم الصعود', category: 'Minimalist', color: '#F1F5F9', size: 24, rotation: 0, tags: ['arrow', 'link', 'forward'], description: 'انتقال مباشر ومقتضب' },
      { id: 'min-4', name: 'Minus', label: 'خط تجريدي', category: 'Minimalist', color: '#94A3B8', size: 24, rotation: 0, tags: ['line', 'divider', 'subtle'], description: 'فاصل هندسي أنيق' },
      { id: 'min-5', name: 'CornerUpRight', label: 'توجيه هندسي', category: 'Minimalist', color: '#E2E8F0', size: 24, rotation: 0, tags: ['corner', 'turn', 'direct'], description: 'توجيه واثق بدون بهرجة' },
      { id: 'min-6', name: 'Hash', label: 'علامة وسام', category: 'Minimalist', color: '#94A3B8', size: 24, rotation: 0, tags: ['number', 'tag', 'clean'], description: 'رمز رقمي مقتضب' },
      { id: 'min-7', name: 'Slash', label: 'شرطة مائلة', category: 'Minimalist', color: '#CBD5E1', size: 24, rotation: 0, tags: ['slash', 'lean', 'modern'], description: 'لمسة معمارية خفيفة' },
      { id: 'min-8', name: 'Eye', label: 'رؤية بصرية', category: 'Minimalist', color: '#F8FAFC', size: 24, rotation: 0, tags: ['view', 'vision', 'observe'], description: 'وضوح الرؤية والبساطة' },
      { id: 'min-9', name: 'Disc', label: 'قرص متمركز', category: 'Minimalist', color: '#E2E8F0', size: 24, rotation: 0, tags: ['disc', 'core', 'center'], description: 'نقطة ارتكاز دائرية' },
      { id: 'min-10', name: 'Grid', label: 'شبكة منتظمة', category: 'Minimalist', color: '#94A3B8', size: 24, rotation: 0, tags: ['matrix', 'layout', 'order'], description: 'نظام قياسي صارم' },
      { id: 'min-11', name: 'Sliders', label: 'مؤشرات دقيقة', category: 'Minimalist', color: '#CBD5E1', size: 24, rotation: 0, tags: ['tune', 'balance', 'control'], description: 'تعديل انسيابي متوازن' },
      { id: 'min-12', name: 'Check', label: 'علامة إنجاز', category: 'Minimalist', color: '#10B981', size: 24, rotation: 0, tags: ['done', 'true', 'ok'], description: 'تأكيد مباشر ودقيق' },
    ]
  },
  {
    id: 'business',
    title: 'مجموعة أعمال وريادة',
    titleEn: 'Business',
    description: 'أيقونات إدارية واستثمارية تعكس النمو والاحترافية واستراتيجيات الأعمال.',
    accentColor: '#F59E0B',
    badge: 'Business & Growth',
    icons: [
      { id: 'biz-1', name: 'TrendingUp', label: 'مؤشر النمو', category: 'Business', color: '#10B981', size: 26, rotation: 0, tags: ['growth', 'profit', 'chart'], description: 'صعود مستمر في العوائد' },
      { id: 'biz-2', name: 'Briefcase', label: 'حقيبة أعمال', category: 'Business', color: '#C5A059', size: 26, rotation: 0, tags: ['portfolio', 'career', 'corporate'], description: 'مشاريع مؤسسية ومهنية' },
      { id: 'biz-3', name: 'DollarSign', label: 'عملة وقيمة', category: 'Business', color: '#10B981', size: 26, rotation: 0, tags: ['finance', 'roi', 'money'], description: 'عائد الاستثمار والجدوى' },
      { id: 'biz-4', name: 'BarChart2', label: 'تحليل بياني', category: 'Business', color: '#3B82F6', size: 26, rotation: 0, tags: ['analytics', 'metrics', 'data'], description: 'قرارات مبنية على البيانات' },
      { id: 'biz-5', name: 'PieChart', label: 'حصص السوق', category: 'Business', color: '#8B5CF6', size: 26, rotation: 0, tags: ['distribution', 'share', 'market'], description: 'توزيع الحصص والشرائح' },
      { id: 'biz-6', name: 'Award', label: 'جائزة تقديرية', category: 'Business', color: '#EAB308', size: 28, rotation: 0, tags: ['excellence', 'badge', 'honor'], description: 'شهادات واعتمادات دولية' },
      { id: 'biz-7', name: 'Globe', label: 'توسع عالمي', category: 'Business', color: '#06B6D4', size: 26, rotation: 0, tags: ['world', 'scale', 'international'], description: 'انتشار عبر الأسواق العالمية' },
      { id: 'biz-8', name: 'Target', label: 'هدف استراتيجي', category: 'Business', color: '#EF4444', size: 26, rotation: 0, tags: ['goal', 'kpi', 'focus'], description: 'تحقيق الأهداف والمؤشرات' },
      { id: 'biz-9', name: 'CreditCard', label: 'دفع وحسابات', category: 'Business', color: '#6366F1', size: 24, rotation: 0, tags: ['checkout', 'payment', 'billing'], description: 'معاملات سلسة ومؤمنة' },
      { id: 'biz-10', name: 'ShoppingBag', label: 'تجارة إلكترونية', category: 'Business', color: '#F43F5E', size: 24, rotation: 0, tags: ['ecommerce', 'sales', 'retail'], description: 'تسوق ومبيعات رقمية' },
    ]
  },
  {
    id: 'media',
    title: 'مجموعة وسائط وتواصل',
    titleEn: 'Media',
    description: 'أيقونات تواصل وتفاعل رقمي لصناع المحتوى والشبكات الاجتماعية والوسائط المتعددة.',
    accentColor: '#EC4899',
    badge: 'Media & Social',
    icons: [
      { id: 'med-1', name: 'Share2', label: 'مشاركة ونشر', category: 'Media', color: '#38BDF8', size: 26, rotation: 0, tags: ['social', 'broadcast', 'share'], description: 'وصول واسع ومشاركة' },
      { id: 'med-2', name: 'Send', label: 'إرسال فوري', category: 'Media', color: '#C5A059', size: 24, rotation: -20, tags: ['message', 'direct', 'inbox'], description: 'تواصل مباشر وسريع' },
      { id: 'med-3', name: 'MessageSquare', label: 'محادثة وتفاعل', category: 'Media', color: '#10B981', size: 26, rotation: 0, tags: ['chat', 'feedback', 'comment'], description: 'بناء مجتمع متفاعل' },
      { id: 'med-4', name: 'Headphones', label: 'بودكاست وصوت', category: 'Media', color: '#8B5CF6', size: 26, rotation: 0, tags: ['podcast', 'listen', 'audio'], description: 'محتوى مسموع وتجارب صوتية' },
      { id: 'med-5', name: 'Video', label: 'إنتاج مرئي', category: 'Media', color: '#EF4444', size: 26, rotation: 0, tags: ['film', 'stream', 'visual'], description: 'فيديو عالي الجودة' },
      { id: 'med-6', name: 'Radio', label: 'بث مباشر', category: 'Media', color: '#F59E0B', size: 26, rotation: 0, tags: ['live', 'stream', 'air'], description: 'تغطيات حية وبثوث مستمرة' },
      { id: 'med-7', name: 'Bookmark', label: 'حفظ وتفضيل', category: 'Media', color: '#EAB308', size: 24, rotation: 0, tags: ['favorite', 'save', 'collect'], description: 'أرشفة المحتوى القيم' },
      { id: 'med-8', name: 'Bell', label: 'تنبيهات ومتابعة', category: 'Media', color: '#F43F5E', size: 26, rotation: 15, tags: ['notify', 'alert', 'subscribe'], description: 'إشعارات لحظية للمتابعين' },
    ]
  }
];

export interface IconPresetsProps {
  onSelectPreset: (preset: { 
    iconName: string; 
    color?: string; 
    size?: number; 
    rotation?: number; 
    title?: string;
  }) => void;
  onApplyPresetPack?: (pack: IconPresetCollection) => void;
  theme?: 'dark' | 'light';
  currentIconName?: string;
  currentColor?: string;
  onColorChange?: (color: string) => void;
  className?: string;
  viewMode?: 'grid' | 'cards' | 'compact';
  enableDrag?: boolean;
}

export const IconPresets: React.FC<IconPresetsProps> = ({
  onSelectPreset,
  onApplyPresetPack,
  theme = 'dark',
  currentIconName,
  currentColor,
  onColorChange,
  className = '',
  viewMode = 'cards',
  enableDrag = true
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Artistic' | 'Technical' | 'Minimalist' | 'Business' | 'Media'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState<string | null>(currentColor || null);

  const categories = [
    { id: 'All', label: 'الكل (All)', icon: Layers },
    { id: 'Artistic', label: 'فني (Artistic)', icon: Palette, color: '#C5A059' },
    { id: 'Technical', label: 'تقني (Technical)', icon: Code, color: '#3B82F6' },
    { id: 'Minimalist', label: 'مينيمال (Minimalist)', icon: Circle, color: '#94A3B8' },
    { id: 'Business', label: 'أعمال (Business)', icon: TrendingUp, color: '#F59E0B' },
    { id: 'Media', label: 'وسائط (Media)', icon: Share2, color: '#EC4899' },
  ];

  const paletteColors = [
    { name: 'ذهبي أصيل', hex: '#C5A059' },
    { name: 'أخضر زمردي', hex: '#10B981' },
    { name: 'أزرق تقني', hex: '#3B82F6' },
    { name: 'بنفسجي ملكي', hex: '#8B5CF6' },
    { name: 'وردي حيوي', hex: '#F43F5E' },
    { name: 'عنبري دافئ', hex: '#F59E0B' },
    { name: 'سماوي ناصع', hex: '#06B6D4' },
    { name: 'أبيض نقي', hex: '#FFFFFF' },
  ];

  const handleColorPick = (hex: string) => {
    setCustomColor(hex);
    if (onColorChange) onColorChange(hex);
  };

  const filteredCollections = ICON_PRESET_COLLECTIONS.filter(col => {
    if (activeCategory !== 'All' && col.titleEn !== activeCategory) {
      return false;
    }
    return true;
  }).map(col => {
    if (!searchQuery.trim()) return col;
    const q = searchQuery.toLowerCase();
    const matchingIcons = col.icons.filter(ic => 
      ic.name.toLowerCase().includes(q) || 
      ic.label.includes(q) || 
      ic.description.includes(q) ||
      ic.tags.some(t => t.toLowerCase().includes(q))
    );
    return {
      ...col,
      icons: matchingIcons
    };
  }).filter(col => col.icons.length > 0);

  const handlePresetClick = (preset: IconPresetItem) => {
    setSelectedPresetId(preset.id);
    const chosenColor = customColor || preset.color;
    onSelectPreset({
      iconName: preset.name,
      color: chosenColor,
      size: preset.size,
      rotation: preset.rotation,
      title: preset.label
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quick Color Palette Toolbar */}
      <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
        theme === 'dark' ? 'bg-[#151412] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E5E0D8]'
      }`}>
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span className="text-xs font-bold text-[#DFCA9B]">اختر لون الأيقونة:</span>
          {customColor && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#C5A059]/20 text-[#C5A059]">
              {customColor}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {paletteColors.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => handleColorPick(c.hex)}
              className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                customColor === c.hex
                  ? 'border-white scale-120 ring-2 ring-[#C5A059] shadow-md'
                  : 'border-white/20 hover:scale-110 opacity-85 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          <div className="flex items-center gap-1 pl-1 border-r border-[#C5A059]/20">
            <input
              type="color"
              value={customColor || '#C5A059'}
              onChange={(e) => handleColorPick(e.target.value)}
              className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-0"
              title="تحديد لون مخصص بحرية"
            />
            {customColor && (
              <button
                type="button"
                onClick={() => {
                  setCustomColor(null);
                }}
                className="text-[10px] text-[#8E877D] hover:text-white px-1.5 py-0.5 rounded border border-[#8E877D]/30 font-mono"
                title="استعادة الألوان الافتراضية للحزم"
              >
                تلقائي
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search & Category Filter Header */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute right-3.5 top-3 w-4 h-4 text-[#8E877D]" />
          <input
            type="text"
            placeholder="بحث في مجموعات الأيقونات الجاهزة (مثال: شفرة، Palette، ريشة، Cpu)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-4 pr-10 py-2.5 rounded-2xl border text-xs outline-none transition-all ${
              theme === 'dark' 
                ? 'bg-[#121212] border-[#2E2B26] text-white focus:border-[#C5A059]' 
                : 'bg-white border-[#E5E0D8] text-slate-900 focus:border-[#C5A059]'
            }`}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {categories.map((cat) => {
            const IconComp = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#C5A059] text-[#121212] shadow-sm'
                    : theme === 'dark' 
                      ? 'bg-[#22201C] text-[#8E877D] hover:text-white hover:bg-[#2A2824]' 
                      : 'bg-[#E5E0D8]/60 text-slate-600 hover:text-slate-900 hover:bg-[#E5E0D8]'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" style={{ color: isActive ? '#121212' : cat.color }} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Collections Container */}
      <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
        {filteredCollections.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-[#8E877D]/30 space-y-2">
            <Sparkles className="w-8 h-8 text-[#8E877D] mx-auto opacity-50" />
            <p className="text-xs text-[#8E877D]">لا توجد نتائج تطابق بحثك في مجموعات الأيقونات</p>
          </div>
        ) : (
          filteredCollections.map((col) => (
            <div
              key={col.id}
              className={`p-4 rounded-2xl border transition-all ${
                theme === 'dark' 
                  ? 'bg-[#151412] border-[#2A2824] hover:border-[#C5A059]/40' 
                  : 'bg-white border-[#E5E0D8] hover:border-[#C5A059]/60 shadow-xs'
              }`}
            >
              {/* Collection Header */}
              <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#C5A059]/15">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: `${col.accentColor}20`, color: col.accentColor }}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-[#F9F7F2]" style={{ color: theme === 'dark' ? '#F9F7F2' : '#121212' }}>
                        {col.title}
                      </h4>
                      <span 
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: `${col.accentColor}15`, color: col.accentColor }}
                      >
                        {col.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8E877D] line-clamp-1 mt-0.5">{col.description}</p>
                  </div>
                </div>

                {onApplyPresetPack && (
                  <button
                    type="button"
                    onClick={() => onApplyPresetPack(col)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border shrink-0 hover:scale-102"
                    style={{ 
                      borderColor: `${col.accentColor}40`,
                      color: col.accentColor,
                      backgroundColor: `${col.accentColor}10`
                    }}
                    title="تطبيق تشكيلة الأيقونات هذه على جميع البطاقات بتنسيق متناغم"
                  >
                    <span>تطبيق الحزمة على البطاقات</span>
                    <ArrowRight className="w-3 h-3 rotate-180" />
                  </button>
                )}
              </div>

              {/* Preset Icons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {col.icons.map((preset) => {
                  const isCurrent = currentIconName === preset.name;
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      draggable={enableDrag}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', preset.name);
                        e.dataTransfer.setData('application/json', JSON.stringify({
                          name: preset.name,
                          color: preset.color,
                          size: preset.size,
                          rotation: preset.rotation
                        }));
                      }}
                      onClick={() => handlePresetClick(preset)}
                      className={`group relative p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                        isCurrent || isSelected
                          ? 'border-[#C5A059] bg-[#C5A059]/15 shadow-sm scale-102 ring-1 ring-[#C5A059]'
                          : theme === 'dark' 
                            ? 'border-[#22201C] bg-[#1A1917]/70 hover:bg-[#24221E] hover:border-[#C5A059]/40' 
                            : 'border-[#EDE8E0] bg-[#FAF8F5] hover:bg-white hover:border-[#C5A059]/50'
                      }`}
                      title={`${preset.label} - ${preset.description}\nانقر للتطبيق الفوري أو اسحب إلى البطاقة`}
                    >
                      {/* Icon Avatar Preview */}
                      <div 
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-xs ${
                          theme === 'dark' ? 'bg-[#121212]' : 'bg-white'
                        }`}
                        style={{ 
                          color: preset.color,
                          border: `1px solid ${preset.color}30`
                        }}
                      >
                        <div style={{ transform: `rotate(${preset.rotation}deg)` }}>
                          <IconRenderer name={preset.name} size={preset.size - 4} className="transition-all" />
                        </div>
                      </div>

                      {/* Text info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold truncate group-hover:text-[#C5A059] transition-colors" style={{ color: theme === 'dark' ? '#F9F7F2' : '#1A1917' }}>
                            {preset.label}
                          </span>
                          {(isCurrent || isSelected) && (
                            <Check className="w-3 h-3 text-[#C5A059] shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] text-[#8E877D] font-mono truncate">
                          <span>{preset.name}</span>
                          <span>•</span>
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: preset.color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

