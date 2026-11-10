import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { ServiceItem, IntegratedSolutionItem } from '../../../types';
import { 
  X, 
  Save, 
  Sliders, 
  Type, 
  Layout, 
  Palette, 
  Sparkles, 
  Tag, 
  CheckCircle, 
  Eye, 
  Plus, 
  Trash2, 
  Edit3,
  Move,
  Layers,
  ChevronDown
} from 'lucide-react';

export const UnifiedPropertiesSidebar: React.FC = () => {
  const { 
    showLivePropertiesPanel, 
    setShowLivePropertiesPanel, 
    selectedLiveElementId,
    services,
    updateService,
    solutions,
    updateSolution,
    openIconLibrary,
    isAuthenticated,
    brandVideoUrl,
    updateBrandVideoUrl
  } = useApp();

  const [activeTab, setActiveTab] = useState<'content' | 'layout' | 'appearance' | 'typography' | 'motion' | 'advanced'>('content');

  // Identify what kind of element is selected
  const isService = selectedLiveElementId?.startsWith('service-card-');
  const serviceId = isService ? selectedLiveElementId?.replace('service-card-', '') : null;
  const currentService = serviceId ? services.find(s => s.id === serviceId) : null;

  const isSolution = selectedLiveElementId?.startsWith('solution-card-');
  const solutionId = isSolution ? selectedLiveElementId?.replace('solution-card-', '') : null;
  const currentSolution = solutionId ? solutions.find(sol => sol.id === solutionId) : null;

  // Local state for draft editing of service
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [serviceType, setServiceType] = useState<'consulting' | 'service'>('service');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceDetailedDesc, setServiceDetailedDesc] = useState('');
  const [serviceDeliverables, setServiceDeliverables] = useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] = useState('');
  const [serviceTags, setServiceTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Local state for draft editing of solution
  const [solutionTitle, setSolutionTitle] = useState('');
  const [solutionProblem, setSolutionProblem] = useState('');
  const [solutionAudience, setSolutionAudience] = useState('');
  const [solutionDuration, setSolutionDuration] = useState('');
  const [solutionBadge, setSolutionBadge] = useState('');
  const [solutionDeliverables, setSolutionDeliverables] = useState<string[]>([]);
  const [newSolutionDeliverable, setNewSolutionDeliverable] = useState('');

  // Sync state whenever selected element changes
  useEffect(() => {
    if (currentService) {
      setServiceTitle(currentService.title || '');
      setServiceCategory(currentService.category || '');
      setServiceType(currentService.type || 'service');
      setServiceDescription(currentService.description || '');
      setServiceDetailedDesc(currentService.detailedDescription || '');
      setServiceDeliverables(currentService.deliverables || []);
      setServiceTags(currentService.tags || []);
    } else if (currentSolution) {
      setSolutionTitle(currentSolution.title || '');
      setSolutionProblem(currentSolution.problemSolved || '');
      setSolutionAudience(currentSolution.targetAudience || '');
      setSolutionDuration(currentSolution.estimatedDuration || '');
      setSolutionBadge(currentSolution.badge || '');
      setSolutionDeliverables(currentSolution.deliverables || []);
    }
  }, [selectedLiveElementId, currentService, currentSolution]);

  if (!showLivePropertiesPanel) return null;

  const handleSaveService = () => {
    if (!serviceId) return;
    updateService(serviceId, {
      title: serviceTitle,
      category: serviceCategory,
      type: serviceType,
      description: serviceDescription,
      detailedDescription: serviceDetailedDesc,
      deliverables: serviceDeliverables,
      tags: serviceTags
    });
  };

  const handleSaveSolution = () => {
    if (!solutionId) return;
    updateSolution(solutionId, {
      title: solutionTitle,
      problemSolved: solutionProblem,
      targetAudience: solutionAudience,
      estimatedDuration: solutionDuration,
      badge: solutionBadge,
      deliverables: solutionDeliverables
    });
  };

  const handleAddDeliverable = () => {
    if (!newDeliverable.trim()) return;
    const updated = [...serviceDeliverables, newDeliverable.trim()];
    setServiceDeliverables(updated);
    setNewDeliverable('');
    if (serviceId) updateService(serviceId, { deliverables: updated });
  };

  const handleRemoveDeliverable = (index: number) => {
    const updated = serviceDeliverables.filter((_, i) => i !== index);
    setServiceDeliverables(updated);
    if (serviceId) updateService(serviceId, { deliverables: updated });
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const updated = [...serviceTags, newTag.trim()];
    setServiceTags(updated);
    setNewTag('');
    if (serviceId) updateService(serviceId, { tags: updated });
  };

  const handleRemoveTag = (index: number) => {
    const updated = serviceTags.filter((_, i) => i !== index);
    setServiceTags(updated);
    if (serviceId) updateService(serviceId, { tags: updated });
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[9990] lg:hidden animate-fadeIn"
        onClick={() => setShowLivePropertiesPanel(false)}
      />

      {/* Sidebar Panel */}
      <aside 
        id="unified-properties-sidebar"
        aria-label="لوحة الخصائص الموحدة"
        className={`fixed ${isAuthenticated ? 'top-11' : 'top-0'} bottom-0 left-0 z-[9995] w-96 max-w-[90vw] bg-[#171717] border-r border-[#C5A059]/30 shadow-2xl flex flex-col animate-slideLeft`}
        dir="rtl"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#121212]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">لوحة الخصائص الموحدة</h3>
              <span className="text-[11px] text-[#C5A059] block truncate max-w-[200px]">
                {currentService 
                  ? currentService.title 
                  : currentSolution 
                  ? currentSolution.title 
                  : selectedLiveElementId === 'services-hero-section'
                  ? 'مقدمة قسم الخدمات'
                  : selectedLiveElementId === 'animated-brand-icon'
                  ? 'أيقونة الهوية البصرية (3D)'
                  : selectedLiveElementId || 'العنصر المحدد'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLivePropertiesPanel(false)}
            className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      {/* Tabs Navigation */}
      <div className="flex items-center border-b border-white/10 bg-[#141414] overflow-x-auto px-2">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'content'
              ? 'border-[#C5A059] text-[#C5A059]'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          المحتوى
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('layout')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'layout'
              ? 'border-[#C5A059] text-[#C5A059]'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          التخطيط
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'appearance'
              ? 'border-[#C5A059] text-[#C5A059]'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          المظهر
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'typography'
              ? 'border-[#C5A059] text-[#C5A059]'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          الخطوط
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advanced')}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'advanced'
              ? 'border-[#C5A059] text-[#C5A059]'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          متقدم
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5 text-sm">
        {activeTab === 'content' && (
          <div className="space-y-4">
            {currentService && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">عنوان الخدمة</label>
                  <input
                    type="text"
                    value={serviceTitle}
                    onChange={e => {
                      setServiceTitle(e.target.value);
                      if (serviceId) updateService(serviceId, { title: e.target.value });
                    }}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">النوع</label>
                    <select
                      value={serviceType}
                      onChange={e => {
                        const val = e.target.value as 'consulting' | 'service';
                        setServiceType(val);
                        if (serviceId) updateService(serviceId, { type: val });
                      }}
                      className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none"
                    >
                      <option value="service">خدمة تنفيذية</option>
                      <option value="consulting">جلسة استشارية</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">التصنيف</label>
                    <input
                      type="text"
                      value={serviceCategory}
                      onChange={e => {
                        setServiceCategory(e.target.value);
                        if (serviceId) updateService(serviceId, { category: e.target.value });
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">الوصف المختصر للبطاقة</label>
                  <textarea
                    rows={3}
                    value={serviceDescription}
                    onChange={e => {
                      setServiceDescription(e.target.value);
                      if (serviceId) updateService(serviceId, { description: e.target.value });
                    }}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">الوصف التفصيلي (لنافذة التفاصيل)</label>
                  <textarea
                    rows={3}
                    value={serviceDetailedDesc}
                    onChange={e => {
                      setServiceDetailedDesc(e.target.value);
                      if (serviceId) updateService(serviceId, { detailedDescription: e.target.value });
                    }}
                    placeholder="شرح أعمق لمراحل الخدمة وأهدافها..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none resize-none"
                  />
                </div>

                {/* Deliverables Management */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">قائمة مخرجات التسليم</label>
                  <div className="space-y-1.5 mb-2">
                    {serviceDeliverables.map((deliv, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/5 border border-white/5 text-xs text-white">
                        <span className="truncate flex-1">{deliv}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDeliverable(idx)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDeliverable}
                      onChange={e => setNewDeliverable(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddDeliverable()}
                      placeholder="أضف مخرج تسليم جديد..."
                      className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:border-[#C5A059] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddDeliverable}
                      className="px-3 py-1.5 bg-[#C5A059] text-black font-bold text-xs rounded-lg hover:bg-[#D4AF37]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Tags Management */}
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">الوسوم والكلمات المفتاحية</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {serviceTags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-white/10 text-white/80">
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(idx)}
                          className="text-white/50 hover:text-red-400"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                      placeholder="وسم جديد..."
                      className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:border-[#C5A059] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg"
                    >
                      إضافة
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentSolution && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">عنوان الحل المتكامل</label>
                  <input
                    type="text"
                    value={solutionTitle}
                    onChange={e => {
                      setSolutionTitle(e.target.value);
                      if (solutionId) updateSolution(solutionId, { title: e.target.value });
                    }}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">المشكلة التي يعالجها</label>
                  <textarea
                    rows={3}
                    value={solutionProblem}
                    onChange={e => {
                      setSolutionProblem(e.target.value);
                      if (solutionId) updateSolution(solutionId, { problemSolved: e.target.value });
                    }}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">الشارة / البادج</label>
                    <input
                      type="text"
                      value={solutionBadge}
                      onChange={e => {
                        setSolutionBadge(e.target.value);
                        if (solutionId) updateSolution(solutionId, { badge: e.target.value });
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1.5">المدة التقديرية</label>
                    <input
                      type="text"
                      value={solutionDuration}
                      onChange={e => {
                        setSolutionDuration(e.target.value);
                        if (solutionId) updateSolution(solutionId, { estimatedDuration: e.target.value });
                      }}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">الفئة المستهدفة</label>
                  <input
                    type="text"
                    value={solutionAudience}
                    onChange={e => {
                      setSolutionAudience(e.target.value);
                      if (solutionId) updateSolution(solutionId, { targetAudience: e.target.value });
                    }}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </>
            )}

            {selectedLiveElementId === 'animated-brand-icon' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-[#C5A059]/30 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-[#C5A059] font-bold">
                    <Sparkles className="w-4 h-4" />
                    <span>حاوية الفيديو الزجاجي (تشغيل مستمر)</span>
                  </div>
                  <p className="text-white/70 leading-relaxed">
                    حاوية فيديو بتشغيل مستمر (Loop) مع برواز زجاجي مصقول وحواف مضيئة موضوعة بين قسم المزايا وقسم الخدمات التخصصية.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">رابط YouTube أو فيديو مباشر (MP4/WebM):</label>
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={brandVideoUrl}
                        onChange={e => updateBrandVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... أو رابط مباشر"
                        className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none"
                      />
                      <p className="text-[11px] text-[#C5A059]">يدعم روابط يوتيوب والشورتس ومقاطع الفيديو المباشرة، ويتم تكرارها مستمراً (Loop).</p>
                      <label className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 border border-[#C5A059]/40 text-[#C5A059] cursor-pointer text-xs font-semibold transition-all">
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/quicktime"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              updateBrandVideoUrl(url);
                            }
                          }}
                        />
                        <span>رفع فيديو من الجهاز (MP4/MOV)</span>
                      </label>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                    <span>وضع التشغيل:</span>
                    <span className="text-emerald-400 font-semibold">تلقائي ومستمر (Loop + Autoplay)</span>
                  </div>
                </div>
              </div>
            )}

            {!currentService && !currentSolution && selectedLiveElementId !== 'animated-brand-icon' && (
              <div className="py-8 text-center text-white/50 text-xs">
                انقر على أي بطاقة خدمة أو حل متكامل في الصفحة لتعديل محتواها ومخرجاتها ونصوصها مباشرة.
              </div>
            )}
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">توزيع الأعمدة في الشبكة</label>
              <select className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none">
                <option value="3">3 أعمدة متوازنة (المعيار الاحترافي)</option>
                <option value="2">عمودان عريضان</option>
                <option value="4">4 أعمدة مكثفة</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">الهوامش الداخلية (Padding)</label>
              <select className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none">
                <option value="p-6">قياسي متناسق (p-6)</option>
                <option value="p-8">فخم وفسيح (p-8)</option>
                <option value="p-4">مضغوط (p-4)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">أقصى عرض للحاوية</label>
              <select className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none">
                <option value="max-w-7xl">شاشة كاملة عريضة (max-w-7xl)</option>
                <option value="max-w-5xl">تركيز متوسط (max-w-5xl)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">خامة الخلفية</label>
              <select className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none">
                <option value="charcoal">فحمية داكنة فاخرة (#181818)</option>
                <option value="glass">زجاجية معتامة (Backdrop Glass)</option>
                <option value="subtle">تدرج خافت ناعم</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">لون التمييز (Accent)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  defaultValue="#C5A059"
                  className="w-8 h-8 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                />
                <span className="text-xs text-white/80 font-mono">#C5A059 (Champagne Gold)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">انحناء الزوايا (Border Radius)</label>
              <select className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none">
                <option value="rounded-2xl">انحناء متقن (rounded-2xl - 16px)</option>
                <option value="rounded-xl">انحناء قياسي (rounded-xl - 12px)</option>
                <option value="rounded-3xl">انحناء فسيح (rounded-3xl - 24px)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">حجم الخط للعناوين الرئيسية</label>
              <select className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none">
                <option value="lg">متناسق (text-lg)</option>
                <option value="xl">بارز (text-xl)</option>
                <option value="2xl">كبير (text-2xl)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">وزن الخط</label>
              <select className="w-full px-3 py-2 bg-[#222] border border-white/10 rounded-xl text-white text-xs focus:border-[#C5A059] focus:outline-none">
                <option value="bold">عريض (Bold)</option>
                <option value="black">فائق العرض (Black)</option>
                <option value="semibold">متوسط (Semi-bold)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">حالة الظهور للزوار</span>
                <span className="text-[11px] text-white/50">إخفاء هذا العنصر مؤقتاً دون حذفه</span>
              </div>
              <input type="checkbox" defaultChecked className="toggle-checkbox" />
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">تثبيت العنصر وقفل التعديل</span>
                <span className="text-[11px] text-white/50">منع التحريك أو السحب بالخطأ</span>
              </div>
              <input type="checkbox" className="toggle-checkbox" />
            </div>
          </div>
        )}
      </div>

      {/* Panel Footer */}
      <div className="p-4 border-t border-white/10 bg-[#121212] flex items-center justify-between">
        <span className="text-xs text-white/40">تُحفظ التعديلات لحظياً محلياً</span>
        <button
          type="button"
          onClick={() => {
            if (currentService) handleSaveService();
            if (currentSolution) handleSaveSolution();
            setShowLivePropertiesPanel(false);
          }}
          className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>تم وحفظ التعديل</span>
        </button>
      </div>
    </aside>
    </>
  );
};

