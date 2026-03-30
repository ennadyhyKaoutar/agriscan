'use client';

import { formatDistanceToNow } from 'date-fns';
import { fr, ar } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { useI18n } from '@/app/hooks/useI18n';

export function DetectionHistoryCard({ detection, onDelete }) {
  const { t, language } = useI18n();

  const getStatusBadge = (status) => {
    const badges = {
      healthy: { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Sain' },
      uncertain: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⚠️ Incertain' },
      infected: { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Infecté' },
    };
    return badges[status] || badges.uncertain;
  };

  const badge = getStatusBadge(detection.status);
  const locale = language === 'fr' ? fr : ar;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
          {detection.imageUrl && (
            <img
              src={detection.imageUrl}
              alt={detection.disease}
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>

        {/* Contenu */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-800">{detection.diseaseFR}</p>
              <p className="text-sm text-gray-500">{detection.diseaseAR}</p>
            </div>
            <button
              onClick={() => onDelete(detection.id)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
            <span className="text-xs text-gray-500">
              {detection.crop === 'tomato' && '🍅'}
              {detection.crop === 'potato' && '🥔'}
              {detection.crop === 'pepper' && '🫑'}
              {' '}
              {detection.crop}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(detection.date), {
              addSuffix: true,
              locale,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
