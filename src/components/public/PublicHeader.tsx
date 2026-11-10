import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Menu, X, Sun, Moon, FileText, Settings, Lock } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const { 
    profile, 
    theme, 
    toggleTheme, 
    setShowResumeModal, 
    isAuthenticated, 
    openSettingsModal,
    setShowLoginModal 
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [scrolled, setScrolled] = useState(false);
  const [topBarHeight, setTopBarHeight] = useState<number>(0);

  // Measure top global bar height dynamically (0 when hidden for normal visitors)
  useEffect(() => {
    const updateTopOffset = () => {
      const topBar = document.getElementById('top-global-bar');
      if (topBar && isAuthenticated) {
        setTopBarHeight(topBar.offsetHeight);
      } else {
        setTopBarHeight(0);
      }
    };

    updateTopOffset();
    window.addEventListener('resize', updateTopOffset);
    const observer = new ResizeObserver(updateTopOffset);
    const topBar = document.getElementById('top-global-bar');
    if (topBar) observer.observe(topBar);

    return () => {
      window.removeEventListener('resize', updateTopOffset);
      observer.disconnect();
    };
  }, [isAuthenticated]);

  // Monitor scroll position for active section spy & elevated header shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);

      const sections = ['hero', 'about', 'expertise', 'integrated-solutions', 'projects', 'articles', 'contact'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 180) {
            setActiveSection(sectionId === 'integrated-solutions' ? 'expertise' : sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'hero', label: 'الرئيسية', href: '#hero' },
    { id: 'about', label: 'نبذة عني', href: '#about' },
    { id: 'expertise', label: 'الخدمات والحلول', href: '#expertise' },
    { id: 'projects', label: 'أعمالي', href: '#projects' },
    { id: 'articles', label: 'المقالات', href: '#articles' },
    { id: 'contact', label: 'تواصل معي', href: '#contact' },
  ];

  return (
    <header 
      id="public-header"
      style={{ top: `${topBarHeight}px` }}
      className={`sticky z-40 w-full transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-[#121212]/95 text-[#F9F7F2] border-b border-[#2A2722]' 
          : 'bg-[#F9F7F2]/95 text-[#121212] border-b border-[#E2DDD3]'
      } backdrop-blur-xl ${scrolled ? 'shadow-xl shadow-black/15 border-b-[#C5A059]/40' : ''}`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo / Monogram */}
        <a 
          href="#hero" 
          id="header-brand-logo"
          className="flex items-center gap-3 group cursor-pointer shrink-0"
        >
          {profile.useImageLogo && profile.logoUrl ? (
            <div className="relative flex items-center justify-center rounded-xl overflow-hidden border border-[#C5A059]/30 bg-[#121212]/80 p-0.5 shadow-sm transition-transform group-hover:scale-105 shrink-0">
              <img 
                src={profile.logoUrl} 
                alt={profile.name || "Brand Logo"} 
                className="w-auto object-contain rounded-lg"
                style={{ height: `${profile.logoHeight || 38}px`, maxHeight: '44px' }}
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl font-serif-display transition-transform group-hover:scale-105 border overflow-hidden shadow-xs shrink-0 ${
              theme === 'dark'
                ? 'bg-[#1A1917] border-[#C5A059]/40 text-[#DFCA9B]'
                : 'bg-[#FFFFFF] border-[#C5A059]/40 text-[#9C7934]'
            }`}>
              <span className="tracking-tighter">A</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#C5A059]/10 to-transparent pointer-events-none" />
            </div>
          )}

          <div className="flex flex-col text-right">
            <span className="font-bold text-base sm:text-lg tracking-tight transition-colors group-hover:text-[#C5A059] font-serif-display whitespace-nowrap">
              {profile.name}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#8C867D] dark:text-[#9C9589] -mt-0.5 tracking-wider font-medium uppercase truncate max-w-[150px] sm:max-w-none">
              {profile.englishName}
            </span>
          </div>
        </a>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? theme === 'dark' 
                      ? 'text-[#C5A059] bg-[#C5A059]/15 font-bold' 
                      : 'text-[#8F6E30] bg-[#C5A059]/15 font-bold'
                    : theme === 'dark'
                      ? 'text-[#C7C1B7] hover:text-[#E8D4A8] hover:bg-[#1A1917]'
                      : 'text-[#5A554E] hover:text-[#121212] hover:bg-[#F2EFE9]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 right-3 left-3 h-0.5 bg-[#C5A059] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Left Side: Actions & Discreet Admin Portal Indicator */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
          
          {/* CV Download / View Button */}
          <button
            id="header-cv-btn"
            onClick={() => setShowResumeModal(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all shadow-xs cursor-pointer ${
              theme === 'dark'
                ? 'border-[#C5A059]/40 bg-[#C5A059]/10 text-[#DFCA9B] hover:bg-[#C5A059]/20'
                : 'border-[#C5A059]/50 bg-[#FAF8F5] text-[#8F6E30] hover:bg-[#F2EFE9]'
            }`}
            title="تحميل / استعراض السيرة الذاتية (CV & PDF)"
          >
            <FileText className="w-4 h-4 text-[#C5A059]" />
            <span className="hidden lg:inline whitespace-nowrap">السيرة الذاتية (CV)</span>
            <span className="lg:hidden">CV</span>
          </button>

          {/* Admin Indicator (Clean, Unobtrusive) */}
          {isAuthenticated ? (
            <button
              id="header-admin-portal-btn"
              onClick={() => openSettingsModal('profile')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
              title="لوحة التحكم النشطة"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <Settings className="w-3.5 h-3.5 text-[#8F6E30] dark:text-[#C5A059]" />
              <span className="hidden xl:inline whitespace-nowrap">لوحة التحكم</span>
            </button>
          ) : (
            <button
              id="header-admin-login-btn"
              onClick={() => setShowLoginModal(true)}
              className="p-2 rounded-xl border border-transparent hover:border-black/10 dark:hover:border-white/10 text-[#8E877D] dark:text-white/40 hover:text-[#8F6E30] dark:hover:text-[#C5A059] transition-all cursor-pointer"
              title="تسجيل دخول الإدارة"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-[#282622] text-[#C5A059] hover:bg-[#1A1917]'
                : 'border-[#E5E0D8] text-[#5A554E] hover:text-[#121212] hover:bg-[#F2EFE9]'
            }`}
            title="تبديل المظهر"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Portfolio Anchor CTA */}
          <a
            id="header-cta-btn"
            href="#projects"
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group border shadow-xs whitespace-nowrap"
            style={{
              background: theme === 'dark' ? '#C5A059' : '#121212',
              borderColor: theme === 'dark' ? '#C5A059' : '#121212',
              color: theme === 'dark' ? '#121212' : '#F9F7F2'
            }}
          >
            <span className="font-semibold">استعرض أعمالي</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border ${
              theme === 'dark' ? 'border-[#282622] text-[#C5A059]' : 'border-[#E5E0D8] text-[#5A554E]'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg border ${
              theme === 'dark' ? 'border-[#282622] text-[#C7C1B7]' : 'border-[#E5E0D8] text-[#5A554E]'
            }`}
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`sm:hidden border-b px-4 py-5 space-y-3 shadow-2xl ${
          theme === 'dark' ? 'bg-[#1A1917] border-[#282622]' : 'bg-[#F9F7F2] border-[#E5E0D8]'
        }`}>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-[#C5A059]/20 text-[#C5A059] font-bold' 
                      : theme === 'dark' ? 'text-[#C7C1B7] hover:bg-[#282622]' : 'text-[#121212] hover:bg-[#F2EFE9]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
          <div className="pt-3 border-t border-[#C5A059]/20 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowResumeModal(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] font-bold text-sm"
            >
              <FileText className="w-4 h-4" />
              <span>تحميل السيرة الذاتية (PDF / CV)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAuthenticated) {
                  openSettingsModal('profile');
                } else {
                  setShowLoginModal(true);
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#C5A059]/40 bg-black/5 dark:bg-white/5 text-xs font-bold transition-all"
            >
              {isAuthenticated ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Settings className="w-4 h-4 text-[#C5A059]" />
                  <span>فتح لوحة التحكم والإعدادات</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#C5A059]" />
                  <span>دخول الإدارة / لوحة التحكم</span>
                </>
              )}
            </button>

            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#C5A059] text-[#121212] font-bold text-sm"
            >
              <span>استعرض أعمالي</span>
              <ArrowLeft className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

