# 🏷️ Stratégie de Versioning - CESI Zen

## 📋 Vue d'ensemble

Le versioning est implémenté via **Git** avec une stratégie de branches et tags clairs.

## 🌿 Structure des branches

### Branches principales
- **`main`** : Code de production (stable)
- **`develop`** : Code de développement (intégration)

### Branches temporaires
- **`feature/nom-fonctionnalite`** : Nouvelles fonctionnalités
- **`hotfix/nom-fix`** : Corrections urgentes
- **`release/vX.X.X`** : Préparation des releases

## 🏷️ Système de tags

### Convention de nommage
```bash
vX.Y.Z
```
- **X** : Version majeure (breaking changes)
- **Y** : Version mineure (nouvelles fonctionnalités)
- **Z** : Version patch (corrections de bugs)

### Exemples
- `v1.0.0` : Première version stable
- `v1.1.0` : Ajout de nouvelles fonctionnalités
- `v1.1.1` : Correction de bugs

## 🔄 Workflow Git

### 1. Développement d'une nouvelle fonctionnalité
```bash
# Créer une branche depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/authentification-oauth

# Développer et commiter
git add .
git commit -m "feat: ajout authentification OAuth Google"
git push origin feature/authentification-oauth

# Créer une Pull Request vers develop
```

### 2. Déploiement en production
```bash
# Merge develop vers main
git checkout main
git merge develop

# Créer un tag de version
git tag -a v1.1.0 -m "Version 1.1.0 - Ajout OAuth"
git push origin v1.1.0
git push origin main
```

## 🤖 Automatisation CI/CD

### Configuration dans `.github/workflows/ci.yml`

```yaml
on:
  push:
    branches: [ main, develop ]    # 🌿 CI sur les branches principales
    tags: [ 'v*' ]                # 🏷️ CI sur les tags de version
  pull_request:
    branches: [ main, develop ]    # 🔄 CI sur les PRs
```

### Déclencheurs automatiques
- **Push sur `develop`** → Tests + Build
- **Push sur `main`** → Tests + Build + Déploiement staging
- **Tag `v*`** → Tests + Build + Déploiement production
- **Pull Request** → Tests complets

## 📊 Traçabilité des versions

### Dans GitHub
1. **Onglet "Releases"** : Historique des versions avec changelogs
2. **Onglet "Tags"** : Liste de tous les tags
3. **Network Graph** : Visualisation des branches
4. **Actions** : Historique des builds par version

### Commandes Git utiles
```bash
# Voir toutes les versions
git tag -l

# Voir les détails d'une version
git show v1.1.0

# Voir l'historique des commits
git log --oneline --graph

# Voir les différences entre versions
git diff v1.0.0 v1.1.0
```

## 📝 Convention de commit

### Format
```
type(scope): description

[body optionnel]

[footer optionnel]
```

### Types
- **feat** : Nouvelle fonctionnalité
- **fix** : Correction de bug
- **docs** : Documentation
- **style** : Formatage (sans changement de code)
- **refactor** : Refactoring
- **test** : Ajout de tests
- **chore** : Maintenance

### Exemples
```bash
git commit -m "feat(auth): ajout connexion OAuth Google"
git commit -m "fix(api): correction endpoint /users"
git commit -m "docs: mise à jour README.md"
```

## 🚀 Intégration avec Docker

### Tags d'images Docker
Les images Docker suivent les tags Git :

```bash
# Build avec tag de version
docker build -t cesi-zen:v1.1.0 .
docker build -t cesi-zen:latest .

# Dans la CI/CD
docker tag cesi-zen:latest ghcr.io/user/cesi-zen:v1.1.0
```

## 📈 Suivi des versions

### Fichier package.json (automatique)
```json
{
  "name": "cesi-zen",
  "version": "1.1.0",
  "scripts": {
    "version": "npm run build && git add ."
  }
}
```

### Changelog automatique
- Génération automatique via les commits
- Mise à jour lors des releases
- Visible dans GitHub Releases

## 🎯 Pour l'évaluation

**Le versioning est visible ici :**

1. **Structure Git** : `git branch -a` et `git tag -l`
2. **Workflow CI/CD** : `.github/workflows/ci.yml` (lignes 4-7)
3. **Configuration branches** : Protection des branches main/develop
4. **Historique** : `git log --oneline --graph`
5. **Releases GitHub** : Onglet Releases avec changelogs
6. **Documentation** : Ce fichier + docs/CI-CD-EVAL.md

**Commande pour montrer le versioning :**
```bash
# Afficher la structure Git
git log --oneline --graph --all
git tag -l
git branch -a
```
