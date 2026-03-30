'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, X } from 'lucide-react';
import { useI18n } from '@/app/hooks/useI18n';
import { useDetection } from '@/app/hooks/useDetection';
import { useDetectionStore } from '@/app/lib/store';
import { LoadingSpinner } from '@/app/components/Loading';
import { DetectionResult } from '@/app/components/DetectionResult';
import { uploadDetection, saveDetection } from '@/app/lib/api';

export default function DetectionPage() {
  const router = useRouter();
  const { t, isRTL } = useI18n();
  const { analyzeImage, loading: modelLoading } = useDetection();
  const addDetection = useDetectionStore((state) => state.addDetection);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const canvasRef = useRef(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cropType, setCropType] = useState('tomato');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = async (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setImage(file);
      setResult(null);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      setError(t('detection.uploadPhoto'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Appel API avec l'image
      const analysisResult = await uploadDetection(image, cropType);

      // Simuler le résultat pour la démo
      const mockResult = {
        status: 'uncertain',
        diseaseFR: 'Mildiou',
        diseaseAR: 'البياض الدقيقي',
        confidence: analysisResult.confidence || 85,
        severity: 'medium',
        treatment: 'Utilisez un fongicide contenant du soufre ou du cuivre...',
        prevention: 'Assurez une bonne circulation de l\'air, évitez l\'excès d\'humidité...',
      };

      setResult(mockResult);

      // Sauvegarder localement
      const detection = {
        id: Date.now(),
        imageUrl: preview,
        crop: cropType,
        diseaseFR: mockResult.diseaseFR,
        diseaseAR: mockResult.diseaseAR,
        confidence: mockResult.confidence,
        severity: mockResult.severity,
        status: mockResult.status,
        date: new Date().toISOString(),
      };

      addDetection(detection);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDetection = async () => {
    if (!result) return;

    try {
      const detection = {
        imageUrl: preview,
        crop: cropType,
        diseaseFR: result.diseaseFR,
        diseaseAR: result.diseaseAR,
        confidence: result.confidence,
        severity: result.severity,
        status: result.status,
        treatment: result.treatment,
        prevention: result.prevention,
        date: new Date().toISOString(),
      };

      await saveDetection(detection);
      router.push('/history');
    } catch (err) {
      setError(err.message || t('common.error'));
    }
  };

  const handleFindMedicine = () => {
    router.push('/medicine');
  };

  return (
    <div className={`min-h-screen bg-background py-8 px-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('detection.title')}</h1>
        <p className="text-gray-600 mb-8">Analysez votre plante pour détecter les maladies</p>

        {!result ? (
          <>
            {/* Crop Selection */}
            <div className="bg-white rounded-lg p-6 mb-6 border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de culture
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="input-field"
              >
                <option value="tomato">🍅 Tomate</option>
                <option value="potato">🥔 Pomme de terre</option>
                <option value="pepper">🫑 Poivron</option>
              </select>
            </div>

            {/* Image Preview or Upload */}
            {!preview ? (
              <div className="bg-white rounded-lg p-8 border-2 border-dashed border-gray-300 mb-6">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Camera size={48} className="text-gray-400" />
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t('detection.uploadPhoto')}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Téléchargez ou capturez une photo de votre plante
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                      <Upload size={20} />
                      {t('detection.uploadPhoto')}
                    </button>

                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      <Camera size={20} />
                      {t('detection.takePhoto')}
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraCapture}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="relative mb-6">
                  <div className="bg-gray-200 rounded-lg overflow-hidden aspect-square mb-2">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setPreview(null);
                      setImage(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={20} />
                  </button>

                  <p className="text-sm text-gray-600">
                    {image?.name && `Fichier: ${image.name}`}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 mb-3"
                >
                  {loading ? t('detection.analyzing') : t('detection.analyze')}
                </button>

                <button
                  onClick={() => {
                    setPreview(null);
                    setImage(null);
                  }}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  {t('common.cancel')}
                </button>
              </>
            )}

            {loading && <LoadingSpinner />}
          </>
        ) : (
          <DetectionResult
            result={result}
            onSave={handleSaveDetection}
            onFindMedicine={handleFindMedicine}
          />
        )}
      </div>
    </div>
  );
}
