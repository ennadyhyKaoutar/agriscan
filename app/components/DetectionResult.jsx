'use client';

import { AlertCircle, CheckCircle, Heart } from 'lucide-react';
import { useI18n } from '@/app/hooks/useI18n';

export function DetectionResult({ result, onSave, onFindMedicine }) {
  const { t, isRTL } = useI18n();

  if (!result) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="text-green-500" size={32} />;
      case 'uncertain':
        return <AlertCircle className="text-yellow-500" size={32} />;
      case 'infected':
        return <AlertCircle className="text-red-500" size={32} />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return colors[severity] || colors.medium;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex items-center gap-4 mb-6">
        {getStatusIcon(result.status)}
        <div>
          <p className="text-sm text-gray-600">{t('detection.result')}</p>
          <p className="text-lg font-semibold text-gray-800">{result.diseaseFR}</p>
          <p className="text-sm text-gray-500">{result.diseaseAR}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">{t('detection.confidence')}</p>
          <div className="mb-2">
            <p className="text-2xl font-bold text-primary-600">
              {Math.round(result.confidence)}%
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">{t('detection.severity')}</p>
          <div className={`px-3 py-2 rounded-lg ${getSeverityColor(result.severity)} inline-block`}>
            <p className="font-semibold text-sm">{t(`detection.severity.${result.severity}`)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">{t('detection.treatment')}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{result.treatment}</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">{t('detection.prevention')}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{result.prevention}</p>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onFindMedicine}
          className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
        >
          🛒 {t('detection.findMedicine')}
        </button>
        <button
          onClick={onSave}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          💾 {t('detection.save')}
        </button>
      </div>
    </div>
  );
}
