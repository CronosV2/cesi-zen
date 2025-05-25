import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import HolmesRaheEvent from '../models/HolmesRaheEvent';

// Configuration dotenv
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Événements de l'échelle Holmes-Rahe officiels
const holmesRaheEvents = [
  // Famille (Family)
  {
    name: 'Décès du conjoint',
    description: 'Perte de son époux/épouse',
    points: 100,
    category: 'family'
  },
  {
    name: 'Divorce',
    description: 'Séparation légale définitive',
    points: 73,
    category: 'family'
  },
  {
    name: 'Séparation conjugale',
    description: 'Séparation temporaire ou permanente du conjoint',
    points: 65,
    category: 'family'
  },
  {
    name: 'Mariage',
    description: 'Union matrimoniale',
    points: 50,
    category: 'family'
  },
  {
    name: 'Réconciliation conjugale',
    description: 'Retour avec le conjoint après séparation',
    points: 45,
    category: 'family'
  },
  {
    name: 'Décès d\'un proche',
    description: 'Mort d\'un membre de la famille proche',
    points: 63,
    category: 'family'
  },
  {
    name: 'Ajout d\'un nouveau membre dans la famille',
    description: 'Naissance, adoption, emménagement d\'un parent âgé',
    points: 39,
    category: 'family'
  },
  {
    name: 'Problèmes avec les beaux-parents',
    description: 'Difficultés relationnelles avec la belle-famille',
    points: 29,
    category: 'family'
  },
  {
    name: 'Départ d\'un membre de la famille',
    description: 'Enfant qui quitte le foyer, divorce d\'un proche',
    points: 29,
    category: 'family'
  },

  // Personnel (Personal)
  {
    name: 'Emprisonnement',
    description: 'Incarcération ou détention',
    points: 63,
    category: 'personal'
  },
  {
    name: 'Blessure ou maladie personnelle',
    description: 'Problème de santé physique ou mentale important',
    points: 53,
    category: 'personal'
  },
  {
    name: 'Changement dans les habitudes de sommeil',
    description: 'Modification significative des heures de sommeil',
    points: 16,
    category: 'personal'
  },
  {
    name: 'Changement dans les habitudes alimentaires',
    description: 'Modification du régime alimentaire ou des horaires de repas',
    points: 15,
    category: 'personal'
  },
  {
    name: 'Changement d\'activités sociales',
    description: 'Modification des loisirs, clubs, activités de groupe',
    points: 18,
    category: 'personal'
  },
  {
    name: 'Changement d\'activités religieuses',
    description: 'Modification de la pratique religieuse',
    points: 19,
    category: 'personal'
  },
  {
    name: 'Changement dans les habitudes personnelles',
    description: 'Modification de l\'apparence, du style de vie, des routines',
    points: 24,
    category: 'personal'
  },

  // Travail (Work)
  {
    name: 'Licenciement',
    description: 'Perte d\'emploi involontaire',
    points: 47,
    category: 'work'
  },
  {
    name: 'Retraite',
    description: 'Cessation d\'activité professionnelle',
    points: 45,
    category: 'work'
  },
  {
    name: 'Changement de responsabilités au travail',
    description: 'Promotion, rétrogradation, changement de poste',
    points: 29,
    category: 'work'
  },
  {
    name: 'Changement des conditions de travail',
    description: 'Horaires, lieu de travail, collègues, etc.',
    points: 20,
    category: 'work'
  },
  {
    name: 'Problèmes avec le patron',
    description: 'Difficultés relationnelles avec la hiérarchie',
    points: 23,
    category: 'work'
  },
  {
    name: 'Début ou fin d\'études',
    description: 'Entrée à l\'université, obtention d\'un diplôme',
    points: 26,
    category: 'work'
  },

  // Finances (Financial)
  {
    name: 'Difficultés financières majeures',
    description: 'Problèmes d\'argent importants, faillite',
    points: 38,
    category: 'financial'
  },
  {
    name: 'Changement de situation financière',
    description: 'Amélioration ou détérioration significative des revenus',
    points: 38,
    category: 'financial'
  },
  {
    name: 'Prêt hypothécaire important',
    description: 'Achat d\'une maison, gros emprunt immobilier',
    points: 31,
    category: 'financial'
  },
  {
    name: 'Saisie d\'un bien',
    description: 'Perte d\'un bien par saisie légale',
    points: 30,
    category: 'financial'
  },
  {
    name: 'Prêt personnel important',
    description: 'Emprunt significatif pour voiture, études, etc.',
    points: 17,
    category: 'financial'
  },

  // Santé (Health)
  {
    name: 'Grossesse',
    description: 'Attente d\'un enfant',
    points: 40,
    category: 'health'
  },
  {
    name: 'Problèmes sexuels',
    description: 'Difficultés dans la vie intime',
    points: 39,
    category: 'health'
  },
  {
    name: 'Révision des habitudes personnelles',
    description: 'Remise en question de son mode de vie',
    points: 24,
    category: 'health'
  },

  // Social (Social)
  {
    name: 'Déménagement',
    description: 'Changement de domicile',
    points: 20,
    category: 'social'
  },
  {
    name: 'Changement d\'école',
    description: 'Nouveau établissement scolaire',
    points: 20,
    category: 'social'
  },
  {
    name: 'Problèmes avec la loi',
    description: 'Infractions mineures, contraventions, procès',
    points: 11,
    category: 'social'
  },
  {
    name: 'Réalisation personnelle remarquable',
    description: 'Succès important, reconnaissance publique',
    points: 28,
    category: 'social'
  },
  {
    name: 'Vacances',
    description: 'Période de congés, voyage de détente',
    points: 13,
    category: 'social'
  },
  {
    name: 'Fêtes de fin d\'année',
    description: 'Période des fêtes (Noël, Nouvel An)',
    points: 12,
    category: 'social'
  }
];

