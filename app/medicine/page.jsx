'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Copy, Phone as PhoneIcon } from 'lucide-react';
import { useI18n } from '@/app/hooks/useI18n';
import { getNearbyStores } from '@/app/lib/api';

const MOCK_STORES = [
  {
    id: 1,
    name: 'Agri-Shop Marrakech',
    address: '45 Rue Moulay Ali, Marrakech',
    phone: '+212 524 123 456',
    distance: 2.3,
    products: ['Fongicide cuivre', 'Insecticide bio'],
  },
  {
    id: 2,
    name: 'Coop Agricole Safi',
    address: '78 Boulevard Zerktouni, Safi',
    phone: '+212 544 789 012',
    distance: 5.1,
    products: ['Soufre micronisé', 'Traitement biologique'],
  },
  {
    id: 3,
    name: 'Farm Supplies',
    address: '123 Avenue Mohammed V, Casablanca',
    phone: '+212 522 456 789',
    distance: 8.7,
    products: ['Produits anti-maladie', 'Engrais spécialisés'],
  },
];

const RECOMMENDED_MEDICINES = [
  {
    id: 1,
    name: 'Fongicide à base de cuivre',
    description: 'Efficace contre le mildiou et autres maladies fongiques',
    price: '120-150 DH',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Soufre micronisé',
    description: 'Traitement préventif et curatif pour l\'oïdium',
    price: '80-100 DH',
    rating: 4.3,
  },
  {
    id: 3,
    name: 'Traitement biologique',
    description: 'Solution écologique sans résidus chimiques',
    price: '150-200 DH',
    rating: 4.7,
  },
];

export default function MedicinePage() {
  const { t, isRTL } = useI18n();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStores = async () => {
      try {
        setLoading(true);
        // Utiliser les stores mockés pour la démo
        setStores(MOCK_STORES);
        // Décommentez pour utiliser l'API réelle :
        // const userLocation = await getDeviceLocation();
        // const data = await getNearbyStores(userLocation.lat, userLocation.lng);
        // setStores(data);
      } catch (err) {
        setError(err.message || t('common.error'));
        setStores(MOCK_STORES);
      } finally {
        setLoading(false);
      }
    };

    loadStores();
  }, [t]);

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleDirections = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(
      `https://www.google.com/maps/search/${encodedAddress}`,
      '_blank'
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`min-h-screen bg-background py-8 px-4 pb-20 md:pb-8 ${
      isRTL ? 'rtl' : 'ltr'
    }`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('medicine.title')}</h1>
        <p className="text-gray-600 mb-8">Trouvez les meilleurs traitements près de chez vous</p>

        {/* Recommended Medicines */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('medicine.recommended')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECOMMENDED_MEDICINES.map((medicine) => (
              <div key={medicine.id} className="bg-white rounded-lg p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">{medicine.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{medicine.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-primary-600">{medicine.price}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {medicine.rating}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-primary-100 text-primary-600 py-2 rounded-lg font-semibold hover:bg-primary-200 transition-colors">
                  Voir les offres
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby Stores */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('medicine.nearbyStores')}</h2>

          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
              </div>
            </div>
          ) : stores.length > 0 ? (
            <div className="space-y-4">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin size={16} />
                        {store.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-600">{store.distance} km</p>
                      <p className="text-xs text-gray-500">De votre position</p>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Produits disponibles:</p>
                    <div className="flex flex-wrap gap-2">
                      {store.products.map((product, idx) => (
                        <span
                          key={idx}
                          className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCall(store.phone)}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <PhoneIcon size={18} />
                      {t('medicine.call')}
                    </button>

                    <button
                      onClick={() => copyToClipboard(store.phone)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      title="Copier le téléphone"
                    >
                      <Copy size={18} />
                    </button>

                    <button
                      onClick={() => handleDirections(store.address)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <MapPin size={18} />
                      {t('medicine.directions')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center border border-gray-100">
              <p className="text-gray-600">{t('medicine.noStores')}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
