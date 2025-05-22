# CESI Zen Backend TypeScript

Ce projet est une version TypeScript du backend pour l'application CESI Zen.

## Technologies utilisées

- Node.js
- Express
- TypeScript
- MongoDB avec Mongoose
- JWT pour l'authentification
- Bcrypt pour le hachage des mots de passe

## Installation

1. Clonez le dépôt
2. Installez les dépendances :

```bash
pnpm install
```

3. Créez un fichier `.env` basé sur le modèle `.env.example` et configurez vos variables d'environnement

## Scripts disponibles

- `pnpm start` : Démarre le serveur en mode production
- `pnpm dev` : Démarre le serveur en mode développement avec nodemon
- `pnpm build` : Compile le code TypeScript
- `pnpm lint` : Vérifie le code avec ESLint
- `pnpm lint:fix` : Corrige automatiquement les problèmes ESLint

## Structure du projet

```
src/
├── config/       # Configuration (database, etc.)
├── controllers/  # Contrôleurs de routes
├── middleware/   # Middleware (auth, etc.)
├── models/       # Modèles Mongoose
├── routes/       # Définitions des routes
├── utils/        # Utilitaires (JWT, etc.)
└── index.ts      # Point d'entrée
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion (protégé)
- `GET /api/auth/me` - Profil utilisateur (protégé)

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs (protégé)
- `POST /api/users/test` - Créer un utilisateur de test

### Profil
- `GET /api/profile` - Récupérer le profil (protégé)
- `PUT /api/profile` - Mettre à jour le profil (protégé)
