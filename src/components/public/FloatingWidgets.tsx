import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowUp, MessageCircle } from 'lucide-react';

export const FloatingWidgets: React.FC = () => {
  const { profile, theme } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWhatsappNumber = profile.whatsapp.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent('مرحباً أستاذ عبدالله، أود الاستفسار والتواصل معك.')}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          id="scroll-to-top-btn"
          className={`p-3 rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 ${
            theme === 'dark'
              ? 'bg-[#1A1917]/90 border-[#2E2B26] text-[#C7C1B7] hover:text-[#C5A059]'
              : 'bg-[#FFFFFF]/90 border-[#E5E0D8] text-[#5A554E] hover:text-[#8F6E30] artistic-shadow-sm'
          }`}
          aria-label="الرجوع للأعلى"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Floating WhatsApp Button */}
      {profile.whatsapp && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          id="floating-whatsapp-btn"
          className="relative p-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          aria-label="محادثة واتساب مباشرة"
        >
          {/* Subtle pulse wave */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
          <MessageCircle className="w-6 h-6 fill-current relative z-10" />
          
          {/* Tooltip */}
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#121212] text-[#F9F7F2] border border-[#2E2B26] text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg font-serif-display">
            محادثة واتساب فورية
          </span>
        </a>
      )}
    </div>
  );
};

