# AGILICS - Guide de Démarrage Rapide ⚡

## 🎯 5 minutes pour démarrer

### 1️⃣ Installation (2 min)

```bash
# Cloner le projet
git clone https://github.com/votre-username/agilics-app.git
cd agilics-app

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Accédez à **http://localhost:3000** 🚀

### 2️⃣ Tester l'App (1 min)

1. **Page de login** → Créer un compte test
2. **Remplir le formulaire**
   - Prénom: Jean
   - Nom: Dupont
   - Email: jean@test.com
   - Mot de passe: Test1234!
   - Région: Casablanca-Settat
   - Cultures: Tomate, Poivron

3. **Dashboard** → Voir les 3 cultures principales

### 3️⃣ Tester la Détection (2 min)

1. Cliquer sur "📷 Analyser ma plante"
2. Télécharger une image (test avec n'importe quelle image)
3. Cliquer "Analyser" → Voir le résultat simulé
4. Cliquer "Sauvegarder" → Voir dans l'historique

## 📱 Tester la PWA

### Sur Mobile (Android)
```
Chrome → Menu (⋮) → Installer AGILICS → Accepter
```

### Sur Desktop
```
Chrome → Menu → Installer l'app → Accepter
```

## 🌐 Changer la Langue

- Cliquer le bouton **"Français/العربية"** dans le header
- RTL s'active automatiquement pour l'arabe
- Traductions sauvegardées localement

## 🔌 Intégrer une API Réelle

### 1. Éditer `.env.local`

```bash
NEXT_PUBLIC_API_URL=https://votre-api.com
```

### 2. Adapter `app/lib/api.js`

Les endpoints attendus:

```
POST   /auth/login
POST   /auth/signup
POST   /detections/analyze     # Image upload
GET    /detections
POST   /detections
DELETE /detections/{id}
GET    /plants
POST   /plants
...
```

## 🤖 Ajouter TensorFlow.js Model

### Option A : Utiliser MobileNet (Demo)

```bash
npm install @tensorflow-models/mobilenet
```

Puis dans `app/hooks/useDetection.js`:

```javascript
import * as mobilenet from '@tensorflow-models/mobilenet';

const loadModel = async () => {
  const model = await mobilenet.load();
  setModel(model);
};
```

### Option B : Modèle Custom

1. Exporter votre modèle Keras en TensorFlow.js
```bash
tensorflowjs_converter \
  --input_format keras \
  model.h5 \
  public/model
```

2. Ajouter les fichiers à `public/model/`
3. Charger dans `useDetection.js`:
```javascript
const model = await tf.loadLayersModel('file://public/model/model.json');
```

## 🚀 Déployer sur Vercel

### Méthode Rapide (3 étapes)

1. **Push sur GitHub**
```bash
git add .
git commit -m "AGILICS MVP"
git push origin main
```

2. **Connecter Vercel**
- Aller sur https://vercel.com
- Cliquer "New Project"
- Importer depuis GitHub
- Sélectionner le repo

3. **Ajouter Variables d'Env**
```
NEXT_PUBLIC_API_URL = https://api.agilics.ma
NEXT_PUBLIC_GOOGLE_MAPS_KEY = your_key
```

4. **Deploy!** ✅

Votre app est live sur `agilics.vercel.app`

## 📂 Structure Rapide

```
agilics-app/
├── app/
│   ├── auth/page.jsx          ← Connexion
│   ├── dashboard/page.jsx     ← Accueil
│   ├── detection/page.jsx     ← Analyse
│   ├── history/page.jsx       ← Historique
│   ├── plants/page.jsx        ← Plantes
│   ├── medicine/page.jsx      ← Pharmacies
│   ├── profile/page.jsx       ← Profil
│   └── components/            ← Composants réutilisables
├── locales/
│   ├── fr.json                ← Français
│   └── ar.json                ← Arabe
├── public/
│   ├── manifest.json          ← PWA config
│   └── service-worker.js      ← Offline
└── package.json
```

## 🎨 Personnaliser les Couleurs

Éditer `tailwind.config.js`:

```javascript
colors: {
  primary: '#2D6A4F',      // Vert
  secondary: '#52B788',    // Vert clair
  danger: '#E63946',       // Rouge
  warning: '#F4A261',      // Orange
}
```

## 🐛 Débogage

### Voir les logs
```bash
npm run dev
# Ouvrir DevTools (F12) → Console
```

### Mode offline
Devtools → Network → Mode "Offline"

### Service Worker
Devtools → Application → Service Workers

## ✅ Checklist avant Production

- [ ] Remplacer les données mockées par API réelle
- [ ] Ajouter le modèle TensorFlow.js
- [ ] Configurer les variables d'env
- [ ] Tester sur mobile (iOS + Android)
- [ ] Générer les icônes PWA
- [ ] Ajouter le certificat SSL (Vercel auto)
- [ ] Configurer CORS côté API
- [ ] Tester le mode offline
- [ ] Audit Lighthouse
- [ ] Sauvegarder les tokens JWT de manière sécurisée

## 🆘 Troubleshooting

### "Module not found" error
```bash
npm install
```

### Port 3000 déjà utilisé
```bash
npm run dev -- -p 3001
```

### Service Worker ne se charge pas
```bash
# Vider le cache
# DevTools → Application → Clear storage
# Rafraîchir la page
```

### i18n ne change pas
```javascript
// S'assurer d'utiliser le hook useI18n
import { useI18n } from '@/app/hooks/useI18n';
const { t, language, changeLanguage } = useI18n();
```

## 📚 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [React i18next](https://react.i18next.com)
- [Zustand](https://zustand-demo.vercel.app/)
- [PWA Docs](https://web.dev/progressive-web-apps/)

## 🎓 Tutoriels Next Steps

1. **Ajouter une API Node.js** → Express + MongoDB
2. **Auth Réelle** → NextAuth.js + JWT
3. **Upload Images** → Cloudinary ou S3
4. **Notifications** → Firebase Cloud Messaging
5. **Analytics** → Google Analytics 4

---

**Besoin d'aide?** Ouvrir une issue sur GitHub 🐙
