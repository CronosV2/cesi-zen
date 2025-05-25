import mongoose, { Document, Schema } from 'mongoose';

// Interface pour un événement Holmes-Rahe
export interface IHolmesRaheEvent {
  name: string;
  description: string;
  points: number;
  category: 'family' | 'personal' | 'work' | 'financial' | 'health' | 'social';
  isActive: boolean;
}

export interface IHolmesRaheEventDocument extends IHolmesRaheEvent, Document {}

// Schéma pour les événements Holmes-Rahe
const holmesRaheEventSchema = new Schema<IHolmesRaheEventDocument>(
  {
    name: {
      type: String,
      required: [true, 'Nom de l\'événement requis'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description de l\'événement requise'],
      trim: true,
    },
    points: {
      type: Number,
      required: [true, 'Points de stress requis'],
      min: [1, 'Les points doivent être supérieurs à 0'],
      max: [100, 'Les points ne peuvent pas dépasser 100'],
    },
    category: {
      type: String,
      required: [true, 'Catégorie requise'],
      enum: {
        values: ['family', 'personal', 'work', 'financial', 'health', 'social'],
        message: 'Catégorie non valide'
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les requêtes
holmesRaheEventSchema.index({ category: 1, isActive: 1 });
holmesRaheEventSchema.index({ points: -1 });

const HolmesRaheEvent = mongoose.model<IHolmesRaheEventDocument>('HolmesRaheEvent', holmesRaheEventSchema);

export default HolmesRaheEvent; 