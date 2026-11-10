import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Sparkles, ArrowDown, Send, ShieldCheck, Layers, CheckCircle } from 'lucide-react';
import { MotionLeft } from '../../common/MotionLeft';
import { ContextualEditWrapper } from './ContextualEditWrapper';
import { ServiceInquiryModal } from './ServiceInquiryModal';

interface ServicesHeroProps {
  onOpenInquiry?: () => void;
}

export const ServicesHero: React.FC<ServicesHeroProps> = () => {
  const { profile, isAuthenticated, isLiveEditMode, setShowLivePropertiesPanel, setSelectedLiveElementId } = useApp();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const scrollToSolutions = () => {
    const el = document.getElementById('integrated-solutions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ContextualEditWrapper
      id="services-hero-section"
      label="مقدمة قسم الخدمات"
      onEdit={() => {
        setSelectedLiveElementId('services-hero-section');
        setShowLivePropertiesPanel(true);
      }}
      className="w-full relative pt-12 pb-16 md:pt-16 md:pb-20"
    >
      {/* Background Ambience Layer - Isolated clipping so badges and borders are never cut off */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#C5A059]/5 blur-[120px] rounded-full" />
        <div className="absolute -top-10 right-1/4 w-72 h-72 bg-white/[0.02] rounded-full border border-white/5 animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtle Domain Badge */}
        <MotionLeft immediate delay={0.1} distance={-15} className="inline-flex items-center justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121212]/5 dark:bg-white/[0.03] border border-[#C5A059]/30 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#8F6E30] dark:text-[#C5A059]" />
            <span className="text-xs font-semibold tracking-wide text-[#121212]/90 dark:text-white/90">
              الخدمات والاستشارات المهنية المتخصصة
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
          </div>
        </MotionLeft>

        {/* Main Display Headline */}
        <MotionLeft immediate delay={0.2} distance={-20}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#121212] dark:text-white tracking-tight leading-[1.25] mb-6">
            حلول متكاملة تدمج بين{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8F6E30] via-[#C5A059] to-[#8F6E30] dark:from-[#C5A059] dark:via-[#E6CA85] dark:to-[#C5A059]">
              الرؤية الاستشارية
            </span>{' '}
            والتنفيذ الرقمي الفائق
          </h1>
        </MotionLeft>

        {/* Clear, High-legibility Subtext */}
        <MotionLeft immediate delay={0.3} distance={-25}>
          <p className="text-base sm:text-lg md:text-xl text-[#5A554E] dark:text-white/75 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            من هندسة المنصات والتطبيقات الرقمية المتقدمة إلى الأنظمة المالية والمحاسبية واستشارات الهوية المعمارية والتشطيب. خدمات مبنية على معايير الجودة التنفيذية الصارمة.
          </p>
        </MotionLeft>

        {/* Primary Action Buttons */}
        <MotionLeft immediate delay={0.4} distance={-30} className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIsInquiryOpen(true)}
            className="px-7 py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-sm sm:text-base shadow-xl shadow-[#C5A059]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 group cursor-pointer"
          >
            <Send className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>طلب استشارة أو خدمة</span>
          </button>

          <button
            type="button"
            onClick={scrollToSolutions}
            className="px-6 py-3.5 rounded-xl bg-[#FFFFFF] dark:bg-white/5 hover:bg-[#FAF8F5] dark:hover:bg-white/10 border border-[#E5E0D8] dark:border-white/10 hover:border-[#C5A059]/40 text-[#121212] dark:text-white/90 font-medium text-sm sm:text-base transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer artistic-shadow-sm"
          >
            <Layers className="w-4 h-4 text-[#8F6E30] dark:text-[#C5A059]" />
            <span>استعراض الحلول المتكاملة</span>
            <ArrowDown className="w-3.5 h-3.5 opacity-60" />
          </button>
        </MotionLeft>

        {/* Trust Indicators Bar */}
        <MotionLeft immediate delay={0.5} distance={-35} className="hero-benefits mt-12 pt-8 border-t border-[#E5E0D8] dark:border-white/5 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-[#8E877D] dark:text-white/60">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#8F6E30] dark:text-[#C5A059]" />
            <span>منهجية عمل معتمدة من 5 مراحل</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#8F6E30] dark:text-[#C5A059]" />
            <span>مخرجات تسليم محددة وموثقة</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#8F6E30] dark:text-[#C5A059]" />
            <span>جلسة استشارية أولية مجانية</span>
          </div>
        </MotionLeft>
      </div>

      <ServiceInquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        serviceTitle="استشارة استراتيجية عامة"
        serviceType="consulting"
        serviceCategory="استشارات عامة"
      />
    </ContextualEditWrapper>
  );
};

