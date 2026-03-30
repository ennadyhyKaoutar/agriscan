# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build l'application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Installer dumb-init pour gérer les signaux
RUN apk add --no-cache dumb-init

# Copier les dépendances de production
COPY package.json package-lock.json ./
RUN npm ci --production

# Copier les fichiers buildés depuis le stage 1
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Exposer le port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Utiliser dumb-init pour démarrer l'app
ENTRYPOINT ["/sbin/dumb-init", "--"]
CMD ["npm", "start"]
