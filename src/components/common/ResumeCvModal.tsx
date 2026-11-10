import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Sliders, 
  Eye, 
  Layers, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ArrowRight, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Languages, 
  Code,
  LayoutTemplate
} from 'lucide-react';
import { CvWorkExperience, CvEducation, CvCertification } from '../../types';
import { initialCvResumeData } from '../../data/initialData';

export const ResumeCvModal: React.FC = () => {
  const { 
    showResumeModal, 
    setShowResumeModal, 
    profile, 
    metrics, 
    cvResumeData, 
    updateCvResumeData, 
    theme, 
    notify 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'preview' | 'edit_content' | 'customize'>('preview');
  const [copied, setCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const printContainerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showResumeModal) {
        setShowResumeModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResumeModal, setShowResumeModal]);

  if (!showResumeModal) return null;

  // 1. High-Precision Standalone Print & PDF Generator
  const handlePrint = () => {
    setIsPrinting(true);
    notify('جارٍ فتح واجهة الطباعة وحفظ PDF...', 'info');

    // If not in preview tab, ensure preview tab is active so the element is ready
    if (activeTab !== 'preview') {
      setActiveTab('preview');
    }

    setTimeout(() => {
      try {
        const printDoc = printContainerRef.current || document.getElementById('printable-cv-document');
        const contentHtml = printDoc ? printDoc.outerHTML : '';

        // Standalone HTML template for clean printing
        const printableDoc = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>السيرة الذاتية - ${profile.name} (${profile.englishName})</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff !important;
      color: #121212 !important;
      font-family: 'Cairo', system-ui, sans-serif;
    }
    #printable-cv-document {
      max-width: 100% !important;
      width: 100% !important;
      min-height: auto !important;
      box-shadow: none !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
    }
    .no-print {
      display: none !important;
    }
  </style>
</head>
<body class="bg-white text-black p-4 flex justify-center">
  <div class="w-full max-w-[850px]">
    ${contentHtml}
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;

        // Try opening in new dedicated printable window
        let popupOpened = false;
        try {
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(printableDoc);
            printWindow.document.close();
            popupOpened = true;
          }
        } catch (e) {
          console.warn('Popup blocked or iframe sandboxed:', e);
          popupOpened = false;
        }

        // If popup was blocked or in iframe environment, trigger window.print() directly
        if (!popupOpened) {
          window.print();
        }
      } catch (err) {
        console.error('Print generation failed, falling back to window.print():', err);
        window.print();
      } finally {
        setIsPrinting(false);
      }
    }, 150);
  };

  // 2. Download Standalone HTML CV
  const handleDownloadHtml = () => {
    const printDoc = printContainerRef.current;
    if (!printDoc) return;

    const fullHtml = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>السيرة الذاتية - ${profile.name}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: A4 portrait; margin: 12mm; }
    body { font-family: 'Cairo', sans-serif; background: #FAF8F5; }
    @media print { body { background: #ffffff !important; } }
  </style>
</head>
<body class="p-4 sm:p-8 flex justify-center items-center min-h-screen">
  ${printDoc.outerHTML}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${profile.englishName.replace(/\s+/g, '_')}_${new Date().getFullYear()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    notify('تم تنزيل ملف السيرة الذاتية بصيغة HTML المستقلة بنجاح');
  };

  // 3. Copy Text
  const handleCopyText = () => {
    const text = `
========================================
السيرة الذاتية المهنية: ${profile.name} (${profile.englishName})
المسمى المهني: ${profile.role}
البريد الإلكتروني: ${profile.email} | الهاتف: ${profile.phone}
الموقع: ${profile.location}
========================================

نبذة موجزة:
${cvResumeData.summary || profile.longBio}

المهارات والخبرات التقنية:
${cvResumeData.skills.map(s => `• ${s}`).join('\n')}

الخبرات العملية:
${cvResumeData.experiences.map(exp => `
- ${exp.role} | ${exp.company} (${exp.startDate} - ${exp.endDate})
  ${exp.description}
  ${exp.achievements?.map(a => `  * ${a}`).join('\n') || ''}
`).join('\n')}

المؤهلات التعليمية:
${cvResumeData.education.map(edu => `• ${edu.degree} - ${edu.institution} (${edu.year})`).join('\n')}

الشهادات المعتمدة:
${cvResumeData.certifications.map(cert => `• ${cert.name} - ${cert.issuer} (${cert.year})`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    notify('تم نسخ نصوص السيرة الذاتية إلى الحافظة بنجاح');
    setTimeout(() => setCopied(false), 2500);
  };

  // Reset to initial
  const handleReset = () => {
    updateCvResumeData(initialCvResumeData);
    notify('تمت استعادة بيانات السيرة الذاتية الافتراضية بنجاح');
    setIsConfirmingReset(false);
  };

  // Experience Handlers
  const handleAddExperience = () => {
    const newExp: CvWorkExperience = {
      id: `exp_${Date.now()}`,
      role: 'مسمى وظيفي جديد',
      company: 'اسم الشركة أو المؤسسة',
      location: 'الرياض',
      startDate: `${new Date().getFullYear() - 1}`,
      endDate: 'حتى الآن',
      current: true,
      description: 'وصف المسؤوليات والإنجازات الرئيسية في هذا المنصب...',
      achievements: ['إنجاز مميز 1', 'إنجاز مميز 2']
    };
    updateCvResumeData({ experiences: [newExp, ...cvResumeData.experiences] });
    notify('تمت إضافة منصب جديد لقائمة الخبرات');
  };

  const handleUpdateExperience = (id: string, updates: Partial<CvWorkExperience>) => {
    const updated = cvResumeData.experiences.map(exp => exp.id === id ? { ...exp, ...updates } : exp);
    updateCvResumeData({ experiences: updated });
  };

  const handleDeleteExperience = (id: string) => {
    const filtered = cvResumeData.experiences.filter(exp => exp.id !== id);
    updateCvResumeData({ experiences: filtered });
    notify('تم حذف المنصب من الخبرات');
  };

  // Education Handlers
  const handleAddEducation = () => {
    const newEdu: CvEducation = {
      id: `edu_${Date.now()}`,
      degree: 'درجة بكالوريوس / ماجستير جديدة',
      institution: 'اسم الجامعة أو الكلية',
      year: `${new Date().getFullYear()}`,
      details: 'التخصص والمرتبة الأكاديمية'
    };
    updateCvResumeData({ education: [...cvResumeData.education, newEdu] });
    notify('تمت إضافة مؤهل أكاديمي جديد');
  };

  const handleUpdateEducation = (id: string, updates: Partial<CvEducation>) => {
    const updated = cvResumeData.education.map(edu => edu.id === id ? { ...edu, ...updates } : edu);
    updateCvResumeData({ education: updated });
  };

  const handleDeleteEducation = (id: string) => {
    const filtered = cvResumeData.education.filter(edu => edu.id !== id);
    updateCvResumeData({ education: filtered });
    notify('تم حذف المؤهل الأكاديمي');
  };

  // Certification Handlers
  const handleAddCertification = () => {
    const newCert: CvCertification = {
      id: `cert_${Date.now()}`,
      name: 'شهادة مهنية معتمدة جديدة',
      issuer: 'الجهة المانحة (مثل Google, AWS, Microsoft)',
      year: `${new Date().getFullYear()}`
    };
    updateCvResumeData({ certifications: [...cvResumeData.certifications, newCert] });
    notify('تمت إضافة شهادة مهنية جديدة');
  };

  const handleUpdateCertification = (id: string, updates: Partial<CvCertification>) => {
    const updated = cvResumeData.certifications.map(cert => cert.id === id ? { ...cert, ...updates } : cert);
    updateCvResumeData({ certifications: updated });
  };

  const handleDeleteCertification = (id: string) => {
    const filtered = cvResumeData.certifications.filter(cert => cert.id !== id);
    updateCvResumeData({ certifications: filtered });
    notify('تم حذف الشهادة');
  };

  // Template Styles Helpers
  const isGold = cvResumeData.template === 'executive_gold';
  const isTech = cvResumeData.template === 'modern_tech';
  const isMinimal = cvResumeData.template === 'minimal_clean';

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          setShowResumeModal(false);
        }
      }}
    >
      {/* Container Box */}
      <div 
        className={`relative w-full max-w-6xl h-[94vh] max-h-[950px] rounded-2xl sm:rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
          theme === 'dark' 
            ? 'bg-[#141311] border-[#2E2B26] text-[#F9F7F2]' 
            : 'bg-[#FAF8F5] border-[#E2DDD3] text-[#121212]'
        }`}
      >
        {/* TOP BAR: Title, Close button, and Actions */}
        <div className="no-print px-4 sm:px-6 py-3.5 border-b border-[#E2DDD3] dark:border-[#2A2722] flex items-center justify-between gap-3 bg-white/70 dark:bg-[#1A1916]/70 backdrop-blur-md shrink-0">
          
          {/* Right (in RTL): Title and Icon */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center border border-[#C5A059]/30 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold font-serif-display text-[#121212] dark:text-[#F9F7F2]">
                  السيرة الذاتية الاحترافية (CV & Resume)
                </h2>
                <span className="hidden xs:inline px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#C5A059]/20 text-[#8F6E30] dark:text-[#E8D4A8] border border-[#C5A059]/40">
                  A4 Print & PDF
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#5A554E] dark:text-[#BDB7AB] truncate max-w-[280px] sm:max-w-md">
                معاينة مباشرة وتخصيص وتصدير بنقرة واحدة بجودة فائقة
              </p>
            </div>
          </div>

          {/* Left (in RTL): Primary Action Buttons + Prominent Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Download PDF / Print Button */}
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              id="cv-print-action-btn"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-[#C5A059] text-[#121212] hover:bg-[#DFCA9B] transition-all shadow-md active:scale-95 disabled:opacity-50"
              title="طباعة وتصدير بصيغة PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">طباعة / تصدير PDF</span>
              <span className="sm:hidden">طباعة</span>
            </button>

            {/* Standalone HTML download */}
            <button
              onClick={handleDownloadHtml}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#2E2B26] dark:text-[#E8E4DC] hover:bg-[#F2ECE1] dark:hover:bg-[#282622] transition-colors"
              title="تنزيل كملف HTML مستقل"
            >
              <Download className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>ملف HTML</span>
            </button>

            {/* Copy text */}
            <button
              onClick={handleCopyText}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#2E2B26] dark:text-[#E8E4DC] hover:bg-[#F2ECE1] dark:hover:bg-[#282622] transition-colors"
              title="نسخ نص السيرة"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#8C867D]" />}
              <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
            </button>

            {/* Prominent Close Button to return to Homepage */}
            <button
              onClick={() => setShowResumeModal(false)}
              id="close-cv-modal-btn"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-[#D4CEBF] dark:border-[#38342D] bg-[#F2ECE1] dark:bg-[#252320] text-[#121212] dark:text-[#F9F7F2] hover:bg-[#E5DFD3] dark:hover:bg-[#322F2A] hover:border-[#C5A059] transition-all shadow-xs"
              title="إغلاق والعودة للصفحة الرئيسية (Esc)"
            >
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              <span className="font-bold">إغلاق / العودة</span>
              <X className="w-3.5 h-3.5 text-[#8C867D] mr-0.5" />
            </button>
          </div>
        </div>

        {/* SUBNAV TABS: High-contrast tab navigation */}
        <div className="no-print px-4 sm:px-6 py-2 border-b border-[#E2DDD3] dark:border-[#2A2722] bg-[#EFEBE3]/60 dark:bg-[#191815]/60 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                activeTab === 'preview'
                  ? 'bg-[#C5A059] text-[#121212]'
                  : 'bg-white dark:bg-[#1E1D1A] text-[#4A453E] dark:text-[#D5CFBF] border border-[#D4CEBF] dark:border-[#33302A] hover:text-[#121212] dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>المعاينة المباشرة (Live A4)</span>
            </button>

            <button
              onClick={() => setActiveTab('edit_content')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                activeTab === 'edit_content'
                  ? 'bg-[#C5A059] text-[#121212]'
                  : 'bg-white dark:bg-[#1E1D1A] text-[#4A453E] dark:text-[#D5CFBF] border border-[#D4CEBF] dark:border-[#33302A] hover:text-[#121212] dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>تعديل محتوى ونصوص السيرة</span>
            </button>

            <button
              onClick={() => setActiveTab('customize')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                activeTab === 'customize'
                  ? 'bg-[#C5A059] text-[#121212]'
                  : 'bg-white dark:bg-[#1E1D1A] text-[#4A453E] dark:text-[#D5CFBF] border border-[#D4CEBF] dark:border-[#33302A] hover:text-[#121212] dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>القوالب وتخصيص المظهر</span>
            </button>
          </div>

          {/* Quick Template Switcher & Zoom in the Subnav */}
          <div className="flex items-center gap-2">
            {activeTab === 'preview' && (
              <div className="hidden sm:flex items-center gap-1 text-xs border border-[#D4CEBF] dark:border-[#33302A] rounded-lg p-0.5 bg-white dark:bg-[#1E1D1A]">
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
                  className="p-1 text-[#5A554E] dark:text-[#BDB7AB] hover:text-[#121212] dark:hover:text-white rounded"
                  title="تصغير المعاينة"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono px-1 font-bold text-[#121212] dark:text-[#F9F7F2]">
                  {zoomLevel}%
                </span>
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(130, prev + 15))}
                  className="p-1 text-[#5A554E] dark:text-[#BDB7AB] hover:text-[#121212] dark:hover:text-white rounded"
                  title="تكبير المعاينة"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {isConfirmingReset ? (
              <div className="flex items-center gap-1.5 bg-red-950/90 border border-red-500/60 rounded-lg px-2 py-1">
                <span className="text-[10px] text-red-200 font-bold">استعادة الأصل؟</span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-1.5 py-0.5 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold transition-colors"
                >
                  تأكيد
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingReset(false)}
                  className="px-1.5 py-0.5 text-white/70 hover:text-white rounded text-[10px] transition-colors"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingReset(true)}
                className="flex items-center gap-1 text-[11px] text-[#5A554E] dark:text-[#BDB7AB] hover:text-[#C5A059] p-1.5 rounded-lg transition-colors cursor-pointer"
                title="استعادة القيم الافتراضية الأصلية للسيرة الذاتية"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden md:inline">استعادة الأصل</span>
              </button>
            )}
          </div>
        </div>

        {/* MAIN BODY AREA */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex flex-col items-center">
          
          {/* ========================================================================= */}
          {/* TAB 1: LIVE A4 PREVIEW WITH REAL-TIME REACTIVITY                          */}
          {/* ========================================================================= */}
          {activeTab === 'preview' && (
            <div className="w-full flex flex-col items-center pb-8">
              
              {/* Quick Preset Selector floating pill above the A4 paper */}
              <div className="w-full max-w-[820px] mb-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#1C1A17] border border-[#E2DDD3] dark:border-[#2E2B26] shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#2E2B26] dark:text-[#E8E4DC]">القالب النشط:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateCvResumeData({ template: 'executive_gold' })}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                        isGold 
                          ? 'bg-[#C5A059] text-[#121212] shadow-xs' 
                          : 'bg-[#F2ECE1] dark:bg-[#252320] text-[#5A554E] dark:text-[#BDB7AB] hover:text-[#121212]'
                      }`}
                    >
                      👑 الذهبي الملكي
                    </button>
                    <button
                      onClick={() => updateCvResumeData({ template: 'modern_tech' })}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                        isTech 
                          ? 'bg-[#10B981] text-white shadow-xs' 
                          : 'bg-[#F2ECE1] dark:bg-[#252320] text-[#5A554E] dark:text-[#BDB7AB] hover:text-[#121212]'
                      }`}
                    >
                      💻 التقني المعاصر
                    </button>
                    <button
                      onClick={() => updateCvResumeData({ template: 'minimal_clean' })}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                        isMinimal 
                          ? 'bg-[#121212] text-white dark:bg-white dark:text-[#121212] shadow-xs' 
                          : 'bg-[#F2ECE1] dark:bg-[#252320] text-[#5A554E] dark:text-[#BDB7AB] hover:text-[#121212]'
                      }`}
                    >
                      ⚡ الأنيق البسيط
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#2E2B26] dark:text-[#E8E4DC]">
                    <input 
                      type="checkbox" 
                      checked={cvResumeData.showPhoto} 
                      onChange={(e) => updateCvResumeData({ showPhoto: e.target.checked })} 
                      className="accent-[#C5A059] rounded w-3.5 h-3.5"
                    />
                    <span>الصورة</span>
                  </label>
                  <span className="text-[#D4CEBF] dark:text-[#38342D]">|</span>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-[#2E2B26] dark:text-[#E8E4DC]">
                    <input 
                      type="checkbox" 
                      checked={cvResumeData.showMetrics} 
                      onChange={(e) => updateCvResumeData({ showMetrics: e.target.checked })} 
                      className="accent-[#C5A059] rounded w-3.5 h-3.5"
                    />
                    <span>الأرقام القياسية</span>
                  </label>
                </div>
              </div>

              {/* The A4 Sheet document container */}
              <div 
                style={{ 
                  transform: `scale(${zoomLevel / 100})`, 
                  transformOrigin: 'top center',
                  direction: 'rtl'
                }}
                className="transition-transform duration-200 w-full flex justify-center"
              >
                <div 
                  id="printable-cv-document"
                  ref={printContainerRef}
                  className={`w-full max-w-[820px] min-h-[1100px] bg-white text-[#121212] p-8 sm:p-12 rounded-2xl shadow-2xl border transition-all duration-300 ${
                    isGold
                      ? 'border-[#C5A059]/40 font-sans'
                      : isTech
                      ? 'border-emerald-500/40 font-sans'
                      : 'border-slate-300 font-sans'
                  }`}
                >
                  
                  {/* Template Top Accent Bar */}
                  {isGold && (
                    <div className="w-full h-2 rounded-t-lg bg-gradient-to-r from-[#C5A059] via-[#E8D4A8] to-[#C5A059] -mt-8 sm:-mt-12 -mx-8 sm:-mx-12 mb-8" />
                  )}
                  {isTech && (
                    <div className="w-full h-2 rounded-t-lg bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 -mt-8 sm:-mt-12 -mx-8 sm:-mx-12 mb-8" />
                  )}

                  {/* Header: Name, Title, Contacts, Avatar */}
                  <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 ${
                    isGold ? 'border-[#C5A059]/30' : isTech ? 'border-emerald-500/30' : 'border-slate-200'
                  }`}>
                    
                    <div className="flex items-center gap-5">
                      {cvResumeData.showPhoto && profile.avatarUrl && (
                        <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shadow-md shrink-0 flex items-center justify-center bg-black/5 ${
                          isGold ? 'border-[#C5A059]' : isTech ? 'border-emerald-500' : 'border-slate-400'
                        }`}>
                          <img 
                            src={profile.avatarUrl} 
                            alt={profile.name} 
                            className={`max-h-full max-w-full w-auto h-auto ${
                              profile.avatarFit === 'cover' ? 'w-full h-full object-cover' : 'object-contain p-0.5'
                            }`}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      <div>
                        <h1 className={`text-2xl sm:text-3xl font-extrabold text-[#121212] tracking-tight ${
                          isGold ? 'font-serif-display text-[#121212]' : isTech ? 'font-bold text-slate-900' : 'font-sans text-black'
                        }`}>
                          {profile.name}
                        </h1>
                        <div className={`text-sm font-bold tracking-wide uppercase mt-0.5 ${
                          isGold ? 'text-[#8F6E30]' : isTech ? 'text-emerald-700 font-mono' : 'text-slate-600'
                        }`}>
                          {profile.englishName}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-[#4A453E] mt-1">
                          {profile.role}
                        </div>
                      </div>
                    </div>

                    {/* Contact Info Block */}
                    {cvResumeData.showContact && (
                      <div className="flex flex-col gap-1.5 text-xs text-[#4A453E] shrink-0 border-r-0 sm:border-r border-[#E2DDD3] sm:pr-6">
                        <div className="flex items-center gap-2">
                          <Mail className={`w-3.5 h-3.5 ${isGold ? 'text-[#C5A059]' : isTech ? 'text-emerald-600' : 'text-slate-600'}`} />
                          <span className="font-mono font-medium text-[#121212]">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className={`w-3.5 h-3.5 ${isGold ? 'text-[#C5A059]' : isTech ? 'text-emerald-600' : 'text-slate-600'}`} />
                          <span className="font-mono font-medium text-[#121212]" dir="ltr">{profile.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-3.5 h-3.5 ${isGold ? 'text-[#C5A059]' : isTech ? 'text-emerald-600' : 'text-slate-600'}`} />
                          <span className="font-medium text-[#121212]">{profile.location}</span>
                        </div>
                        {profile.socials?.github && (
                          <div className="flex items-center gap-2">
                            <Globe className={`w-3.5 h-3.5 ${isGold ? 'text-[#C5A059]' : isTech ? 'text-emerald-600' : 'text-slate-600'}`} />
                            <span className="font-mono font-medium text-[#121212]">{profile.socials.github}</span>
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Executive Summary */}
                  <div className="py-5 border-b border-[#E2DDD3]">
                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                      isGold ? 'text-[#8F6E30] font-serif-display' : isTech ? 'text-emerald-700 font-mono' : 'text-slate-800'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>الملخص التنفيذي والمهني</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#2E2B26] leading-relaxed text-justify font-medium">
                      {cvResumeData.summary || profile.longBio || profile.bio}
                    </p>
                  </div>

                  {/* Key Metrics / Highlights (if enabled) */}
                  {cvResumeData.showMetrics && metrics.length > 0 && (
                    <div className="py-4 border-b border-[#E2DDD3]">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {metrics.slice(0, 4).map((m) => (
                          <div 
                            key={m.id} 
                            className={`p-2.5 rounded-xl text-center border ${
                              isGold 
                                ? 'bg-[#FAF8F5] border-[#E8D4A8]/60' 
                                : isTech 
                                ? 'bg-emerald-50/50 border-emerald-200' 
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className={`text-lg font-extrabold font-serif-display ${
                              isGold ? 'text-[#8F6E30]' : isTech ? 'text-emerald-800' : 'text-slate-900'
                            }`}>
                              {m.value}
                            </div>
                            <div className="text-[11px] font-bold text-[#4A453E]">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Work Experience */}
                  <div className="py-5 border-b border-[#E2DDD3]">
                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5 ${
                      isGold ? 'text-[#8F6E30] font-serif-display' : isTech ? 'text-emerald-700 font-mono' : 'text-slate-800'
                    }`}>
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>الخبرات المهنية والمناصب السابقة</span>
                    </h3>
                    <div className="space-y-4">
                      {cvResumeData.experiences.map((exp) => (
                        <div 
                          key={exp.id} 
                          className={`relative pr-4 border-r-2 ${
                            isGold ? 'border-[#C5A059]' : isTech ? 'border-emerald-500' : 'border-slate-400'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4 className="text-xs sm:text-sm font-bold text-[#121212]">
                              {exp.role}
                            </h4>
                            <span className="text-[11px] font-mono font-semibold text-[#5A554E] bg-[#F2ECE1] px-2 py-0.5 rounded-md self-start sm:self-auto">
                              {exp.startDate} - {exp.endDate}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-[#4A453E] mb-1">
                            {exp.company} {exp.location ? `• ${exp.location}` : ''}
                          </div>
                          <p className="text-xs text-[#2E2B26] leading-relaxed mb-1.5 font-medium">
                            {exp.description}
                          </p>
                          {exp.achievements && exp.achievements.length > 0 && (
                            <ul className="list-disc list-inside text-[11px] text-[#4A453E] space-y-0.5 mr-1 font-medium">
                              {exp.achievements.map((ach, i) => (
                                <li key={i}>{ach}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education & Certifications Side-by-Side */}
                  <div className="py-5 border-b border-[#E2DDD3] grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Academic Education */}
                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
                        isGold ? 'text-[#8F6E30] font-serif-display' : isTech ? 'text-emerald-700 font-mono' : 'text-slate-800'
                      }`}>
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>المؤهلات الأكاديمية</span>
                      </h3>
                      <div className="space-y-3">
                        {cvResumeData.education.map((edu) => (
                          <div key={edu.id} className="border-r-2 border-[#D4CEBF] pr-3">
                            <div className="text-xs font-bold text-[#121212]">{edu.degree}</div>
                            <div className="text-[11px] font-semibold text-[#4A453E]">{edu.institution} ({edu.year})</div>
                            {edu.details && <div className="text-[10px] text-[#5A554E] mt-0.5">{edu.details}</div>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
                        isGold ? 'text-[#8F6E30] font-serif-display' : isTech ? 'text-emerald-700 font-mono' : 'text-slate-800'
                      }`}>
                        <Award className="w-3.5 h-3.5" />
                        <span>الشهادات المهنية المعتمدة</span>
                      </h3>
                      <div className="space-y-2">
                        {cvResumeData.certifications.map((cert) => (
                          <div key={cert.id} className="text-xs text-[#2E2B26] flex items-start gap-1.5">
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isGold ? 'text-[#C5A059]' : isTech ? 'text-emerald-600' : 'text-slate-700'
                            }`} />
                            <div>
                              <span className="font-bold">{cert.name}</span>
                              <span className="text-[10px] text-[#5A554E] font-medium block">{cert.issuer} • {cert.year}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Skills & Expertise Chips */}
                  <div className="pt-5">
                    <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
                      isGold ? 'text-[#8F6E30] font-serif-display' : isTech ? 'text-emerald-700 font-mono' : 'text-slate-800'
                    }`}>
                      <Layers className="w-3.5 h-3.5" />
                      <span>المهارات والتقنيات الأساسية</span>
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {cvResumeData.skills.map((skill, idx) => (
                        <span 
                          key={idx}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                            isGold
                              ? 'bg-[#FAF8F5] text-[#2E2B26] border-[#E8D4A8]'
                              : isTech
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-mono'
                              : 'bg-slate-50 text-slate-900 border-slate-200'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages Footer */}
                  {cvResumeData.languages && cvResumeData.languages.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-[#E2DDD3] flex flex-wrap items-center justify-between text-[11px] text-[#5A554E] gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#121212]">اللغات:</span>
                        {cvResumeData.languages.map((l, i) => (
                          <span key={i} className="font-medium text-[#2E2B26]">{l.name} ({l.level})</span>
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-[#8C867D]">
                        وثيقة رسمية مصدّرة من المنصة الرقمية • {new Date().getFullYear()}
                      </span>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: RICH CONTENT EDITOR WITH HIGH CONTRAST & FULL EDITABILITY           */}
          {/* ========================================================================= */}
          {activeTab === 'edit_content' && (
            <div className="w-full max-w-3xl space-y-6 pb-12">
              
              {/* Alert Guide */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#121212] dark:text-[#F9F7F2]">
                    محرر نصوص وتجارب السيرة الذاتية التفاعلي
                  </h4>
                  <p className="text-xs text-[#5A554E] dark:text-[#C7C1B7] mt-0.5 leading-relaxed">
                    جميع التعديلات التي تجريها هنا تنعكس فوراً ومباشرةً على المعاينة المباشرة (Live Preview) وعلى ملف الـ PDF المطبوع.
                  </p>
                </div>
              </div>

              {/* 1. Summary Editor */}
              <div className="p-5 rounded-2xl border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1A1916] shadow-xs">
                <label className="block text-xs font-bold text-[#121212] dark:text-[#F9F7F2] mb-1">
                  الملخص التنفيذي والمهني (Professional Summary):
                </label>
                <p className="text-[11px] font-medium text-[#5A554E] dark:text-[#BDB7AB] mb-2.5">
                  فقرة تلخص خبراتك القيادية والتقنية وأبرز مهاراتك.
                </p>
                <textarea
                  rows={4}
                  value={cvResumeData.summary}
                  onChange={(e) => updateCvResumeData({ summary: e.target.value })}
                  placeholder="اكتب نبذة مهنية قوية وموجزة..."
                  className="w-full p-3.5 text-xs font-medium rounded-xl border border-[#D4CEBF] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-[#141311] text-[#121212] dark:text-[#F9F7F2] placeholder:text-[#8C867D] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] leading-relaxed"
                />
              </div>

              {/* 2. Skills Editor */}
              <div className="p-5 rounded-2xl border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1A1916] shadow-xs">
                <label className="block text-xs font-bold text-[#121212] dark:text-[#F9F7F2] mb-1">
                  المهارات والتقنيات (مفصولة بفواصل):
                </label>
                <p className="text-[11px] font-medium text-[#5A554E] dark:text-[#BDB7AB] mb-2.5">
                  اكتب المهارات مفصولة بفاصلة (مثال: React, TypeScript, Python, UI/UX).
                </p>
                <input
                  type="text"
                  value={cvResumeData.skills.join(', ')}
                  onChange={(e) => updateCvResumeData({ skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="w-full p-3.5 text-xs font-bold rounded-xl border border-[#D4CEBF] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-[#141311] text-[#121212] dark:text-[#F9F7F2] placeholder:text-[#8C867D] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>

              {/* 3. Work Experiences Manager */}
              <div className="p-5 rounded-2xl border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1A1916] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#121212] dark:text-[#F9F7F2] flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-[#C5A059]" />
                      <span>الخبرات المهنية والمناصب ({cvResumeData.experiences.length})</span>
                    </h3>
                    <p className="text-[11px] font-medium text-[#5A554E] dark:text-[#BDB7AB]">
                      إضافة وتعديل وحذف محطات العمل والمناصب السابقة
                    </p>
                  </div>
                  <button
                    onClick={handleAddExperience}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#C5A059] text-[#121212] hover:bg-[#DFCA9B] transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة منصب</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {cvResumeData.experiences.map((exp, idx) => (
                    <div 
                      key={exp.id} 
                      className="p-4 rounded-xl border border-[#D4CEBF] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-[#141311] space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-[#E2DDD3] dark:border-[#2E2B26]">
                        <span className="text-xs font-bold text-[#8F6E30] dark:text-[#E8D4A8]">
                          منصب #{idx + 1}
                        </span>
                        <button
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="حذف هذا المنصب"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-[#2E2B26] dark:text-[#E8E4DC] mb-1">المسمى الوظيفي:</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleUpdateExperience(exp.id, { role: e.target.value })}
                            className="w-full p-2 text-xs rounded-lg border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#121212] dark:text-[#F9F7F2]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#2E2B26] dark:text-[#E8E4DC] mb-1">اسم الشركة / المؤسسة:</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(exp.id, { company: e.target.value })}
                            className="w-full p-2 text-xs rounded-lg border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#121212] dark:text-[#F9F7F2]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#2E2B26] dark:text-[#E8E4DC] mb-1">تاريخ البدء:</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExperience(exp.id, { startDate: e.target.value })}
                            className="w-full p-2 text-xs rounded-lg border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#121212] dark:text-[#F9F7F2]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#2E2B26] dark:text-[#E8E4DC] mb-1">تاريخ الانتهاء:</label>
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => handleUpdateExperience(exp.id, { endDate: e.target.value })}
                            className="w-full p-2 text-xs rounded-lg border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#121212] dark:text-[#F9F7F2]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#2E2B26] dark:text-[#E8E4DC] mb-1">وصف المهام والمسؤوليات:</label>
                        <textarea
                          rows={2}
                          value={exp.description}
                          onChange={(e) => handleUpdateExperience(exp.id, { description: e.target.value })}
                          className="w-full p-2 text-xs rounded-lg border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#121212] dark:text-[#F9F7F2]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Education Manager */}
              <div className="p-5 rounded-2xl border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1A1916] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#121212] dark:text-[#F9F7F2] flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#C5A059]" />
                      <span>المؤهلات الأكاديمية ({cvResumeData.education.length})</span>
                    </h3>
                  </div>
                  <button
                    onClick={handleAddEducation}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#C5A059] text-[#121212] hover:bg-[#DFCA9B] transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة مؤهل</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {cvResumeData.education.map((edu) => (
                    <div key={edu.id} className="p-3.5 rounded-xl border border-[#D4CEBF] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-[#141311] grid grid-cols-1 sm:grid-cols-3 gap-2 relative">
                      <div>
                        <label className="block text-[10px] font-bold text-[#2E2B26] dark:text-[#E8E4DC] mb-0.5">الدرجة الأكاديمية:</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleUpdateEducation(edu.id, { degree: e.target.value })}
                          className="w-full p-2 text-xs rounded-lg border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#121212] dark:text-[#F9F7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#2E2B26] dark:text-[#E8E4DC] mb-0.5">الجامعة / الكلية:</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleUpdateEducation(edu.id, { institution: e.target.value })}
                          className="w-full p-2 text-xs rounded-lg border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#121212] dark:text-[#F9F7F2]"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-[#2E2B26] dark:text-[#E8E4DC] mb-0.5">السنة:</label>
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => handleUpdateEducation(edu.id, { year: e.target.value })}
                            className="w-full p-2 text-xs rounded-lg border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#121212] dark:text-[#F9F7F2]"
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteEducation(edu.id)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Certifications Manager */}
              <div className="p-5 rounded-2xl border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1A1916] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#121212] dark:text-[#F9F7F2] flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#C5A059]" />
                      <span>الشهادات المهنية المعتمدة ({cvResumeData.certifications.length})</span>
                    </h3>
                  </div>
                  <button
                    onClick={handleAddCertification}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#C5A059] text-[#121212] hover:bg-[#DFCA9B] transition-all shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة شهادة</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {cvResumeData.certifications.map((cert) => (
                    <div key={cert.id} className="p-3.5 rounded-xl border border-[#D4CEBF] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-[#141311] grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-[#2E2B26] dark:text-[#E8E4DC] mb-0.5">اسم الشهادة:</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => handleUpdateCertification(cert.id, { name: e.target.value })}
                          className="w-full p-2 text-xs rounded-lg border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#121212] dark:text-[#F9F7F2]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#2E2B26] dark:text-[#E8E4DC] mb-0.5">الجهة المانحة:</label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => handleUpdateCertification(cert.id, { issuer: e.target.value })}
                          className="w-full p-2 text-xs rounded-lg border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#121212] dark:text-[#F9F7F2]"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-[#2E2B26] dark:text-[#E8E4DC] mb-0.5">السنة:</label>
                          <input
                            type="text"
                            value={cert.year}
                            onChange={(e) => handleUpdateCertification(cert.id, { year: e.target.value })}
                            className="w-full p-2 text-xs rounded-lg border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#121212] dark:text-[#F9F7F2]"
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteCertification(cert.id)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: TEMPLATES & SECTION TOGGLES                                       */}
          {/* ========================================================================= */}
          {activeTab === 'customize' && (
            <div className="w-full max-w-2xl space-y-6 pb-12">
              
              {/* Template Style Selector */}
              <div className="p-5 rounded-2xl border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1A1916] shadow-xs">
                <h3 className="text-xs font-bold text-[#121212] dark:text-[#F9F7F2] mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>اختر نمط وتصميم السيرة الذاتية (CV Template)</span>
                </h3>
                <p className="text-[11px] font-medium text-[#5A554E] dark:text-[#BDB7AB] mb-4">
                  القالب يغير الخطوط والترويسة والألوان ونمط عرض الخبرات على الفور.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => updateCvResumeData({ template: 'executive_gold' })}
                    className={`p-4 rounded-xl border text-right transition-all shadow-xs ${
                      isGold
                        ? 'border-[#C5A059] bg-[#C5A059]/15 ring-2 ring-[#C5A059]/40'
                        : 'border-[#D4CEBF] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-[#141311] hover:border-[#C5A059]'
                    }`}
                  >
                    <div className="font-extrabold text-xs text-[#121212] dark:text-[#F9F7F2] mb-1 flex items-center justify-between">
                      <span>👑 الذهبي الملكي</span>
                      {isGold && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                    </div>
                    <div className="text-[10px] font-medium text-[#5A554E] dark:text-[#BDB7AB] leading-relaxed">
                      خطوط سيريف عريضة وفخمة مع إطارات ذهبية راقية تليق بالمناصب التنفيذية.
                    </div>
                  </button>

                  <button
                    onClick={() => updateCvResumeData({ template: 'modern_tech' })}
                    className={`p-4 rounded-xl border text-right transition-all shadow-xs ${
                      isTech
                        ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/40'
                        : 'border-[#D4CEBF] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-[#141311] hover:border-emerald-500'
                    }`}
                  >
                    <div className="font-extrabold text-xs text-[#121212] dark:text-[#F9F7F2] mb-1 flex items-center justify-between">
                      <span>💻 التقني المعاصر</span>
                      {isTech && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    </div>
                    <div className="text-[10px] font-medium text-[#5A554E] dark:text-[#BDB7AB] leading-relaxed">
                      أسلوب عصري للمطورين مع وسوم تقنية حديثة وخطوط مونو مميزة.
                    </div>
                  </button>

                  <button
                    onClick={() => updateCvResumeData({ template: 'minimal_clean' })}
                    className={`p-4 rounded-xl border text-right transition-all shadow-xs ${
                      isMinimal
                        ? 'border-slate-800 dark:border-white bg-slate-500/15 ring-2 ring-slate-500/40'
                        : 'border-[#D4CEBF] dark:border-[#38342D] bg-[#FAF8F5] dark:bg-[#141311] hover:border-slate-800'
                    }`}
                  >
                    <div className="font-extrabold text-xs text-[#121212] dark:text-[#F9F7F2] mb-1 flex items-center justify-between">
                      <span>⚡ الأنيق البسيط</span>
                      {isMinimal && <Check className="w-3.5 h-3.5 text-slate-800 dark:text-white" />}
                    </div>
                    <div className="text-[10px] font-medium text-[#5A554E] dark:text-[#BDB7AB] leading-relaxed">
                      تصميم سويسري عالي التباين يركز على المحتوى المباشر والأناقة الهادئة.
                    </div>
                  </button>
                </div>
              </div>

              {/* Section Toggles */}
              <div className="p-5 rounded-2xl border border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1A1916] shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-[#121212] dark:text-[#F9F7F2] mb-1 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#C5A059]" />
                  <span>تخصيص الأقسام المرئية في السيرة المطبوعة</span>
                </h3>
                <p className="text-[11px] font-medium text-[#5A554E] dark:text-[#BDB7AB] mb-3">
                  حدد العناصر التي تريد إظهارها أو إخفاءها في النسخة النهائية.
                </p>

                {[
                  { key: 'showPhoto', label: 'صورة الملف الشخصي (Avatar)', desc: 'إظهار الصورة الشخصية في ترويسة السيرة الذاتية' },
                  { key: 'showContact', label: 'بيانات التواصل الشخصي', desc: 'البريد الإلكتروني والهاتف والموقع الجغرافي وروابط الشبكات' },
                  { key: 'showMetrics', label: 'شريط الأرقام القياسية والإنجازات', desc: 'إبراز سنوات الخبرة والمشاريع المنجزة ونسبة الرضا' },
                ].map((item) => (
                  <label 
                    key={item.key} 
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F2ECE1] dark:hover:bg-[#201E1B] border border-transparent hover:border-[#D4CEBF] dark:hover:border-[#38342D] cursor-pointer transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#121212] dark:text-[#F9F7F2]">{item.label}</div>
                      <div className="text-[10px] font-medium text-[#5A554E] dark:text-[#BDB7AB]">{item.desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={(cvResumeData as any)[item.key]}
                      onChange={(e) => updateCvResumeData({ [item.key]: e.target.checked })}
                      className="w-4 h-4 accent-[#C5A059] rounded cursor-pointer"
                    />
                  </label>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* BOTTOM STICKY BAR: Always accessible Close and Print Actions */}
        <div className="no-print px-4 sm:px-6 py-3 border-t border-[#E2DDD3] dark:border-[#2A2722] bg-white/80 dark:bg-[#1A1916]/80 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResumeModal(false)}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-[#D4CEBF] dark:border-[#38342D] bg-[#F2ECE1] dark:bg-[#252320] text-[#121212] dark:text-[#F9F7F2] hover:bg-[#E5DFD3] dark:hover:bg-[#322F2A] hover:border-[#C5A059] transition-all flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              <span>إغلاق والعودة للصفحة الرئيسية</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                activeTab === 'preview' 
                  ? 'hidden' 
                  : 'border-[#D4CEBF] dark:border-[#38342D] bg-white dark:bg-[#1E1D1A] text-[#121212] dark:text-[#F9F7F2]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline ml-1 text-[#C5A059]" />
              <span>عرض المعاينة المباشرة</span>
            </button>

            <button
              id="cv-bottom-print-btn"
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-[#C5A059] text-[#121212] hover:bg-[#DFCA9B] transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              title="طباعة وتصدير بصيغة PDF"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ كـ PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

