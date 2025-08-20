# Configuration CI/CD - CESI Zen

## 🚀 Vue d'ensemble

Ce projet utilise GitHub Actions pour l'intégration continue (CI) et le déploiement continu (CD). La configuration CI/CD automatise les tests, la construction et le déploiement de l'application CESI Zen.

## 📁 Structure des workflows

```
.github/
├── workflows/
│   └── ci-cd.yml              # Workflow principal CI/CD
├── dependabot.yml             # Configuration Dependabot pour les dépendances
└── PULL_REQUEST_TEMPLATE.md   # Template pour les pull requests
```

## 🔄 Workflow principal (`ci-cd.yml`)

### Déclencheurs
- **Push** sur les branches `main` et `develop`
- **Pull Request** vers les branches `main` et `develop`

### Jobs

#### 1. **Backend Tests & Build** (`backend-tests`)
- **Environnement** : Ubuntu Latest
- **Répertoire de travail** : `./cesi-zen-code/backend-ts`
- **Services** : MongoDB 7 (pour les tests d'intégration)

**Étapes :**
1. Installation de Node.js 20
2. Installation de pnpm 10.5.2
3. Cache des dépendances pnpm
4. Installation des dépendances (`pnpm install --frozen-lockfile`)
5. Analyse ESLint (`pnpm run lint`)
6. Vérification TypeScript (`pnpm run build`)
7. Exécution des tests avec couverture (`pnpm run test:coverage`)
8. Upload du rapport de couverture vers Codecov

#### 2. **Frontend Tests & Build** (`frontend-tests`)
- **Environnement** : Ubuntu Latest
- **Répertoire de travail** : `./cesi-zen-code/frontend`

**Étapes :**
1. Installation de Node.js 20
2. Installation de pnpm 10.5.2
3. Cache des dépendances pnpm
4. Installation des dépendances (`pnpm install --frozen-lockfile`)
5. Analyse ESLint (`pnpm run lint`)
6. Build Next.js (`pnpm run build`)

#### 3. **Integration Tests** (`integration-tests`)
- **Dépendances** : `backend-tests` et `frontend-tests`
- **Condition** : Uniquement sur push vers `main` ou `develop`
- **Services** : MongoDB 7

**Étapes :**
1. Installation et build du backend
2. Démarrage du serveur backend en arrière-plan
3. Vérification que l'API est accessible (`/api/health`)
4. Build du frontend avec connexion au backend
5. Arrêt du serveur backend

#### 4. **Deploy** (`deploy`)
- **Dépendances** : Tous les jobs précédents
- **Condition** : Uniquement sur push vers `main`
- **Environnement** : `production`

**Note** : Les étapes de déploiement sont actuellement désactivées (`if: false`) et doivent être configurées selon votre plateforme de déploiement.

## 🔧 Configuration requise

### Variables d'environnement pour la CI

Le workflow utilise les variables d'environnement suivantes :

```yaml
# Backend (tests)
NODE_ENV: test
MONGODB_URI: mongodb://testuser:testpass@localhost:27017/cesi-zen-test?authSource=admin
JWT_SECRET: test-secret-key-for-ci
PORT: 5000

# Frontend (build)
NEXT_PUBLIC_API_URL: http://localhost:5000
```

### Secrets GitHub (pour le déploiement)

Pour activer le déploiement, configurez ces secrets dans votre repository GitHub :

```bash
# Pour Vercel (frontend)
VERCEL_TOKEN=your_vercel_token
ORG_ID=your_vercel_org_id
PROJECT_ID=your_vercel_project_id

# Pour d'autres plateformes (backend)
# Ajoutez les secrets appropriés selon votre choix de déploiement
```

## 🤖 Dependabot

Dependabot est configuré pour maintenir automatiquement les dépendances à jour :

- **Fréquence** : Hebdomadaire (lundi à 9h)
- **Scope** : 
  - Backend TypeScript (`/cesi-zen-code/backend-ts`)
  - Frontend (`/cesi-zen-code/frontend`)
  - Backend legacy (`/cesi-zen-code/backend`)
  - GitHub Actions (`/`)

## 🚦 Statut des builds

Les badges de statut peuvent être ajoutés au README :

```markdown
![CI/CD](https://github.com/your-username/cesi-zen/workflows/CI/CD%20Pipeline/badge.svg)
![Codecov](https://codecov.io/gh/your-username/cesi-zen/branch/main/graph/badge.svg)
```

## 🔍 Health Check

Un endpoint de health check a été ajouté au backend pour la CI/CD :

```typescript
GET /api/health

Response:
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "test"
}
```

## 🚀 Plateformes de déploiement suggérées

### Frontend (Next.js)
- **Vercel** (recommandé) - Configuration incluse mais désactivée
- **Netlify**
- **AWS Amplify**
- **Railway**

### Backend (Node.js/Express)
- **Railway** (recommandé pour les projets étudiants)
- **Heroku**
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**
- **Google Cloud Run**

### Base de données
- **MongoDB Atlas** (recommandé)
- **Railway PostgreSQL** (alternative)

## 📝 Activation du déploiement

Pour activer le déploiement automatique :

1. **Choisissez votre plateforme** de déploiement
2. **Configurez les secrets** GitHub appropriés
3. **Modifiez le workflow** :
   ```yaml
   # Changez 'if: false' en 'if: true' ou supprimez la condition
   - name: Deploy Frontend to Vercel
     if: true  # ou supprimez cette ligne
   ```
4. **Testez** sur une branche de développement d'abord

## 🛠️ Maintenance

### Mise à jour des versions
- **Node.js** : Modifiez `NODE_VERSION` dans le workflow
- **pnpm** : Modifiez `PNPM_VERSION` dans le workflow
- **MongoDB** : Modifiez la version dans les services

### Ajout de nouveaux tests
- Ajoutez vos tests dans les répertoires appropriés
- Ils seront automatiquement exécutés par la CI

### Modification des branches surveillées
```yaml
on:
  push:
    branches: [ main, develop, staging ]  # Ajoutez vos branches
  pull_request:
    branches: [ main, develop ]
```

## 🐛 Dépannage

### Erreurs communes

1. **Tests MongoDB échouent** :
   - Vérifiez que les services MongoDB sont configurés
   - Vérifiez l'URI de connexion

2. **Build frontend échoue** :
   - Vérifiez les variables d'environnement Next.js
   - Vérifiez que toutes les dépendances sont dans `package.json`

3. **Cache pnpm invalide** :
   - Modifiez la clé de cache dans le workflow
   - Les caches se régénèrent automatiquement

### Logs et debugging

- Consultez l'onglet "Actions" de votre repository GitHub
- Chaque étape affiche ses logs détaillés
- Utilisez `console.log` dans vos tests pour le debugging

## 📚 Ressources

- [Documentation GitHub Actions](https://docs.github.com/actions)
- [Guide pnpm GitHub Actions](https://pnpm.io/continuous-integration#github-actions)
- [Next.js déploiement](https://nextjs.org/docs/deployment)
- [MongoDB en CI](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) 