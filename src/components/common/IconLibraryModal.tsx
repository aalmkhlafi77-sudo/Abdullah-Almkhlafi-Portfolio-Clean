import React, { useState, useEffect } from 'react';
import { 
  X, Search, Sparkles, Code, Terminal, Layers, Cpu, Globe, Database, 
  Shield, Zap, Star, Heart, Award, Briefcase, User, Mail, Phone, Settings, 
  CheckCircle, FileText, Folder, Compass, Sun, Moon, Flame, Key, Lock, 
  Send, Share2, Bookmark, Tag, HelpCircle, Info, AlertTriangle, Check, 
  ArrowRight, Download, Upload, RefreshCw, Filter, Sliders, Layout, Grid, 
  List, Maximize2, Edit3, Trash2, Plus, Minus, Play, Pause, Camera, 
  Video, Image, Music, Headphones, MapPin, Clock, Calendar, Activity, 
  TrendingUp, BarChart2, PieChart, DollarSign, CreditCard, ShoppingBag, 
  Gift, Smile, Medal, Target, Compass as CompassIcon, Anchor, Feather, 
  BookOpen, Book, Cloud, Wind, Radio, Tv, Smartphone, Tablet, Monitor, 
  Laptop, Server, HardDrive, Printer, Wifi, Bluetooth, Battery, Power, Wand2,
  Copy, CheckSquare
} from 'lucide-react';
import { IconRenderer } from '../ui/IconRenderer';
import { IconPresets, IconPresetCollection } from './IconPresets';
import { useApp } from '../../context/AppContext';

interface IconLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: string, customStyle?: { color?: string; size?: number; rotation?: number }) => void;
  onApplyPresetPack?: (pack: IconPresetCollection) => void;
  currentIconName?: string;
  currentColor?: string;
  currentSize?: number;
  currentRotation?: number;
  theme: 'dark' | 'light';
}

