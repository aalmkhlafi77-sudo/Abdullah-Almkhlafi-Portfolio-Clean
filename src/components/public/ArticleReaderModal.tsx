import React from 'react';
import { ArticleItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, BookOpen, Quote, Sparkles, Tag } from 'lucide-react';

interface ArticleReaderModalProps {
  article: ArticleItem | null;
  onClose: () => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({ article, onClose }) => {
  const { theme } = useApp();

  if (!article) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex min-h-screen items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto backdrop-blur-md bg-black/85 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-3xl my-auto max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all z-10 ${
          theme === 'dark'
            ? 'bg-[#1A1917] border-[#2E2B26] text-[#F9F7F2]'
            : 'bg-[#FFFFFF] border-[#E5E0D8] text-[#121212]'
        } p-6 sm:p-10`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-6 left-6 p-2 rounded-full border transition-colors ${
            theme === 'dark'
              ? 'bg-[#24221E] border-[#2E2B26] text-[#C7C1B7] hover:text-[#F9F7F2]'
              : 'bg-[#F2EFE9] border-[#E5E0D8] text-[#5A554E] hover:text-[#121212]'
          }`}
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Article Meta */}
        <div className="space-y-4 mb-8 text-right">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className={`px-3 py-1 rounded-full font-semibold border ${
              theme === 'dark'
                ? 'bg-[#C5A059]/20 text-[#DFCA9B] border-[#C5A059]/30'
                : 'bg-[#F2EFE9] text-[#8F6E30] border-[#E5E0D8]'
            }`}>
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-[#8E877D]">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishDate}
            </span>
            <span className="flex items-center gap-1 text-[#8E877D]">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold leading-snug font-serif-display">
            {article.title}
          </h1>

          <p className="text-base text-[#8E877D] leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="relative rounded-2xl overflow-hidden mb-8 aspect-video bg-[#0F0E0C] border border-[#2E2B26] shadow-xs flex items-center justify-center">
            <img
              src={article.coverImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 scale-110 pointer-events-none"
            />
            <img
              src={article.coverImage}
              alt={article.title}
              className={`relative z-10 max-h-full max-w-full w-auto h-auto ${
                article.imageFit === 'cover' ? 'w-full h-full object-cover' : 'object-contain p-2'
              }`}
            />
          </div>
        )}

        {/* Rendered Content Blocks */}
        <div className="space-y-6 text-right leading-relaxed">
          {article.blocks?.map((block) => {
            switch (block.type) {
              case 'h1':
                return (
                  <h2 key={block.id} className="text-2xl sm:text-3xl font-bold mt-8 mb-3 text-[#8F6E30] dark:text-[#DFCA9B] font-serif-display">
                    {block.content}
                  </h2>
                );
              case 'h2':
                return (
                  <h3 key={block.id} className="text-xl sm:text-2xl font-bold mt-6 mb-2 font-serif-display">
                    {block.content}
                  </h3>
                );
              case 'paragraph':
                return (
                  <p key={block.id} className={`text-sm sm:text-base leading-loose ${
                    theme === 'dark' ? 'text-[#C7C1B7]' : 'text-[#5A554E]'
                  }`}>
                    {block.content}
                  </p>
                );
              case 'quote':
                return (
                  <div 
                    key={block.id} 
                    className={`p-6 rounded-2xl border my-6 relative overflow-hidden ${
                      theme === 'dark' 
                        ? 'bg-[#24221E] border-[#C5A059]/30 text-[#DFCA9B]' 
                        : 'bg-[#FAF8F5] border-[#C5A059]/40 text-[#121212]'
                    }`}
                  >
                    <Quote className="w-8 h-8 opacity-20 absolute top-3 left-4 text-[#C5A059]" />
                    <p className="text-base sm:text-lg italic font-medium relative z-10 font-serif-display">
                      "{block.content}"
                    </p>
                    {block.meta?.author && (
                      <span className="block mt-2 text-xs font-bold opacity-75">
                        — {block.meta.author}
                      </span>
                    )}
                  </div>
                );
              case 'image':
                return (
                  <div key={block.id} className="my-6">
                    <div className="relative rounded-2xl overflow-hidden bg-[#0F0E0C] border border-[#E5E0D8] dark:border-[#2E2B26] flex items-center justify-center min-h-64 max-h-[500px]">
                      <img
                        src={block.content}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 scale-110 pointer-events-none"
                      />
                      <img
                        src={block.content}
                        alt={block.meta?.caption || ''}
                        className="relative z-10 max-h-[500px] max-w-full w-auto h-auto object-contain p-2"
                      />
                    </div>
                    {block.meta?.caption && (
                      <span className="block text-center text-xs text-[#8E877D] mt-2">
                        {block.meta.caption}
                      </span>
                    )}
                  </div>
                );
              case 'table':
                const rows = block.content.split('\n').map(r => r.split('|').map(c => c.trim()));
                const [headers, ...bodyRows] = rows;
                return (
                  <div key={block.id} className="my-6 overflow-x-auto rounded-2xl border border-[#E5E0D8] dark:border-[#2E2B26]">
                    <table className="w-full text-xs sm:text-sm text-right">
                      {headers && (
                        <thead className={theme === 'dark' ? 'bg-[#24221E] text-[#DFCA9B]' : 'bg-[#F2EFE9] text-[#121212]'}>
                          <tr>
                            {headers.map((h, i) => (
                              <th key={i} className="p-3 font-bold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        {bodyRows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-t border-[#E5E0D8] dark:border-[#282622]">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className={`p-3 ${theme === 'dark' ? 'text-[#C7C1B7]' : 'text-[#5A554E]'}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              case 'cta':
                return (
                  <div 
                    key={block.id}
                    className={`my-8 p-6 rounded-2xl border text-center space-y-4 ${
                      theme === 'dark'
                        ? 'bg-[#24221E] border-[#C5A059]/40 text-[#F9F7F2]'
                        : 'bg-[#F9F7F2] border-[#E5E0D8] text-[#121212]'
                    }`}
                  >
                    <p className="text-sm sm:text-base font-bold font-serif-display">{block.content}</p>
                    {block.meta?.buttonText && (
                      <a
                        href={block.meta.buttonLink || '#contact'}
                        onClick={onClose}
                        className="inline-block px-5 py-2.5 rounded-xl bg-[#C5A059] hover:bg-[#B8934A] text-[#121212] font-bold text-xs shadow-xs transition-all"
                      >
                        {block.meta.buttonText}
                      </a>
                    )}
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-[#E5E0D8] dark:border-[#282622]">
          <Tag className="w-3.5 h-3.5 text-[#8E877D]" />
          {article.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`text-xs px-2.5 py-1 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-[#24221E] border-[#2E2B26] text-[#C7C1B7]' 
                  : 'bg-[#F2EFE9] border-[#E5E0D8] text-[#5A554E]'
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

