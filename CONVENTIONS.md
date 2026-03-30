# AGILICS - Conventions & Best Practices

## 📝 Conventions de Code

### Dénomination

#### Fichiers
- **Components**: `PascalCase.jsx` (ex: `DetectionResult.jsx`)
- **Pages**: `page.jsx` dans dossier (ex: `/dashboard/page.jsx`)
- **Hooks**: `useNomDuHook.js` (ex: `useOnlineStatus.js`)
- **Utils**: `kebab-case.js` (ex: `image-utils.js`)
- **Styles**: `kebab-case.css` (ex: `form-styles.css`)

#### Variables & Functions
- **Variables**: `camelCase` (ex: `isLoading`, `userData`)
- **Constants**: `UPPER_SNAKE_CASE` (ex: `API_TIMEOUT`, `MAX_SIZE`)
- **Functions**: `camelCase` (ex: `fetchData()`, `handleClick()`)
- **Classes**: `PascalCase` (ex: `UserManager`, `DataCache`)

#### Events & Handlers
```javascript
// Pattern: handle + NomDuEvent
onClick={handleClick}
onChange={handleChange}
onSubmit={handleSubmit}
onError={handleError}
```

### Imports

#### Organisation
```javascript
// 1. Imports React/Next
import { useState } from 'react';
import Link from 'next/link';

// 2. Imports librairies externes
import axios from 'axios';
import { format } from 'date-fns';

// 3. Imports internes absolus (@/)
import { useI18n } from '@/app/hooks/useI18n';
import { api } from '@/app/lib/api';

// 4. Imports relatifs
import { Card } from '../components/Card';
```

### Composants React

#### Structure d'un composant
```javascript
'use client'; // Si client-side

import { useState } from 'react';
import { useI18n } from '@/app/hooks/useI18n';

// Props validation (optional, mais recommandé)
/**
 * @param {string} title - Titre du composant
 * @param {ReactNode} children - Contenu enfant
 * @param {function} onClose - Callback fermeture
 */
export function MyComponent({ title, children, onClose }) {
  const { t, isRTL } = useI18n();
  const [state, setState] = useState(null);

  const handleAction = () => {
    // Logique
  };

  return (
    <div className={isRTL ? 'rtl' : 'ltr'}>
      {/* JSX */}
    </div>
  );
}
```

#### PropTypes recommandés
```javascript
// Toujours documenter les props
// Option 1: JSDoc (à préférer)
/**
 * Affiche un carton d'action
 * @param {Object} props
 * @param {string} props.title - Titre affiché
 * @param {string} props.description - Description
 * @param {Function} props.onAction - Callback au clic
 * @returns {JSX.Element}
 */
export function ActionCard({ title, description, onAction }) {
  // ...
}

// Option 2: TypeScript (futur)
interface ActionCardProps {
  title: string;
  description: string;
  onAction: () => void;
}
```

### État & Mutations

#### Pattern Zustand
```javascript
// ✅ BON
export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      
      setUser: (user) => set({ user }),
      fetchUser: async (id) => {
        set({ loading: true });
        try {
          const data = await api.get(`/users/${id}`);
          set({ user: data });
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: 'user-store' }
  )
);

// ❌ MAUVAIS - Trop de logique
export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  // ...longue logique business...
}));
```

#### Pattern API
```javascript
// ✅ BON
try {
  const data = await api.post('/endpoint', payload);
  return data;
} catch (error) {
  throw error.response?.data || error.message;
}

// ❌ MAUVAIS - Pas d'erreur handling
const data = await api.post('/endpoint', payload);
```

### Async/Await

```javascript
// ✅ BON
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const result = await api.post('/api/endpoint', data);
    setSuccess('Succès!');
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

// ❌ MAUVAIS - Sans try/catch
const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await api.post('/api/endpoint', data);
  setSuccess('Succès!');
};
```

## 🎨 CSS & Tailwind

### Ordre des classes
```jsx
// Ordre recommandé: position → display → sizing → margin → padding → colors
<div className="relative flex h-20 w-full mt-4 p-4 bg-white border border-gray-200 rounded-lg">
```

### Utilitaires personnalisés
```css
/* ✅ BON - Réutiliser */
.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors;
}

/* ❌ MAUVAIS - Classes partout */
<button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
```

### Variables Tailwind
```css
/* Dans globals.css */
:root {
  --color-primary: #2D6A4F;
  --color-secondary: #52B788;
}

/* Usage */
.my-element {
  background-color: var(--color-primary);
}
```