const ICON_DATABASE = [
  { name: 'Sparkles', category: 'تطوير وذكاء اصطناعي' },
  { name: 'Code', category: 'تطوير' },
  { name: 'Terminal', category: 'تطوير' },
  { name: 'Cpu', category: 'تطوير' },
  { name: 'Database', category: 'تطوير' },
  { name: 'Server', category: 'تطوير' },
  { name: 'Layers', category: 'تصميم' },
  { name: 'Layout', category: 'تصميم' },
  { name: 'Grid', category: 'تصميم' },
  { name: 'Feather', category: 'تصميم' },
  { name: 'Image', category: 'تصميم' },
  { name: 'Edit3', category: 'تصميم' },
  { name: 'Globe', category: 'أعمال وشبكات' },
  { name: 'Briefcase', category: 'أعمال وشبكات' },
  { name: 'DollarSign', category: 'أعمال وشبكات' },
  { name: 'CreditCard', category: 'أعمال وشبكات' },
  { name: 'TrendingUp', category: 'أعمال وشبكات' },
  { name: 'BarChart2', category: 'أعمال وشبكات' },
  { name: 'PieChart', category: 'أعمال وشبكات' },
  { name: 'Shield', category: 'أمان وحماية' },
  { name: 'Key', category: 'أمان وحماية' },
  { name: 'Lock', category: 'أمان وحماية' },
  { name: 'AlertTriangle', category: 'أمان وحماية' },
  { name: 'Zap', category: 'عام ومميز' },
  { name: 'Star', category: 'عام ومميز' },
  { name: 'Heart', category: 'عام ومميز' },
  { name: 'Award', category: 'عام ومميز' },
  { name: 'Medal', category: 'عام ومميز' },
  { name: 'Target', category: 'عام ومميز' },
  { name: 'Flame', category: 'عام ومميز' },
  { name: 'Compass', category: 'عام ومميز' },
  { name: 'Sun', category: 'عام ومميز' },
  { name: 'Moon', category: 'عام ومميز' },
  { name: 'User', category: 'واجهات وتواصل' },
  { name: 'Mail', category: 'واجهات وتواصل' },
  { name: 'Phone', category: 'واجهات وتواصل' },
  { name: 'Send', category: 'واجهات وتواصل' },
  { name: 'Share2', category: 'واجهات وتواصل' },
  { name: 'Bookmark', category: 'واجهات وتواصل' },
  { name: 'Tag', category: 'واجهات وتواصل' },
  { name: 'FileText', category: 'محتوى وملفات' },
  { name: 'Folder', category: 'محتوى وملفات' },
  { name: 'BookOpen', category: 'محتوى وملفات' },
  { name: 'Book', category: 'محتوى وملفات' },
  { name: 'Download', category: 'محتوى وملفات' },
  { name: 'Upload', category: 'محتوى وملفات' },
  { name: 'Clock', category: 'أدوات وأسهم' },
  { name: 'Calendar', category: 'أدوات وأسهم' },
  { name: 'Search', category: 'أدوات وأسهم' },
  { name: 'Filter', category: 'أدوات وأسهم' },
  { name: 'Sliders', category: 'أدوات وأسهم' },
  { name: 'RefreshCw', category: 'أدوات وأسهم' },
  { name: 'Settings', category: 'أدوات وأسهم' },
  { name: 'CheckCircle', category: 'أدوات وأسهم' },
  { name: 'ArrowRight', category: 'أدوات وأسهم' },
  { name: 'Smartphone', category: 'أجهزة وتقنية' },
  { name: 'Tablet', category: 'أجهزة وتقنية' },
  { name: 'Monitor', category: 'أجهزة وتقنية' },
  { name: 'Laptop', category: 'أجهزة وتقنية' },
  { name: 'Wifi', category: 'أجهزة وتقنية' },
  { name: 'Camera', category: 'وسائط وترفيه' },
  { name: 'Video', category: 'وسائط وترفيه' },
  { name: 'Music', category: 'وسائط وترفيه' },
  { name: 'Headphones', category: 'وسائط وترفيه' },
  { name: 'Smile', category: 'وسائط وترفيه' },
];

