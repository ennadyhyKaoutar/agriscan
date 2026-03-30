// Rôles utilisateur
export const USER_ROLES = {
  FARMER: 'farmer',
  AGRONOMIST: 'agronomist',
};

// Statuts de détection
export const DETECTION_STATUS = {
  HEALTHY: 'healthy',
  UNCERTAIN: 'uncertain',
  INFECTED: 'infected',
};

// Niveaux de gravité
export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Statuts des plantes
export const PLANT_STATUS = {
  HEALTHY: 'healthy',
  IN_TREATMENT: 'inTreatment',
  INFECTED: 'infected',
};

// Types de cultures
export const CROP_TYPES = {
  TOMATO: 'tomato',
  POTATO: 'potato',
  PEPPER: 'pepper',
};

// Regions Maroc
export const MOROCCAN_REGIONS = [
  {
    id: 'tangier',
    name: 'Tanger-Tétouan-Al Hoceïma',
    nameAR: 'طنجة-تطوان-الحسيمة',
    latitude: 35.0,
    longitude: -5.5,
  },
  {
    id: 'fez',
    name: 'Fès-Meknès',
    nameAR: 'فاس-مكناس',
    latitude: 34.0,
    longitude: -5.0,
  },
  {
    id: 'rabat',
    name: 'Rabat-Salé-Kénitra',
    nameAR: 'الرباط-سلا-القنيطرة',
    latitude: 34.0,
    longitude: -6.8,
  },
  {
    id: 'casablanca',
    name: 'Casablanca-Settat',
    nameAR: 'الدار البيضاء-سطات',
    latitude: 33.5,
    longitude: -7.5,
  },
  {
    id: 'marrakech',
    name: 'Marrakech-Safi',
    nameAR: 'مراكش-الحوز',
    latitude: 31.6,
    longitude: -8.0,
  },
  {
    id: 'agadir',
    name: 'Souss-Massa',
    nameAR: 'سوس-ماسة',
    latitude: 30.4,
    longitude: -9.6,
  },
  {
    id: 'beni',
    name: 'Béni Mellal-Khénifra',
    nameAR: 'بني ملال-خنيفرة',
    latitude: 32.5,
    longitude: -6.0,
  },
  {
    id: 'draa',
    name: 'Drâa-Tafilalet',
    nameAR: 'درعة-تافيلالت',
    latitude: 31.5,
    longitude: -4.5,
  },
  {
    id: 'oujda',
    name: 'Oujda-Angad',
    nameAR: 'وجدة-أنكاد',
    latitude: 34.6,
    longitude: -1.9,
  },
];

// Maladies courantes
export const COMMON_DISEASES = {
  TOMATO: [
    {
      id: 'early_blight',
      nameFR: 'Alternariose (Brûlure précoce)',
      nameAR: 'الأرتناريا (اللفحة المبكرة)',
      severity: 'high',
      treatment: 'Fongicide à base de manèbe ou mancozèbe',
      prevention: 'Rotation des cultures, détruire les débris',
    },
    {
      id: 'late_blight',
      nameFR: 'Mildiou',
      nameAR: 'البياض الدقيقي',
      severity: 'critical',
      treatment: 'Fongicide à base de chlorothalonil',
      prevention: 'Irrigation au sol, éviter l\'humidité foliaire',
    },
    {
      id: 'powdery_mildew',
      nameFR: 'Oïdium',
      nameAR: 'العفن البودري',
      severity: 'medium',
      treatment: 'Soufre micronisé ou fongicides spécifiques',
      prevention: 'Améliorer la circulation de l\'air',
    },
  ],
  POTATO: [
    {
      id: 'late_blight_potato',
      nameFR: 'Mildiou',
      nameAR: 'البياض الدقيقي',
      severity: 'critical',
      treatment: 'Fongicide systémique à base de fluazinam',
      prevention: 'Variétés résistantes, pas de surhumidité',
    },
    {
      id: 'early_blight_potato',
      nameFR: 'Alternariose',
      nameAR: 'الأرتناريا',
      severity: 'high',
      treatment: 'Fongicide protectant en prévention',
      prevention: 'Rotation, élimination des feuilles infectées',
    },
  ],
  PEPPER: [
    {
      id: 'anthracnose',
      nameFR: 'Anthracnose',
      nameAR: 'الأنثراكنوز',
      severity: 'high',
      treatment: 'Fongicide à base de carbendazime',
      prevention: 'Gestion de l\'humidité, désinfection outils',
    },
  ],
};

// Types de notifications
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Limites et contraintes
export const LIMITS = {
  MAX_IMAGE_SIZE_MB: 5,
  MAX_FILE_NAME_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_DETECTION_HISTORY: 100,
  IMAGE_MIN_WIDTH: 100,
  IMAGE_MIN_HEIGHT: 100,
  IMAGE_QUALITY: 0.9,
};

// Timeouts
export const TIMEOUTS = {
  API_TIMEOUT: 10000,
  NOTIFICATION_DURATION: 4000,
  DEBOUNCE: 300,
  THROTTLE: 500,
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_SIGNUP: '/auth/signup',
  AUTH_LOGOUT: '/auth/logout',
  
  DETECTIONS_LIST: '/detections',
  DETECTIONS_ANALYZE: '/detections/analyze',
  DETECTIONS_SAVE: '/detections',
  DETECTIONS_DELETE: '/detections/:id',
  
  PLANTS_LIST: '/plants',
  PLANTS_CREATE: '/plants',
  PLANTS_UPDATE: '/plants/:id',
  PLANTS_DELETE: '/plants/:id',
  
  PROFILE_GET: '/profile',
  PROFILE_UPDATE: '/profile',
  
  MEDICINES_GET: '/medicines',
  STORES_NEARBY: '/stores/nearby',
};

// Colors for UI
export const COLORS = {
  PRIMARY: '#2D6A4F',
  SECONDARY: '#52B788',
  DANGER: '#E63946',
  WARNING: '#F4A261',
  SUCCESS: '#06D6A0',
  INFO: '#0096C7',
  BACKGROUND: '#F8F9FA',
};

// Crop emojis
export const CROP_EMOJIS = {
  tomato: '🍅',
  potato: '🥔',
  pepper: '🫑',
};

// Status badges
export const STATUS_BADGES = {
  healthy: { emoji: '✅', color: 'text-green-600', bg: 'bg-green-100' },
  uncertain: { emoji: '⚠️', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  infected: { emoji: '❌', color: 'text-red-600', bg: 'bg-red-100' },
  inTreatment: { emoji: '🟡', color: 'text-yellow-600', bg: 'bg-yellow-100' },
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'agilics_token',
  USER: 'agilics_user',
  LANGUAGE: 'agilics_language',
  DETECTIONS: 'agilics_detections',
  PLANTS: 'agilics_plants',
  PREFERENCES: 'agilics_preferences',
};
