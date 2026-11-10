import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { X, Send, MessageSquare, CheckCircle2, Mail, Phone, ArrowRight } from 'lucide-react';

interface ServiceInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
  serviceType?: 'consulting' | 'service';
  serviceCategory?: string;
}

export const ServiceInquiryModal: React.FC<ServiceInquiryModalProps> = ({
  isOpen,
  onClose,
  serviceTitle = 'استشارة عامة',
  serviceType = 'service',
  serviceCategory = 'حلول عامة'
}) => {
  const { profile } = useApp();

  const [name, setName] = useState('');
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'email'>('whatsapp');
  const [contactValue, setContactValue] = useState('');
  const [inquiryType, setInquiryType] = useState<string>(
    serviceType === 'consulting' ? 'حجز جلسة استشارية' : 'طلب عرض سعر ونطاق عمل'
  );
  const [timeline, setTimeline] = useState('عاجل (خلال أسبوعين)');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const message = `السلام عليكم ورحمة الله،\nأنا: ${name}\nأرغب في: ${inquiryType}\nبخصوص: ${serviceTitle} (${serviceCategory})\nالإطار الزمني المتوقع: ${timeline}\nالتواصل: ${contactValue || 'عبر هذا الرقم'}\nتفاصيل الطلب: ${details || 'لا توجد ملاحظات إضافية'}`;

    if (contactMethod === 'whatsapp') {
      const whatsappNumber = (profile.whatsapp || profile.phone || '966500000000').replace(/[^0-9]/g, '');
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } else {
      const subject = encodeURIComponent(`طلب استشارة / خدمة: ${serviceTitle}`);
      const body = encodeURIComponent(message);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    }

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 dark:bg-black/80 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-xl bg-[#FFFFFF] dark:bg-[#1A1A1A] border border-[#E5E0D8] dark:border-[#C5A059]/30 rounded-2xl artistic-shadow-lg dark:shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E0D8] dark:border-white/10 bg-[#F9F7F2] dark:bg-[#141414]">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#C5A059]/15 text-[#8F6E30] dark:text-[#C5A059] border border-[#C5A059]/30">
              {serviceType === 'consulting' ? 'طلب استشارة متخصصة' : 'طلب خدمة وتنفيذ'}
            </span>
            <h3 className="text-xl font-bold text-[#121212] dark:text-white mt-2 flex items-center gap-2 font-serif-display">
              <span>{serviceTitle}</span>
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-[#8E877D] dark:text-white/50 hover:text-[#121212] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-[#C5A059]/20 text-[#8F6E30] dark:text-[#C5A059] border border-[#C5A059]/40 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-bold text-[#121212] dark:text-white font-serif-display">تم تجهيز طلبك بنجاح!</h4>
              <p className="text-[#5A554E] dark:text-white/70 max-w-md mx-auto text-sm leading-relaxed">
                تم تحويل طلبك مباشرة عبر {contactMethod === 'whatsapp' ? 'واتساب' : 'البريد الإلكتروني'}. سأقوم بالاطلاع على التفاصيل والرد عليك في أقرب وقت ممكن.
              </p>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="mt-6 px-6 py-2.5 bg-[#C5A059] text-black font-semibold rounded-xl hover:bg-[#D4AF37] transition-colors cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#121212]/85 dark:text-white/80 mb-1.5">
                  الاسم الكريم أو اسم المنشأة *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="مثال: م. فهد الشمري / شركة آفاق المستقبل"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/5 border border-[#E5E0D8] dark:border-white/10 text-[#121212] dark:text-white text-sm focus:border-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#121212]/85 dark:text-white/80 mb-1.5">
                    طبيعة الطلب
                  </label>
                  <select
                    value={inquiryType}
                    onChange={e => setInquiryType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F7F2] dark:bg-[#242424] border border-[#E5E0D8] dark:border-white/10 text-[#121212] dark:text-white text-sm focus:border-[#C5A059] focus:outline-none cursor-pointer"
                  >
                    <option value="طلب عرض سعر ونطاق عمل">طلب عرض سعر ونطاق عمل</option>
                    <option value="حجز جلسة استشارية أولية">حجز جلسة استشارية أولية</option>
                    <option value="مناقشة مشروع متكامل">مناقشة مشروع متكامل</option>
                    <option value="استفسار فني متخصص">استفسار فني متخصص</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#121212]/85 dark:text-white/80 mb-1.5">
                    الإطار الزمني المرغوب
                  </label>
                  <select
                    value={timeline}
                    onChange={e => setTimeline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F9F7F2] dark:bg-[#242424] border border-[#E5E0D8] dark:border-white/10 text-[#121212] dark:text-white text-sm focus:border-[#C5A059] focus:outline-none cursor-pointer"
                  >
                    <option value="عاجل (خلال أسبوعين)">عاجل (خلال أسبوعين)</option>
                    <option value="شهر إلى شهرين">شهر إلى شهرين</option>
                    <option value="مرحلة دراسة وتخطيط">مرحلة دراسة وتخطيط</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#121212]/85 dark:text-white/80 mb-1.5">
                  قناة الإرسال والتواصل المفضلة
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setContactMethod('whatsapp')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                      contactMethod === 'whatsapp'
                        ? 'border-emerald-500/80 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold shadow-sm'
                        : 'border-[#E5E0D8] dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-[#5A554E] dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    محادثة واتساب مباشرة
                  </button>

                  <button
                    type="button"
                    onClick={() => setContactMethod('email')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                      contactMethod === 'email'
                        ? 'border-[#C5A059] bg-[#C5A059]/15 text-[#8F6E30] dark:text-[#C5A059] font-semibold shadow-sm'
                        : 'border-[#E5E0D8] dark:border-white/10 bg-black/[0.02] dark:bg-white/5 text-[#5A554E] dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    البريد الإلكتروني
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#121212]/85 dark:text-white/80 mb-1.5">
                  رقم الهاتف أو البريد الإلكتروني للمتابعة (اختياري)
                </label>
                <input
                  type="text"
                  value={contactValue}
                  onChange={e => setContactValue(e.target.value)}
                  placeholder={contactMethod === 'whatsapp' ? '+966 5X XXX XXXX' : 'name@company.com'}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/5 border border-[#E5E0D8] dark:border-white/10 text-[#121212] dark:text-white text-sm focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#121212]/85 dark:text-white/80 mb-1.5">
                  نبذة عن فكرة المشروع أو استفسارك
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="شاركني ملخصاً موجزاً عن التحدي أو المخرجات التي تطمح للوصول إليها..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/5 border border-[#E5E0D8] dark:border-white/10 text-[#121212] dark:text-white text-sm focus:border-[#C5A059] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold rounded-xl shadow-lg shadow-[#C5A059]/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <span>إرسال الطلب والمتابعة الفورية</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

