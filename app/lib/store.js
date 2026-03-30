import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      language: 'fr',

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLanguage: (language) => set({ language }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-store',
    }
  )
);

export const useDetectionStore = create(
  persist(
    (set) => ({
      detections: [],
      currentDetection: null,

      addDetection: (detection) =>
        set((state) => ({
          detections: [detection, ...state.detections],
        })),

      setCurrentDetection: (detection) => set({ currentDetection: detection }),

      deleteDetection: (id) =>
        set((state) => ({
          detections: state.detections.filter((d) => d.id !== id),
        })),

      clearHistory: () => set({ detections: [] }),
    }),
    {
      name: 'detection-store',
    }
  )
);

export const usePlantsStore = create(
  persist(
    (set) => ({
      plants: [],

      addPlant: (plant) =>
        set((state) => ({
          plants: [...state.plants, { ...plant, id: Date.now() }],
        })),

      updatePlant: (id, updates) =>
        set((state) => ({
          plants: state.plants.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      deletePlant: (id) =>
        set((state) => ({
          plants: state.plants.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'plants-store',
    }
  )
);