## 🧪 Testing

### Structure de test
```javascript
// components/__tests__/Card.test.jsx
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card Component', () => {
  test('renders children correctly', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  test('applies hover effect when enabled', () => {
    render(<Card hover>Content</Card>);
    // ...assertions
  });
});
```

## 📱 Responsive Design

### Mobile-First Approach
```jsx
// ✅ BON - Mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ MAUVAIS - Desktop first
<div className="grid grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4">
```

### Breakpoints
```javascript
// Tailwind breakpoints (utiliser ces tailles)
sm:  640px   // Mobile landscape
md:  768px   // Tablet
lg:  1024px  // Desktop
xl:  1280px  // Large desktop
2xl: 1536px  // Ultra-wide
```

## ♿ Accessibilité

### ARIA Labels
```jsx
// ✅ BON - Accessible
<button aria-label="Fermer le modal" onClick={handleClose}>
  <X size={20} />
</button>

// ❌ MAUVAIS - Pas d'accessibilité
<button onClick={handleClose}>
  <X size={20} />
</button>
```

### Semantic HTML
```jsx
// ✅ BON
<main>
  <header>
    <nav>Navigation</nav>
  </header>
  <article>
    <h1>Titre</h1>
  </article>
</main>

// ❌ MAUVAIS
<div>
  <div className="header">
    <div>Navigation</div>
  </div>
  <div>
    <div>Titre</div>
  </div>
</div>
```

## 🔒 Sécurité

### XSS Prevention
```jsx
// ✅ BON - React échappe automatiquement
<p>{userInput}</p>

// ❌ MAUVAIS - dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### Token Management
```javascript
// ✅ BON - Token dans header
const token = localStorage.getItem('token');
api.defaults.headers.Authorization = `Bearer ${token}`;

// ❌ MAUVAIS - Token en clair dans URL
fetch(`/api/data?token=${token}`);
```

## 📊 Performance

### Code Splitting
```javascript
// ✅ BON - Lazy load
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
});

// Utilisation
<HeavyComponent />
```

### Memoization
```javascript
// ✅ BON - Éviter re-render inutile
const MemoizedCard = React.memo(Card);

// Ou avec useCallback
const handleClick = useCallback(() => {
  // Action
}, [dependencies]);
```

### Image Optimization
```jsx
// ✅ BON - Lazy load + responsive
<img 
  src="image.jpg" 
  alt="Description"
  loading="lazy"
  width="800"
  height="600"
/>

// ❌ MAUVAIS
<img src="huge-image.png" alt="image" />
```

## 📚 Commentaires

### Documentation
```javascript
// ✅ BON - Documenter le "pourquoi"
// Utiliser IndexedDB au lieu de localStorage
// pour éviter le limite de 5MB
const [data] = useFetch('/api/data');

// ❌ MAUVAIS - État obvious
// Récupérer les données
const [data] = useFetch('/api/data');
```

### Commentaires JSDoc
```javascript
/**
 * Analyse une image avec TensorFlow.js
 * @async
 * @param {File} imageFile - Fichier image à analyser
 * @param {string} cropType - Type de culture (tomato/potato/pepper)
 * @returns {Promise<Object>} Résultat de l'analyse
 * @throws {Error} Si le modèle ne se charge pas
 */
async function analyzeImage(imageFile, cropType) {
  // ...
}
```

## 🔄 Git Workflow

### Commit Messages
```bash
# ✅ BON
git commit -m "feat: Add detection result component"
git commit -m "fix: Correct i18n language toggle"
git commit -m "docs: Update README with PWA setup"

# ❌ MAUVAIS
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

### Branch Naming
```bash
# Feature
git checkout -b feature/detection-analysis

# Bugfix
git checkout -b fix/offline-sync

# Docs
git checkout -b docs/api-setup
```

## 📋 Checklist Avant Commit

- [ ] Code formaté avec Prettier
- [ ] Pas d'erreurs ESLint
- [ ] Tests passent
- [ ] Pas de `console.log()` en production
- [ ] Pas de secrets en hardcoded
- [ ] Messages de commit clairs
- [ ] Features documentées
- [ ] Accessible (WCAG 2.1)
- [ ] Mobile responsive
- [ ] Perf acceptable

---

Ces conventions garantissent une **maintenabilité** et **scalabilité** optimales du projet.
