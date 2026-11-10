import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import { IconRenderer } from '../ui/IconRenderer';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Search, 
  Tag, 
  Sliders, 
  X, 
  Palette, 
  Globe, 
  User, 
  BarChart3, 
  Calculator, 
  Briefcase, 
  ShieldCheck, 
  AppWindow,
  HelpCircle,
  FileText,
  Eye,
  CheckSquare,
  Save,
  UploadCloud,
  Cloud,
  CheckCheck,
  Clock,
  RefreshCw
} from 'lucide-react';

export const ServicesManageTab: React.FC = () => {
  const { 
    services, 
    updateService, 
    addService, 
    deleteService, 
    reorderServices, 
    resetServicesToDefault, 
    openIconLibrary, 
    draftStatus,
    saveDraft,
    publishChanges,
    lastSavedTime,
    theme, 
    notify 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'consulting' | 'service'>('all');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isSavingTab, setIsSavingTab] = useState(false);
  const [isPublishingTab, setIsPublishingTab] = useState(false);

  // Form state for editing or creating
  const [formData, setFormData] = useState<Partial<ServiceItem>>({
    title: '',
    description: '',
    detailedDescription: '',
    deliverables: [''],
    category: 'خدمات وتطوير',
    type: 'service',
    iconName: 'Sparkles',
    tags: ['تقنية', 'حلول']
  });

  const [tagInput, setTagInput] = useState('');
  const [newDeliverableInput, setNewDeliverableInput] = useState('');

  // 9 Core Standard Categories
  const standardCategories = [
    { title: 'تصميم الهوية البصرية', type: 'service', icon: 'Palette' },
    { title: 'بناء مواقع إلكترونية', type: 'service', icon: 'Globe' },
    { title: 'صفحات وتطبيقات شخصية', type: 'service', icon: 'User' },
    { title: 'تصميم أنظمة إدارية ومالية', type: 'service', icon: 'BarChart3' },
    { title: 'استشارات محاسبية', type: 'consulting', icon: 'Calculator' },
    { title: 'استشارات أعمال', type: 'consulting', icon: 'Briefcase' },
    { title: 'استشارات الأرضيات والمفروشات', type: 'consulting', icon: 'Layers' },
    { title: 'استشارات ضريبة القيمة المضافة', type: 'consulting', icon: 'ShieldCheck' },
    { title: 'تطبيقات سطح المكتب', type: 'service', icon: 'AppWindow' }
  ];

  // Icon options
  const popularIcons = [
    { name: 'Palette', label: 'هوية بصرية' },
    { name: 'Globe', label: 'مواقع ويب' },
    { name: 'User', label: 'صفحة شخصية' },
    { name: 'BarChart3', label: 'أنظمة مالية' },
    { name: 'Calculator', label: 'استشارات محاسبية' },
    { name: 'Briefcase', label: 'استشارات أعمال' },
    { name: 'Layers', label: 'أرضيات ومفروشات' },
    { name: 'ShieldCheck', label: 'ضريبة القيمة المضافة' },
    { name: 'AppWindow', label: 'سطح المكتب' },
    { name: 'Code2', label: 'برمجة' },
    { name: 'Cpu', label: 'ذكاء اصطناعي' },
    { name: 'Database', label: 'قواعد بيانات' },
    { name: 'TrendingUp', label: 'نمو وتطوير' },
    { name: 'Sparkles', label: 'خدمات مميزة' }
  ];

  const handleSaveDraftDirect = async () => {
    setIsSavingTab(true);
    await saveDraft();
    setTimeout(() => setIsSavingTab(false), 500);
  };

  const handlePublishDirect = async () => {
    setIsPublishingTab(true);
    await publishChanges();
    setTimeout(() => setIsPublishingTab(false), 500);
  };

  // Open Edit Form
  const handleStartEdit = (service: ServiceItem) => {
    setEditingService(service);
    setIsAddingNew(false);
    setFormData({
      ...service,
      deliverables: service.deliverables && service.deliverables.length > 0 ? [...service.deliverables] : [''],
      tags: service.tags ? [...service.tags] : []
    });
  };

  // Open Add Form
  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingService(null);
    setFormData({
      id: `service_${Date.now()}`,
      title: '',
      description: '',
      detailedDescription: '',
      deliverables: [
        'مخرج العمل الأول ونطاق التنفيذ',
        'المخرج الثاني وضمان الجودة',
        'التوثيق الفني والدعم المستمر'
      ],
      category: 'خدمات واستشارات',
      type: 'service',
      iconName: 'Sparkles',
      tags: ['تطوير', 'استشارات'],
      order: services.length + 1
    });
  };

  // Save Service
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      notify('يرجى كتابة عنوان الخدمة أو الاستشارة', 'warning');
      return;
    }
    if (!formData.description?.trim()) {
      notify('يرجى كتابة الوصف المختصر للخدمة', 'warning');
      return;
    }

    const cleanDeliverables = (formData.deliverables || []).filter(d => d.trim().length > 0);

    if (isAddingNew) {
      const newService: ServiceItem = {
        id: formData.id || `service_${Date.now()}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        detailedDescription: formData.detailedDescription?.trim() || formData.description.trim(),
        deliverables: cleanDeliverables.length > 0 ? cleanDeliverables : ['تسليم العمل بالمعايير المتفق عليها بدقة عالية.'],
        type: formData.type || (formData.title.includes('استشارات') ? 'consulting' : 'service'),
        iconName: formData.iconName || 'Sparkles',
        iconColor: formData.iconColor,
        iconSize: formData.iconSize,
        iconRotation: formData.iconRotation,
        category: formData.category?.trim() || 'عام',
        tags: formData.tags && formData.tags.length > 0 ? formData.tags : ['خدمات'],
        order: services.length + 1
      };
      addService(newService);
    } else if (editingService) {
      updateService(editingService.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        detailedDescription: formData.detailedDescription?.trim() || formData.description.trim(),
        deliverables: cleanDeliverables.length > 0 ? cleanDeliverables : ['تسليم العمل بالمعايير المتفق عليها بدقة عالية.'],
        type: formData.type,
        iconName: formData.iconName,
        iconColor: formData.iconColor,
        iconSize: formData.iconSize,
        iconRotation: formData.iconRotation,
        category: formData.category?.trim(),
        tags: formData.tags
      });
      notify('تم تحديث بيانات الخدمة بنجاح', 'success');
    }

    setEditingService(null);
    setIsAddingNew(false);
  };

  // Move up/down
  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === services.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...services];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    reorderServices(newItems);
  };

  // Deliverable points management
  const handleAddDeliverable = () => {
    if (!newDeliverableInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      deliverables: [...(prev.deliverables || []), newDeliverableInput.trim()]
    }));
    setNewDeliverableInput('');
  };

  const handleRemoveDeliverable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deliverables: (prev.deliverables || []).filter((_, i) => i !== index)
    }));
  };

  const handleUpdateDeliverable = (index: number, val: string) => {
    setFormData(prev => {
      const next = [...(prev.deliverables || [])];
      next[index] = val;
      return { ...prev, deliverables: next };
    });
  };

  // Tag management
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (!formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tagToRemove)
    }));
  };

  // Filtered list
  const filteredServices = services.filter(service => {
    if (filterType === 'consulting' && service.type !== 'consulting' && !service.title.includes('استشارات')) return false;
    if (filterType === 'service' && (service.type === 'consulting' || service.title.includes('استشارات'))) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        service.title.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q) ||
        service.category.toLowerCase().includes(q) ||
        service.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Direct Cloud Sync & Publishing Action Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        theme === 'dark' ? 'bg-[#181715] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E8E3DA]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full shrink-0 ${
            draftStatus === 'published'
              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
              : draftStatus === 'saved'
              ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]'
              : 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]'
          }`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-serif-display text-[#DFCA9B]">
                حالة مزامنة الخدمات:
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                draftStatus === 'published'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : draftStatus === 'saved'
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>
                {draftStatus === 'published' ? 'منشور سحابياً ومحدث' : draftStatus === 'saved' ? 'مسودة محفوظة بالسحابة' : 'توجد تعديلات غير محفوظة'}
              </span>
            </div>
            {lastSavedTime && (
              <span className="text-[10px] text-[#8E877D] flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>آخر حفظ: {lastSavedTime}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleSaveDraftDirect}
            disabled={isSavingTab || isPublishingTab}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
              theme === 'dark'
                ? 'bg-[#22201D] border-[#2E2B26] text-[#DFCA9B] hover:bg-[#2A2824] hover:text-[#F9F7F2]'
                : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#8F6E30] hover:bg-[#F2EFE9] hover:text-[#121212]'
            }`}
          >
            {isSavingTab ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
            ) : (
              <Save className="w-3.5 h-3.5 text-[#C5A059]" />
            )}
            <span>حفظ المسودة في قاعدة بيانات الموقع</span>
          </button>

          <button
            type="button"
            onClick={handlePublishDirect}
            disabled={isSavingTab || isPublishingTab}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-[#121212] hover:bg-[#D4AF37] shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            {isPublishingTab ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#121212]" />
            ) : (
              <UploadCloud className="w-3.5 h-3.5 text-[#121212]" />
            )}
            <span>نشر فوري للواجهة والسحابة</span>
          </button>
        </div>
      </div>

      {/* 2. Top Header & Primary Add / Reset Bar */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        theme === 'dark' ? 'bg-[#1C1B18] border-[#2A2824]' : 'bg-[#FAF8F5] border-[#E8E3DA]'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
              المنظومة المتكاملة
            </span>
            <h4 className="font-bold text-sm sm:text-base font-serif-display text-[#C5A059]">
              شريط الخدمات والاستشارات الـ 9
            </h4>
          </div>
          <p className="text-xs text-[#8E877D] dark:text-[#9E988D]">
            إجمالي {services.length} مجالات معتمدة: ({services.filter(s => s.type !== 'consulting' && !s.title.includes('استشارات')).length} خدمات وتطوير • {services.filter(s => s.type === 'consulting' || s.title.includes('استشارات')).length} استشارات متخصصة).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
          <button
            type="button"
            onClick={resetServicesToDefault}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              theme === 'dark'
                ? 'bg-[#22201D] border-[#2E2B26] text-[#DFCA9B] hover:bg-[#2A2824] hover:text-[#F9F7F2]'
                : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#8F6E30] hover:bg-[#F2EFE9] hover:text-[#121212]'
            }`}
            title="إعادة تعيين القائمة إلى الخدمات والاستشارات الـ 9 المعتمدة مع كافة أوصافها ونقاطها التفصيلية"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>استعادة الخدمات الـ 9 الافتراضية</span>
          </button>

          <button
            type="button"
            onClick={handleStartAdd}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-[#121212] hover:bg-[#D4AF37] shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة خدمة أو استشارة</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Type Filter Tabs */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border self-start ${
          theme === 'dark' ? 'bg-[#181715] border-[#2A2824]' : 'bg-[#F2EFE9] border-[#E5E0D8]'
        }`}>
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs'
                : 'text-[#8E877D] hover:text-[#C5A059]'
            }`}
          >
            الكل ({services.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('consulting')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'consulting'
                ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs'
                : 'text-[#8E877D] hover:text-[#C5A059]'
            }`}
          >
            الاستشارات ({services.filter(s => s.type === 'consulting' || s.title.includes('استشارات')).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('service')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'service'
                ? 'bg-[#C5A059] text-[#121212] font-bold shadow-xs'
                : 'text-[#8E877D] hover:text-[#C5A059]'
            }`}
          >
            الخدمات والتطوير ({services.filter(s => s.type !== 'consulting' && !s.title.includes('استشارات')).length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E877D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في الخدمات والاستشارات..."
            className={`w-full pr-9 pl-3 py-1.5 rounded-xl text-xs border outline-none transition-all ${
              theme === 'dark'
                ? 'bg-[#181715] border-[#2A2824] text-[#F9F7F2] focus:border-[#C5A059]'
                : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
            }`}
          />
        </div>
      </div>

      {/* SERVICES LIST */}
      <div className="space-y-3">
        {filteredServices.map((service, index) => {
          const isConsulting = service.type === 'consulting' || service.title.includes('استشارات');
          return (
            <div
              key={service.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-[#181715] border-[#282622] hover:border-[#C5A059]/40'
                  : 'bg-[#FFFFFF] border-[#E8E3DA] hover:border-[#C5A059]/40 shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Right Info (Icon + Details) */}
                <div className="flex items-start gap-3.5 flex-1">
                  <div
                    onClick={() => openIconLibrary({
                      type: 'service',
                      id: service.id,
                      currentIconName: service.iconName,
                      currentColor: service.iconColor,
                      currentSize: service.iconSize,
                      currentRotation: service.iconRotation
                    })}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 cursor-pointer transition-transform hover:scale-105 ${
                      theme === 'dark'
                        ? 'bg-[#22201D] border-[#2E2B26] text-[#DFCA9B]'
                        : 'bg-[#F4F1EA] border-[#E5E0D8] text-[#8F6E30]'
                    }`}
                    title="انقر لاختيار وتخصيص أيقونة هذه الخدمة"
                  >
                    <IconRenderer 
                      name={service.iconName} 
                      size={service.iconSize || 22} 
                      color={service.iconColor} 
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#8E877D]">#{index + 1}</span>
                      <h4 className="font-bold text-sm sm:text-base font-serif-display text-[#F9F7F2] dark:text-[#F9F7F2]">
                        {service.title}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        isConsulting
                          ? 'bg-[#C5A059]/15 border-[#C5A059]/40 text-[#C5A059]'
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                      }`}>
                        {isConsulting ? 'استشارة متخصصة' : 'خدمة رقمية وهندسية'}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        theme === 'dark' ? 'bg-[#24221E] border-[#2E2B26] text-[#C7C1B7]' : 'bg-[#F2EFE9] border-[#E5E0D8] text-[#5A554E]'
                      }`}>
                        {service.category}
                      </span>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-[#8E877D] dark:text-[#A8A196] leading-relaxed">
                      {service.description}
                    </p>

                    {/* Detailed Description Preview */}
                    {service.detailedDescription && service.detailedDescription !== service.description && (
                      <p className="text-[11px] text-[#C5A059]/90 italic bg-[#C5A059]/5 px-2.5 py-1 rounded-lg border border-[#C5A059]/15">
                        <span className="font-semibold not-italic">الوصف التفصيلي: </span>
                        {service.detailedDescription}
                      </p>
                    )}

                    {/* Deliverables Checklist Preview */}
                    {service.deliverables && service.deliverables.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-[#8E877D] block mb-1">
                          نقاط ومخرجات التنفيذ ({service.deliverables.length} نقاط):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {service.deliverables.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#9E988D]">
                              <CheckCircle2 className="w-3 h-3 text-[#C5A059] shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {service.tags && service.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {service.tags.map((tag, tIdx) => (
                          <span 
                            key={tIdx} 
                            className={`text-[10px] px-2 py-0.5 rounded border ${
                              theme === 'dark' ? 'bg-[#201E1B] border-[#2E2B26] text-[#A8A196]' : 'bg-[#F2EFE9] border-[#E5E0D8] text-[#6E675D]'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Left Actions (Reorder, Edit, Delete) */}
                <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className={`p-2 rounded-xl border transition-colors disabled:opacity-30 ${
                      theme === 'dark' ? 'border-[#2E2B26] text-[#8E877D] hover:text-[#C5A059] hover:bg-[#22201D]' : 'border-[#E5E0D8] text-[#5A554E] hover:text-[#121212] hover:bg-[#F2EFE9]'
                    }`}
                    title="تحريك لأعلى"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === services.length - 1}
                    className={`p-2 rounded-xl border transition-colors disabled:opacity-30 ${
                      theme === 'dark' ? 'border-[#2E2B26] text-[#8E877D] hover:text-[#C5A059] hover:bg-[#22201D]' : 'border-[#E5E0D8] text-[#5A554E] hover:text-[#121212] hover:bg-[#F2EFE9]'
                    }`}
                    title="تحريك لأسفل"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartEdit(service)}
                    className="p-2 rounded-xl border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#121212] transition-colors"
                    title="تعديل بيانات الخدمة"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(service.id)}
                    className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                    title="حذف الخدمة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Confirm Delete Banner */}
              {showDeleteConfirm === service.id && (
                <div className="mt-3 p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-between gap-3 text-xs text-red-200">
                  <span>هل أنت متأكد من حذف هذه الخدمة ({service.title})؟</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        deleteService(service.id);
                        setShowDeleteConfirm(null);
                      }}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                    >
                      تأكيد الحذف
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-3 py-1 bg-transparent hover:bg-white/10 text-white/80 rounded-lg transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredServices.length === 0 && (
          <div className="text-center py-10 border border-dashed rounded-2xl border-[#2E2B26] p-6 text-sm text-[#8E877D]">
            لا توجد خدمات مطابقة لخيارات التصفية.
          </div>
        )}
      </div>

      {/* EDIT / ADD MODAL OR FORM */}
      {(editingService || isAddingNew) && (
        <div 
          className="fixed inset-0 z-[999999] p-3 sm:p-6 flex items-center justify-center bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => { setEditingService(null); setIsAddingNew(false); }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl max-h-[90vh] my-auto flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
              theme === 'dark' ? 'bg-[#161513] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212]'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
              theme === 'dark' ? 'border-[#282622] bg-[#121110]' : 'border-[#E5E0D8] bg-[#FAF8F5]'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                  {isAddingNew ? <Plus className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base font-serif-display">
                    {isAddingNew ? 'إضافة خدمة أو استشارة جديدة' : `تعديل: ${editingService?.title}`}
                  </h3>
                  <p className="text-xs text-[#8E877D]">
                    إدخال وتخصيص كافة التفاصيل والمخرجات والوسوم
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setEditingService(null); setIsAddingNew(false); }}
                className="p-1.5 rounded-lg border border-transparent hover:border-[#2E2B26] text-[#8E877D] hover:text-[#F9F7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Service Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DFCA9B] block">
                    عنوان الخدمة أو الاستشارة *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="مثال: تصميم الهوية البصرية"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition-all ${
                      theme === 'dark'
                        ? 'bg-[#1E1C19] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]'
                        : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#DFCA9B] block">
                      تصنيف المجال (Category) *
                    </label>
                    <span className="text-[10px] text-[#8E877D]">
                      اختر من المجالات الـ 9 أو اكتب تصنيفاً خاصاً
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.category || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="مثال: استشارات محاسبية، تصميم، برمجة"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition-all ${
                      theme === 'dark'
                        ? 'bg-[#1E1C19] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]'
                        : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                    }`}
                  />
                  {/* Quick Domain Preset Pills */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {standardCategories.map((cat, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            category: cat.title,
                            type: cat.type as 'service' | 'consulting',
                            iconName: cat.icon,
                            title: prev.title ? prev.title : cat.title
                          }));
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                          formData.category === cat.title
                            ? 'bg-[#C5A059] text-[#121212] font-bold border-[#C5A059]'
                            : theme === 'dark'
                            ? 'bg-[#22201D] border-[#2E2B26] text-[#8E877D] hover:text-[#DFCA9B]'
                            : 'bg-[#F2EFE9] border-[#E5E0D8] text-[#5A554E] hover:text-[#121212]'
                        }`}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Type & Icon Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DFCA9B] block">
                    نوع البطاقة
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'service' }))}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        formData.type === 'service'
                          ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]'
                          : theme === 'dark' ? 'bg-[#1E1C19] border-[#2E2B26] text-[#8E877D]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#5A554E]'
                      }`}
                    >
                      خدمة رقمية / هندسية
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'consulting' }))}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        formData.type === 'consulting'
                          ? 'bg-[#C5A059] text-[#121212] border-[#C5A059]'
                          : theme === 'dark' ? 'bg-[#1E1C19] border-[#2E2B26] text-[#8E877D]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#5A554E]'
                      }`}
                    >
                      استشارة متخصصة
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#DFCA9B] block">
                    أيقونة الخدمة
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] shrink-0">
                      <IconRenderer name={formData.iconName || 'Sparkles'} size={20} />
                    </div>
                    <select
                      value={formData.iconName || 'Sparkles'}
                      onChange={(e) => setFormData(prev => ({ ...prev, iconName: e.target.value }))}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs border outline-none ${
                        theme === 'dark' ? 'bg-[#1E1C19] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212]'
                      }`}
                    >
                      {popularIcons.map(ic => (
                        <option key={ic.name} value={ic.name}>{ic.label} ({ic.name})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#DFCA9B] block">
                  الوصف المختصر (يظهر في مقدمة البطاقة) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف موجز وواضح للخدمة..."
                  className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border outline-none transition-all ${
                    theme === 'dark'
                      ? 'bg-[#1E1C19] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]'
                      : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                  }`}
                />
              </div>

              {/* Detailed Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#DFCA9B] block">
                  الوصف التفصيلي الشامل (Detailed Overview)
                </label>
                <textarea
                  rows={3}
                  value={formData.detailedDescription || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, detailedDescription: e.target.value }))}
                  placeholder="شرح موسع وشامل حول منهجية العمل والقيمة المضافة التي يحصل عليها العميل..."
                  className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border outline-none transition-all ${
                    theme === 'dark'
                      ? 'bg-[#1E1C19] border-[#2E2B26] text-[#F9F7F2] focus:border-[#C5A059]'
                      : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] focus:border-[#C5A059]'
                  }`}
                />
              </div>

              {/* Deliverables / Checklist Points */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#DFCA9B] block">
                    مخرجات ونقاط العمل والتسليم التفصيلية (Deliverables)
                  </label>
                  <span className="text-[11px] text-[#8E877D]">
                    {(formData.deliverables || []).length} نقاط
                  </span>
                </div>

                {/* List of points */}
                <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                  {(formData.deliverables || []).map((point, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handleUpdateDeliverable(pIdx, e.target.value)}
                        placeholder={`نقطة المخرج رقم ${pIdx + 1}`}
                        className={`flex-1 px-3 py-1.5 rounded-lg text-xs border outline-none ${
                          theme === 'dark' ? 'bg-[#1E1C19] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(pIdx)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="حذف هذه النقطة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new point input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newDeliverableInput}
                    onChange={(e) => setNewDeliverableInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDeliverable(); } }}
                    placeholder="اكتب نقطة تسليم أو مخرج عمل جديد..."
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs border outline-none ${
                      theme === 'dark' ? 'bg-[#1E1C19] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 hover:bg-[#C5A059] hover:text-[#121212] transition-all shrink-0"
                  >
                    + إضافة نقطة
                  </button>
                </div>
              </div>

              {/* Tags and Keywords */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#DFCA9B] block">
                  الوسوم والكلمات المفتاحية (Tags)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(formData.tags || []).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#DFCA9B]"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    placeholder="اكتب وسم واضغط إضافة..."
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs border outline-none ${
                      theme === 'dark' ? 'bg-[#1E1C19] border-[#2E2B26] text-[#F9F7F2]' : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 hover:bg-[#C5A059] hover:text-[#121212] transition-all shrink-0"
                  >
                    + إضافة وسم
                  </button>
                </div>
              </div>

              {/* Footer Save / Cancel */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#282622]">
                <button
                  type="button"
                  onClick={() => { setEditingService(null); setIsAddingNew(false); }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                    theme === 'dark' ? 'border-[#2E2B26] text-[#8E877D]' : 'border-[#E5E0D8] text-[#5A554E]'
                  }`}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-[#C5A059] text-[#121212] hover:bg-[#D4AF37] transition-all shadow-md"
                >
                  {isAddingNew ? 'حفظ وإضافة الخدمة' : 'حفظ التعديلات'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
