import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, MessageSquare, MapPin, Send, CheckCircle2, Sparkles, ArrowLeft } from 'lucide-react';
import { BuilderElement } from '../../types';
import { MotionLeft } from '../common/MotionLeft';
import { 
  getTitleFontSizeClass, 
  getBodyFontSizeClass, 
  getFontWeightClass, 
  getGradientBackground,
  getScopedValue 
} from '../../utils/typography';

interface PublicContactProps {
  title?: string;
  subtitle?: string;
  description?: string;
  layout?: BuilderElement['layout'];
  style?: BuilderElement['style'];
}

export const PublicContact: React.FC<PublicContactProps> = ({ 
  title, 
  subtitle, 
  description,
  layout,
  style
}) => {
  const { profile, theme, notify } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      notify('يرجى ملء جميع الحقول المطلوبة', 'warning');
      return;
    }
    setSubmitted(true);
    notify('شكراً لتواصلك! تم إرسال رسالتك بنجاح وسأرد عليك قريباً.', 'success');
  };

  const cleanWhatsappNumber = profile.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent('مرحباً أستاذ عبدالله، اطلعت على منصتك الشخصية وأود التواصل معك بشأن فرصة تعاون.')}`;

  const maxWidthClass = 
    layout?.maxWidth === '3xl' ? 'max-w-3xl' :
    layout?.maxWidth === '5xl' ? 'max-w-5xl' :
    layout?.maxWidth === 'full' ? 'max-w-full' : 'max-w-7xl';

  const paddingClass = layout?.paddingY || 'py-24';

  // Scoped Container Style
  const containerBg = getScopedValue(style, 'container', 'backgroundColor', style?.backgroundColor);
  const containerColor = getScopedValue(style, 'container', 'textColor', style?.textColor);
  const containerGradient = getScopedValue(style, 'container', 'gradient', style?.gradient);
  const gradientBg = getGradientBackground(containerGradient);

  // Scoped Title Style
  const titleColor = getScopedValue(style, 'title', 'textColor', style?.textColor);
  const titleSize = getScopedValue(style, 'title', 'fontSize', style?.fontSize);
  const titleWeight = getScopedValue(style, 'title', 'fontWeight', style?.fontWeight);
  const titleFontSize = getTitleFontSizeClass(titleSize);
  const titleFontWeight = getFontWeightClass(titleWeight);

  // Scoped Subtitle Style
  const subtitleColor = getScopedValue(style, 'subtitle', 'textColor', style?.accentColor || (theme === 'dark' ? '#E8D4A8' : '#8F6E30'));
  const subtitleBg = getScopedValue(style, 'subtitle', 'backgroundColor');
  const subtitleBorder = getScopedValue(style, 'subtitle', 'borderColor');
  const subtitleSize = getScopedValue(style, 'subtitle', 'fontSize', 'sm');
  const subtitleWeight = getScopedValue(style, 'subtitle', 'fontWeight', 'semibold');

  // Scoped Description Style
  const descColor = getScopedValue(style, 'description', 'textColor', style?.textColor);
  const descSize = getScopedValue(style, 'description', 'fontSize', style?.fontSize);
  const descWeight = getScopedValue(style, 'description', 'fontWeight', 'normal');
  const descFontSize = getBodyFontSizeClass(descSize);
  const descFontWeight = getFontWeightClass(descWeight);

  // Scoped Cards Style
  const cardBg = getScopedValue(style, 'cards', 'backgroundColor', style?.cardBackground);
  const cardColor = getScopedValue(style, 'cards', 'textColor', style?.cardTextColor);
  const cardBorder = getScopedValue(style, 'cards', 'borderColor', style?.cardBorderColor);
  const cardRadius = getScopedValue(style, 'cards', 'borderRadius', style?.cardBorderRadius);
  const cardGradient = getScopedValue(style, 'cards', 'gradient');
  const cardGradientBg = getGradientBackground(cardGradient);

  const cardCustomStyle: React.CSSProperties = {
    background: cardGradientBg || cardBg || undefined,
    backgroundColor: !cardGradientBg ? (cardBg || undefined) : undefined,
    color: cardColor || undefined,
    borderColor: cardBorder || undefined,
    borderRadius: cardRadius || undefined,
  };

  // Scoped Button Style
  const buttonBg = getScopedValue(style, 'button', 'backgroundColor', '#C5A059');
  const buttonColor = getScopedValue(style, 'button', 'textColor', '#121212');
  const buttonRadius = getScopedValue(style, 'button', 'borderRadius', '16px');
  const buttonGradient = getScopedValue(style, 'button', 'gradient');
  const buttonGradientBg = getGradientBackground(buttonGradient);

  return (
    <section 
      id="contact"
      style={{
        background: gradientBg || containerBg || undefined,
        backgroundColor: !gradientBg ? (containerBg || undefined) : undefined,
        color: containerColor || undefined,
      }}
      className={`${paddingClass} transition-colors duration-300 relative ${
        !containerBg && !gradientBg ? (
          theme === 'dark' 
            ? 'bg-[#121212] text-[#F9F7F2]' 
            : 'bg-[#F9F7F2] text-[#121212]'
        ) : ''
      }`}
    >
      <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8`}>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Right Column: Contact Details and Direct Channels */}
          <MotionLeft distance={-50} className="lg:col-span-5 space-y-8 text-right">
            <div>
              <div 
                style={{
                  backgroundColor: subtitleBg || undefined,
                  borderColor: subtitleBorder || undefined,
                  color: subtitleColor || undefined,
                }}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getBodyFontSizeClass(subtitleSize)} ${getFontWeightClass(subtitleWeight)} mb-3 border ${
                !subtitleBg ? (
                  theme === 'dark'
                    ? 'bg-[#1A1917] border-[#C5A059]/30 text-[#E8D4A8]'
                    : 'bg-[#F2EFE9] border-[#E5E0D8] text-[#8F6E30]'
                ) : ''
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{subtitle || 'شراكة وتواصل'}</span>
              </div>
              <h2 
                style={{ color: titleColor || undefined }}
                className={`${titleFontSize} ${titleFontWeight} tracking-tight font-serif-display`}
              >
                {title || 'لنصنع شيئاً استثنائياً معاً'}
              </h2>
              <p 
                style={{ color: descColor ? `${descColor}cc` : undefined }}
                className={`mt-3 ${descFontSize} ${descFontWeight} leading-relaxed ${
                  !descColor ? (theme === 'dark' ? 'text-[#C7C1B7]' : 'text-[#5A554E]') : ''
                }`}
              >
                {description || 'سواء كنت تؤسس لمنتج تقني جديد، أو تبحث عن مستشار لتطوير تجربة مستخدم منصتك، أنا هنا لمساعدتك في تحويل رؤيتك إلى واقع رقمي رصين.'}
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              
              {/* WhatsApp Card */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                id="contact-whatsapp-direct-card"
                style={cardCustomStyle}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.02] ${
                  !style?.cardBackground ? (
                    theme === 'dark'
                      ? 'bg-[#1A1917] hover:bg-[#201E1A] border-[#282622] hover:border-[#C5A059]/40 text-[#F9F7F2]'
                      : 'bg-[#FFFFFF] hover:bg-[#FAF8F5] border-[#E5E0D8] hover:border-[#C5A059]/40 text-[#121212] artistic-shadow-sm'
                  ) : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-[#8E877D] block font-medium">محادثة فورية</span>
                  <span 
                    style={{ color: style?.cardTextColor || undefined }}
                    className="text-sm font-bold text-[#8F6E30] dark:text-[#DFCA9B] font-serif-display"
                  >
                    واتساب مباشر (WhatsApp)
                  </span>
                  <span className="text-xs text-[#8E877D] block mt-0.5 dir-ltr text-right">{profile.phone}</span>
                </div>
                <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${profile.email}`}
                id="contact-email-direct-card"
                style={cardCustomStyle}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.02] ${
                  !style?.cardBackground ? (
                    theme === 'dark'
                      ? 'bg-[#1A1917] hover:bg-[#201E1A] border-[#282622] hover:border-[#C5A059]/40 text-[#F9F7F2]'
                      : 'bg-[#FFFFFF] hover:bg-[#FAF8F5] border-[#E5E0D8] hover:border-[#C5A059]/40 text-[#121212] artistic-shadow-sm'
                  ) : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-[#8E877D] block font-medium">البريد الإلكتروني</span>
                  <span 
                    style={{ color: style?.cardTextColor || undefined }}
                    className="text-sm font-bold font-serif-display"
                  >
                    {profile.email}
                  </span>
                </div>
                <ArrowLeft className="w-4 h-4 text-[#8E877D]" />
              </a>

              {/* Location Card */}
              <div 
                style={cardCustomStyle}
                className={`flex items-center gap-4 p-4 rounded-2xl border ${
                  !style?.cardBackground ? (
                    theme === 'dark'
                      ? 'bg-[#1A1917] border-[#282622] text-[#C7C1B7]'
                      : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#5A554E] artistic-shadow-sm'
                  ) : ''
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-[#8E877D] block font-medium">المقر الرئيسي</span>
                  <span 
                    style={{ color: style?.cardTextColor || undefined }}
                    className="text-sm font-bold font-serif-display text-[#121212] dark:text-[#F9F7F2]"
                  >
                    {profile.location}
                  </span>
                </div>
              </div>

            </div>
          </MotionLeft>

          {/* Left Column: Interactive Contact Form */}
          <MotionLeft distance={-50} delay={0.15} className="lg:col-span-7">
            <div 
              style={cardCustomStyle}
              className={`p-6 sm:p-10 rounded-3xl border shadow-xl ${
                !style?.cardBackground ? (
                  theme === 'dark'
                    ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]'
                    : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212] artistic-shadow-sm'
                ) : ''
              }`}
            >
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif-display">تم استلام رسالتك بنجاح!</h3>
                  <p className="text-sm text-[#8E877D] max-w-md mx-auto">
                    شكراً لتواصلك يا {name}، سيتم مراجعة تفاصيل رسالتك والرد عليك في أقرب فرصة ممكنة.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] font-bold text-xs"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-right">
                  <h3 
                    style={{ color: style?.cardTextColor || undefined }}
                    className="text-xl font-bold mb-4 font-serif-display"
                  >
                    أرسل استفسارك أو تفاصيل مشروعك
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#8E877D] dark:text-[#C7C1B7] mb-1.5">
                        الاسم الكامل *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: خالد العتيبي"
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:border-[#C5A059] ${
                          theme === 'dark'
                            ? 'bg-[#24221E] border-[#2E2B26] text-[#F9F7F2] placeholder-[#8E877D]'
                            : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212] placeholder-[#8E877D]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#8E877D] dark:text-[#C7C1B7] mb-1.5">
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:border-[#C5A059] ${
                          theme === 'dark'
                            ? 'bg-[#24221E] border-[#2E2B26] text-[#F9F7F2] placeholder-[#8E877D]'
                            : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212] placeholder-[#8E877D]'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8E877D] dark:text-[#C7C1B7] mb-1.5">
                      موضوع الرسالة
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="استشارة تقنية / تصميم تطبيق جديد / شراكة استراتيجية"
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:border-[#C5A059] ${
                        theme === 'dark'
                          ? 'bg-[#24221E] border-[#2E2B26] text-[#F9F7F2] placeholder-[#8E877D]'
                          : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212] placeholder-[#8E877D]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8E877D] dark:text-[#C7C1B7] mb-1.5">
                      نص الرسالة أو تفاصيل الفكرة *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="صف فكرة مشروعك، أهدافك، أو الأسئلة التي تود مناقشتها..."
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:border-[#C5A059] ${
                        theme === 'dark'
                          ? 'bg-[#24221E] border-[#2E2B26] text-[#F9F7F2] placeholder-[#8E877D]'
                          : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#121212] placeholder-[#8E877D]'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    id="submit-contact-form-btn"
                    style={{
                      background: buttonGradientBg || buttonBg || undefined,
                      backgroundColor: !buttonGradientBg ? (buttonBg || undefined) : undefined,
                      color: buttonColor || undefined,
                      borderRadius: buttonRadius || undefined,
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#C5A059] hover:opacity-90 text-[#121212] font-bold text-sm shadow-xs transition-all cursor-pointer font-serif-display"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال الرسالة الآن</span>
                  </button>

                  <p className="text-[11px] text-[#8E877D] text-center">
                    معلوماتك محمية ولن تتم مشاركتها مع أي طرف ثالث.
                  </p>
                </form>
              )}
            </div>
          </MotionLeft>

        </div>

      </div>
    </section>
  );
};

