import mongoose, { Document, Schema } from 'mongoose';

// Interface pour un résultat Holmes-Rahe
export interface IHolmesRaheResult {
  userId: mongoose.Types.ObjectId;
  selectedEvents: {
    eventId: mongoose.Types.ObjectId;
    eventName: string;
    points: number;
    category: string;
  }[];
  totalScore: number;
  riskLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
  completedAt: Date;
}

export interface IHolmesRaheResultDocument extends IHolmesRaheResult, Document {}

// Schéma pour les résultats Holmes-Rahe
const holmesRaheResultSchema = new Schema<IHolmesRaheResultDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'ID utilisateur requis'],
    },
    selectedEvents: [{
      eventId: {
        type: Schema.Types.ObjectId,
        ref: 'HolmesRaheEvent',
        required: true,
      },
      eventName: {
        type: String,
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
    }],
    totalScore: {
      type: Number,
      required: [true, 'Score total requis'],
      min: [0, 'Le score ne peut pas être négatif'],
    },
    riskLevel: {
      type: String,
      required: [true, 'Niveau de risque requis'],
      enum: {
        values: ['low', 'moderate', 'high'],
        message: 'Niveau de risque non valide'
      },
    },
    recommendations: [{
      type: String,
      trim: true,
    }],
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les requêtes
holmesRaheResultSchema.index({ userId: 1, createdAt: -1 });
holmesRaheResultSchema.index({ totalScore: -1 });
holmesRaheResultSchema.index({ riskLevel: 1 });

// Méthode pour calculer le niveau de risque
holmesRaheResultSchema.methods.calculateRiskLevel = function(totalScore: number): string {
  if (totalScore < 150) {
    return 'low';
  } else if (totalScore >= 150 && totalScore < 300) {
    return 'moderate';
  } else {
    return 'high';
  }
};

// Méthode pour générer des recommandations
holmesRaheResultSchema.methods.generateRecommendations = function(totalScore: number, riskLevel: string): string[] {
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
      'Surveillez votre sommeil et votre alimentation.',
      'N\'hésitez pas à parler à un professionnel si le stress persiste.'
    );
  } else {
    recommendations.push(
      'Votre niveau de stress est élevé. Il est fortement recommandé de prendre des mesures immédiates.',
      'Consultez un professionnel de la santé mentale.',
      'Pratiquez quotidiennement des techniques de relaxation.',
      'Privilégiez le repos et évitez les sources de stress supplémentaires.',
      'Entourez-vous de votre réseau de soutien (famille, amis).',
      'Considérez des activités physiques douces comme la marche ou le yoga.'
    );
  }
  
  return recommendations;
};

const HolmesRaheResult = mongoose.model<IHolmesRaheResultDocument>('HolmesRaheResult', holmesRaheResultSchema);

export default HolmesRaheResult; 