const initHolmesRaheEvents = async (): Promise<void> => {
  try {
    // Connexion à MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI not defined in environment variables');
    }
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connexion MongoDB établie');

    // Vérifier si les événements existent déjà
    const existingCount = await HolmesRaheEvent.countDocuments();
    
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} événements Holmes-Rahe déjà présents dans la base`);
      console.log('Voulez-vous supprimer et recréer tous les événements? (Ctrl+C pour annuler)');
      
      // Attendre 3 secondes puis continuer
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Supprimer tous les événements existants
      await HolmesRaheEvent.deleteMany({});
      console.log('🗑️  Événements existants supprimés');
    }

    // Insérer tous les événements
    const insertedEvents = await HolmesRaheEvent.insertMany(holmesRaheEvents);
    
    console.log(`✅ ${insertedEvents.length} événements Holmes-Rahe créés avec succès`);
    
    // Afficher un résumé par catégorie
    const categories = await HolmesRaheEvent.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalPoints: { $sum: '$points' } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n📊 Résumé par catégorie:');
    categories.forEach(cat => {
      const categoryLabels: { [key: string]: string } = {
        family: 'Famille',
        personal: 'Personnel',
        work: 'Travail',
        financial: 'Finances',
        health: 'Santé',
        social: 'Social'
      };
      console.log(`   ${categoryLabels[cat._id] || cat._id}: ${cat.count} événements (${cat.totalPoints} points max)`);
    });

    console.log('\n🎯 Échelle de risque:');
    console.log('   🟢 Faible risque: < 150 points');
    console.log('   🟡 Risque modéré: 150-299 points');
    console.log('   🔴 Risque élevé: ≥ 300 points');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Connexion MongoDB fermée');
    process.exit(0);
  }
};

// Exécuter le script
if (require.main === module) {
  console.log('🚀 Initialisation des événements Holmes-Rahe...\n');
  initHolmesRaheEvents();
}

export default initHolmesRaheEvents; 