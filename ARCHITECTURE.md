# AGILICS - Architecture Technique

## 🏗️ Stack Technologique

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 avec Tailwind CSS
- **State**: Zustand avec persist
- **i18n**: react-i18next + JSON
- **ML**: TensorFlow.js avec WebGL backend
- **API Client**: Axios avec intercepteurs

### Infrastructure
- **Build**: Next.js SSR + Static Export
- **Deploy**: Vercel (edge + serverless)
- **PWA**: Service Worker + Web App Manifest
- **Cache**: Workbox strategies

### Langues
- **FR**: Inter font (sans-serif)
- **AR**: Cairo font + RTL automatique

## 🎯 Architecture Modulaire

### 1. **App Router Structure**
```
app/
├── (auth)              ← Route group non affichée
│   └── auth/page.jsx
├── (main)              ← Routes connectées
│   ├── dashboard/
│   ├── detection/
│   ├── history/
│   ├── plants/
│   ├── medicine/
│   └── profile/
└── components/         ← Partagés
```

### 2. **State Management (Zustand)**
```javascript
// Stores persistants (localStorage)
- useAuthStore()         // user, token, language
- useDetectionStore()    // détections historique
- usePlantsStore()       // plantes suivies

// Pas de Redux/MobX = plus léger
```

### 3. **Component Architecture**
```
components/
├── Header.jsx          ← Global, sticky
├── BottomNav.jsx       ← Mobile nav
├── CropCard.jsx        ← Reusable card
├── DetectionResult.jsx ← Composed
└── Loading.jsx         ← Utilities
```

**Patterns:**
- Props drilling minimal
- Composition over inheritance
- Custom hooks pour logique

### 4. **Hooks Personnalisés**
```
hooks/
├── useOnlineStatus()   ← Navigator.onLine + events
├── useDetection()      ← TensorFlow.js wrapper
└── useI18n()           ← i18next wrapper
```

## 🔄 Data Flow

```
User → Input
  ↓
API Call (axios)
  ↓
Response
  ↓
Zustand Store (persist)
  ↓
Component re-render
  ↓
UI Update
```

### Offline Flow
```
User → Input
  ↓
Check navigator.onLine
  ├─ true → API Call
  └─ false → TensorFlow.js local
  ↓
Result → IndexedDB (via Zustand persist)
  ↓
Sync when back online (Service Worker)
```

## 🚀 Performance Optimizations

### Code Splitting
```javascript
// Automatique avec Next.js
// Chaque page = chunk séparé
// ~50KB JS par page
```

### Image Optimization
```javascript
// Tailwind + native img
// WebP + avif formats
// Lazy loading via browser
```

### Bundle Size
```
Initial JS: ~45KB (gzip)
Assets cache: ~100MB (offline)
Local model: ~10MB TensorFlow.js

Total Install: ~50MB
```

### Caching Strategy
```
1. Service Worker cache
   - Static assets: cache-first
   - API: network-first (with fallback)
   - HTML: network-first

2. Browser cache
   - Images: 30 days
   - JS/CSS: 1 year (with hash)
   - API: no-cache

3. Local storage
   - Auth token
   - User preferences
   - Detections history
```

## 🔐 Security

### Authentication
```javascript
// JWT Token Flow
1. Login → GET token
2. Store in localStorage
3. Add to axios interceptor
4. Send with every request
5. Logout → Clear token
```

### Data Protection
```
- HTTPS only in production
- No sensitive data in localStorage
- API validation on backend
- CORS configuration
- Content-Security-Policy headers
```

## 📱 Responsive Design

### Breakpoints (Tailwind)
```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Wide */
2xl: 1536px  /* Ultra-wide */
```

### Mobile-First Approach
```css
/* Default = mobile */
.component { /* mobile styles */ }

/* Tablet+ */
@media (md:) { /* tablet styles */ }

/* Desktop+ */
@media (lg:) { /* desktop styles */ }
```

## 🌍 i18n Implementation

### File Structure
```
locales/
├── fr.json
│   └── { "common": { "appName": "AGILICS" }, ... }
└── ar.json
    └── { "common": { "appName": "أجيليكس" }, ... }
```

### Nested Keys
```json
{
  "auth": {
    "login": "...",
    "signup": "..."
  },
  "detection": {
    "title": "...",
    "result": "..."
  }
}
```

