import React from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Search, 
  Compass, 
  Code2, 
  ShieldCheck, 
  Rocket, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { MotionLeft } from '../../common/MotionLeft';
import { ContextualEditWrapper } from './ContextualEditWrapper';

export const ServicesMethodology: React.FC = () => {
  const { setSelectedLiveElementId, setShowLivePropertiesPanel } = useApp();

  const steps = [
    {
      number: '01',
      title: 'فهم الاحتياج وتحديد الأهداف',
      subtitle: 'Discovery & Needs Assessment',
      icon: Search,
      description: 'جلسة استشارية متعمقة لتحليل المتطلبات الحالية، تحديد التحديات بدقة، وبلورة الأهداف الواضحة مع العميل.',
      deliverables: ['وثيقة نطاق المشروع', 'مصفوفة التحديات والأهداف', 'جدول زمني استرشادي']
    },
    {
      number: '02',
      title: 'التحليل والتخطيط المعماري',
      subtitle: 'Architecture & System Design',
      icon: Compass,
      description: 'هندسة المخطط التقني أو التشغيلي، اختيار التقنيات والبروتوكولات الأنسب، وتحديد تدفق العمليات بالتفصيل.',
      deliverables: ['المخطط الهيكلي للبنية', 'مواصفات واجهات الاستخدام', 'خطة تكامل الأنظمة']
    },
    {
      number: '03',
      title: 'التصميم والهندسة التنفيذية',
      subtitle: 'Execution & Development',
      icon: Code2,
      description: 'البناء الفعلي للمنظومة بأعلى معايير كتابة الكود النظيف أو الصياغة الاستشارية المحكمة مع مشاركة التحديثات دورياً.',
      deliverables: ['نماذج أولية تفاعلية', 'إصدارات برمجية تجريبية', 'تقارير تقدم مرحلية']
    },
    {
      number: '04',
      title: 'المراجعة والاختبار وضمان الجودة',
      subtitle: 'QA & Rigorous Testing',
      icon: ShieldCheck,
      description: 'اختبارات الأداء، التوافق، استقرار الأنظمة، وسيناريوهات الاستخدام الفعلي للتأكد من خلو العمل من أي ثغرات.',
      deliverables: ['تقرير فحص الجودة الشامل', 'اختبار الأمان والاستجابة', 'اعتماد العميل النهائي']
    },
    {
      number: '05',
      title: 'التسليم والدعم المستمر',
      subtitle: 'Deployment & Continuous Support',
      icon: Rocket,
      description: 'إطلاق المنظومة في بيئة الإنتاج، تدريب الكوادر على الإدارة، وتقديم دعم فني واستشاري لضمان الاستقرار والنمو.',
      deliverables: ['التدشين الحي الرسمي', 'دليل المستخدم والتوثيق', 'فترة ضمان ودعم فني']
    }
  ];

  return (
    <section id="services-methodology" className="w-full py-16 md:py-24 border-t border-[#E5E0D8] dark:border-white/5 relative transition-colors duration-300" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#8F6E30] dark:text-[#C5A059] text-xs font-semibold mb-3">
            <span>مسار التنفيذ المعتمد</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#121212] dark:text-white tracking-tight leading-snug">
            منهجية عمل احترافية تضمن الدقة والانضباط في كل مرحلة
          </h2>
          <p className="text-[#5A554E] dark:text-white/70 text-sm sm:text-base mt-3 leading-relaxed">
            نتبع مساراً تنفيذياً من خمس مراحل واضحة المعالم لتحويل متطلباتك إلى مخرجات جاهزة للعمل والاستثمار الفوري.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <MotionLeft
                key={step.number}
                immediate
                delay={0.1 * index}
                distance={-20}
                className="h-full flex"
              >
                <div className="h-full w-full bg-[#FFFFFF] dark:bg-[#181818] border border-[#E5E0D8] dark:border-white/10 hover:border-[#C5A059]/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 group artistic-shadow-sm dark:shadow-lg dark:hover:shadow-xl">
                  <div>
                    {/* Top: Number & Icon */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-2xl font-black text-[#8F6E30]/40 dark:text-[#C5A059]/40 group-hover:text-[#8F6E30] dark:group-hover:text-[#C5A059] transition-colors font-mono">
                        {step.number}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-black/[0.03] dark:bg-white/5 border border-[#E5E0D8] dark:border-white/10 group-hover:border-[#C5A059]/40 flex items-center justify-center text-[#8F6E30] dark:text-[#C5A059] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Step Title & Subtitle */}
                    <h3 className="text-base font-bold text-[#121212] dark:text-white group-hover:text-[#C5A059] transition-colors mb-1 font-serif-display">
                      {step.title}
                    </h3>
                    <span className="text-[11px] font-mono text-[#8E877D] dark:text-white/40 block mb-3">
                      {step.subtitle}
                    </span>

                    {/* Description */}
                    <p className="text-xs text-[#5A554E] dark:text-white/70 leading-relaxed mb-4">
                      {step.description}
                    </p>
                  </div>

                  {/* Deliverables */}
                  <div className="pt-3 border-t border-[#E5E0D8] dark:border-white/5 mt-auto">
                    <span className="text-[10px] font-bold text-[#8E877D] dark:text-white/40 block mb-2">المخرجات الرئيسية:</span>
                    <div className="space-y-1.5">
                      {step.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#121212]/80 dark:text-white/80">
                          <CheckCircle2 className="w-3 h-3 text-[#8F6E30] dark:text-[#C5A059] shrink-0 mt-0.5" />
                          <span className="leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </MotionLeft>
            );
          })}
        </div>
      </div>
    </section>
  );
};

