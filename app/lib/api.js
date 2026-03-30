import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.agilics.ma';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export async function login(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function signup(userData) {
  try {
    const response = await api.post('/auth/signup', userData);
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function logout() {
  localStorage.removeItem('token');
  return true;
}

// Détections
export async function uploadDetection(imageFile, cropType) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('cropType', cropType);

    const response = await api.post('/detections/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function getDetections() {
  try {
    const response = await api.get('/detections');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function saveDetection(detection) {
  try {
    const response = await api.post('/detections', detection);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function deleteDetection(detectionId) {
  try {
    await api.delete(`/detections/${detectionId}`);
    return true;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Plantes
export async function getPlants() {
  try {
    const response = await api.get('/plants');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function addPlant(plant) {
  try {
    const response = await api.post('/plants', plant);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function updatePlant(plantId, updates) {
  try {
    const response = await api.put(`/plants/${plantId}`, updates);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function deletePlant(plantId) {
  try {
    await api.delete(`/plants/${plantId}`);
    return true;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Profil
export async function getProfile() {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function updateProfile(updates) {
  try {
    const response = await api.put('/profile', updates);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

// Médicaments
export async function getMedicines(diseaseId) {
  try {
    const response = await api.get(`/medicines?diseaseId=${diseaseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export async function getNearbyStores(latitude, longitude, radius = 5000) {
  try {
    const response = await api.get(
      `/stores/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}

export default api;
