import React, { useState } from 'react';
import { Attraction } from '../types';
import { X, Copy, Check, Share2, MessageCircle, Send, MapPin, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  attraction: Attraction | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  attraction,
  isOpen,
  onClose,
  onShowToast
}) => {
  const [copiedType, setCopiedType] = useState<'link' | 'summary' | null>(null);

  if (!isOpen || !attraction) return null;

  const mapsUrl = `https://www.google.com/maps?q=${attraction.latitude},${attraction.longitude}`;
  const shareText = `🌟 وجهة سياحية في ستوكهولم: ${attraction.name} (${attraction.swedishName})\n\n📍 الموقع: ${attraction.address}\n🚇 أقرب محطة مترو: ${attraction.metroStation}\n🎟️ التذاكر: ${attraction.ticketPrice}\n⏰ ساعات العمل: ${attraction.openingHours}\n\n🗺️ رابط الخريطة:\n${mapsUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(mapsUrl);
      setCopiedType('link');
      onShowToast('تم نسخ رابط الموقع على الخريطة بنجاح');
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error(err);
      onShowToast('فشل في نسخ الرابط');
    }
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedType('summary');
      onShowToast('تم نسخ تفاصيل المكان كاملة للحافظة');
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.error(err);
      onShowToast('فشل في نسخ التفاصيل');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: attraction.name,
          text: `${attraction.name} - ${attraction.description}`,
          url: mapsUrl
        });
        onClose();
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopySummary();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(mapsUrl)}&text=${encodeURIComponent(`${attraction.name} - دليل ستوكهولم السياحي`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 dark:border-gray-700 transition-all scale-100"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-950/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">مشاركة الوجهة السياحية</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{attraction.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Quick share options */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-transform active:scale-95 shadow-sm shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>عبر واتساب</span>
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm transition-transform active:scale-95 shadow-sm shadow-sky-500/20"
            >
              <Send className="w-4 h-4" />
              <span>عبر تيليجرام</span>
            </a>
          </div>

          {/* Native Web Share */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm shadow-blue-600/20"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة سريعة عبر تطبيقات الهاتف</span>
            </button>
          )}

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            <span className="flex-shrink mx-3 text-xs text-gray-400 dark:text-gray-500">أو نسخ البيانات</span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          {/* Copy link */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200/80 dark:border-gray-600/50">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <div className="text-right truncate">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">رابط موقع المكان (خرائط جوجل)</p>
                <p className="text-[11px] text-gray-400 truncate font-mono" dir="ltr">{mapsUrl}</p>
              </div>
            </div>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-600 rounded-lg text-xs font-bold transition-colors"
            >
              {copiedType === 'link' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>
          </div>

          {/* Copy full formatted text */}
          <button
            onClick={handleCopySummary}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-xs transition-colors border border-gray-200 dark:border-gray-600"
          >
            {copiedType === 'summary' ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">تم نسخ كامل التفاصيل!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-gray-500" />
                <span>نسخ ملخص الزيارة والتعليمات كاملة</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
