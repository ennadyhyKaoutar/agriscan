'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, ArrowRight } from 'lucide-react';
import { useAuthStore, useDetectionStore } from '@/app/lib/store';
import { useI18n } from '@/app/hooks/useI18n';
import { CropCard } from '@/app/components/CropCard';
import { DetectionHistoryCard } from '@/app/components/DetectionHistoryCard';
import { SkeletonLoader } from '@/app/components/Loading';
import { getDetections, deleteDetection } from '@/app/lib/api';

const CROPS = [
  { name: 'tomato', label: 'Tomate', icon: '🍅', color: 'text-red-500' },
  { name: 'potato', label: 'Pomme de terre', icon: '🥔', color: 'text-yellow-700' },
  { name: 'pepper', label: 'Poivron', icon: '🫑', color: 'text-green-500' },
];

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const detections = useDetectionStore((state) => state.detections);
  const removeDetection = useDetectionStore((state) => state.deleteDetection);
  const { t, isRTL } = useI18n();

  const [loading, setLoading] = useState(true);
  const [recentDetections, setRecentDetections] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    const loadDetections = async () => {
      try {
        const data = await getDetections();
        setRecentDetections(data.slice(0, 3));
      } catch (error) {
        console.error('Error loading detections:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDetections();
  }, [user, router]);

  const handleDeleteDetection = async (id) => {
    try {
      await deleteDetection(id);
      removeDetection(id);
      setRecentDetections(recentDetections.filter((d) => d.id !== id));
    } catch (error) {
      console.error('Error deleting detection:', error);
    }
  };

  if (!user) return null;

  const cropCounts = {
    tomato: detections.filter((d) => d.crop === 'tomato').length,
    potato: detections.filter((d) => d.crop === 'potato').length,
    pepper: detections.filter((d) => d.crop === 'pepper').length,
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('home.welcome', { firstName: user.firstName })}
          </h1>
          <p className="text-gray-600">{t('home.mycrops')}</p>
        </div>

        {/* Main CTA */}
        <Link
          href="/detection"
          className="block mb-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{t('home.analyzePlant')}</h2>
              <p className="opacity-90">Identifiez les maladies en quelques secondes</p>
            </div>
            <Camera size={48} className="opacity-80" />
          </div>
        </Link>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {CROPS.map((crop) => (
            <CropCard
              key={crop.name}
              crop={crop.label}
              count={cropCounts[crop.name]}
              icon={crop.icon}
            />
          ))}
        </div>

        {/* Recent Detections */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{t('home.recentDetections')}</h2>
            <Link
              href="/history"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
            >
              {t('home.viewAll')}
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <SkeletonLoader count={3} />
          ) : recentDetections.length > 0 ? (
            <div className="space-y-4">
              {recentDetections.map((detection) => (
                <DetectionHistoryCard
                  key={detection.id}
                  detection={detection}
                  onDelete={handleDeleteDetection}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
              <p className="text-gray-600">{t('home.noDetections')}</p>
              <Link
                href="/detection"
                className="mt-4 inline-block text-primary-600 hover:text-primary-700 font-semibold"
              >
                {t('home.analyzePlant')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
