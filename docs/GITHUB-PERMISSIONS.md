# 🔐 Configuration des Permissions GitHub

Ce guide explique comment configurer les permissions pour les workflows GitHub Actions.

## 🚨 Problème courant : "Resource not accessible by integration"

Cette erreur survient quand un workflow essaie d'accéder à des ressources GitHub sans les permissions appropriées.

### Erreur typique
```
Warning: Resource not accessible by integration
Error: Resource not accessible by integration
```

## 🛠️ Solutions

### 1. Permissions au niveau du workflow

```yaml
name: 🧪 Continuous Integration

permissions:
  contents: read          # Lire le code du repository
  actions: read          # Lire les artifacts et runs
  security-events: write # Écrire dans l'onglet Security
  packages: write        # Pousser des images Docker
  pull-requests: write   # Commenter les PRs

jobs:
  # ... vos jobs
```

### 2. Permissions au niveau du job

```yaml
jobs:
  security-scan:
    runs-on: ubuntu-latest
    permissions:
      security-events: write  # Spécifique à ce job
    steps:
      # ... vos steps
```

### 3. Permissions par défaut restrictives

```yaml
permissions:
  contents: read  # Minimum requis pour checkout

jobs:
  my-job:
    permissions:
      contents: read
      security-events: write  # Ajouter selon les besoins
```

## 📋 Types de permissions

### Lecture (read)
- `contents: read` - Lire le code du repository
- `actions: read` - Lire les workflows et artifacts
- `metadata: read` - Lire les métadonnées du repository

### Écriture (write)
- `contents: write` - Modifier le code (commits, tags)
- `packages: write` - Pousser des packages/images
- `security-events: write` - Écrire dans l'onglet Security
- `pull-requests: write` - Commenter les PRs
- `issues: write` - Créer/modifier des issues

### Aucune permission
- `permissions: {}` - Aucune permission explicite

## 🔧 Corrections spécifiques

### Pour Trivy Security Scan
```yaml
permissions:
  contents: read
  security-events: write

jobs:
  security-scan:
    steps:
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        if: always() && github.event_name == 'push'
        with:
          sarif_file: 'trivy-results.sarif'
        continue-on-error: true
```

### Pour Docker Registry (GHCR)
```yaml
permissions:
  contents: read
  packages: write

jobs:
  build:
    steps:
      - name: Login to Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
```

### Pour Codecov
```yaml
permissions:
  contents: read

jobs:
  test:
    steps:
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}  # Utiliser token externe
```

## ⚙️ Configuration du repository

### 1. Actions permissions
Dans Settings → Actions → General :

- **Actions permissions**: "Allow all actions and reusable workflows"
- **Workflow permissions**: "Read and write permissions" ou "Read repository contents and packages permissions"

### 2. Security features
Dans Settings → Code security and analysis :

- ✅ **Dependency graph**: Enabled
- ✅ **Dependabot alerts**: Enabled
- ✅ **Code scanning**: Enabled

### 3. Branch protection
Dans Settings → Branches :

- ✅ **Require status checks**: Enabled
- ✅ **Require branches to be up to date**: Enabled
- ✅ **Include administrators**: Enabled

## 🚫 Limitation des permissions

### Fork repositories
Les forks ont des permissions limitées :
- Pas d'accès aux secrets
- Pas d'écriture dans Security
- Pas de push vers GHCR

### Pull requests externes
Les PRs de contributeurs externes :
- Utilisent `pull_request_target` pour accéder aux secrets
- Nécessitent une review manuelle

```yaml
on:
  pull_request_target:  # Attention : sécurisé seulement si bien configuré

jobs:
  build:
    if: github.event.pull_request.head.repo.full_name == github.repository
```

## 🔍 Debugging des permissions

### Vérifier les permissions actuelles
```yaml
- name: Debug permissions
  run: |
    echo "Actor: ${{ github.actor }}"
    echo "Event: ${{ github.event_name }}"
    echo "Ref: ${{ github.ref }}"
    echo "Repository: ${{ github.repository }}"
```

### Tester les permissions
```yaml
- name: Test permissions
  run: |
    # Test lecture
    gh api repos/${{ github.repository }} || echo "Cannot read repo"
    
    # Test écriture (si autorisé)
    gh api repos/${{ github.repository }}/issues \
      -X POST \
      -f title="Test issue" \
      -f body="Test permissions" || echo "Cannot write issues"
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## 📚 Ressources

- [GitHub Actions Permissions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [GITHUB_TOKEN Permissions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)
- [Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

## ✅ Configuration recommandée

Pour CESI Zen, utilisez cette configuration :

```yaml
name: 🧪 Continuous Integration

permissions:
  contents: read
  actions: read
  security-events: write
  packages: write

jobs:
  # Vos jobs ici
```

Cette configuration permet :
- ✅ Checkout du code
- ✅ Upload des résultats de sécurité
- ✅ Push des images Docker
- ✅ Lecture des artifacts

