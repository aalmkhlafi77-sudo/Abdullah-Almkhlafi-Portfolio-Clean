import React from 'react';
import { ServiceItem } from '../../../types';
import { IconRenderer } from '../../ui/IconRenderer';
import { 
  X, 
  CheckCircle2, 
  Send, 
  ArrowLeft, 
  Sparkles, 
  Briefcase, 
  Code2, 
  Tag, 
  Share2,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onInquire: (service: ServiceItem) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onInquire
}) => {
  if (!service) return null;

  const isConsulting = service.type === 'consulting';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 dark:bg-black/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-2xl bg-[#FFFFFF] dark:bg-[#1A1A1A] border border-[#E5E0D8] dark:border-[#C5A059]/30 rounded-2xl artistic-shadow-lg dark:shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#E5E0D8] dark:border-white/10 bg-[#F9F7F2] dark:bg-[#141414]">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-black/[0.03] dark:bg-white/5 border border-[#E5E0D8] dark:border-white/10 flex items-center justify-center shrink-0">
              <IconRenderer
                name={service.iconName || 'Sparkles'}
                className="w-7 h-7"
                color={service.iconColor || '#C5A059'}
                size={service.iconSize || 28}
                rotation={service.iconRotation || 0}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isConsulting
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                }`}>
                  {isConsulting ? 'جلسة استشارية متخصصة' : 'خدمة تنفيذية احترافية'}
                </span>
                <span className="text-xs text-[#8E877D] dark:text-white/50 bg-black/5 dark:bg-white/5 px-2.5 py-0.5 rounded-full">
                  {service.category}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#121212] dark:text-white leading-tight font-serif-display">
                {service.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#8E877D] dark:text-white/50 hover:text-[#121212] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Description */}
          <div>
            <h4 className="text-xs font-bold text-[#8F6E30] dark:text-[#C5A059] uppercase tracking-wider mb-2">
              نطاق الخدمة والهدف الاستراتيجي
            </h4>
            <p className="text-[#5A554E] dark:text-white/80 text-sm sm:text-base leading-relaxed">
              {service.detailedDescription || service.description}
            </p>
          </div>

          {/* Deliverables List */}
          {Array.isArray(service.deliverables) && service.deliverables.length > 0 && (
            <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#E5E0D8] dark:border-white/5">
              <h4 className="text-xs font-bold text-[#8F6E30] dark:text-[#C5A059] uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>مخرجات التسليم الملموسة (Deliverables)</span>
              </h4>
              <div className="space-y-2.5">
                {service.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#121212]/85 dark:text-white/85">
                    <CheckCircle2 className="w-4 h-4 text-[#8F6E30] dark:text-[#C5A059] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {Array.isArray(service.tags) && service.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#8E877D] dark:text-white/50 mb-2">المجالات والتقنيات المرتبطة:</h4>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-black/[0.03] dark:bg-white/5 border border-[#E5E0D8] dark:border-white/10 text-[#5A554E] dark:text-white/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quality Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#8E877D] dark:text-white/60">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#E5E0D8] dark:border-white/5">
              <ShieldCheck className="w-4 h-4 text-[#8F6E30] dark:text-[#C5A059] shrink-0" />
              <span>معايير أمان وتوثيق برمجي كامل</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-[#E5E0D8] dark:border-white/5">
              <Clock className="w-4 h-4 text-[#8F6E30] dark:text-[#C5A059] shrink-0" />
              <span>متابعة دورية وجلسات استعراض مرحلية</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-5 border-t border-[#E5E0D8] dark:border-white/10 bg-[#F9F7F2] dark:bg-[#141414]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[#5A554E] dark:text-white/70 hover:text-[#121212] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 text-xs sm:text-sm transition-colors cursor-pointer"
          >
            إغلاق
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onInquire(service);
            }}
            className="px-6 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold text-xs sm:text-sm shadow-lg shadow-[#C5A059]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>طلب {isConsulting ? 'الاستشارة' : 'الخدمة'} الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};

