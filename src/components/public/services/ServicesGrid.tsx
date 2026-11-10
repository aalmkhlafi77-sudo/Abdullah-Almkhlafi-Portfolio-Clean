import React from 'react';
import { useApp } from '../../../context/AppContext';
import { ServiceItem } from '../../../types';
import { IconRenderer } from '../../ui/IconRenderer';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Tag, 
  Send, 
  Info, 
  Edit3, 
  Sliders, 
  MoveUp, 
  MoveDown,
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { MotionLeft } from '../../common/MotionLeft';
import { ContextualEditWrapper } from './ContextualEditWrapper';

interface ServicesGridProps {
  services: ServiceItem[];
  onSelectServiceForDetail: (service: ServiceItem) => void;
  onSelectServiceForInquiry: (service: ServiceItem) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  onSelectServiceForDetail,
  onSelectServiceForInquiry
}) => {
  const { 
    isAuthenticated, 
    isLiveEditMode, 
    reorderServices, 
    deleteService, 
    addService,
    setSelectedLiveElementId,
    setShowLivePropertiesPanel,
    openIconLibrary
  } = useApp();

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newServices = [...services];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newServices.length) return;
    const temp = newServices[index];
    newServices[index] = newServices[targetIndex];
    newServices[targetIndex] = temp;
    reorderServices(newServices);
  };

  const handleDuplicate = (service: ServiceItem) => {
    const duplicated: ServiceItem = {
      ...service,
      id: 'service_' + Date.now(),
      title: `${service.title} (نسخة جديدة)`,
      order: service.order + 1
    };
    addService(duplicated);
  };

  if (services.length === 0) {
    return (
      <div className="py-16 text-center bg-[#FFFFFF] dark:bg-[#151515] border border-[#E5E0D8] dark:border-white/10 rounded-2xl p-8 artistic-shadow-sm transition-colors duration-300" dir="rtl">
        <Sparkles className="w-10 h-10 text-[#8F6E30] dark:text-[#C5A059] mx-auto mb-3 opacity-60" />
        <h3 className="text-lg font-bold text-[#121212] dark:text-white mb-2">لا توجد خدمات مطابقة لمعايير البحث الحالية</h3>
        <p className="text-[#5A554E] dark:text-white/60 text-sm max-w-md mx-auto">
          جرّب إزالة بعض الكلمات المفتاحية من شريط البحث أو اختر تصنيفاً آخر لعرض الخدمات المتاحة.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" dir="rtl">
      {services.map((service, index) => {
        const isConsulting = service.type === 'consulting';

        return (
          <MotionLeft
            key={service.id}
            immediate
            delay={0.05 * (index % 6)}
            distance={-20}
            className="h-full flex"
          >
            <ContextualEditWrapper
              id={`service-card-${service.id}`}
              label={`خدمة: ${service.title.slice(0, 16)}...`}
              canMoveUp={index > 0}
              canMoveDown={index < services.length - 1}
              onMoveUp={() => handleMove(index, 'up')}
              onMoveDown={() => handleMove(index, 'down')}
              onDuplicate={() => handleDuplicate(service)}
              onDelete={() => deleteService(service.id)}
              onEdit={() => {
                setSelectedLiveElementId(`service-card-${service.id}`);
                setShowLivePropertiesPanel(true);
              }}
              className="w-full"
            >
              <div className="h-full w-full bg-[#FFFFFF] dark:bg-[#181818] hover:bg-[#FAF8F5] dark:hover:bg-[#1C1C1C] border border-[#E5E0D8] dark:border-white/10 hover:border-[#C5A059]/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group artistic-shadow-sm dark:shadow-lg dark:hover:shadow-xl dark:hover:shadow-[#C5A059]/5">
                {/* Top Row: Icon & Category Badges */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-5">
                    {/* Icon Container with Admin Quick Changer */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-[#E5E0D8] dark:border-white/10 group-hover:border-[#C5A059]/50 flex items-center justify-center transition-colors">
                        <IconRenderer
                          name={service.iconName || 'Sparkles'}
                          className="w-6 h-6"
                          color={service.iconColor || '#C5A059'}
                          size={service.iconSize || 24}
                          rotation={service.iconRotation || 0}
                        />
                      </div>

                      {isAuthenticated && isLiveEditMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openIconLibrary({
                              type: 'service',
                              id: service.id,
                              currentIconName: service.iconName,
                              currentColor: service.iconColor,
                              currentSize: service.iconSize,
                              currentRotation: service.iconRotation
                            });
                          }}
                          title="تغيير أيقونة الخدمة"
                          className="absolute -bottom-1 -left-1 p-1 bg-[#C5A059] text-black rounded-md shadow hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Edit3 className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>

                    {/* Badges: Type & Category */}
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isConsulting
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                      }`}>
                        {isConsulting ? 'جلسة استشارية' : 'خدمة تنفيذية'}
                      </span>
                      <span className="text-[11px] font-medium text-[#5A554E] dark:text-white/50 bg-black/[0.04] dark:bg-white/5 px-2 py-0.5 rounded-md border border-[#E5E0D8] dark:border-transparent">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#121212] dark:text-white group-hover:text-[#C5A059] transition-colors leading-snug mb-2.5 line-clamp-2 font-serif-display">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#5A554E] dark:text-white/70 leading-relaxed mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Deliverables Preview (if available) */}
                  {Array.isArray(service.deliverables) && service.deliverables.length > 0 && (
                    <div className="mb-4 pt-3 border-t border-[#E5E0D8] dark:border-white/5 space-y-1.5">
                      <span className="text-[11px] font-semibold text-[#8E877D] dark:text-white/40 block mb-1">
                        أبرز مخرجات التسليم:
                      </span>
                      {service.deliverables.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#121212]/80 dark:text-white/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#8F6E30] dark:text-[#C5A059] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {Array.isArray(service.tags) && service.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {service.tags.slice(0, 4).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-black/[0.03] dark:bg-white/[0.04] text-[#8E877D] dark:text-white/50 border border-[#E5E0D8] dark:border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 border-t border-[#E5E0D8] dark:border-white/5 flex items-center justify-between gap-3 mt-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectServiceForInquiry(service);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#C5A059]/15 hover:bg-[#C5A059] text-[#8F6E30] dark:text-[#C5A059] hover:text-black font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border border-[#C5A059]/30 hover:border-[#C5A059] cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>طلب {isConsulting ? 'الاستشارة' : 'الخدمة'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectServiceForDetail(service);
                    }}
                    className="py-2 px-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[#5A554E] dark:text-white/80 hover:text-[#121212] dark:hover:text-white font-medium text-xs transition-colors flex items-center gap-1 border border-[#E5E0D8] dark:border-white/5 cursor-pointer"
                    title="عرض كامل التفاصيل والمخرجات"
                  >
                    <span>التفاصيل</span>
                    <ArrowLeft className="w-3 h-3 opacity-60" />
                  </button>
                </div>
              </div>
            </ContextualEditWrapper>
          </MotionLeft>
        );
      })}
    </div>
  );
};

