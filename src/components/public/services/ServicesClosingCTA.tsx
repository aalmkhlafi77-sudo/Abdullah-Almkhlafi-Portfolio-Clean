import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Send, 
  MessageSquare, 
  Mail, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';
import { MotionLeft } from '../../common/MotionLeft';
import { ServiceInquiryModal } from './ServiceInquiryModal';

export const ServicesClosingCTA: React.FC = () => {
  const { profile } = useApp();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const whatsappNumber = (profile.whatsapp || profile.phone || '966500000000').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('السلام عليكم ورحمة الله، أود الاستفسار عن باقات الخدمات والاستشارات المتاحة.')}`;

  return (
    <section className="w-full py-16 md:py-24 border-t border-[#E5E0D8] dark:border-white/5 relative overflow-hidden transition-colors duration-300" dir="rtl">
      {/* Refined Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#C5A059]/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Box Card */}
        <div className="bg-[#FFFFFF] dark:bg-[#181818] border border-[#C5A059]/30 rounded-3xl p-8 sm:p-12 md:p-16 artistic-shadow-md dark:shadow-2xl relative">
          <MotionLeft immediate delay={0.1} distance={-20}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#8F6E30] dark:text-[#C5A059] text-xs font-bold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>خطوتك الأولى نحو تحول رقمي ملموس</span>
            </div>
          </MotionLeft>

          <MotionLeft immediate delay={0.2} distance={-25}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#121212] dark:text-white tracking-tight leading-[1.3] mb-6 font-serif-display">
              جاهز لمناقشة مشروعك القادم والارتقاء بعملياتك؟
            </h2>
          </MotionLeft>

          <MotionLeft immediate delay={0.3} distance={-30}>
            <p className="text-base sm:text-lg text-[#5A554E] dark:text-white/75 max-w-2xl mx-auto leading-relaxed mb-10">
              احجز جلسة استشارية أولية لتحليل احتياجك بدقة، أو اطلب عرض سعر تفصيلي يتضمن نطاق العمل والمخرجات وجدول التنفيذ الزمني.
            </p>
          </MotionLeft>

          {/* Action Buttons */}
          <MotionLeft immediate delay={0.4} distance={-35} className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsInquiryOpen(true)}
              className="px-8 py-4 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-sm sm:text-base shadow-xl shadow-[#C5A059]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 group cursor-pointer"
            >
              <Send className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>طلب استشارة أو خدمة</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-bold text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>محادثة واتساب مباشرة</span>
            </a>

            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent('استفسار عن الخدمات والحلول')}`}
              className="px-6 py-4 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-[#E5E0D8] dark:border-white/10 text-[#121212] dark:text-white/80 font-medium text-sm sm:text-base transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#8F6E30] dark:text-[#C5A059]" />
              <span>مراسلة عبر البريد</span>
            </a>
          </MotionLeft>

          {/* Guarantee Pills */}
          <MotionLeft immediate delay={0.5} distance={-40} className="mt-12 pt-8 border-t border-[#E5E0D8] dark:border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-[#8E877D] dark:text-white/60">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#8F6E30] dark:text-[#C5A059]" />
              <span>التزام صارم بسرية البيانات واتفاقيات NDA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8F6E30] dark:text-[#C5A059]" />
              <span>رد فوري خلال أقل من 24 ساعة عمل</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#8F6E30] dark:text-[#C5A059]" />
              <span>مخرجات عمل معتمدة وقابلة للقياس</span>
            </div>
          </MotionLeft>
        </div>
      </div>

      <ServiceInquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        serviceTitle="طلب استشارة أو خدمة عامة"
        serviceType="consulting"
        serviceCategory="استشارات عامة"
      />
    </section>
  );
};

