import mongoose from 'mongoose';
import Article from '../models/Article';
import dotenv from 'dotenv';
import path from 'path';

// Configuration dotenv
dotenv.config({ path: path.join(__dirname, '../../.env') });

const sampleArticles = [
  {
    title: 'Gérer son stress pendant les examens',
    content: `Les examens peuvent être une source importante de stress pour les étudiants. Voici quelques conseils pour mieux gérer cette période :

## Techniques de relaxation

1. **Respiration profonde** : Prenez quelques minutes chaque jour pour pratiquer la respiration profonde
2. **Méditation** : Même 10 minutes par jour peuvent faire une différence
3. **Exercice physique** : L'activité physique aide à réduire le stress

## Organisation du travail

- Planifiez vos révisions à l'avance
- Faites des pauses régulières
- Dormez suffisamment

## Alimentation

Une alimentation équilibrée est essentielle pour maintenir votre énergie et votre concentration.`,
    excerpt: 'Découvrez des techniques efficaces pour rester zen pendant la période d\'examens et optimiser vos révisions.',
    author: 'Dr. Sarah Martin',
    category: 'conseil',
    isPublished: true,
    isFeatured: true,
    tags: ['stress', 'examens', 'relaxation', 'conseils']
  },
  {
    title: 'Nouvelle session de méditation guidée',
    content: `Nous sommes ravis d'annoncer le lancement de nos nouvelles sessions de méditation guidée !

## Programme

**Quand ?** Tous les mercredis de 18h à 19h
**Où ?** Salle de détente du campus
**Animateur :** Marie Dubois, instructrice certifiée

## Au programme

- Techniques de respiration
- Méditation de pleine conscience
- Relaxation progressive
- Gestion du stress

## Inscription

L'inscription est gratuite pour tous les étudiants CESI. Places limitées à 20 participants.

Contactez-nous à l'adresse : meditation@cesi.fr`,
    excerpt: 'Rejoignez-nous pour une session de méditation guidée chaque mercredi. Inscription gratuite pour tous les étudiants.',
    author: 'Équipe CESI-ZEN',
    category: 'evenement',
    isPublished: true,
    isFeatured: true,
    tags: ['méditation', 'événement', 'bien-être', 'campus']
  },
  {
    title: 'Les bienfaits de la marche sur la santé mentale',
    content: `La marche est l'une des activités les plus simples et les plus bénéfiques pour notre santé mentale.

## Bienfaits scientifiquement prouvés

### Réduction du stress
- Diminution du cortisol (hormone du stress)
- Libération d'endorphines naturelles
- Amélioration de l'humeur

### Amélioration cognitive
- Meilleure concentration
- Stimulation de la créativité
- Réduction de la fatigue mentale

## Conseils pratiques

1. **Commencez petit** : 10-15 minutes par jour
2. **Choisissez un environnement agréable** : parc, forêt, bord de mer
3. **Marchez en pleine conscience** : concentrez-vous sur vos sensations
4. **Variez les parcours** : évitez la routine

## Intégrer la marche dans votre quotidien d'étudiant

- Marchez jusqu'au campus quand c'est possible
- Prenez les escaliers plutôt que l'ascenseur
- Organisez des réunions de groupe en marchant
- Faites une pause marche entre les cours`,
    excerpt: 'Découvrez comment la marche peut améliorer votre bien-être mental et comment l\'intégrer facilement dans votre quotidien d\'étudiant.',
    author: 'Dr. Pierre Leroy',
    category: 'sante',
    isPublished: true,
    isFeatured: false,
    tags: ['marche', 'santé mentale', 'exercice', 'bien-être']
  },
  {
    title: 'Lancement de l\'application CESI-ZEN',
    content: `Nous sommes fiers d'annoncer le lancement officiel de l'application CESI-ZEN !

## Qu'est-ce que CESI-ZEN ?

CESI-ZEN est une plateforme dédiée au bien-être des étudiants CESI. Elle propose :

- Des outils de diagnostic de stress (Holmes-Rahe)
- Des exercices de relaxation
- Des conseils personnalisés
- Un suivi de votre progression

## Fonctionnalités principales

### Test Holmes-Rahe
Évaluez votre niveau de stress grâce à ce questionnaire scientifiquement validé.

### Exercices de bien-être
- Méditation guidée
- Exercices de respiration
- Techniques de relaxation

### Suivi personnalisé
- Tableau de bord personnel
- Historique de vos exercices
- Recommandations adaptées

## Comment commencer ?

1. Créez votre compte sur la plateforme
2. Complétez votre profil
3. Passez le test Holmes-Rahe
4. Explorez les outils disponibles

## Support

Notre équipe est disponible pour vous accompagner dans l'utilisation de la plateforme.
Contact : support@cesi-zen.fr`,
    excerpt: 'Découvrez la nouvelle plateforme CESI-ZEN dédiée au bien-être des étudiants avec des outils innovants de gestion du stress.',
    author: 'Équipe CESI-ZEN',
    category: 'actualite',
    isPublished: true,
    isFeatured: false,
    tags: ['lancement', 'application', 'bien-être', 'étudiants']
  }
];

async function seedArticles() {
  try {
    // Connexion à MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI not defined in environment variables');
    }
    
    await mongoose.connect(mongoURI);
    console.log('Connexion MongoDB établie');

    // Supprimer les articles existants
    await Article.deleteMany({});
    console.log('Articles existants supprimés');

    // Insérer les nouveaux articles
    const articles = await Article.insertMany(sampleArticles);
    console.log(`${articles.length} articles créés avec succès`);

    // Afficher les articles créés
    articles.forEach(article => {
      console.log(`- ${article.title} (${article.category})`);
    });

    console.log('\nInitialisation des articles terminée !');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des articles:', error);
    process.exit(1);
  }
}

// Exécuter le script
seedArticles(); 