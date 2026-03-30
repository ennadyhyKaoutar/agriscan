'use client';

import { useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

const MODEL_URL = '/model/model.json';

export function useDetection() {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger le modèle
  const loadModel = useCallback(async () => {
    try {
      setLoading(true);
      await tf.ready();
      // Note: Remplacer par votre URL de modèle réel
      // const loadedModel = await tf.loadLayersModel(MODEL_URL);
      // setModel(loadedModel);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Analyser une image
  const analyzeImage = useCallback(
    async (imageData) => {
      if (!model) {
        setError('Modèle non chargé');
        return null;
      }

      try {
        setLoading(true);
        
        // Préparer l'image
        let tensor = tf.browser.fromPixels(imageData);
        tensor = tf.image.resizeBilinear(tensor, [224, 224]);
        tensor = tensor.expandDims(0);
        tensor = tensor.div(tf.scalar(255));

        // Prédiction
        const prediction = await model.predict(tensor);
        const data = await prediction.data();

        // Nettoyer les tensors
        tensor.dispose();
        prediction.dispose();

        const results = {
          confidence: Math.max(...data) * 100,
          disease: 'Spot bactérien',
          severity: 'moyen',
          treatment: 'Utiliser un fongicide approuvé',
          prevention: 'Rotation des cultures',
        };

        setLoading(false);
        return results;
      } catch (err) {
        setError(err.message);
        setLoading(false);
        return null;
      }
    },
    [model]
  );

  return {
    loadModel,
    analyzeImage,
    model,
    loading,
    error,
  };
}
