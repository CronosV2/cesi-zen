import { Request, Response } from 'express';
import HolmesRaheEvent from '../models/HolmesRaheEvent';
import HolmesRaheResult from '../models/HolmesRaheResult';
import User from '../models/User';

/**
 * Récupère tous les événements Holmes-Rahe actifs
 */
export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await HolmesRaheEvent.find({ isActive: true })
      .sort({ category: 1, points: -1 })
      .select('name description points category');

    res.status(200).json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Récupère les événements groupés par catégorie (PUBLIC - visiteurs anonymes)
 */
export const getEventsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await HolmesRaheEvent.find({ isActive: true })
      .sort({ points: -1 })
      .select('name description points category');

    // Grouper par catégorie
    const groupedEvents = events.reduce((acc: any, event) => {
      if (!acc[event.category]) {
        acc[event.category] = [];
      }
      acc[event.category].push(event);
      return acc;
    }, {});

    // Définir les labels des catégories en français
    const categoryLabels = {
      family: 'Famille',
      personal: 'Personnel',
      work: 'Travail',
      financial: 'Finances',
      health: 'Santé',
      social: 'Social'
    };

    const result = Object.keys(groupedEvents).map(category => ({
      category,
      label: categoryLabels[category as keyof typeof categoryLabels] || category,
      events: groupedEvents[category]
    }));

    res.status(200).json({
      success: true,
      categories: result
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements par catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Soumet un diagnostic (UTILISATEUR CONNECTÉ)
 */
export const submitQuestionnaire = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { selectedEventIds } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
      return;
    }

    if (!selectedEventIds || !Array.isArray(selectedEventIds)) {
      res.status(400).json({
        success: false,
        message: 'Liste d\'événements sélectionnés requise'
      });
      return;
    }

    // Récupérer les événements sélectionnés
    const events = await HolmesRaheEvent.find({
      _id: { $in: selectedEventIds },
      isActive: true
    });

    if (events.length !== selectedEventIds.length) {
      res.status(400).json({
        success: false,
        message: 'Certains événements sélectionnés sont invalides'
      });
      return;
    }

    // Calculer le score total
    const totalScore = events.reduce((sum, event) => sum + event.points, 0);

    // Déterminer le niveau de risque
    let riskLevel: 'low' | 'moderate' | 'high';
    if (totalScore < 150) {
      riskLevel = 'low';
    } else if (totalScore >= 150 && totalScore < 300) {
      riskLevel = 'moderate';
    } else {
      riskLevel = 'high';
    }

    // Générer les recommandations
    const recommendations = generateRecommendations(totalScore, riskLevel);

    // Préparer les événements sélectionnés
    const selectedEvents = events.map(event => ({
      eventId: event._id,
      eventName: event.name,
      points: event.points,
      category: event.category
    }));

    // Sauvegarder le résultat
    const result = new HolmesRaheResult({
      userId,
      selectedEvents,
      totalScore,
      riskLevel,
      recommendations,
      completedAt: new Date()
    });

    await result.save();

    // Mettre à jour le niveau de stress et incrémenter les exercices complétés
    const stressLevel = riskLevel === 'low' ? 'Faible' : 
                       riskLevel === 'moderate' ? 'Modéré' : 'Élevé';
    
    await User.findByIdAndUpdate(userId, { 
      stressLevel,
      $inc: { exercicesCompleted: 1 }
    });

    res.status(201).json({
      success: true,
      result: {
        totalScore,
        riskLevel,
        recommendations,
        selectedEventsCount: selectedEvents.length,
        completedAt: result.completedAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de la soumission du diagnostic:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la soumission du diagnostic',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Récupère l'historique des diagnostics (UTILISATEUR CONNECTÉ)
 */
export const getUserResults = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
      return;
    }

    const results = await HolmesRaheResult.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('totalScore riskLevel completedAt selectedEvents');

    res.status(200).json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des diagnostics:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des diagnostics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Récupère le dernier résultat d'un utilisateur
 */
export const getLatestResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Non authentifié'
      });
      return;
    }

    const result = await HolmesRaheResult.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate('selectedEvents.eventId', 'name description category');

    if (!result) {
      res.status(404).json({
        success: false,
        message: 'Aucun résultat trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du dernier résultat:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du résultat',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * ADMIN - Récupère tous les événements pour configuration
 */
export const getAdminEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await HolmesRaheEvent.find()
      .sort({ category: 1, points: -1 })
      .select('name description points category isActive');

    res.status(200).json({
      success: true,
      events
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * ADMIN - Créer un nouvel événement
 */
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, points, category, isActive = true } = req.body;

    if (!name || !description || !points || !category) {
      res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
      return;
    }

    const newEvent = new HolmesRaheEvent({
      name,
      description,
      points,
      category,
      isActive
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      event: newEvent,
      message: 'Événement créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'événement',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * ADMIN - Modifier un événement
 */
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, points, category, isActive } = req.body;

    const updatedEvent = await HolmesRaheEvent.findByIdAndUpdate(
      id,
      { name, description, points, category, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      event: updatedEvent,
      message: 'Événement modifié avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la modification de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification de l\'événement',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * ADMIN - Supprimer un événement
 */
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedEvent = await HolmesRaheEvent.findByIdAndDelete(id);

    if (!deletedEvent) {
      res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Événement supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'événement',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * ADMIN - Statistiques pour configuration des résultats
 */
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalResults,
      lowRiskCount,
      moderateRiskCount,
      highRiskCount,
      averageScore,
      recentResults
    ] = await Promise.all([
      HolmesRaheResult.countDocuments(),
      HolmesRaheResult.countDocuments({ riskLevel: 'low' }),
      HolmesRaheResult.countDocuments({ riskLevel: 'moderate' }),
      HolmesRaheResult.countDocuments({ riskLevel: 'high' }),
      HolmesRaheResult.aggregate([
        { $group: { _id: null, avgScore: { $avg: '$totalScore' } } }
      ]),
      HolmesRaheResult.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      })
    ]);

    const stats = {
      totalResults,
      riskDistribution: {
        low: lowRiskCount,
        moderate: moderateRiskCount,
        high: highRiskCount
      },
      averageScore: averageScore[0]?.avgScore || 0,
      recentResults
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Fonction helper pour générer les recommandations
 */
function generateRecommendations(totalScore: number, riskLevel: string): string[] {
  const recommendations: string[] = [];
  
  if (riskLevel === 'low') {
    recommendations.push(
      'Votre niveau de stress est faible. Continuez à maintenir un bon équilibre.',
      'Pratiquez des activités de relaxation préventives comme la méditation.',
      'Maintenez des habitudes de vie saines (sommeil, exercice, alimentation).'
    );
  } else if (riskLevel === 'moderate') {
    recommendations.push(
      'Votre niveau de stress est modéré. Il est recommandé de prendre des mesures préventives.',
      'Intégrez des techniques de gestion du stress dans votre routine quotidienne.',
      'Considérez des exercices de respiration et de relaxation réguliers.',
      'Surveillez votre sommeil et votre alimentation.'
    );
  } else {
    recommendations.push(
      'Votre niveau de stress est élevé. Il est fortement recommandé de prendre des mesures immédiates.',
      'Consultez un professionnel de la santé mentale.',
      'Pratiquez quotidiennement des techniques de relaxation.',
      'Privilégiez le repos et évitez les sources de stress supplémentaires.'
    );
  }
  
  return recommendations;
} 