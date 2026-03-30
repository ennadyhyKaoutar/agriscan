'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/app/lib/store';

export function usePrecachePages() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user && 'serviceWorker' in navigator) {
      const sendMessage = () => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_ALL',
          });
          console.log('✅ Pages préchargées pour offline');
        }
      };

      setTimeout(sendMessage, 500);

      navigator.serviceWorker.addEventListener('controllerchange', sendMessage);

      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', sendMessage);
      };
    }
  }, [user]);
}