'use client';

import { useState } from 'react';
import { Plus, Trash2, Heart } from 'lucide-react';
import { usePlantsStore } from '@/app/lib/store';
import { useI18n } from '@/app/hooks/useI18n';
import { addPlant, deletePlant, updatePlant } from '@/app/lib/api';

const CROPS = ['Tomate', 'Pomme de terre', 'Poivron'];
const STATUS_OPTIONS = ['healthy', 'inTreatment', 'infected'];

export default function PlantsPage() {
  const plants = usePlantsStore((state) => state.plants);
  const addNewPlant = usePlantsStore((state) => state.addPlant);
  const removePlant = usePlantsStore((state) => state.deletePlant);
  const updateStorePlant = usePlantsStore((state) => state.updatePlant);
  const { t, isRTL } = useI18n();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cropType: 'Tomate',
    status: 'healthy',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newPlant = await addPlant(formData);
      addNewPlant(newPlant);
      setFormData({ name: '', cropType: 'Tomate', status: 'healthy' });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding plant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePlant(id);
      removePlant(id);
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updatePlant(id, { status: newStatus });
      updateStorePlant(id, { status: newStatus });
    } catch (error) {
      console.error('Error updating plant:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      inTreatment: 'bg-yellow-100 text-yellow-800',
      infected: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.healthy;
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      healthy: '🟢',
      inTreatment: '🟡',
      infected: '🔴',
    };
    return emojis[status] || '🟢';
  };

  const getCropEmoji = (crop) => {
    const emojis = {
      Tomate: '🍅',
      'Pomme de terre': '🥔',
      Poivron: '🫑',
    };
    return emojis[crop] || '🌱';
  };

  return (
    <div className={`min-h-screen bg-background py-8 px-4 pb-20 md:pb-8 ${
      isRTL ? 'rtl' : 'ltr'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('plants.title')}</h1>
            <p className="text-gray-600">Gérez et suivez vos plantes</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            {t('plants.addPlant')}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-6 mb-6 border border-gray-100 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('plants.plantName')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Ex: Tomate Claire"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('plants.cropType')}
                </label>
                <select
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  className="input-field"
                >
                  {CROPS.map((crop) => (
                    <option key={crop} value={crop}>
                      {getCropEmoji(crop)} {crop}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                >
                  <option value="healthy">{t('plants.healthy')}</option>
                  <option value="inTreatment">{t('plants.inTreatment')}</option>
                  <option value="infected">{t('plants.infected')}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? t('common.loading') : t('common.save')}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        )}

        {/* Plants Grid */}
        {plants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plants.map((plant) => (
              <div
                key={plant.id}
                className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-2xl mb-1">
                      {getCropEmoji(plant.cropType)} {plant.name}
                    </p>
                    <p className="text-sm text-gray-600">{plant.cropType}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(plant.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} className="text-red-500" />
                  </button>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    value={plant.status}
                    onChange={(e) => handleStatusChange(plant.id, e.target.value)}
                    className={`input-field text-sm ${getStatusColor(plant.status)}`}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {getStatusEmoji(status)} {t(`plants.${status}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="w-full flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700 font-semibold py-2 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors">
                  <Heart size={18} />
                  {t('plants.history')}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
            <p className="text-gray-600 mb-4">Vous n'avez pas encore ajouté de plante</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              {t('plants.addPlant')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
