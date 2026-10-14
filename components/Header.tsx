import React from 'react';
import { ViewMode } from '../types';
import { Map, LayoutGrid, SplitSquareVertical, Bookmark, Compass, Sun, Moon, Search, Sparkles } from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  savedCount: number;
  showSavedOnly: boolean;
  onToggleSavedFilter: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  savedCount,
  showSavedOnly,
  onToggleSavedFilter,
  searchQuery,
  onSearchChange,
  isDark,
  onToggleDark
}) => {
  return (
    <header className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-700/80 sticky top-0 z-40 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    دليل ستوكهولم السياحي
                  </h1>
                  <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                    Stockholm 🇸🇪
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                  استكشف أجمل المعالم، والمواقع على الخريطة التفاعلية، واحفظ خطتك
                </p>
              </div>
            </div>

            {/* Mobile Dark Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={onToggleDark}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors"
                title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
              >
                {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Controls: Search, View Mode, Saved Filter */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[180px]">
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="ابحث عن معلم، متحف، قصر..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-3 pr-9 py-2 bg-gray-50 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-xl text-xs sm:text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Saved Toggle Button */}
            <button
              onClick={onToggleSavedFilter}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                showSavedOnly
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                  : 'bg-gray-50 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}
              title="عرض الأماكن المحفوظة فقط"
            >
              <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-white' : ''}`} />
              <span>المحفوظات</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                showSavedOnly ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
              }`}>
                {savedCount}
              </span>
            </button>

            {/* View Mode Switcher */}
            <div className="flex bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl border border-gray-200/80 dark:border-gray-600">
              <button
                onClick={() => onViewModeChange('split')}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'split'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="عرض متكامل (خريطة وتفاصيل)"
              >
                <SplitSquareVertical className="w-4 h-4" />
                <span className="hidden md:inline">مزدوج</span>
              </button>

              <button
                onClick={() => onViewModeChange('map')}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'map'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="عرض الخريطة الكاملة"
              >
                <Map className="w-4 h-4" />
                <span className="hidden md:inline">الخريطة</span>
              </button>

              <button
                onClick={() => onViewModeChange('cards')}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
                title="عرض شبكة البطاقات"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden md:inline">بطاقات</span>
              </button>
            </div>

            {/* Desktop Dark Toggle */}
            <button
              onClick={onToggleDark}
              className="hidden md:flex p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
              title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
