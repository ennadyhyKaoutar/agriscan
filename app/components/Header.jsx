'use client';

import { Globe, Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/app/hooks/useOnlineStatus';
import { useI18n } from '@/app/hooks/useI18n';

export function Header() {
  const isOnline = useOnlineStatus();
  const { language, changeLanguage, isRTL, t } = useI18n();

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-30 ${
      isRTL ? 'rtl' : 'ltr'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            } animate-pulse`}
          />
          <span className="text-sm text-gray-600">
            {isOnline ? t('common.online') : t('common.offline')}
          </span>
        </div>

        <button
          onClick={() => changeLanguage(language === 'fr' ? 'ar' : 'fr')}
          className="flex items-center gap-2 px-3 py-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
          aria-label="Changer la langue"
        >
          <Globe size={18} />
          <span className="text-sm font-medium">
            {language === 'fr' ? 'العربية' : 'Français'}
          </span>
        </button>
      </div>
    </header>
  );
}
