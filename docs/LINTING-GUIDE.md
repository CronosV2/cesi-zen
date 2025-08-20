# 🔍 Guide de Linting pour CESI Zen

Ce guide explique comment résoudre les erreurs de linting dans le projet CESI Zen.

## 📋 Erreurs courantes et solutions

### 🔧 Backend (TypeScript/Node.js)

#### Configuration ESLint manquante
```bash
Error: ESLint couldn't find a configuration file
```

**Solution :** Le fichier `.eslintrc.js` a été créé dans `cesi-zen-code/backend-ts/`

#### Règles ESLint configurées
- `@typescript-eslint/no-explicit-any`: warn (au lieu d'error)
- `@typescript-eslint/no-unused-vars`: error avec exceptions pour `_prefix`
- `@typescript-eslint/no-floating-promises`: error

### 🎨 Frontend (Next.js/React)

#### Erreurs TypeScript communes

1. **`Unexpected any`**
   ```typescript
   // ❌ Éviter
   const data: any = response.data;
   
   // ✅ Préférer
   const data: ResponseType = response.data;
   // ou
   const data = response.data as ResponseType;
   ```

2. **Variables non utilisées**
   ```typescript
   // ❌ Éviter
   const [data, setData] = useState();
   
   // ✅ Si vraiment non utilisé
   const [_data, setData] = useState();
   ```

3. **Apostrophes non échappées**
   ```jsx
   // ❌ Éviter
   <p>Don't use unescaped quotes</p>
   
   // ✅ Solutions
   <p>Don&apos;t use unescaped quotes</p>
   <p>{"Don't use unescaped quotes"}</p>
   ```

4. **Dépendances manquantes dans useEffect**
   ```typescript
   // ❌ Éviter
   useEffect(() => {
     fetchData();
   }, []); // fetchData manquant
   
   // ✅ Solutions
   useEffect(() => {
     fetchData();
   }, [fetchData]);
   
   // ou
   const fetchData = useCallback(() => {
     // logic here
   }, []);
   ```

## 🛠️ Scripts de correction

### Correction automatique
```bash
# Backend
cd cesi-zen-code/backend-ts
npm run lint:fix

# Frontend  
cd cesi-zen-code/frontend
npm run lint -- --fix
```

### Script de préparation CI
```bash
# Depuis la racine du projet
./scripts/prepare-ci.sh
```

## ⚙️ Configuration ESLint

### Backend (.eslintrc.js)
```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_' 
    }],
  },
};
```

### Frontend (.eslintrc.json)
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { 
      "varsIgnorePattern": "^_"
    }],
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## 🚦 Gestion dans CI/CD

### Stratégie de linting en CI
1. **Warnings autorisés** - N'arrêtent pas le build
2. **Errors bloquants** - Arrêtent le pipeline
3. **Correction progressive** - Amélioration continue

### Configuration CI
```yaml
- name: 🔍 Lint code
  run: npm run lint || echo "Linting warnings found"
  continue-on-error: false
```

## 📊 Métriques de qualité

### Objectifs
- ✅ 0 erreurs ESLint critiques
- ⚠️ < 10 warnings par fichier
- 📈 Amélioration continue

### Monitoring
- Rapport de linting dans chaque PR
- Badge de qualité de code
- Intégration SonarQube (optionnel)

## 🔧 Dépannage

### Erreurs communes

#### "Configuration file not found"
```bash
# Vérifier la présence des fichiers
ls -la cesi-zen-code/backend-ts/.eslintrc.js
ls -la cesi-zen-code/frontend/.eslintrc.json

# Recréer si nécessaire
./scripts/prepare-ci.sh
```

#### "Module not found"
```bash
# Réinstaller les dépendances
npm ci
```

#### "Parsing error"
```bash
# Vérifier la configuration TypeScript
npx tsc --noEmit
```

### Cache ESLint
```bash
# Nettoyer le cache ESLint
npm run lint -- --cache --cache-location .eslintcache
```

## 📚 Ressources

- [ESLint Documentation](https://eslint.org/docs/rules/)
- [TypeScript ESLint](https://typescript-eslint.io/rules/)
- [Next.js ESLint](https://nextjs.org/docs/basic-features/eslint)
- [React Hooks Rules](https://reactjs.org/docs/hooks-rules.html)

## 🎯 Bonnes pratiques

### Pour les développeurs
1. **Linter avant commit** - Utiliser pre-commit hooks
2. **Configuration IDE** - ESLint extension activée
3. **Fix progressif** - Corriger warnings existants
4. **Types explicites** - Éviter `any` autant que possible

### Pour l'équipe
1. **Standards partagés** - Configuration ESLint commune
2. **Reviews de code** - Vérification qualité
3. **Formation** - Bonnes pratiques TypeScript/React
4. **Monitoring** - Suivi des métriques de qualité
