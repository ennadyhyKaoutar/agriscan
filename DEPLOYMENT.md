# AGILICS - Guide Déploiement Complet 🚀

## Table des Matières
1. [Déploiement Vercel (Frontend)](#vercel)
2. [Déploiement Railway (Backend)](#railway)
3. [Déploiement Docker](#docker)
4. [Configuration Post-Déploiement](#config)
5. [Monitoring & Maintenance](#monitoring)

---

## 🟦 Vercel (Frontend) {#vercel}

### Prérequis
- Compte Vercel gratuit (https://vercel.com)
- Repo GitHub avec le code

### Step 1: Connecter GitHub à Vercel

```bash
# 1. Créer un repo GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/agilics-app.git
git push -u origin main
```

### Step 2: Importer sur Vercel

1. Aller sur https://vercel.com/new
2. Cliquer "Import Git Repository"
3. Chercher "agilics-app"
4. Cliquer "Import"

### Step 3: Configuration Vercel

```
Project Name: agilics-app
Framework: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm ci
```

### Step 4: Ajouter Variables d'Env

Dans Vercel Dashboard:
```
Settings → Environment Variables

NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_GOOGLE_MAPS_KEY=YOUR_KEY
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_ID
```

### Step 5: Configurer Custom Domain (optionnel)

```
Settings → Domains
Ajouter: agilics.ma (ou votre domaine)
Suivre les instructions DNS
```

### Step 6: Deploy!

```bash
git push origin main  # Auto-triggers deployment
```

✅ L'app est live sur `https://agilics-app.vercel.app`

---

## 🚆 Railway (Backend API) {#railway}

### Prérequis
- Compte Railway (https://railway.app)
- PostgreSQL database
- Node.js API code

### Step 1: Créer un Service Railway

1. Aller sur https://railway.app/new
2. Cliquer "Deploy from GitHub"
3. Connecter GitHub
4. Sélectionner le repo API

### Step 2: Configurer Environment

Railway auto-détecte:
- Node.js (depuis package.json)
- PostgreSQL (si dans Dockerfile)

Ajouter manuellement:
```
Settings → Variables

DATABASE_URL=postgresql://...
JWT_SECRET=generate_strong_secret
NODE_ENV=production
API_PORT=5000
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### Step 3: Database PostgreSQL

```bash
# Railway crée automatiquement une DB
# Pour vous connecter localement:

# 1. Copier la DATABASE_URL depuis Railway
DATABASE_URL="postgresql://user:pass@host:port/db"

# 2. Appliquer migrations
npx prisma migrate deploy

# 3. Seed data (optionnel)
npx prisma db seed
```

### Step 4: Deploy

```bash
git push origin main  # Auto-builds et deploy

# Ou manuellement
railway link  # Lier le projet local
railway up    # Deploy
```

✅ API est live sur `https://api.railway.app` (ou custom domain)

---

## 🐳 Docker {#docker}

### Option A: Docker Compose (Développement)

```bash
# 1. Construire les images
docker-compose build

# 2. Démarrer tous les services
docker-compose up -d

# 3. Vérifier
docker-compose ps

# Frontend: http://localhost:3000
# API: http://localhost:5000
# PostgreSQL: localhost:5432
```

### Option B: Docker Seul (Production)

```bash
# 1. Build l'image
docker build -t agilics-app:latest .

# 2. Run le container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.your-domain.com \
  agilics-app:latest

# 3. Accéder
# http://localhost:3000
```

### Option C: Kubernetes (Scaling)

```bash
# 1. Créer une image
docker build -t your-registry/agilics-app:v1 .
docker push your-registry/agilics-app:v1

# 2. Appliquer Kubernetes config
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# 3. Vérifier
kubectl get pods
kubectl get services
```

---

## ⚙️ Configuration Post-Déploiement {#config}

### 1. SSL/HTTPS

```bash
# Vercel: Auto (Let's Encrypt)
# Railway: Auto

# Pour custom domain:
# DNS: Ajouter records CNAME
```

### 2. CORS Configuration

```javascript
// Backend: app.js ou server.js
const cors = require('cors');

app.use(cors({
  origin: [
    'https://agilics-app.vercel.app',
    'https://agilics.ma',
    'https://www.agilics.ma'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

### 3. Database Backups

```bash
# Railway: Auto-backups enabled

# PostgreSQL backup manuel:
pg_dump $DATABASE_URL > backup.sql

# Restore:
psql $DATABASE_URL < backup.sql
```

### 4. Email Configuration (Sendinblue)

```javascript
// lib/email.js
const SibApiV3Sdk = require('sib-api-v3-sdk');

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// Envoyer email
tranEmailApi.sendTransacEmail({
  Subject: 'Bienvenue sur AGILICS',
  To: [{ email: user.email }],
  HtmlContent: '<h1>Bienvenue!</h1>',
  From: { email: 'noreply@agilics.ma' }
});
```

### 5. Analytics Setup

```html
<!-- Next.js: app/layout.jsx -->
<Script 
  strategy="afterInteractive"
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
/>
<Script
  id="google-analytics"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_ID');
    `
  }}
/>
```

### 6. Error Tracking (Sentry)

```bash
# 1. Créer compte Sentry (https://sentry.io)

# 2. Installer
npm install @sentry/nextjs

# 3. Configuration: sentry.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## 📊 Monitoring & Maintenance {#monitoring}

### Health Checks

```bash
# Frontend
curl https://agilics-app.vercel.app/api/health

# API
curl https://api.railway.app/health

# Expected: { "status": "ok" }
```

### Performance Monitoring

```javascript
// Vercel Analytics (built-in)
// Check: https://vercel.com/dashboard/analytics

// Railway Metrics
// Check: Dashboard → Metrics
```

### Logs

```bash
# Vercel
vercel logs  # Frontend logs

# Railway
railway logs  # Backend logs

# Docker
docker logs agilics-app
```

### Database Maintenance

```bash
# Vacuum & Analyze
psql $DATABASE_URL

\c agilics
VACUUM ANALYZE;

-- Désactiver les vieux logs
SELECT pg_database.datname,
  pg_size_pretty(pg_database_size(pg_database.datname))
FROM pg_database;
```

### Certificate Renewal

```bash
# Vercel & Railway: Auto (Let's Encrypt)
# Manual check:
openssl s_client -connect agilics.ma:443
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v28
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🚨 Troubleshooting Déploiement

### Vercel

```bash
# Build échoue
# → Check: npm run build localement
# → Vérifier package.json
# → Logs: Vercel Dashboard

# Variables d'env non trouvées
# → Vercel > Settings > Environment Variables
# → Redeploy après ajout

# PWA ne s'installe pas
# → Check manifest.json accessible
# → Service worker registered
# → HTTPS obligatoire
```

### Railway

```bash
# API démarre puis crash
# → Check: npm start command
# → Verify: Procfile ou package.json scripts
# → Logs: railway logs

# Database connection error
# → Check: DATABASE_URL dans variables
# → Verify: Syntax postgresql://user:pass@host/db

# Memory/CPU exceeded
# → Upgrade plan
# → Optimize query performance
```

### Docker

```bash
# Image build échoue
docker build --no-cache -t agilics:latest .

# Container crash au startup
docker logs agilics

# Port déjà utilisé
docker run -p 3001:3000 agilics:latest
```

---

## 📋 Checklist Déploiement

- [ ] Tests passent localement
- [ ] Variables d'env configurées
- [ ] Database migrations appliquées
- [ ] Assets optimisés
- [ ] SSL certificat valide
- [ ] CORS configuration correcte
- [ ] Backups configurés
- [ ] Monitoring activé
- [ ] Error tracking setup
- [ ] Analytics implémenté
- [ ] Email service fonctionnel
- [ ] Health checks passent
- [ ] Lighthouse score > 90
- [ ] Mobile tested
- [ ] Documentation mise à jour

---

## 🎉 Déploiement Réussi!

Félicitations! Votre app AGILICS est maintenant **live en production** 🚀

### Prochaines étapes:
1. Monitorer les logs quotidiennement
2. Gather user feedback
3. Plan v1.1 improvements
4. Scale infrastructure si besoin
5. Community building

### Contacts Support:
- Vercel Support: vercel.com/support
- Railway Support: railway.app/support
- GitHub Issues: Votre repo

---

**Dernière mise à jour: Mars 2026**
