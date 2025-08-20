#!/bin/bash

# Script de préparation pour le CI
echo "🚀 Préparation pour le CI/CD..."

# 1. Installer les dépendances backend
echo "📦 Installation des dépendances backend..."
cd cesi-zen-code/backend-ts
npm ci --silent

# 2. Installer les dépendances frontend  
echo "📦 Installation des dépendances frontend..."
cd ../frontend
npm ci --silent

# 3. Vérifier les configurations
echo "🔧 Vérification des configurations..."

# Vérifier que .eslintrc.js existe pour le backend
if [ ! -f "../backend-ts/.eslintrc.js" ]; then
    echo "❌ Configuration ESLint manquante pour le backend"
    exit 1
fi

# Vérifier que .eslintrc.json existe pour le frontend
if [ ! -f ".eslintrc.json" ]; then
    echo "❌ Configuration ESLint manquante pour le frontend"
    exit 1
fi

# 4. Tests de linting (mode non-bloquant)
echo "🔍 Test de linting backend..."
cd ../backend-ts
npm run lint || echo "⚠️ Warnings de linting backend détectés"

echo "🔍 Test de linting frontend..."
cd ../frontend
npm run lint || echo "⚠️ Warnings de linting frontend détectés"

# 5. Tests de build
echo "🏗️ Test de build backend..."
cd ../backend-ts
npm run build

echo "🏗️ Test de build frontend..."
cd ../frontend
npm run build

echo "✅ Préparation CI terminée avec succès!"
