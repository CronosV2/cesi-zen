# 🔐 Configuration des Secrets GitHub

Ce document explique comment configurer les secrets nécessaires pour les workflows CI/CD.

## 📋 Secrets requis

### Pour le CI (Tests)
Aucun secret spécifique requis - utilise des valeurs de test.

### Pour le CD (Déploiement)

#### 1. Registry Docker (GitHub Container Registry)
Les secrets suivants sont automatiquement disponibles :
- `GITHUB_TOKEN` - Token automatique pour pousser vers GHCR

#### 2. Déploiement (optionnel)
Si vous déployez sur des serveurs externes :

```bash
# SSH pour déploiement
SSH_PRIVATE_KEY     # Clé privée SSH pour accéder aux serveurs
SSH_HOST_STAGING    # IP/hostname du serveur de staging  
SSH_HOST_PRODUCTION # IP/hostname du serveur de production
SSH_USER            # Utilisateur SSH

# Base de données (si externe)
DATABASE_URL_STAGING    # URL MongoDB pour staging
DATABASE_URL_PRODUCTION # URL MongoDB pour production
```

#### 3. Notifications (optionnel)
```bash
SLACK_WEBHOOK_URL   # URL webhook Slack pour notifications
DISCORD_WEBHOOK_URL # URL webhook Discord pour notifications
```

## 🛠️ Comment ajouter des secrets

### Via l'interface GitHub
1. Allez dans votre repository GitHub
2. Settings → Secrets and variables → Actions
3. Cliquez sur "New repository secret"
4. Ajoutez le nom et la valeur du secret

### Via GitHub CLI
```bash
# Exemple pour ajouter un secret Slack
gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/services/..."

# Exemple pour ajouter une clé SSH
gh secret set SSH_PRIVATE_KEY --body "$(cat ~/.ssh/id_rsa)"
```

## 🔧 Variables d'environnement

### Variables de repository
Variables publiques (non sensibles) :

```bash
STAGING_DOMAIN=cesi-zen-staging.yourdomain.com
PRODUCTION_DOMAIN=cesi-zen.yourdomain.com
REGISTRY=ghcr.io
```

### Ajout de variables
1. Settings → Secrets and variables → Actions
2. Onglet "Variables"
3. Cliquez sur "New repository variable"

## 🏗️ Configuration des environnements

### Création d'environnements protégés
1. Settings → Environments
2. Créez les environnements :
   - `staging` - Déploiement automatique
   - `production` - Nécessite approbation manuelle
   - `rollback` - Pour les rollbacks d'urgence

### Règles de protection
Pour l'environnement `production` :
- ✅ Required reviewers (au moins 1)
- ✅ Wait timer (optionnel, ex: 5 minutes)
- ✅ Deployment branches (main seulement)

## 🚀 Plateformes de déploiement supportées

### 1. Docker Compose (Serveur dédié)
Variables requises :
```bash
SSH_PRIVATE_KEY
SSH_HOST_STAGING
SSH_HOST_PRODUCTION
SSH_USER
```

### 2. Vercel (Frontend uniquement)
```bash
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

### 3. Railway
```bash
RAILWAY_TOKEN
RAILWAY_PROJECT_ID
```

### 4. DigitalOcean App Platform
```bash
DIGITALOCEAN_ACCESS_TOKEN
```

### 5. AWS ECS
```bash
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
ECS_CLUSTER_NAME
ECS_SERVICE_NAME
```

## 🔍 Vérification de la configuration

### Test des secrets
```bash
# Vérifier que les secrets sont bien configurés
gh secret list

# Tester une connexion SSH
ssh -i ~/.ssh/id_rsa user@staging-server 'echo "Connexion OK"'
```

### Test des workflows
1. Poussez une modification sur une branche feature
2. Vérifiez que le CI se déclenche
3. Mergez sur main
4. Vérifiez que le CD se déclenche

## 📚 Documentation complémentaire

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Docker Registry Authentication](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
