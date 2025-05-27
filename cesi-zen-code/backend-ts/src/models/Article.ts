import mongoose, { Document, Schema } from 'mongoose';

// Interface pour un article
export interface IArticle {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: 'actualite' | 'conseil' | 'evenement' | 'sante';
  isPublished: boolean;
  isFeatured: boolean;
  imageUrl?: string;
  tags: string[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IArticleDocument extends IArticle, Document {}

// Schéma pour les articles
const articleSchema = new Schema<IArticleDocument>(
  {
    title: {
      type: String,
      required: [true, 'Titre de l\'article requis'],
      trim: true,
      maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères'],
    },
    content: {
      type: String,
      required: [true, 'Contenu de l\'article requis'],
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Extrait de l\'article requis'],
      trim: true,
      maxlength: [300, 'L\'extrait ne peut pas dépasser 300 caractères'],
    },
    author: {
      type: String,
      required: [true, 'Auteur de l\'article requis'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Catégorie requise'],
      enum: {
        values: ['actualite', 'conseil', 'evenement', 'sante'],
        message: 'Catégorie non valide'
      },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour optimiser les requêtes
articleSchema.index({ category: 1, isPublished: 1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ isFeatured: 1, isPublished: 1 });
articleSchema.index({ tags: 1 });

// Middleware pour définir publishedAt lors de la publication
articleSchema.pre('save', function(this: IArticleDocument, next: any) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const Article = mongoose.model<IArticleDocument>('Article', articleSchema);

export default Article; 