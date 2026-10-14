import React from 'react';
import { Attraction } from '../types';
import { Star, Bookmark, Share2, MapPin, Train, Clock, ArrowUpRight } from 'lucide-react';

interface AttractionsGridProps {
  attractions: Attraction[];
  savedIds: Set<string>;
  onSelect: (attraction: Attraction) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onShare: (attraction: Attraction, e: React.MouseEvent) => void;
}

export const AttractionsGrid: React.FC<AttractionsGridProps> = ({
  attractions,
  savedIds,
  onSelect,
  onToggleSave,
  onShare
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
      {attractions.map((attraction) => {
        const isSaved = savedIds.has(attraction.id);

        return (
          <div
            key={attraction.id}
            onClick={() => onSelect(attraction)}
            className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
          >
            {/* Image banner */}
            <div className="relative h-44 w-full overflow-hidden bg-gray-900">
              <img
                src={attraction.imageUrl}
                alt={attraction.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

              {/* Category & Free Badges */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {attraction.categoryLabel}
                </span>
                {attraction.isFree && (
                  <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    مجاني
                  </span>
                )}
              </div>

              {/* Bookmark Button */}
              <button
                onClick={(e) => onToggleSave(attraction.id, e)}
                className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md transition-all ${
                  isSaved
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-black/40 text-white hover:bg-black/70'
                }`}
                title={isSaved ? 'إزالة من المحفوظات' : 'حفظ في المفضلة'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              </button>

              {/* Title & Rating on bottom of image */}
              <div className="absolute bottom-3 right-3 left-3 text-white">
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{attraction.rating}</span>
                </div>
                <h3 className="font-bold text-base truncate leading-tight">{attraction.name}</h3>
                <p className="text-[11px] text-gray-300 font-mono truncate">{attraction.swedishName}</p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                {attraction.description}
              </p>

              {/* Details & Actions */}
              <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700/60">
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1 truncate">
                    <Train className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{attraction.metroStation.split('(')[0]}</span>
                  </span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {attraction.ticketPrice.includes('مجاني') ? 'دخول مجاني' : attraction.ticketPrice.split(' ')[0] + ' SEK'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => onSelect(attraction)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-colors"
                  >
                    <span>التفاصيل والخريطة</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => onShare(attraction, e)}
                    className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors"
                    title="مشاركة"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttractionsGrid;
