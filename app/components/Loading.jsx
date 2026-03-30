'use client';

import { useI18n } from '@/app/hooks/useI18n';

export function LoadingSpinner() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin" />
      </div>
      <p className="text-gray-600 font-medium">{t('detection.analyzing')}</p>
    </div>
  );
}

export function SkeletonLoader({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-24 animate-pulse" />
      ))}
    </div>
  );
}
