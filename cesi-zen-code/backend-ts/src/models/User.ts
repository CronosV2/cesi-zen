import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Définition de l'interface utilisateur
export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin';
  isActive: boolean;
  dateOfBirth?: string;    // Date de naissance (optionnelle)
  ecole?: string;          // École (optionnelle)
  promotion?: string;      // Promotion (optionnelle)
  ville?: string;          // Ville (optionnelle)
  level?: number;          // Niveau de l'utilisateur pour la gamification
  exercicesCompleted?: number; // Nombre d'exercices complétés
  stressLevel?: string;    // Niveau de stress actuel
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour le document MongoDB (ajoute les méthodes et propriétés de mongoose)
export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface pour le modèle (ajout de méthodes statiques si nécessaire)
export interface IUserModel extends Model<IUserDocument> {
  // Méthodes statiques à ajouter si besoin
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email requis'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Mot de passe requis'],
      minlength: 6,
      select: false, // Ne pas renvoyer le mot de passe par défaut
    },
    firstName: {
      type: String,
      required: [true, 'Prénom requis'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Nom requis'],
      trim: true,
    },
    dateOfBirth: {
      type: String,
      trim: true,
    },
    ecole: {
      type: String,
      trim: true,
    },
    promotion: {
      type: String,
      trim: true,
    },
    ville: {
      type: String,
      trim: true,
    },
    level: {
      type: Number,
      default: 1
    },
    exercicesCompleted: {
      type: Number,
      default: 0
    },
    stressLevel: {
      type: String,
      default: 'Normal'
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
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

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(this: IUserDocument, next: any) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode pour vérifier le mot de passe
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;
