import { Request, Response } from 'express';
import Article, { IArticleDocument } from '../models/Article';

// Interface pour les requêtes avec pagination
interface PaginatedRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    category?: string;
    featured?: string;
    published?: string;
    search?: string;
  };
}

// Récupérer tous les articles (publics)
export const getPublicArticles = async (req: PaginatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '6');
    const category = req.query.category;
    const featured = req.query.featured === 'true';
    const search = req.query.search;

    // Construction du filtre
    const filter: any = { isPublished: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (featured) {
      filter.isFeatured = true;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;

    const articles = await Article.find(filter)
      .select('-content') // Exclure le contenu complet pour la liste
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalArticles: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un article par ID (public)
export const getPublicArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await Article.findOne({ 
      _id: id, 
      isPublished: true 
    });

    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les articles en vedette
export const getFeaturedArticles = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string || '3');

    const articles = await Article.find({ 
      isPublished: true, 
      isFeatured: true 
    })
      .select('-content')
      .sort({ publishedAt: -1 })
      .limit(limit);

    res.status(200).json(articles);
  } catch (error) {
    console.error('Erreur lors de la récupération des articles en vedette:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ADMIN ROUTES

// Récupérer tous les articles (admin)
export const getAllArticles = async (req: PaginatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const category = req.query.category;
    const published = req.query.published;
    const search = req.query.search;

    // Construction du filtre
    const filter: any = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (published !== undefined) {
      filter.isPublished = published === 'true';
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;

    const articles = await Article.find(filter)
      .select('-content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalArticles: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles (admin):', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un article par ID (admin)
export const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un nouvel article
export const createArticle = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      excerpt,
      author,
      category,
      isPublished,
      isFeatured,
      imageUrl,
      tags
    } = req.body;

    // Validation des données requises
    if (!title || !content || !excerpt || !author || !category) {
      return res.status(400).json({ 
        message: 'Tous les champs requis doivent être remplis' 
      });
    }

    const article = new Article({
      title,
      content,
      excerpt,
      author,
      category,
      isPublished: isPublished || false,
      isFeatured: isFeatured || false,
      imageUrl,
      tags: tags || []
    });

    await article.save();

    res.status(201).json({
      message: 'Article créé avec succès',
      article
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un article
export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const article = await Article.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(200).json({
      message: 'Article mis à jour avec succès',
      article
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un article
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await Article.findByIdAndDelete(id);

    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(200).json({
      message: 'Article supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Publier/dépublier un article
export const togglePublishArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    article.isPublished = !article.isPublished;
    
    if (article.isPublished && !article.publishedAt) {
      article.publishedAt = new Date();
    }

    await article.save();

    res.status(200).json({
      message: `Article ${article.isPublished ? 'publié' : 'dépublié'} avec succès`,
      article
    });
  } catch (error) {
    console.error('Erreur lors de la publication/dépublication:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Statistiques des articles (admin)
export const getArticleStats = async (req: Request, res: Response) => {
  try {
    const totalArticles = await Article.countDocuments();
    const publishedArticles = await Article.countDocuments({ isPublished: true });
    const featuredArticles = await Article.countDocuments({ isFeatured: true });
    const draftArticles = await Article.countDocuments({ isPublished: false });

    // Statistiques par catégorie
    const categoryStats = await Article.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          published: {
            $sum: { $cond: ['$isPublished', 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      total: totalArticles,
      published: publishedArticles,
      featured: featuredArticles,
      drafts: draftArticles,
      byCategory: categoryStats
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 