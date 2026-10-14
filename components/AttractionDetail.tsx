import React from 'react';
import { Attraction } from '../types';
import { 
  MapPin, 
  Bookmark, 
  Share2, 
  Star, 
  Navigation, 
  ExternalLink, 
  Clock, 
  Ticket, 
  Calendar, 
  Hourglass, 
  Train, 
  CheckCircle2, 
  Info,
  Globe
} from 'lucide-react';

interface AttractionDetailProps {
  attraction: Attraction | null;
  isSaved: boolean;
  onSave: (id: string) => void;
  onShare: (attraction: Attraction) => void;
  onFocusOnMap?: () => void;
}

export const AttractionDetail: React.FC<AttractionDetailProps> = ({
  attraction,
  isSaved,
  onSave,
  onShare,
  onFocusOnMap
}) => {
  if (!attraction) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200/80 dark:border-gray-700/80 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mb-4">
          <MapPin className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">اختر معلماً سياحياً من القائمة</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mt-1">
          انقر على أي معلم في القائمة أو على الخريطة التفاعلية لعرض تفاصيل الموقع، المحطات، المواعيد والأسعار
        </p>
      </div>
    );
  }

  const googleMapsDirections = `https://www.google.com/maps/dir/?api=1&destination=${attraction.latitude},${attraction.longitude}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm overflow-hidden flex flex-col h-full">
      
      {/* Hero Banner Image */}
      <div className="relative h-60 sm:h-72 w-full flex-shrink-0 bg-gray-900">
        <img
          src={attraction.imageUrl}
          alt={attraction.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {attraction.categoryLabel}
          </span>
          {attraction.isFree && (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              دخول مجاني
            </span>
          )}
        </div>

        {/* Title & Swedish Name */}
        <div className="absolute bottom-4 right-4 left-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1 text-amber-400 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{attraction.rating}</span>
              <span className="text-gray-300 font-normal">({attraction.reviewsCount.toLocaleString()} تقييم)</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            {attraction.name}
          </h2>
          <p className="text-gray-300 font-mono text-xs sm:text-sm mt-0.5">
            {attraction.swedishName}
          </p>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/90 border-b border-gray-200/80 dark:border-gray-700 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Directions via Google Maps */}
          <a
            href={googleMapsDirections}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>الاتجاهات على الخريطة</span>
          </a>

          {/* In-app map focus */}
          {onFocusOnMap && (
            <button
              onClick={onFocusOnMap}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl text-xs font-bold transition-colors"
            >
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>تحديد في الخريطة</span>
            </button>
          )}

          {/* Official Website */}
          {attraction.website && (
            <a
              href={attraction.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl text-xs font-semibold transition-colors"
              title="الموقع الرسمي للمَعلم"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>الموقع الرسمي</span>
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={() => onSave(attraction.id)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isSaved
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            <span>{isSaved ? 'تم الحفظ' : 'حفظ'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => onShare(attraction)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>مشاركة</span>
          </button>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-6">
        
        {/* Quick Facts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          {/* Location */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">العنوان والموقع</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug mt-0.5">{attraction.address}</p>
            </div>
          </div>

          {/* Metro Station */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
              <Train className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">أقرب محطة مترو</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug mt-0.5">{attraction.metroStation}</p>
            </div>
          </div>

          {/* Ticket Price */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <Ticket className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">رسوم الدخول والتذاكر</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug mt-0.5">{attraction.ticketPrice}</p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex-shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">مواعيد وساعات العمل</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug mt-0.5">{attraction.openingHours}</p>
            </div>
          </div>

          {/* Estimated Duration */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex-shrink-0">
              <Hourglass className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">المدة المقترحة للزيارة</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug mt-0.5">{attraction.estimatedDuration}</p>
            </div>
          </div>

          {/* Best Time */}
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex-shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">أفضل وقت للزيارة</p>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-snug mt-0.5">{attraction.bestTimeToVisit}</p>
            </div>
          </div>

        </div>

        {/* Description Section */}
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-blue-500" />
            <span>نبذة وتاريخ المعلم</span>
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
            {attraction.description}
          </p>
          {attraction.detailedInfo && (
            <p className="text-sm text-gray-600 dark:text-gray-300/90 leading-relaxed mt-2.5 bg-blue-50/40 dark:bg-blue-950/20 p-3 rounded-xl border border-blue-100/80 dark:border-blue-900/40">
              {attraction.detailedInfo}
            </p>
          )}
        </div>

        {/* Highlights Section */}
        {attraction.highlights && attraction.highlights.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>أبرز ما يمكنك رؤيته وتجربته</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {attraction.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/60"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-200 leading-relaxed">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {attraction.tags && attraction.tags.length > 0 && (
          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-gray-400 font-semibold ml-1">وسوم:</span>
              {attraction.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AttractionDetail;
