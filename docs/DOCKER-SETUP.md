# Configuration Docker - CESI Zen

## 🐳 Vue d'ensemble

Ce projet utilise Docker et Docker Compose pour containeriser l'application CESI Zen, facilitant le développement, les tests et le déploiement.

## 📁 Structure Docker

```
cesi-zen/
├── docker-compose.yml              # Configuration production
├── docker-compose.dev.yml          # Configuration développement
├── .dockerignore                   # Fichiers à ignorer lors du build
├── env.example                     # Variables d'environnement exemple
├── cesi-zen-code/
│   ├── backend-ts/
│   │   ├── Dockerfile              # Image production backend
│   │   └── Dockerfile.dev          # Image développement backend
│   └── frontend/
│       ├── Dockerfile              # Image production frontend
│       └── Dockerfile.dev          # Image développement frontend
```

## 🚀 Démarrage rapide

### 1. Cloner le projet
```bash
git clone https://github.com/your-username/cesi-zen.git
cd cesi-zen
```

### 2. Configurer les variables d'environnement
```bash
cp env.example .env
# Modifier .env avec vos valeurs
```

### 3. Lancer en mode développement
```bash
# Démarrer tous les services avec hot-reload
docker-compose -f docker-compose.dev.yml up

# Ou en arrière-plan
docker-compose -f docker-compose.dev.yml up -d
```

### 4. Lancer en mode production
```bash
# Construire et démarrer
docker-compose up --build

# Ou en arrière-plan
docker-compose up -d
```

## 🛠️ Services disponibles

### Mode Production (`docker-compose.yml`)

| Service | Port | Description |
|---------|------|-------------|
| mongodb | 27017 | Base de données MongoDB |
| backend | 5000 | API Node.js/Express |
| frontend | 3000 | Application Next.js |

### Mode Développement (`docker-compose.dev.yml`)

| Service | Port | Description |
|---------|------|-------------|
| mongodb-dev | 27018 | MongoDB développement |
| backend-dev | 5001 | API avec hot-reload |
| frontend-dev | 3000 | Next.js avec hot-reload |
| adminer | 8080 | Interface web MongoDB |
| redis-dev | 6379 | Cache Redis (optionnel) |

## 📖 Commandes utiles

### Développement

```bash
# Démarrer le développement
docker-compose -f docker-compose.dev.yml up

# Démarrer avec des services spécifiques
docker-compose -f docker-compose.dev.yml up mongodb-dev backend-dev

# Voir les logs
docker-compose -f docker-compose.dev.yml logs -f

# Accéder au shell d'un container
docker-compose -f docker-compose.dev.yml exec backend-dev sh

# Arrêter et supprimer les volumes
docker-compose -f docker-compose.dev.yml down -v

# Reconstruire les images
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Production

```bash
# Démarrer la production
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Mettre à jour les images
docker-compose pull
docker-compose up -d

# Backup de la base de données
docker-compose exec mongodb mongodump --out /backup

# Restaurer la base de données
docker-compose exec mongodb mongorestore /backup
```

### Gestion des images

```bash
# Construire une image spécifique
docker build -t cesi-zen-backend ./cesi-zen-code/backend-ts

# Voir les images
docker images

# Supprimer les images non utilisées
docker image prune

# Supprimer toutes les données Docker
docker system prune -a --volumes
```

## 🔧 Configuration des variables d'environnement

### Variables principales

```bash
# Base de données
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=changeme123
MONGO_DATABASE=cesi-zen
MONGO_PORT=27017

# Backend
BACKEND_PORT=5000
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000

# Frontend
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Variables pour la production

```bash
# Sécurité renforcée
MONGO_ROOT_PASSWORD=super-secure-password-here
JWT_SECRET=generate-a-very-secure-random-jwt-secret
CORS_ORIGIN=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

## 🔍 Health Checks

Tous les services incluent des health checks :

```bash
# Vérifier le statut des services
docker-compose ps

