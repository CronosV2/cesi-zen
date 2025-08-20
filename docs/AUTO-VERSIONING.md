# 🤖 Versioning Automatique - CESI Zen

## 🚀 Vue d'ensemble

Le versioning automatique permet de créer des tags et releases sans intervention manuelle.

## 🔄 Méthodes disponibles

### 1. **Auto-versioning par commit** (Recommandé)

#### Comment ça marche
- **Push sur `main`** → Analyse automatique du commit
- **Convention de commit** → Détermine le type de version
- **Tag automatique** → Créé et poussé sur GitHub

#### Convention de messages
```bash
# PATCH (v1.0.0 → v1.0.1)
git commit -m "fix: correction bug authentification"
git commit -m "docs: mise à jour README"
git commit -m "style: formatage code"

# MINOR (v1.0.0 → v1.1.0)  
git commit -m "feat: ajout OAuth Google"
git commit -m "feat(auth): nouveau système de permissions"

# MAJOR (v1.0.0 → v2.0.0)
git commit -m "feat!: refonte complète de l'API"
git commit -m "feat: nouveau système

BREAKING CHANGE: L'API v1 n'est plus supportée"
```

### 2. **Versioning manuel déclenché**

```bash
# Via GitHub Actions interface
# Repository → Actions → "Auto Versioning" → Run workflow
# Choisir : patch | minor | major
```

### 3. **Versioning par package.json** (Alternative)

```bash
# Dans le projet
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0  
npm version major  # 1.0.0 → 2.0.0

# Push automatique du tag
git push origin --tags
```

## ⚙️ Configuration GitHub

### Permissions requises
```yaml
# .github/workflows/auto-versioning.yml
permissions:
  contents: write    # ✅ Créer tags et releases
  actions: read      # ✅ Lire le workflow
```

### Secrets GitHub (automatiques)
- `GITHUB_TOKEN` → Fourni automatiquement par GitHub

## 🎯 Workflow complet

### Étapes automatiques
1. **Détection** → Analyse du commit sur `main`
2. **Calcul** → Détermine la nouvelle version (semver)
3. **Tag** → Crée et pousse le tag Git
4. **Release** → Crée une release GitHub avec changelog
5. **Notification** → Confirme le succès

### Exemple de flux
```bash
# 1. Développeur fait un commit
git add .
git commit -m "feat: ajout notifications push"
git push origin main

# 2. GitHub Actions se déclenche automatiquement
# 3. Analyse : "feat:" → version MINOR
# 4. v1.0.0 → v1.1.0 automatiquement
# 5. Tag + Release créés
```

## 📋 Avantages du versioning auto

### ✅ Avantages
- **Cohérence** : Pas d'oubli de versioning
- **Traçabilité** : Chaque release liée à un commit
- **Automatisation** : Zéro intervention manuelle
- **Semver** : Respect de la sémantique de version
- **Changelog** : Génération automatique

### ⚠️ Considérations
- **Convention obligatoire** : Messages de commit normés
- **Révision manuelle** : Pas de validation humaine
- **Historique propre** : Nécessite des commits clean

## 🔧 Configuration pour l'éval

### Activer l'auto-versioning
```bash
# 1. Le workflow existe : .github/workflows/auto-versioning.yml
# 2. Push sur main déclenche automatiquement
# 3. Ou manuel via GitHub Actions interface
```

### Démonstration
```bash
# Tester le versioning auto
git checkout main
git add .
git commit -m "feat: amélioration CI/CD pour évaluation"
git push origin main

# → Automatiquement : v1.0.0 → v1.1.0
```

## 🎨 Intégration avec CI/CD

### Déclenchement par tag
```yaml
# .github/workflows/ci.yml
on:
  push:
    tags: [ 'v*' ]    # 🏷️ CI sur nouveau tag
    
# .github/workflows/cd.yml  
on:
  push:
    tags: [ 'v*' ]    # 🚀 Déploiement sur tag
```

### Variables disponibles
```yaml
steps:
  - name: Deploy version ${{ github.ref_name }}
    run: |
      echo "Déploiement de la version : ${{ github.ref_name }}"
      docker build -t app:${{ github.ref_name }} .
```

## 📊 Monitoring

### Voir les versions auto
```bash
# Tags créés automatiquement
git tag -l
v1.0.0    # Manuel (initial)
v1.1.0    # Auto (feat)
v1.1.1    # Auto (fix)
v2.0.0    # Auto (breaking)

# Historique avec auteur
git log --oneline --tags
```

### Dashboard GitHub
- **Releases** → Voir toutes les versions auto
- **Actions** → Historique des versioning
- **Insights** → Graphique des releases

## 🎯 Pour l'évaluateur

**Le versioning automatique est visible ici :**

1. **Workflow** : `.github/workflows/auto-versioning.yml`
2. **Convention** : Messages de commit → version automatique
3. **Résultat** : Tags créés sans intervention
4. **Traçabilité** : Releases GitHub avec changelog
5. **Intégration** : CI/CD déclenchée par tags

**Démonstration :**
```bash
# Montrer l'automatisation
git log --oneline --tags
git tag -l
# → Versions créées automatiquement
```