export const IconLibraryModal: React.FC<IconLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectIcon,
  onApplyPresetPack,
  currentIconName = 'Sparkles',
  currentColor = '#C5A059',
  currentSize = 24,
  currentRotation = 0,
  theme
}) => {
  const { 
    services, 
    metrics, 
    iconLibraryTarget, 
    updateService, 
    updateMetric, 
    setServices, 
    notify,
    isAuthenticated,
    setShowLoginModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'library' | 'presets'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  
  // Customization state
  const [activeIcon, setActiveIcon] = useState(currentIconName);
  const [iconColor, setIconColor] = useState(currentColor || '#C5A059');
  const [iconSize, setIconSize] = useState(currentSize || 24);
  const [iconRotation, setIconRotation] = useState(currentRotation || 0);

  // Target selection state: can be a service id, a metric id, or 'all-services'
  const [selectedTargetId, setSelectedTargetId] = useState<string>(() => {
    return iconLibraryTarget?.id || (services[0]?.id || 'all-services');
  });

  // Sync state whenever modal is opened or target props change
  useEffect(() => {
    if (isOpen) {
      setActiveIcon(currentIconName || 'Sparkles');
      setIconColor(currentColor || '#C5A059');
      setIconSize(currentSize || 24);
      setIconRotation(currentRotation || 0);
      if (iconLibraryTarget?.id) {
        setSelectedTargetId(iconLibraryTarget.id);
      } else if (services.length > 0) {
        setSelectedTargetId(services[0].id);
      }
    }
  }, [isOpen, currentIconName, currentColor, currentSize, currentRotation, iconLibraryTarget, services]);

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
            <h3 className="text-lg sm:text-xl font-bold font-serif-display text-[#C5A059]">استوديو الأيقونات محمي</h3>
            <p className="text-xs text-[#8E877D] mt-2 leading-relaxed">
              تخصيص الأيقونات وحزم الخدمات متاح لمدير الموقع فقط. يرجى تسجيل الدخول بحساب المسؤول للمتابعة.
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
              <Key className="w-4 h-4" />
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

  const categories = ['الكل', 'تطوير وذكاء اصطناعي', 'تطوير', 'تصميم', 'أعمال وشبكات', 'أمان وحماية', 'عام ومميز', 'واجهات وتواصل', 'محتوى وملفات', 'أدوات وأسهم', 'أجهزة وتقنية', 'وسائط وترفيه'];

  const filteredIcons = ICON_DATABASE.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get active target title
  const activeServiceObj = services.find(s => s.id === selectedTargetId);
  const activeMetricObj = metrics.find(m => m.id === selectedTargetId);
  const targetLabel = selectedTargetId === 'all-services'
    ? 'جميع بطاقات الخبرة والخدمات'
    : activeServiceObj
    ? `بطاقة: ${activeServiceObj.title}`
    : activeMetricObj
    ? `مقياس: ${activeMetricObj.label}`
    : 'القالب المحدد';

  // Explicit Insertion Handler
  const handleInsertIcon = (overrideIconName?: string) => {
    const iconToUse = overrideIconName || activeIcon;
    const styleObj = {
      color: iconColor,
      size: iconSize,
      rotation: iconRotation
    };

    if (selectedTargetId === 'all-services') {
      setServices(prev => prev.map(s => ({
        ...s,
        iconName: iconToUse,
        iconColor: iconColor,
        iconSize: iconSize,
        iconRotation: iconRotation
      })));
      notify(`تم إدراج الأيقونة (${iconToUse}) في جميع بطاقات الخدمات بنجاح`);
    } else if (activeServiceObj) {
      updateService(selectedTargetId, {
        iconName: iconToUse,
        iconColor: iconColor,
        iconSize: iconSize,
        iconRotation: iconRotation
      });
      notify(`تم إدراج الأيقونة (${iconToUse}) في (${activeServiceObj.title}) بنجاح`);
    } else if (activeMetricObj) {
      updateMetric(selectedTargetId, {
        iconName: iconToUse,
        iconColor: iconColor,
        iconSize: iconSize,
        iconRotation: iconRotation
      });
      notify(`تم إدراج الأيقونة (${iconToUse}) في مقياس (${activeMetricObj.label}) بنجاح`);
    }

    onSelectIcon(iconToUse, styleObj);
    onClose();
  };

  const handlePresetSelected = (preset: {
    iconName: string;
    color?: string;
    size?: number;
    rotation?: number;
  }) => {
    setActiveIcon(preset.iconName);
    if (preset.color) setIconColor(preset.color);
    if (preset.size) setIconSize(preset.size);
    if (preset.rotation !== undefined) setIconRotation(preset.rotation);
  };

  // Copy icon settings
  const handleCopySettings = () => {
    const data = {
      name: activeIcon,
      color: iconColor,
      size: iconSize,
      rotation: iconRotation
    };
    try {
      localStorage.setItem('ais_copied_icon_style', JSON.stringify(data));
      notify(`تم نسخ إعدادات أيقونة (${activeIcon}) إلى الحافظة`);
    } catch {}
  };

  // Paste icon settings
  const handlePasteSettings = () => {
    try {
      const raw = localStorage.getItem('ais_copied_icon_style');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.name) setActiveIcon(data.name);
        if (data.color) setIconColor(data.color);
        if (data.size) setIconSize(data.size);
        if (data.rotation !== undefined) setIconRotation(data.rotation);
        notify(`تم تطبيق الإعدادات المنسوخة لأيقونة (${data.name})`);
      } else {
        notify('لا توجد إعدادات أيقونة منسوخة حالياً');
      }
    } catch {}
  };

  // Copy JSX code
  const handleCopyJsx = () => {
    const jsxCode = `<${activeIcon} color="${iconColor}" size={${iconSize}} style={{ transform: 'rotate(${iconRotation}deg)' }} />`;
    navigator.clipboard?.writeText(jsxCode);
    notify(`تم نسخ كود JSX: ${jsxCode}`);
  };

  // Download SVG
  const handleDownloadSvg = () => {
    const previewContainer = document.getElementById('icon-live-preview-box');
    const svgEl = previewContainer?.querySelector('svg');
    if (svgEl) {
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgEl);
      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${activeIcon}-${iconColor.replace('#', '')}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
      notify(`تم تحميل الأيقونة (${activeIcon}.svg) بنجاح`);
    } else {
      notify('تعذر استخراج ملف SVG');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
        theme === 'dark' ? 'bg-[#181715] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212]'
      }`}>
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          theme === 'dark' ? 'border-[#2E2B26] bg-[#141312]' : 'border-[#E5E0D8] bg-white'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#C5A059]">مكتبة واستوديو إدراج الأيقونات (Icon Studio)</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-[#C5A059] font-bold">
                  v2.5 Interactive
                </span>
              </div>
              <p className="text-xs text-[#8E877D]">حدد الأيقونة والقالب المستهدف، واضغط زر الإدراج الصريح أو انقر مرتين للتطبيق الفوري</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Tab Switcher */}
            <div className={`p-1 rounded-xl border flex items-center gap-1 ${
              theme === 'dark' ? 'bg-[#1A1917] border-[#2E2B26]' : 'bg-[#F2EFE9] border-[#E5E0D8]'
            }`}>
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'library'
                    ? 'bg-[#C5A059] text-[#121212] shadow-xs'
                    : 'text-[#8E877D] hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>المكتبة الشاملة والمحرر</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'presets'
                    ? 'bg-[#C5A059] text-[#121212] shadow-xs'
                    : 'text-[#8E877D] hover:text-white'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>المجموعات الجاهزة (Presets)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors ${
                theme === 'dark' ? 'border-[#2E2B26] hover:bg-[#22201C]' : 'border-[#E5E0D8] hover:bg-[#F2EFE9]'
              }`}
              title="إغلاق"
            >
              <X className="w-5 h-5 text-[#8E877D]" />
            </button>
          </div>
        </div>

        {/* Modal Body: 12 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          
          {/* Main Content Area (8 cols) */}
          <div className={`md:col-span-8 p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto border-b md:border-b-0 md:border-l ${
            theme === 'dark' ? 'border-[#2E2B26] bg-[#181715]' : 'border-[#E5E0D8] bg-[#FAF8F5]'
          }`}>
            {activeTab === 'presets' ? (
              <IconPresets
                theme={theme}
                currentIconName={activeIcon}
                currentColor={iconColor}
                onColorChange={(col) => setIconColor(col)}
                onSelectPreset={handlePresetSelected}
                onApplyPresetPack={onApplyPresetPack}
                enableDrag={true}
              />
            ) : (
              <>
                {/* Search and Category Filter Bar */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E877D]" />
                    <input
                      type="text"
                      placeholder="ابحث عن أيقونة بالاسم بالإنجليزية (مثل: Sparkles, Code, Cpu, Shield, User)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-hidden ${
                        theme === 'dark'
                          ? 'bg-[#141312] border-[#2E2B26] text-white focus:border-[#C5A059]'
                          : 'bg-white border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                      }`}
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          selectedCategory === cat
                            ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs'
                            : theme === 'dark'
                              ? 'bg-[#22201C] text-[#8E877D] hover:text-white hover:bg-[#2A2824]'
                              : 'bg-[#E5E0D8]/60 text-slate-600 hover:text-slate-900 hover:bg-[#E5E0D8]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icons Grid with Single-Click Preview & Double-Click Instant Insert */}
                <div className="flex items-center justify-between text-[11px] text-[#8E877D] px-1">
                  <span>نتائج البحث ({filteredIcons.length} أيقونة)</span>
                  <span className="text-[#C5A059] font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>انقر نقرة للتحديد والمعاينة • نقرتين للإدراج الفوري</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 overflow-y-auto max-h-[460px] pr-1">
                  {filteredIcons.map((item) => {
                    const isSelected = activeIcon === item.name;
                    return (
                      <div
                        key={item.name}
                        onClick={() => setActiveIcon(item.name)}
                        onDoubleClick={() => handleInsertIcon(item.name)}
                        className={`group relative p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#C5A059] bg-[#C5A059]/20 shadow-md scale-105 ring-2 ring-[#C5A059]'
                            : theme === 'dark'
                              ? 'border-[#262420] bg-[#141312] hover:border-[#C5A059]/50 hover:bg-[#1C1A17]'
                              : 'border-[#E5E0D8] bg-white hover:border-[#C5A059]/50 hover:bg-[#FAF8F5]'
                        }`}
                        title={`${item.name} (${item.category})\n- انقر للتحديد\n- نقرتين للإدراج في القالب`}
                      >
                        <div
                          style={{
                            color: isSelected ? iconColor : undefined,
                            transform: isSelected ? `rotate(${iconRotation}deg)` : undefined
                          }}
                          className="transition-transform group-hover:scale-115"
                        >
                          <IconRenderer name={item.name} className="w-6 h-6" color={isSelected ? iconColor : undefined} />
                        </div>
                        <span className="text-[10px] font-mono text-[#8E877D] truncate max-w-full group-hover:text-[#C5A059]">
                          {item.name}
                        </span>

                        {/* Quick Insert Badge on Hover */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInsertIcon(item.name);
                          }}
                          className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 p-1 rounded-md bg-[#C5A059] text-[#121212] hover:scale-110 transition-all shadow-xs"
                          title="إدراج هذه الأيقونة فوراً"
                        >
                          <Plus className="w-2.5 h-2.5 stroke-[3]" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Right / Left Studio Panel: Live Customization & Insertion Actions (4 cols) */}
          <div className={`md:col-span-4 p-5 flex flex-col justify-between overflow-y-auto ${
            theme === 'dark' ? 'bg-[#141312]' : 'bg-[#FAF8F5]'
          }`}>
            <div className="space-y-4">
              
              {/* Studio Header & Target Destination Selector */}
              <div className="space-y-2 border-b pb-3 border-[#C5A059]/20">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-[#C5A059] flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" />
                    <span>إعدادات وإدراج الأيقونة</span>
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-[#8E877D]">
                    Target
                  </span>
                </div>

                {/* Target Template Dropdown */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#DFCA9B]">القالب / البطاقة المستهدفة للإدراج:</label>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setSelectedTargetId(newId);
                      if (newId !== 'all-services') {
                        const srv = services.find(s => s.id === newId);
                        if (srv) {
                          setActiveIcon(srv.iconName);
                          if (srv.iconColor) setIconColor(srv.iconColor);
                          if (srv.iconSize) setIconSize(srv.iconSize);
                          if (srv.iconRotation !== undefined) setIconRotation(srv.iconRotation);
                        }
                      }
                    }}
                    className={`w-full px-2.5 py-2 rounded-xl border text-xs font-semibold transition-all focus:outline-hidden ${
                      theme === 'dark' 
                        ? 'bg-[#1E1D1A] border-[#38342D] text-white focus:border-[#C5A059]' 
                        : 'bg-white border-[#DCD6CC] text-[#121212] focus:border-[#C5A059]'
                    }`}
                  >
                    <optgroup label="البطاقات الفردية (Services)">
                      {services.map((srv, idx) => (
                        <option key={srv.id} value={srv.id}>
                          {idx + 1}. {srv.title}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="تطبيق عام">
                      <option value="all-services">🌟 تطبيق على جميع بطاقات الخدمات دفعة واحدة</option>
                    </optgroup>
                    {metrics.length > 0 && (
                      <optgroup label="مقاييس الهيرو (Hero Metrics)">
                        {metrics.map((met) => (
                          <option key={met.id} value={met.id}>
                            مقياس: {met.label} ({met.value})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
              </div>

              {/* Live Preview Box with Direct Insertion Button */}
              <div id="icon-live-preview-box" className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[#C5A059]/40 bg-[#C5A059]/10 space-y-3">
                <div className="flex items-center justify-between w-full text-[11px] font-semibold text-[#8E877D]">
                  <span>معاينة حية:</span>
                  <span className="text-[#C5A059] font-bold">{activeIcon}</span>
                </div>
                
                <div 
                  className="w-16 h-16 rounded-2xl border border-[#C5A059]/50 bg-[#121212] flex items-center justify-center shadow-lg transition-all"
                  style={{ transform: `rotate(${iconRotation}deg)` }}
                >
                  <IconRenderer 
                    name={activeIcon} 
                    className="transition-all"
                    size={iconSize}
                    color={iconColor}
                  />
                </div>

                <div className="text-center w-full">
                  <div className="text-[11px] font-mono text-[#DFCA9B] font-bold">
                    {iconSize}px • {iconRotation}° • <span style={{ color: iconColor }}>{iconColor}</span>
                  </div>
                  <div className="text-[10px] text-[#8E877D] mt-0.5 line-clamp-1">
                    سيتم الإدراج في: {targetLabel}
                  </div>
                </div>

                {/* Prominent Explicit Insert Button */}
                <button
                  type="button"
                  onClick={() => handleInsertIcon()}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer scale-100 hover:scale-[1.02] active:scale-98"
                  title="إدراج الأيقونة في القالب المحدد وتطبيق التغييرات"
                >
                  <CheckSquare className="w-4 h-4 stroke-[2.5]" />
                  <span>إدراج الأيقونة في القالب المحدد</span>
                </button>
              </div>

              {/* Quick Actions Toolbar: Copy, Paste, Download SVG, Copy JSX */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#8E877D]">أدوات سريعة (نسخ / لصق / تحميل):</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopySettings}
                    className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-bold border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#DFCA9B] hover:bg-[#C5A059] hover:text-[#121212] transition-all"
                    title="نسخ إعدادات الأيقونة ولونها وحجمها"
                  >
                    <Copy className="w-3 h-3" />
                    <span>نسخ الإعدادات</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePasteSettings}
                    className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-bold border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#DFCA9B] hover:bg-[#C5A059] hover:text-[#121212] transition-all"
                    title="لصق الإعدادات المنسوخة سابقاً"
                  >
                    <Download className="w-3 h-3 rotate-180" />
                    <span>لصق الإعدادات</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadSvg}
                    className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-bold border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#DFCA9B] hover:bg-[#C5A059] hover:text-[#121212] transition-all"
                    title="تحميل الأيقونة كملف SVG مستقل إلى جهازك"
                  >
                    <Download className="w-3 h-3" />
                    <span>تحميل كـ SVG</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyJsx}
                    className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-bold border border-[#C5A059]/30 bg-[#C5A059]/10 text-[#DFCA9B] hover:bg-[#C5A059] hover:text-[#121212] transition-all"
                    title="نسخ وسم Lucide React للاستخدام البرمجي"
                  >
                    <Code className="w-3 h-3" />
                    <span>نسخ كود JSX</span>
                  </button>
                </div>
              </div>

              {/* Color Palette Controls */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-[#8E877D]">تغيير لون الأيقونة (Color):</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { name: 'ذهبي أصيل', hex: '#C5A059' },
                    { name: 'أخضر زمردي', hex: '#10B981' },
                    { name: 'أزرق تقني', hex: '#3B82F6' },
                    { name: 'بنفسجي ملكي', hex: '#8B5CF6' },
                    { name: 'وردي حيوي', hex: '#F43F5E' },
                    { name: 'عنبري دافئ', hex: '#F59E0B' },
                    { name: 'سماوي ناصع', hex: '#06B6D4' },
                    { name: 'أبيض نقي', hex: '#FFFFFF' },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setIconColor(c.hex)}
                      className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                        iconColor === c.hex ? 'border-white scale-115 shadow-md ring-2 ring-[#C5A059]' : 'border-transparent hover:scale-105 opacity-85 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={iconColor}
                    onChange={(e) => setIconColor(e.target.value)}
                    className="w-6 h-6 rounded-full border-0 cursor-pointer bg-transparent"
                    title="لون مخصص بحرية"
                  />
                </div>
              </div>

              {/* Size Slider (1px step) */}
              <div className="space-y-1 p-2.5 rounded-xl border border-[#C5A059]/20 bg-[#1A1917]/30">
                <div className="flex justify-between text-xs text-[#8E877D] font-semibold">
                  <span>حجم الأيقونة (Size)</span>
                  <span className="font-mono text-[#C5A059] font-bold">{iconSize}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIconSize(prev => Math.max(12, prev - 1))}
                    className="px-2 py-0.5 rounded border border-[#C5A059]/30 text-[10px] font-mono hover:bg-[#C5A059]/20 text-[#C5A059]"
                    title="-1px"
                  >
                    -1px
                  </button>
                  <input
                    type="range"
                    min="12"
                    max="64"
                    step="1"
                    value={iconSize}
                    onChange={(e) => setIconSize(Number(e.target.value))}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setIconSize(prev => Math.min(64, prev + 1))}
                    className="px-2 py-0.5 rounded border border-[#C5A059]/30 text-[10px] font-mono hover:bg-[#C5A059]/20 text-[#C5A059]"
                    title="+1px"
                  >
                    +1px
                  </button>
                </div>
              </div>

              {/* Rotation Slider (1 degree step) */}
              <div className="space-y-1 p-2.5 rounded-xl border border-[#C5A059]/20 bg-[#1A1917]/30">
                <div className="flex justify-between text-xs text-[#8E877D] font-semibold">
                  <span>تدوير الأيقونة (Rotation)</span>
                  <span className="font-mono text-[#C5A059] font-bold">{iconRotation}°</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIconRotation(prev => (prev - 1 + 360) % 360)}
                    className="px-2 py-0.5 rounded border border-[#C5A059]/30 text-[10px] font-mono hover:bg-[#C5A059]/20 text-[#C5A059]"
                    title="-1°"
                  >
                    -1°
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={iconRotation}
                    onChange={(e) => setIconRotation(Number(e.target.value))}
                    className="w-full accent-[#C5A059] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => setIconRotation(prev => (prev + 1) % 360)}
                    className="px-2 py-0.5 rounded border border-[#C5A059]/30 text-[10px] font-mono hover:bg-[#C5A059]/20 text-[#C5A059]"
                    title="+1°"
                  >
                    +1°
                  </button>
                </div>
                <div className="flex justify-between gap-1 pt-0.5">
                  {[0, 45, 90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setIconRotation(deg)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono border transition-all ${
                        iconRotation === deg ? 'bg-[#C5A059] text-[#121212] border-[#C5A059] font-bold' : 'border-[#E5E0D8]/30 text-[#8E877D]'
                      }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Final Actions */}
            <div className="pt-3 mt-3 border-t border-[#C5A059]/20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleInsertIcon()}
                className="w-full py-2.5 rounded-xl bg-[#C5A059] text-[#121212] font-bold text-xs hover:bg-[#B8934A] transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>إدراج وإغلاق النافذة</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