# Tester manuellement les endpoints
curl http://localhost:5000/api/health
curl http://localhost:3000
```

## 🚀 Déploiement

### Déploiement automatique avec CI/CD

Le projet inclut un workflow GitHub Actions (`docker-ci-cd.yml`) qui :
1. Teste l'application avec Docker Compose
2. Construit et pousse les images vers GitHub Container Registry
3. Déploie automatiquement (à configurer)

### Déploiement manuel

#### Sur un serveur VPS

```bash
# 1. Copier les fichiers sur le serveur
scp docker-compose.yml .env user@server:/app/
scp -r nginx/ user@server:/app/

# 2. Se connecter au serveur
ssh user@server

# 3. Démarrer l'application
cd /app
docker-compose pull
docker-compose up -d
```

#### Sur Railway

```bash
# Railway détecte automatiquement Docker
# 1. Connecter votre repository
# 2. Configurer les variables d'environnement
# 3. Déployer automatiquement
```

#### Sur DigitalOcean App Platform

```yaml
# Créer un fichier .do/app.yaml
name: cesi-zen
services:
  - name: backend
    source_dir: cesi-zen-code/backend-ts
    github:
      repo: your-username/cesi-zen
      branch: main
    dockerfile_path: Dockerfile
    
  - name: frontend
    source_dir: cesi-zen-code/frontend
    github:
      repo: your-username/cesi-zen
      branch: main
    dockerfile_path: Dockerfile
```

## 🧪 Tests avec Docker

### Tests automatisés

```bash
# Lancer les tests du backend
docker-compose -f docker-compose.dev.yml run --rm backend-dev npm run test

# Tests avec couverture
docker-compose -f docker-compose.dev.yml run --rm backend-dev npm run test:coverage

# Tests d'intégration
docker-compose up -d
# Attendre que les services soient prêts
curl http://localhost:5000/api/health
curl http://localhost:3000
docker-compose down
```

### Tests manuels

```bash
# Démarrer en mode test
docker-compose -f docker-compose.dev.yml up mongodb-dev
docker-compose -f docker-compose.dev.yml run --rm -e NODE_ENV=test backend-dev
```

## 🐛 Dépannage

### Problèmes courants

#### Port déjà utilisé
```bash
# Voir les processus utilisant le port
lsof -i :3000
sudo netstat -tlnp | grep :3000

# Arrêter le processus
sudo kill -9 PID
```

#### Problèmes de permissions
```bash
# Changer les permissions des volumes
sudo chown -R $USER:$USER ./data

# Construire avec l'utilisateur actuel
docker-compose build --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g)
```

#### Base de données corrompue
```bash
# Supprimer et recréer les volumes
docker-compose down -v
docker volume prune
docker-compose up -d
```

#### Images corrompues
```bash
# Reconstruire les images sans cache
docker-compose build --no-cache
docker system prune -a
```

### Logs et debugging

```bash
# Voir tous les logs
docker-compose logs

# Logs d'un service spécifique
docker-compose logs -f backend

# Logs avec timestamps
docker-compose logs -t

# Exécuter des commandes dans un container
docker-compose exec backend sh
docker-compose exec mongodb mongosh
```

## 📊 Monitoring

### Métriques de base

```bash
# Utilisation des ressources
docker stats

# Espace disque utilisé
docker system df

# Informations sur les containers
docker-compose ps
docker inspect container_name
```

### Logs centralisés

Pour la production, considérez l'ajout de :
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Grafana + Prometheus**
- **Sentry** pour le monitoring d'erreurs

## 🔐 Sécurité

### Bonnes pratiques

1. **Variables d'environnement sécurisées**
   ```bash
   # Générer des secrets forts
   openssl rand -hex 32  # Pour JWT_SECRET
   ```

2. **Utilisateurs non-root dans les containers**
   ```dockerfile
   # Déjà implémenté dans nos Dockerfiles
   USER backend  # ou nextjs
   ```

3. **Mise à jour régulière des images**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

4. **Scan de sécurité**
   ```bash
   # Avec Docker Scout
   docker scout cves cesi-zen-backend
   ```

## 📚 Ressources supplémentaires

- [Documentation Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Next.js avec Docker](https://nextjs.org/docs/deployment#docker-image)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp)
- [MongoDB Docker](https://hub.docker.com/_/mongo) 