import React from 'react';
import { Search, X, Filter, Sparkles, Briefcase, Code, Compass, DollarSign, Palette } from 'lucide-react';
import { ServiceItem } from '../../../types';

interface ServicesSearchFilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeType: 'all' | 'consulting' | 'service';
  onTypeChange: (type: 'all' | 'consulting' | 'service') => void;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: string[];
  totalServicesCount: number;
  consultingCount: number;
  serviceCount: number;
  filteredCount: number;
}

export const ServicesSearchFilter: React.FC<ServicesSearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  activeType,
  onTypeChange,
  activeCategory,
  onCategoryChange,
  categories,
  totalServicesCount,
  consultingCount,
  serviceCount,
  filteredCount
}) => {
  const hasActiveFilters = searchQuery.trim() !== '' || activeType !== 'all' || activeCategory !== 'all';

  const clearAllFilters = () => {
    onSearchChange('');
    onTypeChange('all');
    onCategoryChange('all');
  };

  return (
    <div className="w-full space-y-5" dir="rtl">
      {/* Upper Bar: Search and Primary Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Field with Clear Button */}
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#8E877D] dark:text-white/40">
            <Search className="w-4 h-4 text-[#8F6E30] dark:text-[#C5A059]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالاسم، المخرجات، أو الكلمات المفتاحية..."
            className="w-full pl-10 pr-10 py-3 bg-[#F4F1EA] dark:bg-[#181818] border border-[#E5E0D8] dark:border-white/10 hover:border-[#C5A059]/40 dark:hover:border-white/20 focus:border-[#C5A059] rounded-xl text-[#121212] dark:text-white placeholder-[#8E877D] dark:placeholder-white/40 text-sm focus:outline-none focus:ring-1 focus:ring-[#C5A059] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#8E877D] hover:text-[#121212] dark:text-white/40 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Primary Type Tabs: الكل | قسم الاستشارات | الخدمات والتطوير */}
        <div className="inline-flex p-1 bg-[#F0ECE1] dark:bg-[#161616] border border-[#E5E0D8] dark:border-white/10 rounded-xl self-start sm:self-center overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => onTypeChange('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeType === 'all'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'text-[#5A554E] dark:text-white/70 hover:text-[#121212] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <span>جميع الخدمات والاستشارات</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
              activeType === 'all' ? 'bg-black/20 text-black' : 'bg-black/10 dark:bg-white/10 text-[#5A554E] dark:text-white/60'
            }`}>
              {totalServicesCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTypeChange('consulting')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeType === 'consulting'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'text-[#5A554E] dark:text-white/70 hover:text-[#121212] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>قسم الاستشارات</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
              activeType === 'consulting' ? 'bg-black/20 text-black' : 'bg-black/10 dark:bg-white/10 text-[#5A554E] dark:text-white/60'
            }`}>
              {consultingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTypeChange('service')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeType === 'service'
                ? 'bg-[#C5A059] text-black shadow-md'
                : 'text-[#5A554E] dark:text-white/70 hover:text-[#121212] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>الخدمات والتطوير التنفيذي</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
              activeType === 'service' ? 'bg-black/20 text-black' : 'bg-black/10 dark:bg-white/10 text-[#5A554E] dark:text-white/60'
            }`}>
              {serviceCount}
            </span>
          </button>
        </div>
      </div>

      {/* Lower Bar: Domain Chips & Results Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E5E0D8] dark:border-white/5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#8E877D] dark:text-white/50 ml-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#8F6E30] dark:text-[#C5A059]" />
            التخصص:
          </span>

          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#C5A059]/20 text-[#8F6E30] dark:text-[#C5A059] border border-[#C5A059]/40 font-bold'
                : 'bg-black/5 dark:bg-white/5 text-[#5A554E] dark:text-white/60 hover:text-[#121212] dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            الكل
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#C5A059]/20 text-[#8F6E30] dark:text-[#C5A059] border border-[#C5A059]/40 font-bold'
                  : 'bg-black/5 dark:bg-white/5 text-[#5A554E] dark:text-white/60 hover:text-[#121212] dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Counter & Clear Filter Action */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs text-[#8E877D] dark:text-white/60">
            النتائج المعروضة: <strong className="text-[#121212] dark:text-white font-bold">{filteredCount}</strong>
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-[#8F6E30] dark:text-[#C5A059] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              إعادة تعيين الفلاتر
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

