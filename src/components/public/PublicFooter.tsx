import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Github, Mail, Youtube, Facebook, Music2, Ghost, Linkedin, Twitter } from 'lucide-react';
import { MotionLeft } from '../common/MotionLeft';
import { motion, AnimatePresence } from 'motion/react';

export const PublicFooter: React.FC = () => {
  const { profile, theme } = useApp();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Dynamic social media list with brand-specific hover styles and tooltips
  const socialLinks = [
    {
      id: 'github',
      name: 'GitHub',
      url: profile.socials?.github,
      icon: <Github className="w-4 h-4" />,
      colorClass: 'hover:text-black dark:hover:text-white hover:bg-[#24292e]/10 dark:hover:bg-white/10 hover:border-[#24292e] dark:hover:border-white',
      tooltip: 'تابع مشاريعي على GitHub',
      brandColor: '#24292e'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: profile.socials?.facebook,
      icon: <Facebook className="w-4 h-4" />,
      colorClass: 'hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]',
      tooltip: 'تابعني على Facebook',
      brandColor: '#1877F2'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: profile.socials?.linkedin,
      icon: <Linkedin className="w-4 h-4" />,
      colorClass: 'hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]',
      tooltip: 'تواصل معي على LinkedIn',
      brandColor: '#0A66C2'
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      url: profile.socials?.x,
      icon: <Twitter className="w-4 h-4" />,
      colorClass: 'hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 hover:border-black dark:hover:border-white',
      tooltip: 'تابعني على X',
      brandColor: '#000000'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: profile.socials?.youtube,
      icon: <Youtube className="w-4 h-4" />,
      colorClass: 'hover:text-[#FF0000] hover:bg-[#FF0000]/10 hover:border-[#FF0000]',
      tooltip: 'اشترك في قناتي على YouTube',
      brandColor: '#FF0000'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      url: profile.socials?.tiktok,
      icon: <Music2 className="w-4 h-4" />,
      colorClass: 'hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 hover:border-black dark:hover:border-white',
      tooltip: 'تابعني على TikTok',
      brandColor: '#000000'
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      url: profile.socials?.snapchat,
      icon: <Ghost className="w-4 h-4" />,
      colorClass: 'hover:text-[#E8C200] hover:bg-[#FFFC00]/10 hover:border-[#E8C200]',
      tooltip: 'تابعني على Snapchat',
      brandColor: '#FFFC00'
    },
    {
      id: 'email',
      name: 'Email',
      url: profile.socials?.email || (profile.email ? `mailto:${profile.email}` : undefined),
      icon: <Mail className="w-4 h-4" />,
      colorClass: 'hover:text-[#EA4335] hover:bg-[#EA4335]/10 hover:border-[#EA4335]',
      tooltip: 'راسلني عبر البريد الإلكتروني',
      brandColor: '#EA4335'
    }
  ].filter(link => link.url);

  return (
    <footer 
      id="public-footer"
      className={`border-t py-12 transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-[#0F0E0D] border-[#201E1A] text-[#8E877D]' 
          : 'bg-[#F4F1EA] border-[#E5E0D8] text-[#5A554E]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionLeft distance={-30}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Monogram / Brand */}
            <div className="flex items-center gap-3">
              {profile.useImageLogo && profile.logoUrl ? (
                <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#C5A059]/40 bg-[#121212]/80 p-0.5 overflow-hidden shadow-xs">
                  <img 
                    src={profile.logoUrl} 
                    alt={profile.name} 
                    className="w-full h-full object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059] font-serif-display">
                  {profile.name ? profile.name.charAt(0) : 'A'}
                </div>
              )}
              <div className="text-right">
                <span className="font-bold text-sm text-[#121212] dark:text-[#F9F7F2] block font-serif-display">
                  {profile.name}
                </span>
                <span className="text-[11px] text-[#8E877D]">
                  {profile.role}
                </span>
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
              <a href="#hero" className="hover:text-[#C5A059] transition-colors duration-200">الرئيسية</a>
              <a href="#about" className="hover:text-[#C5A059] transition-colors duration-200">نبذة عني</a>
              <a href="#projects" className="hover:text-[#C5A059] transition-colors duration-200">أعمالي</a>
              <a href="#expertise" className="hover:text-[#C5A059] transition-colors duration-200">خبراتي</a>
              <a href="#articles" className="hover:text-[#C5A059] transition-colors duration-200">المقالات</a>
              <a href="#contact" className="hover:text-[#C5A059] transition-colors duration-200">تواصل معي</a>
            </div>

            {/* Socials & Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-xs">
              <div className="flex items-center gap-3 relative">
                {socialLinks.map((link) => (
                  <div 
                    key={link.id} 
                    className="relative"
                    onMouseEnter={() => setHoveredId(link.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Tooltip */}
                    <AnimatePresence>
                      {hoveredId === link.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                          className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-[#121212] text-white text-[10px] rounded-lg whitespace-nowrap shadow-md pointer-events-none z-50 flex items-center justify-center"
                        >
                          <span className="font-sans font-medium">{link.tooltip}</span>
                          {/* Triangle Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#121212]" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Animated Anchor */}
                    <motion.a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.name}
                      whileHover={{ scale: 1.15, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      className={`flex items-center justify-center w-8 h-8 rounded-lg border border-[#E5E0D8] dark:border-[#201E1A] text-[#8E877D] transition-colors duration-200 ${link.colorClass}`}
                    >
                      {link.icon}
                    </motion.a>
                  </div>
                ))}
              </div>

              <span className="text-[#8E877D] text-center sm:text-right">
                جميع الحقوق محفوظة © {new Date().getFullYear()} {profile.name}
              </span>
            </div>
          </div>
        </MotionLeft>
      </div>
    </footer>
  );
};

