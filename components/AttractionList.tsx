import React from 'react';
import { Attraction, Category } from '../types';
import { Star, Bookmark, MapPin, Train, Clock, Sparkles } from 'lucide-react';

interface AttractionListProps {
  attractions: Attraction[];
  savedIds: Set<string>;
  selectedId?: string | null;
  onSelect: (attraction: Attraction) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'historical', label: 'معالم تاريخية' },
  { id: 'museums', label: 'متاحف وفنون' },
  { id: 'nature', label: 'طبيعة وحدائق' },
  { id: 'palaces', label: 'قصور ملكية' },
  { id: 'views', label: 'إطلالات ومناظر' },
  { id: 'entertainment', label: 'ترفيه وتسوق' }
];

export const AttractionList: React.FC<AttractionListProps> = ({
  attractions,
  savedIds,
  selectedId,
  onSelect,
  onToggleSave,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm overflow-hidden">
      
      {/* Category Pills Header */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-700/70 bg-gray-50/70 dark:bg-gray-800/50">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200/60 dark:border-gray-600'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List count indicator */}
      <div className="px-4 py-2 bg-gray-50/40 dark:bg-gray-800/30 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700/50">
        <span>المعالم المتاحة ({attractions.length})</span>
        <span className="text-[11px]">انقر لعرض الموقع والتفاصيل</span>
      </div>

      {/* Scrollable Attractions List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/60">
        {attractions.length > 0 ? (
          attractions.map((attraction) => {
            const isSelected = selectedId === attraction.id;
            const isSaved = savedIds.has(attraction.id);

            return (
              <div
                key={attraction.id}
                onClick={() => onSelect(attraction)}
                className={`group p-3 sm:p-3.5 flex gap-3 cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-blue-950/40 border-r-4 border-blue-600'
                    : 'hover:bg-gray-50/80 dark:hover:bg-gray-700/40'
                }`}
              >
                {/* Thumbnail Image */}
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={attraction.imageUrl}
                    alt={attraction.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {attraction.isFree && (
                    <span className="absolute bottom-1 right-1 bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                      مجاني
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate leading-snug">
                          {attraction.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono truncate">
                          {attraction.swedishName}
                        </p>
                      </div>

                      {/* Bookmark Button */}
                      <button
                        onClick={(e) => onToggleSave(attraction.id, e)}
                        title={isSaved ? 'إزالة من المحفوظات' : 'حفظ المعلم'}
                        className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                          isSaved
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1 mt-1 leading-relaxed">
                      {attraction.description}
                    </p>
                  </div>

                  {/* Metadata Tags */}
                  <div className="flex items-center gap-2 mt-2 pt-1 border-t border-gray-100 dark:border-gray-700/50 text-[11px] text-gray-500 dark:text-gray-400 flex-wrap">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{attraction.rating}</span>
                    </span>

                    <span className="flex items-center gap-1 truncate max-w-[130px]">
                      <Train className="w-3 h-3 text-blue-500" />
                      <span className="truncate">{attraction.metroStation.split(' ')[0]}</span>
                    </span>

                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded text-[10px]">
                      {attraction.categoryLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <Sparkles className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">لا توجد معالم تطابق بحثك</p>
            <p className="text-xs text-gray-400 mt-1">جرّب تغيير فئة التصنيف أو مسح نص البحث</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttractionList;
