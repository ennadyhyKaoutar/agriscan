'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/app/lib/i18n';
import { useAuthStore } from '@/app/lib/store';
import { useEffect } from 'react';

export function Providers({ children }) {
  useEffect(() => {
    const language = useAuthStore.getState().language;
    i18n.changeLanguage(language);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
