# 🚀 Guide des Workflows CI/CD

Ce guide explique comment fonctionnent les workflows CI/CD séparés pour CESI Zen.

## 📋 Vue d'ensemble

### Fichiers de workflows
- `ci.yml` - **Continuous Integration** (Tests et validations)
- `cd.yml` - **Continuous Deployment** (Déploiement)
- `config.yml` - Configuration partagée

### Principe de séparation
- **CI** : Se déclenche sur tous les push et PR
- **CD** : Se déclenche uniquement après succès du CI sur `main`

## 🧪 Workflow CI (Continuous Integration)

### Déclencheurs
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
```

### Jobs inclus

#### 1. 🔧 Backend Tests
- Installation des dépendances
- Linting du code
- Build TypeScript
- Tests unitaires avec couverture
- Upload vers Codecov

#### 2. 🎨 Frontend Tests
- Installation des dépendances
- Linting du code
- Build Next.js

#### 3. 🔗 Integration Tests
- Build des images Docker
- Démarrage des services
- Tests d'intégration API
- Health checks

#### 4. 📋 Code Quality
- Super-Linter pour multiple langages
- Validation YAML, JSON, Dockerfile

#### 5. 🔒 Security Scan
- Scan Trivy pour vulnérabilités
- Upload vers GitHub Security

### Exemple d'utilisation
```bash
# Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# Faire des modifications
git add .
git commit -m "feat: nouvelle fonctionnalité"

# Push déclenche le CI
git push origin feature/nouvelle-fonctionnalite

# Le CI s'exécute automatiquement
# Vérifiez les résultats dans l'onglet Actions
```

## 🚀 Workflow CD (Continuous Deployment)

### Déclencheurs

#### Automatique
```yaml
workflow_run:
  workflows: ["🧪 Continuous Integration"]
  types: [completed]
  branches: [main]
```

#### Manuel
```yaml
workflow_dispatch:
  inputs:
    environment:
      type: choice
      options: [staging, production]
```

### Jobs inclus

#### 1. 🔍 Check Prerequisites
- Vérification des conditions de déploiement
- Détermination de l'environnement cible

#### 2. 🏗️ Build & Push Images
- Build des images Docker optimisées
- Push vers GitHub Container Registry
- Tagging automatique (latest, sha, branch)

#### 3. 🧪 Deploy Staging
- Déploiement automatique vers staging
- Health checks post-déploiement

#### 4. 🧪 Post-Deployment Tests
- Tests de fumée
- Tests d'intégration sur l'environnement live

#### 5. 🚀 Deploy Production
- Nécessite approbation manuelle
- Déploiement Blue/Green
- Monitoring renforcé

#### 6. 📢 Notifications
- Notifications Slack/Discord
- Rapport de déploiement

#### 7. 🔄 Rollback
- En cas d'échec du déploiement
- Retour automatique à la version précédente

## 🎯 Scénarios d'utilisation

### Développement normal
```bash
# 1. Développement sur branche feature
git checkout -b feature/login-improvement
# ... développement ...
git push origin feature/login-improvement

# 2. CI s'exécute (tests seulement)
# 3. Création de la PR
# 4. CI s'exécute sur la PR
# 5. Merge vers main après review

# 6. CI s'exécute sur main
# 7. CD s'exécute automatiquement (staging)
```

### Déploiement en production
```bash
# Option 1: Via l'interface GitHub
# Actions → CD Workflow → Run workflow → production

# Option 2: Via GitHub CLI
gh workflow run cd.yml -f environment=production
```

### Rollback d'urgence
```bash
# Le rollback se déclenche automatiquement en cas d'échec
# Ou manuellement :
gh workflow run cd.yml -f environment=rollback
```

## 🔧 Configuration des environnements

### Variables d'environnement
```bash
# Dans GitHub Settings → Secrets and variables → Actions

# Variables publiques
STAGING_DOMAIN=cesi-zen-staging.yourdomain.com
PRODUCTION_DOMAIN=cesi-zen.yourdomain.com

# Secrets (sensibles)
SSH_PRIVATE_KEY=...
SLACK_WEBHOOK_URL=...
```

### Environnements protégés
1. **staging** - Déploiement automatique
2. **production** - Approbation manuelle requise
3. **rollback** - Pour urgences

## 📊 Monitoring et observabilité

### Métriques suivies
- ✅ Taux de succès CI/CD
- ⏱️ Temps d'exécution des tests
- 📊 Couverture de code
- 🔒 Vulnérabilités détectées
- 🚀 Fréquence des déploiements

### Notifications
- 📢 Succès/échec des déploiements
- 🚨 Alertes de sécurité
- 📈 Rapports de couverture

## 🛠️ Debugging des workflows

### Logs détaillés
```bash
# Activer le debug
# Dans les secrets du repository :
ACTIONS_STEP_DEBUG=true
ACTIONS_RUNNER_DEBUG=true
```

### Tests locaux
```bash
# Simuler le CI localement
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
# Tester les endpoints

# Simuler les tests
cd cesi-zen-code/backend-ts && npm test
cd cesi-zen-code/frontend && npm run build
```

### Vérification des images
```bash
# Lister les images publiées
gh api /orgs/YOUR_ORG/packages?package_type=container

# Tester une image
docker run --rm ghcr.io/your-org/cesi-zen-backend:latest
```

## 🚦 Statuts et badges

Ajoutez ces badges à votre README :

```markdown
![CI](https://github.com/your-org/cesi-zen/workflows/🧪%20Continuous%20Integration/badge.svg)
![CD](https://github.com/your-org/cesi-zen/workflows/🚀%20Continuous%20Deployment/badge.svg)
[![codecov](https://codecov.io/gh/your-org/cesi-zen/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/cesi-zen)
```

## 📚 Bonnes pratiques

### Pour le CI
- ✅ Tests rapides (< 10 minutes)
- ✅ Tests parallèles quand possible
- ✅ Cache des dépendances
- ✅ Fail fast sur les erreurs critiques

### Pour le CD
- ✅ Déploiements atomiques
- ✅ Tests de fumée obligatoires
- ✅ Rollback automatique en cas d'échec
- ✅ Environments protégés pour production

### Sécurité
- 🔒 Secrets jamais en dur dans le code
- 🔒 Scan de vulnérabilités automatique
- 🔒 Approbations manuelles pour production
- 🔒 Audit trail complet

## 🆘 Dépannage

### Problèmes courants

#### CI qui échoue
```bash
# Vérifier les logs
gh run list --workflow=ci.yml
gh run view <run-id>

# Tests locaux
npm test
npm run lint
npm run build
```

#### CD qui ne se déclenche pas
- Vérifier que le CI a réussi
- Vérifier les permissions du token GitHub
- Vérifier la configuration des environnements

#### Échec de déploiement
- Vérifier les logs de déploiement
- Tester la connectivité aux serveurs
- Vérifier les secrets et variables

### Support
- 📖 [Documentation GitHub Actions](https://docs.github.com/en/actions)
- 🐳 [Documentation Docker](https://docs.docker.com/)
- 💬 Ouvrir une issue sur le repository
