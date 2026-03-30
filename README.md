# AGILICS - Détection Maladies Agricoles

PWA React/Next.js 14 pour la détection et gestion des maladies des plantes au Maroc avec support offline avec TensorFlow.js.

## 🌟 Caractéristiques

### Core Features
- ✅ **Authentification** - Inscription/Connexion avec rôles (Agriculteur/Agronome)
- ✅ **Détection IA** - Analyse d'images avec TensorFlow.js (offline-first)
- ✅ **Historique** - Sauvegarde et filtrage des détections
- ✅ **Suivi Plantes** - Gestion des plantes et de leur statut
- ✅ **Pharmacies** - Localisation des magasins agricoles proches
- ✅ **Profil** - Gestion du profil utilisateur

### Technical Features
- ✅ **PWA** - Installation sur mobile, offline-first
- ✅ **i18n** - Support FR/AR avec RTL automatique
- ✅ **Responsive** - Mobile-first design avec Tailwind CSS
- ✅ **TensorFlow.js** - Modèle ML en cache pour mode offline
- ✅ **Service Worker** - Cache stratégies network/cache-first
- ✅ **Zustand** - State management minimal
- ✅ **Vercel Ready** - Déployable directement sur Vercel

## 📋 Structure du Projet

```
agilics-app/
├── app/
│   ├── layout.jsx                 # Layout root avec PWA setup
│   ├── globals.css                # Styles globaux
│   ├── providers.jsx              # Providers (i18n, stores)
│   ├── auth/
│   │   └── page.jsx               # Connexion/Inscription
│   ├── dashboard/
│   │   └── page.jsx               # Accueil avec cultures
│   ├── detection/
│   │   └── page.jsx               # Upload/Camera & analyse
│   ├── history/
│   │   └── page.jsx               # Historique filtré
│   ├── plants/
│   │   └── page.jsx               # Suivi des plantes
│   ├── medicine/
│   │   └── page.jsx               # Médicaments & pharmacies
│   ├── profile/
│   │   └── page.jsx               # Profil utilisateur
│   ├── components/
│   │   ├── Header.jsx             # Header avec toggle langue
│   │   ├── BottomNav.jsx          # Navigation mobile
│   │   ├── CropCard.jsx           # Carte culture
│   │   ├── DetectionResult.jsx    # Résultat analyse
│   │   ├── DetectionHistoryCard.jsx
│   │   └── Loading.jsx            # Spinners & skeletons
│   ├── hooks/
│   │   ├── useOnlineStatus.js     # Détection online/offline
│   │   ├── useDetection.js        # Hook TensorFlow.js
│   │   └── useI18n.js             # Hook i18n
│   └── lib/
│       ├── store.js               # Zustand stores
│       ├── api.js                 # Appels API
│       └── i18n.js                # Configuration i18n
├── public/
│   ├── manifest.json              # PWA manifest
│   ├── service-worker.js          # Service Worker
│   ├── icons/                     # App icons
│   └── model/                     # Modèles TensorFlow.js
├── locales/
│   ├── fr.json                    # Traductions FR
│   └── ar.json                    # Traductions AR
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🚀 Installation Locale

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Git

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/agilics-app.git
cd agilics-app

# 2. Installer les dépendances
npm install

# 3. Configuration environment
cp .env.example .env.local
# Éditer .env.local avec vos variables:
# NEXT_PUBLIC_API_URL=https://api.agilics.ma
# NEXT_PUBLIC_GOOGLE_MAPS_KEY=xxx

# 4. Lancer en développement
npm run dev

# Accéder à http://localhost:3000
```

## 🔧 Configuration

### Variables d'Environnement (.env.local)

```bash
# API
NEXT_PUBLIC_API_URL=https://api.agilics.ma
NEXT_PUBLIC_API_TIMEOUT=10000

# Google Maps (optionnel pour les vraies coordonnées)
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_key

# Firebase (optionnel pour notifications)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
```

### Tailwind Configuration

Le `tailwind.config.js` inclut les couleurs AGILICS :
- **Primary**: #2D6A4F (vert)
- **Secondary**: #52B788
- **Danger**: #E63946 (rouge)
- **Warning**: #F4A261 (orange)
- **Background**: #F8F9FA

### Fonts

- **FR**: Inter (sans-serif)
- **AR**: Cairo (Arabic)

Les fonts sont importées automatiquement via Google Fonts dans `globals.css`.

## 📱 PWA Setup

### Manifest (public/manifest.json)
- Déjà configuré avec icônes et couleurs AGILICS
- Générer les icônes avec `pwa-asset-generator`

### Service Worker (public/service-worker.js)
- Cache-first pour assets statiques
- Network-first pour APIs
- Offline fallback page

