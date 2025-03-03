# Projet Cesizen

Ce projet est une application web construite avec React, TypeScript, MongoDB et Express.

## Structure du projet

```
.
├── frontend/          # Application React TypeScript
└── backend/          # API Express TypeScript avec MongoDB
```

## Prérequis

- Node.js (v14 ou supérieur)
- pnpm
- MongoDB (installé localement ou une instance cloud)

## Installation

### Backend

```bash
cd backend
pnpm install
```

Créez un fichier `.env` dans le dossier backend avec les variables suivantes :
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cesizen
```

### Frontend

```bash
cd frontend
pnpm install
```

## Démarrage

### Backend

```bash
cd backend
pnpm dev
```

Le serveur backend démarrera sur http://localhost:5000

### Frontend

```bash
cd frontend
pnpm dev
```

L'application frontend démarrera sur http://localhost:5173

## Scripts disponibles

### Backend

- `pnpm dev` : Lance le serveur en mode développement
- `pnpm build` : Compile le code TypeScript
- `pnpm start` : Lance le serveur en production

### Frontend

- `pnpm dev` : Lance l'application en mode développement
- `pnpm build` : Compile l'application pour la production
- `pnpm preview` : Prévisualise l'application en production 