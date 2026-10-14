import React from 'react';
import { Attraction } from '../types';
import { X, Bookmark, Trash2, MapPin, Copy, ExternalLink, Calendar, Train, Printer } from 'lucide-react';

interface SavedItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedAttractions: Attraction[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onSelectAttraction: (attraction: Attraction) => void;
  onShowToast: (message: string) => void;
}

export const SavedItineraryModal: React.FC<SavedItineraryModalProps> = ({
  isOpen,
  onClose,
  savedAttractions,
  onRemove,
  onClearAll,
  onSelectAttraction,
  onShowToast
}) => {
  if (!isOpen) return null;

  const handleCopyItinerary = async () => {
    if (savedAttractions.length === 0) return;

    let text = `🇸🇪 خطتي السياحية لزيارة ستوكهولم (${savedAttractions.length} معالم):\n\n`;
    savedAttractions.forEach((attr, idx) => {
      text += `${idx + 1}. ${attr.name} (${attr.swedishName})\n`;
      text += `   📍 العنوان: ${attr.address}\n`;
      text += `   🚇 أقرب مترو: ${attr.metroStation}\n`;
      text += `   ⏰ مواعيد العمل: ${attr.openingHours}\n`;
      text += `   🎟️ التذاكر: ${attr.ticketPrice}\n`;
      text += `   🗺️ الخريطة: https://www.google.com/maps?q=${attr.latitude},${attr.longitude}\n\n`;
    });

    try {
      await navigator.clipboard.writeText(text);
      onShowToast('تم نسخ خطة الرحلة كاملة إلى الحافظة');
    } catch {
      onShowToast('فشل في نسخ خطة الرحلة');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-l from-amber-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">
                الأماكن المحفوظة وخطة الرحلة
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                لديك {savedAttractions.length} معالم في جدولك السياحي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedAttractions.length > 0 && (
              <button
                onClick={handleCopyItinerary}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                title="نسخ الخطة"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">نسخ الخطة</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Saved List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedAttractions.length > 0 ? (
            savedAttractions.map((attraction, index) => (
              <div
                key={attraction.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-200/80 dark:border-gray-600/60 hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
              >
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>

                <img
                  src={attraction.imageUrl}
                  alt={attraction.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-sm"
                />

                <div className="flex-1 min-w-0">
                  <h4 
                    onClick={() => {
                      onSelectAttraction(attraction);
                      onClose();
                    }}
                    className="font-bold text-sm text-gray-900 dark:text-white truncate cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    {attraction.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-mono truncate">{attraction.swedishName}</p>
                  
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-0.5">
                      <Train className="w-3 h-3 text-blue-500" />
                      <span>{attraction.metroStation.split(' ')[0]}</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      {attraction.ticketPrice}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <a
                    href={`https://www.google.com/maps?q=${attraction.latitude},${attraction.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                    title="فتح في خرائط جوجل"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => onRemove(attraction.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    title="حذف من المحفوظات"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">قائمة المحفوظات فارغة حالياً</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                انقر على رمز النجمة أو الحفظ في أي معلم لإضافته إلى خطتك السياحية ومشاركته بسهولة
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {savedAttractions.length > 0 && (
          <div className="p-3.5 bg-gray-50 dark:bg-gray-800/90 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1 transition-colors"
            >
              مسح جميع المحفوظات
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              تم
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedItineraryModal;
