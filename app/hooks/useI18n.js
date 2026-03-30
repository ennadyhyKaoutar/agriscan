'use client';

import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useAuthStore } from '@/app/lib/store';

export function useI18n() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useAuthStore();

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return {
    t,
    language,
    changeLanguage,
    isRTL: language === 'ar',
  };
}
