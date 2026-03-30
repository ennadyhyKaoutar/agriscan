'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CropCard({ crop, count, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{icon}</div>
        <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded text-xs font-semibold">
          {count}
        </span>
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{crop}</h3>
      <p className="text-sm text-gray-500 mb-3">Dernière analyse il y a 3 jours</p>
      <Link
        href={`/detection?crop=${crop}`}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
      >
        Analyser
        <ArrowRight size={14} className="ml-1" />
      </Link>
    </div>
  );
}
