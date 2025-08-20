# Backend TypeScript Dockerfile
# Multi-stage build pour optimiser la taille de l'image finale

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Construire l'application TypeScript
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer uniquement les dépendances de production
RUN npm ci --only=production

# Copier le code compilé depuis le stage builder
COPY --from=builder /app/dist ./dist

# Changer le propriétaire des fichiers
RUN chown -R backend:nodejs /app
USER backend

# Exposer le port
EXPOSE 5000

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5000

# Commande de démarrage
CMD ["node", "dist/index.js"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" 