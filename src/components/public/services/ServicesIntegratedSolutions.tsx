import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { IntegratedSolutionItem } from '../../../types';
import { 
  Layers, 
  Sparkles, 
  Clock, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Plus, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Workflow
} from 'lucide-react';
import { MotionLeft } from '../../common/MotionLeft';
import { ContextualEditWrapper } from './ContextualEditWrapper';
import { ProjectShowcaseBar } from '../ProjectShowcaseBar';
import { ServiceInquiryModal } from './ServiceInquiryModal';

export const ServicesIntegratedSolutions: React.FC = () => {
  const { 
    solutions, 
    addSolution, 
    updateSolution, 
    deleteSolution, 
    reorderSolutions,
    isAuthenticated, 
    isLiveEditMode,
    setSelectedLiveElementId,
    setShowLivePropertiesPanel
  } = useApp();

  const [selectedSolutionForInquiry, setSelectedSolutionForInquiry] = useState<IntegratedSolutionItem | null>(null);

  const handleAddNewSolution = () => {
    const newSol: IntegratedSolutionItem = {
      id: 'sol_' + Date.now(),
      title: 'باقة حل رقمي جديدة',
      problemSolved: 'وصف التحدي أو المشكلة التشغيلية التي تعالجها هذه المنظومة المتكاملة.',
      includedServices: ['بناء مواقع إلكترونية', 'أنظمة وحلول مؤسسية (ERP/CRM)'],
      deliverables: [
        'تسليم المنظومة بالكامل جاهزة للتشغيل الفوري.',
        'تدريب الكوادر ودليل الاستخدام الشامل.',
        'فترة دعم فني وضمان جودة لمدة 3 أشهر.'
      ],
      targetAudience: 'المؤسسات والشركات والمكاتب المهنية.',
      estimatedDuration: '4 إلى 6 أسابيع',
      iconName: 'Workflow',
      badge: 'جديد',
      order: solutions.length + 1,
      featured: false
    };
    addSolution(newSol);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newSolutions = [...solutions];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newSolutions.length) return;
    const temp = newSolutions[index];
    newSolutions[index] = newSolutions[target];
    newSolutions[target] = temp;
    reorderSolutions(newSolutions);
  };

  return (
    <section id="integrated-solutions" className="w-full py-16 md:py-24 border-t border-[#E5E0D8] dark:border-white/5 relative transition-colors duration-300" dir="rtl">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#C5A059]/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#8F6E30] dark:text-[#C5A059] text-xs font-semibold mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>منظومات الحلول المترابطة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#121212] dark:text-white tracking-tight leading-snug">
              حلول متكاملة تعالج تحديات منشأتك كمنظومة واحدة
            </h2>
            <p className="text-[#5A554E] dark:text-white/70 text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
              بدلاً من شراء خدمات مجزأة، تجمع هذه الباقات حلول الاستشارات، البرمجة، الأنظمة المالية، والتصميم لتحقيق نتائج ملموسة وعائد استثماري سريع.
            </p>
          </div>

          {/* Admin: Add New Solution Package */}
          {isAuthenticated && isLiveEditMode && (
            <button
              type="button"
              onClick={handleAddNewSolution}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C5A059] text-black text-xs sm:text-sm font-bold shadow-md hover:bg-[#D4AF37] transition-all self-start md:self-auto shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حل متكامل جديد</span>
            </button>
          )}
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {solutions.map((sol, index) => (
            <MotionLeft
              key={sol.id}
              immediate
              delay={0.1 * (index % 4)}
              distance={-20}
              className="h-full flex"
            >
              <ContextualEditWrapper
                id={`solution-card-${sol.id}`}
                label={`حل: ${sol.title.slice(0, 16)}...`}
                canMoveUp={index > 0}
                canMoveDown={index < solutions.length - 1}
                onMoveUp={() => handleMove(index, 'up')}
                onMoveDown={() => handleMove(index, 'down')}
                onDelete={() => deleteSolution(sol.id)}
                onEdit={() => {
                  setSelectedLiveElementId(`solution-card-${sol.id}`);
                  setShowLivePropertiesPanel(true);
                }}
                className="w-full"
              >
                <div className="h-full w-full bg-[#FFFFFF] dark:bg-[#181818] hover:bg-[#FAF8F5] dark:hover:bg-[#1A1A1A] border border-[#E5E0D8] dark:border-white/10 hover:border-[#C5A059]/50 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 artistic-shadow-sm dark:shadow-xl group">
                  <div>
                    {/* Top Row: Badge & Timeline */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C5A059]/15 text-[#8F6E30] dark:text-[#C5A059] border border-[#C5A059]/30">
                        {sol.badge || 'حل متكامل'}
                      </span>

                      {sol.estimatedDuration && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#5A554E] dark:text-white/60 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-[#E5E0D8] dark:border-transparent">
                          <Clock className="w-3.5 h-3.5 text-[#8F6E30] dark:text-[#C5A059]" />
                          <span>المدة: {sol.estimatedDuration}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#121212] dark:text-white group-hover:text-[#C5A059] transition-colors mb-3 leading-snug font-serif-display">
                      {sol.title}
                    </h3>

                    {/* Problem Solved */}
                    <div className="p-3.5 rounded-xl bg-red-500/[0.06] border border-red-500/20 mb-5">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-red-700 dark:text-red-300 block mb-0.5">التحدي الذي يعالجه:</span>
                          <p className="text-xs text-[#121212]/80 dark:text-white/80 leading-relaxed">{sol.problemSolved}</p>
                        </div>
                      </div>
                    </div>

                    {/* Included Services Chips */}
                    {Array.isArray(sol.includedServices) && sol.includedServices.length > 0 && (
                      <div className="mb-5">
                        <span className="text-xs font-semibold text-[#8E877D] dark:text-white/50 block mb-2">الخدمات المتضمنة في هذا الحل:</span>
                        <div className="flex flex-wrap gap-2">
                          {sol.includedServices.map((srv, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-xs px-2.5 py-1 rounded-lg bg-black/[0.04] dark:bg-white/5 border border-[#E5E0D8] dark:border-white/10 text-[#121212] dark:text-white/90 font-medium"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Expected Deliverables */}
                    {Array.isArray(sol.deliverables) && sol.deliverables.length > 0 && (
                      <div className="mb-6 space-y-2">
                        <span className="text-xs font-semibold text-[#8E877D] dark:text-white/50 block mb-1">المخرجات والنتائج المتوقعة:</span>
                        {sol.deliverables.map((deliv, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2 text-xs text-[#121212]/85 dark:text-white/85">
                            <CheckCircle2 className="w-4 h-4 text-[#8F6E30] dark:text-[#C5A059] shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{deliv}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Target Audience */}
                    {sol.targetAudience && (
                      <div className="pt-4 border-t border-[#E5E0D8] dark:border-white/5 flex items-center gap-2 text-xs text-[#5A554E] dark:text-white/60 mb-5">
                        <Users className="w-3.5 h-3.5 text-[#8F6E30] dark:text-[#C5A059] shrink-0" />
                        <span><strong>الفئة المستهدفة:</strong> {sol.targetAudience}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedSolutionForInquiry(sol)}
                    className="w-full py-3 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>طلب هذا الحل المتكامل</span>
                  </button>
                </div>
              </ContextualEditWrapper>
            </MotionLeft>
          ))}
        </div>

        {/* Featured Applications & Platforms Showcase Bar (Moved here from hero) */}
        <div className="mt-8 pt-8 border-t border-[#E5E0D8] dark:border-white/10">
          <div className="mb-6">
            <span className="text-xs font-bold text-[#8F6E30] dark:text-[#C5A059] tracking-wider uppercase block mb-1">
              منصات وأنظمة مطورة
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#121212] dark:text-white">
              تطبيقات ومنصات واقعية تعمل في بيئات حية
            </h3>
            <p className="text-[#5A554E] dark:text-white/60 text-xs sm:text-sm mt-1">
              استكشف نماذج من المنظومات السحابية والحلول التي تم بناؤها وتدشينها
            </p>
          </div>

          <ProjectShowcaseBar />
        </div>
      </div>

      {selectedSolutionForInquiry && (
        <ServiceInquiryModal
          isOpen={true}
          onClose={() => setSelectedSolutionForInquiry(null)}
          serviceTitle={selectedSolutionForInquiry.title}
          serviceType="service"
          serviceCategory="حلول متكاملة"
        />
      )}
    </section>
  );
};