### Runtime Switching
```javascript
// Trigger via Header button
changeLanguage(lang === 'fr' ? 'ar' : 'fr')

// Persist
useAuthStore.setState({ language: lang })
localStorage.setItem('language', lang)

// Auto RTL
html[lang='ar'] { direction: rtl; }
```

## 🤖 TensorFlow.js Integration

### Model Loading
```javascript
// Lazy load au premier accès
const [model, setModel] = useState(null);

useEffect(() => {
  if (!model) {
    tf.loadLayersModel(MODEL_URL).then(setModel);
  }
}, [model]);
```

### Image Processing
```javascript
1. Load image → tf.browser.fromPixels()
2. Resize → 224x224 (MobileNet)
3. Normalize → divide by 255
4. Predict → model.predict()
5. Cleanup → tensor.dispose()
```

### Memory Management
```javascript
// Éviter memory leaks
// Toujours dispose() les tensors
// WeakMap pour cache

const tensorCache = new WeakMap();
```

## 🔌 API Integration

### Client Setup
```javascript
// app/lib/api.js
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000
});

// Interceptor pour token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Error Handling
```javascript
try {
  const response = await api.post('/endpoint', data);
  return response.data;
} catch (error) {
  // Network error
  if (!error.response) throw new Error('Network error');
  
  // Server error
  throw error.response.data;
}
```

## 📦 Deployment Pipeline

### Development
```bash
npm run dev    # localhost:3000
```

### Build
```bash
npm run build  # Optimize for production
# Next.js: SSR + Static Export
# Tailwind: CSS minification
# JS: Terser minification
```

### Deploy (Vercel)
```bash
git push origin main

# Vercel triggers:
# 1. Fetch code
# 2. npm install
# 3. npm run build
# 4. Deploy to edge
# 5. Invalidate cache
```

### Monitoring
```
- Vercel Analytics: Core Web Vitals
- Error tracking: Sentry (optional)
- API monitoring: Backend logs
```

## 🧪 Testing Strategy

### Unit Tests (Jest + React Testing Library)
```javascript
// components/__tests__/Header.test.jsx
test('toggles language', () => {
  render(<Header />);
  const button = screen.getByRole('button', { name: /arabe/i });
  fireEvent.click(button);
  // Assertions
});
```

### E2E Tests (Playwright)
```javascript
// e2e/auth.spec.ts
test('signup flow', async ({ page }) => {
  await page.goto('/auth');
  await page.fill('input[name="email"]', 'test@test.com');
  // Complete signup
});
```

### Performance Tests
```bash
npm run lighthouse  # Local audit
# Vercel: Automatic Lighthouse on every deploy
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install && npm run build
      - run: npm test
      - uses: vercel/action@v28
```

## 🎨 Design System

### Color System (Tailwind)
```javascript
// Custom palette
primary: {
  50: '#f0f4f1',
  100: '#dce8e2',
  ...
  500: '#2D6A4F',  // Main
  600: '#246347',
  700: '#1d523b'
}
```

### Typography
```css
/* FR */
body { font-family: var(--font-inter); }

/* AR */
html[lang='ar'] { font-family: var(--font-cairo); }
```

### Components Utilities
```css
.card { /* default card styles */ }
.card-hover { /* with hover effect */ }
.btn-primary { /* primary button */ }
.input-field { /* form input */ }
.badge { /* label badge */ }
```

## 📊 Metrics & KPIs

### Web Vitals (Lighthouse)
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **FCP**: < 1.8s (First Contentful Paint)

### Application Metrics
- **Bundle Size**: < 100KB gzip
- **Time to Interactive**: < 3s
- **Offline Functionality**: 100%
- **Browser Support**: Last 2 versions + iOS 12+

## 🚀 Future Optimizations

- [ ] Static Site Generation (ISR)
- [ ] Service Worker precaching
- [ ] Image CDN (Cloudinary)
- [ ] Redis caching (API)
- [ ] Database optimization (indexes)
- [ ] GraphQL (optional)
- [ ] Micro-frontends
- [ ] Edge computing (Workers)

---

**Architecture décidée pour maximiser:**
- ✅ Performance (PWA + offline)
- ✅ Maintenabilité (modular)
- ✅ Scalabilité (Vercel auto)
- ✅ Accessibilité (Semantic HTML)
- ✅ SEO (Next.js SSR)