### Installation Mobile

```bash
# iOS
- Safari → Partager → Sur l'écran d'accueil

# Android
- Chrome → Menu → Installer l'app

# Desktop
- Chrome → Menu → Installer
```

## 🌐 i18n (Français/Arabe)

### Structure des Traductions

```
locales/
├── fr.json     # Traductions françaises
└── ar.json     # Traductions arabes
```

### Utilisation

```jsx
import { useI18n } from '@/app/hooks/useI18n';

export function MyComponent() {
  const { t, language, changeLanguage, isRTL } = useI18n();
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h1>{t('common.appName')}</h1>
      <button onClick={() => changeLanguage('ar')}>العربية</button>
    </div>
  );
}
```

## 🤖 TensorFlow.js Setup

### Modèle

Le hook `useDetection` charge un modèle TensorFlow.js :

```javascript
// Emplacement du modèle à fournir
/public/model/model.json
/public/model/model.weights.bin
```

### Télécharger un Modèle Pré-entraîné

```bash
# Option 1 : Utiliser MobileNet pour la démo
# npm install @tensorflow-models/coco-ssd

# Option 2 : Convertir votre modèle Keras
# tensorflowjs_converter --input_format keras model.h5 web_model
```

### Utilisation

```javascript
const { analyzeImage, loading, error } = useDetection();

const results = await analyzeImage(imageElement);
// Retourne: { confidence, disease, severity, treatment, prevention }
```

## 🔌 API Backend

Les endpoints attendus par l'app :

```
POST   /auth/login              # Login
POST   /auth/signup             # Signup
POST   /detections/analyze      # Upload & analyze image
GET    /detections              # Get history
POST   /detections              # Save detection
DELETE /detections/{id}         # Delete detection
GET    /plants                  # Get plants
POST   /plants                  # Add plant
PUT    /plants/{id}             # Update plant
DELETE /plants/{id}             # Delete plant
GET    /profile                 # Get profile
PUT    /profile                 # Update profile
GET    /medicines               # Get medicines by disease
GET    /stores/nearby            # Get nearby stores (Google Maps)
```

### Mock Backend (pour démo)

Les appels API utilisent des données mockées en développement. Remplacer `api.js` pour utiliser une vraie API.

## 🚀 Déploiement Vercel

### Méthode 1 : Via GitHub

1. **Push sur GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/agilics-app.git
git branch -M main
git push -u origin main
```

2. **Connecter à Vercel**
- Aller sur https://vercel.com
- Cliquer "New Project"
- Importer depuis GitHub
- Sélectionner le repo `agilics-app`
- Ajouter les variables d'environnement
- Deploy !

### Méthode 2 : Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Deploy
vercel

# Ajouter des variables d'env
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_KEY
```

### Configuration Vercel (vercel.json)

```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "@next_public_api_url",
    "NEXT_PUBLIC_GOOGLE_MAPS_KEY": "@next_public_google_maps_key"
  },
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/service-worker.js",
      "dest": "/public/service-worker.js"
    }
  ]
}
```

### Optimisations Vercel

- Analytics automatiques activés
- Image optimization activée
- Compression Gzip automatique
- CDN global inclus

## 🧪 Tests

### Unit Tests (Jest)

```bash
npm install --save-dev jest @testing-library/react
npm test
```

### E2E Tests (Playwright)

```bash
npm install --save-dev @playwright/test
npx playwright test
```

## 📊 Performance

### Lighthouse Metrics (Objectif)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100
- PWA: 100

### Optimisations Appliquées
- ✅ Code splitting avec Next.js
- ✅ Image optimization
- ✅ Service Worker caching
- ✅ Minification CSS/JS
- ✅ Font optimization (preload)
- ✅ Lazy loading components

## 🔒 Sécurité

- ✅ HTTPS obligatoire en production
- ✅ Token JWT stocké localStorage
- ✅ CORS configuré côté API
- ✅ Input validation côté client
- ✅ Sanitization des données

## 📝 Licence

MIT License - voir LICENSE.md

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing`)
5. Ouvrir une Pull Request

## 📧 Support

- Email: support@agilics.ma
- Issues: GitHub Issues
- Docs: https://docs.agilics.ma

## 🎯 Roadmap

- [ ] Intégration Google Maps API réelle
- [ ] Upload vers Cloudinary
- [ ] Notifications push
- [ ] Partage des détections
- [ ] Chat avec agronomes experts
- [ ] Dashboard agronome
- [ ] Prédictions météo
- [ ] Historique plante détaillé
- [ ] Export PDF rapports
- [ ] Multi-langue (EN, ES)

---

**Créé avec ❤️ pour les agriculteurs marocains**
