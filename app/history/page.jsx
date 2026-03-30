'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDetectionStore } from '@/app/lib/store';
import { useI18n } from '@/app/hooks/useI18n';
import { DetectionHistoryCard } from '@/app/components/DetectionHistoryCard';
import { deleteDetection } from '@/app/lib/api';

const CROPS = ['all', 'tomato', 'potato', 'pepper'];

export default function HistoryPage() {
  const router = useRouter();
  const detections = useDetectionStore((state) => state.detections);
  const removeDetection = useDetectionStore((state) => state.deleteDetection);
  const { t, isRTL } = useI18n();

  const [selectedCrop, setSelectedCrop] = useState('all');

  const filteredDetections = useMemo(() => {
    if (selectedCrop === 'all') return detections;
    return detections.filter((d) => d.crop === selectedCrop);
  }, [detections, selectedCrop]);

  const handleDelete = async (id) => {
    try {
      await deleteDetection(id);
      removeDetection(id);
    } catch (error) {
      console.error('Error deleting detection:', error);
    }
  };

  const getCropLabel = (crop) => {
    const labels = {
      all: t('history.filterAll'),
      tomato: t('crops.tomato'),
      potato: t('crops.potato'),
      pepper: t('crops.pepper'),
    };
    return labels[crop] || crop;
  };

  const getCropEmoji = (crop) => {
    const emojis = {
      tomato: '🍅',
      potato: '🥔',
      pepper: '🫑',
    };
    return emojis[crop] || '🌱';
  };

  return (
    <div className={`min-h-screen bg-background py-8 px-4 pb-20 md:pb-8 ${
      isRTL ? 'rtl' : 'ltr'
    }`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('history.title')}</h1>
        <p className="text-gray-600 mb-8">Consultez l'historique de vos analyses</p>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Filtrer par culture
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CROPS.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCrop === crop
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {crop !== 'all' && `${getCropEmoji(crop)} `}
                {getCropLabel(crop)}
              </button>
            ))}
          </div>
        </div>

        {/* Detections List */}
        {filteredDetections.length > 0 ? (
          <div className="space-y-4">
            {filteredDetections.map((detection) => (
              <DetectionHistoryCard
                key={detection.id}
                detection={detection}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
            <p className="text-gray-600 mb-4">{t('history.noPreviousDetections')}</p>
            <button
              onClick={() => router.push('/detection')}
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              {t('home.analyzePlant')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
