import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ProjectItem } from '../../../types';
import { 
  FolderGit2, 
  ExternalLink, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles,
  Layers
} from 'lucide-react';
import { MotionLeft } from '../../common/MotionLeft';

export const ServicesRelatedProjects: React.FC = () => {
  const { projects } = useApp();
  const [activeDomainFilter, setActiveDomainFilter] = useState<string>('all');

  // Extract unique project categories
  const categories = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));

  const filteredProjects = activeDomainFilter === 'all'
    ? projects.slice(0, 6)
    : projects.filter(p => p.category === activeDomainFilter).slice(0, 6);

  if (projects.length === 0) return null;

  return (
    <section id="services-related-projects" className="w-full py-16 md:py-24 border-t border-[#E5E0D8] dark:border-white/5 relative transition-colors duration-300" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#8F6E30] dark:text-[#C5A059] text-xs font-semibold mb-3">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>أعمال ونماذج تنفيذية حية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#121212] dark:text-white tracking-tight leading-snug">
              مشاريع واقعية تُبرهن على جودة الخدمات والحلول
            </h2>
            <p className="text-[#5A554E] dark:text-white/70 text-sm sm:text-base mt-2.5 max-w-2xl leading-relaxed">
              شاهد كيف تحوّلت الاستشارات والخدمات التقنية والتصميمية إلى منتجات وأنظمة ناجحة تعمل في أرض الواقع.
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveDomainFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeDomainFilter === 'all'
                  ? 'bg-[#C5A059] text-black shadow-md'
                  : 'bg-black/5 dark:bg-white/5 text-[#5A554E] dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10 hover:text-[#121212] dark:hover:text-white'
              }`}
            >
              جميع المشاريع
            </button>
            {categories.slice(0, 4).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveDomainFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeDomainFilter === cat
                    ? 'bg-[#C5A059] text-black shadow-md'
                    : 'bg-black/5 dark:bg-white/5 text-[#5A554E] dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10 hover:text-[#121212] dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <MotionLeft
              key={project.id}
              immediate
              delay={0.08 * index}
              distance={-20}
              className="h-full flex"
            >
              <div className="h-full w-full bg-[#FFFFFF] dark:bg-[#181818] hover:bg-[#FAF8F5] dark:hover:bg-[#1A1A1A] border border-[#E5E0D8] dark:border-white/10 hover:border-[#C5A059]/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 group artistic-shadow-sm dark:shadow-lg">
                {/* Project Image Banner */}
                {project.imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden bg-[#0F0E0C] flex items-center justify-center">
                    {/* Ambient Glow */}
                    <img
                      src={project.imageUrl}
                      alt=""
                      aria-hidden="true"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 scale-110 pointer-events-none"
                    />
                    {/* Uncropped Foreground Image */}
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className={`relative z-10 max-h-full max-w-full w-auto h-auto ${
                        project.imageFit === 'cover' ? 'w-full h-full object-cover' : 'object-contain p-1.5'
                      } transition-transform duration-500 group-hover:scale-105`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-15 pointer-events-none" />
                    
                    <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[#C5A059] border border-white/10 z-20">
                      {project.category}
                    </span>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#121212] dark:text-white group-hover:text-[#C5A059] transition-colors mb-2 leading-snug font-serif-display">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#5A554E] dark:text-white/70 leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Deliverables / Tags */}
                    {Array.isArray(project.tags) && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/5 text-[#8E877D] dark:text-white/60 border border-[#E5E0D8] dark:border-transparent"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Links / Action */}
                  <div className="pt-4 border-t border-[#E5E0D8] dark:border-white/5 flex items-center justify-between mt-auto">
                    {(project.externalUrl || project.link || project.videoUrl) ? (
                      <a
                        href={project.externalUrl || project.link || project.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8F6E30] dark:text-[#C5A059] hover:underline"
                      >
                        <span>زيارة المنصة الحية</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-[#8E877D] dark:text-white/40">مشروع معتمد</span>
                    )}

                    <span className="text-xs text-[#8E877D] dark:text-white/50 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>مكتمل ومنفذ</span>
                    </span>
                  </div>
                </div>
              </div>
            </MotionLeft>
          ))}
        </div>
      </div>
    </section>
  );
};

