# 🔄 CI/CD pour l'Évaluation

## 📋 Ce que contient notre pipeline

### ✅ CI (Intégration Continue)

Notre pipeline GitHub Actions (`.github/workflows/ci.yml`) vérifie automatiquement :

1. **📦 Checkout + Installation**
   - Récupération du code
   - Installation Node.js 20
   - Installation des dépendances (`npm ci`)

2. **🔍 Qualité du code**
   - ESLint sur backend et frontend
   - Vérification TypeScript lors du build

3. **🧪 Tests unitaires**
   - Tests Jest sur le backend avec MongoDB de test
   - Base de données isolée pour les tests

4. **🏗️ Build**
   - Build du backend TypeScript
   - Build du frontend Next.js

5. **🐳 Test Docker (optionnel)**
   - Vérification que `docker-compose.yml` fonctionne
   - Test de démarrage des services

## 🚀 CD (Déploiement Continu)

### Option A - Déploiement local/Docker (choisi)

**Environnements disponibles :**

- **Dev** : `docker-compose up`
- **Test** : `docker-compose -f docker-compose.test.yml up` (peut être créé)
- **Prod** : même principe avec `.env.prod`

**Avantages :**
- Reproductible sur n'importe quelle machine
- Isolation complète des services
- Configuration via variables d'environnement

### Option B - Cloud (pour aller plus loin)

- Frontend → Vercel (auto-deploy sur push)
- Backend → Render/Railway 
- Base de données → MongoDB Atlas

## 📁 Structure des fichiers

```
cesi-zen/
├── .github/workflows/
│   ├── ci.yml          # Pipeline d'intégration continue
│   └── cd.yml          # Pipeline de déploiement (optionnel)
├── docker-compose.yml   # Configuration production
├── docker-compose.dev.yml # Configuration développement
├── env.example         # Variables d'environnement
└── docs/
    └── CI-CD-EVAL.md   # Ce fichier
```

## 🎯 Points évaluation couverts

- ✅ **Versioning** : Git avec branches (main/develop) + tags (v1.0.0)
- ✅ **Automatisation** : GitHub Actions pipeline
- ✅ **Environnement automatisé** : Docker Compose (dev/test/prod)
- ✅ **Plan écrit** : Cette documentation

## 🏷️ Versioning détaillé

### Structure Git visible
```bash
# Voir les branches
git branch -a
* main           # 🏭 Production
  develop        # 🔧 Développement
  feature/auth   # 🚀 Fonctionnalités

# Voir les versions
git tag -l
v1.0.0          # 🎯 Version initiale
v1.1.0          # ✨ Nouvelles fonctionnalités
```

### Dans GitHub Actions
```yaml
# .github/workflows/ci.yml (lignes 4-7)
on:
  push:
    branches: [ main, develop ]  # 🌿 Versioning par branches
  pull_request:
    branches: [ main, develop ]  # 🔄 Workflow par PR
```

### Environnements liés aux versions
- **`develop`** → Déploiement automatique DEV
- **`main`** → Déploiement automatique STAGING  
- **`tag v*`** → Déploiement automatique PROD

### 🤖 Versioning automatique
```bash
# Option 1: Par convention de commit (automatique)
git commit -m "feat: nouvelle fonctionnalité"  # → v1.1.0
git commit -m "fix: correction bug"             # → v1.0.1
git commit -m "feat!: breaking change"         # → v2.0.0

# Option 2: Script manuel
./scripts/auto-version.sh patch               # → v1.0.1
./scripts/auto-version.sh minor               # → v1.1.0
./scripts/auto-version.sh major               # → v2.0.0

# Option 3: GitHub Actions interface
# Repository → Actions → "Auto Versioning" → Run workflow
```

## 🔧 Comment tester

1. **Tester la CI :**
   ```bash
   git push origin main
   # → Déclenche automatiquement le pipeline
   ```

2. **Tester le déploiement local :**
   ```bash
   # Environnement de développement
   docker-compose -f docker-compose.dev.yml up

   # Environnement de production
   cp env.example .env
   # Éditer .env avec vos valeurs
   docker-compose up
   ```

3. **Accès aux services :**
   - Frontend : http://localhost:3001
   - Backend : http://localhost:5001
   - API Health : http://localhost:5001/api/health
   - MongoDB Admin : http://localhost:8081

## 📊 Métriques

- **Temps de build** : ~2-3 minutes
- **Tests** : Unitaires + Intégration
- **Couverture** : Mesurée via Jest
- **Sécurité** : ESLint + TypeScript strict
