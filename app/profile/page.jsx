'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MapPin, LogOut, Edit2, Save } from 'lucide-react';
import { useAuthStore } from '@/app/lib/store';
import { useI18n } from '@/app/hooks/useI18n';
import { getProfile, updateProfile, logout } from '@/app/lib/api';

const CROPS = ['Tomate', 'Pomme de terre', 'Poivron'];

const MOROCCAN_REGIONS = [
  'Tanger-Tétouan-Al Hoceïma',
  'Fès-Meknès',
  'Rabat-Salé-Kénitra',
  'Casablanca-Settat',
  'Marrakech-Safi',
  'Souss-Massa',
  'Béni Mellal-Khénifra',
  'Drâa-Tafilalet',
  'Uis',
  'Oujda-Angad',
];

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logout);
  const { t, language, changeLanguage, isRTL } = useI18n();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    region: user?.region || '',
    crops: user?.crops || [],
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        crops: checked
          ? [...prev.crops, value]
          : prev.crops.filter((crop) => crop !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(formData);
      setSuccess(t('profile.updateSuccess'));
      setIsEditing(false);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      logoutUser();
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen bg-background py-8 px-4 pb-20 md:pb-8 ${
      isRTL ? 'rtl' : 'ltr'
    }`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('profile.title')}</h1>
        <p className="text-gray-600 mb-8">Gérez votre profil et vos préférences</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.firstName?.charAt(0)?.toUpperCase()}{user.lastName?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">{user.role === 'farmer' ? t('auth.farmer') : t('auth.agronomist')}</p>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit2 size={20} className="text-primary-600" />
              </button>
            )}
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 mb-6 border border-gray-100 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.firstName')}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.lastName')}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.region')}
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Sélectionner</option>
                {MOROCCAN_REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.cropTypes')}
              </label>
              <div className="space-y-2">
                {CROPS.map((crop) => (
                  <label key={crop} className="flex items-center">
                    <input
                      type="checkbox"
                      name="crops"
                      value={crop}
                      checked={formData.crops.includes(crop)}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="ml-2 text-gray-700">{crop}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {loading ? t('common.loading') : t('common.save')}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>
          </form>
        )}

        {/* Settings */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('profile.settings')}</h2>

          <div className="space-y-4">
            {/* Language */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">{t('profile.language')}</p>
                <p className="text-sm text-gray-600">{language === 'fr' ? 'Français' : 'العربية'}</p>
              </div>
              <button
                onClick={() => changeLanguage(language === 'fr' ? 'ar' : 'fr')}
                className="px-4 py-2 bg-primary-100 text-primary-600 rounded-lg font-semibold hover:bg-primary-200 transition-colors"
              >
                {language === 'fr' ? 'العربية' : 'Français'}
              </button>
            </div>

            {/* Contact Info */}
            <div>
              <p className="font-medium text-gray-900 mb-3">Contact</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  {user.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  {user.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} />
                  {user.region}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          {t('profile.logout')}
        </button>
      </div>
    </div>
  );
}
