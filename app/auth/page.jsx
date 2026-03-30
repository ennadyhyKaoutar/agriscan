'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/app/lib/store';
import { useI18n } from '@/app/hooks/useI18n';
import { login, signup } from '@/app/lib/api';

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

const CROPS = ['Tomate', 'Pomme de terre', 'Poivron'];

export default function AuthPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const { t, isRTL } = useI18n();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    region: '',
    role: '',
    crops: [],
  });

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
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await login(formData.email, formData.password);
        setUser(response.user);
        localStorage.setItem('token', response.token);
        router.push('/dashboard');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error(t('auth.passwordMismatch'));
        }
        const response = await signup(formData);
        setUser(response.user);
        localStorage.setItem('token', response.token);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 ${
      isRTL ? 'rtl' : 'ltr'
    }`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">AGILICS</h1>
          <p className="text-gray-600">{t('auth.login')}</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-xl p-6 space-y-4"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Signup Fields */}
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.firstName')}
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.lastName')}
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.role')}
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="input-field"
                  required={!isLogin}
                >
                  <option value="">{t('auth.selectRole')}</option>
                  <option value="farmer">{t('auth.farmer')}</option>
                  <option value="agronomist">{t('auth.agronomist')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.phone')}
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="+212 6XX XXX XXX"
                    required={!isLogin}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.region')}
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    required={!isLogin}
                  >
                    <option value="">{t('auth.selectRegion')}</option>
                    {MOROCCAN_REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
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
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="exemple@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input-field pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 mt-6"
          >
            {loading ? t('common.loading') : (isLogin ? t('auth.login') : t('auth.signup'))}
          </button>

          {/* Toggle */}
          <p className="text-center text-gray-600 text-sm">
            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  phone: '',
                  region: '',
                  role: '',
                  crops: [],
                });
              }}
              className="ml-1 text-primary-600 hover:text-primary-700 font-semibold"
            >
              {isLogin ? t('auth.signup') : t('auth.login')}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
