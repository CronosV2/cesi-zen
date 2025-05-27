import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { 
  createArticle, 
  getPublicArticles, 
  getFeaturedArticles,
  deleteArticle,
  togglePublishArticle 
} from '../../controllers/articleController';
import Article from '../../models/Article';

// Mock des dépendances
jest.mock('../../models/Article');

describe('Article Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    
    // Créer un objet response avec des fonctions mockées
    responseObject = {};
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation(result => {
        responseObject = result;
        return mockResponse;
      })
    };
  });
  
  afterAll(async () => {
    // Fermer la connexion mongoose après tous les tests
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  describe('createArticle', () => {
    test('devrait créer un article avec succès', async () => {
      // Arrange
      const articleData = {
        title: 'Test Article',
        content: 'Contenu de test pour l\'article',
        excerpt: 'Résumé de l\'article de test',
        author: 'Test Author',
        category: 'conseil',
        isPublished: true,
        isFeatured: false,
        tags: ['test', 'article']
      };
      
      mockRequest = {
        body: articleData
      };
      
      const mockArticle = {
        _id: 'mock-article-id',
        ...articleData,
        save: jest.fn().mockResolvedValue({
          _id: 'mock-article-id',
          ...articleData
        })
      };
      
      // Mock du constructeur Article
      (Article as any).mockImplementation(() => mockArticle);
      
      // Act
      await createArticle(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toEqual({
        message: 'Article créé avec succès',
        article: mockArticle
      });
      expect(mockArticle.save).toHaveBeenCalled();
    });

    test('devrait retourner 400 si les champs requis sont manquants', async () => {
      // Arrange - Manque le titre
      mockRequest = {
        body: {
          content: 'Contenu de test',
          excerpt: 'Résumé',
          author: 'Test Author'
          // category manquant
        }
      };
      
      // Act
      await createArticle(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({
        message: 'Tous les champs requis doivent être remplis'
      });
    });

    test('devrait gérer les erreurs de base de données', async () => {
      // Arrange
      const articleData = {
        title: 'Test Article',
        content: 'Contenu de test',
        excerpt: 'Résumé',
        author: 'Test Author',
        category: 'conseil'
      };
      
      mockRequest = {
        body: articleData
      };
      
      const mockArticle = {
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      };
      
      (Article as any).mockImplementation(() => mockArticle);
      
      // Act
      await createArticle(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseObject).toEqual({
        message: 'Erreur serveur'
      });
    });
  });

  describe('getPublicArticles', () => {
    test('devrait récupérer les articles publics avec pagination', async () => {
      // Arrange
      mockRequest = {
        query: {
          page: '1',
          limit: '6'
        }
      };
      
      const mockArticles = [
        {
          _id: 'article1',
          title: 'Article 1',
          excerpt: 'Résumé 1',
          isPublished: true
        },
        {
          _id: 'article2',
          title: 'Article 2',
          excerpt: 'Résumé 2',
          isPublished: true
        }
      ];
      
      // Mock des méthodes de chaînage avec une approche plus robuste
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockArticles)
      };
      
      // Mock Article.find pour retourner notre mockQuery
      (Article.find as jest.Mock) = jest.fn().mockReturnValue(mockQuery);
      (Article.countDocuments as jest.Mock) = jest.fn().mockResolvedValue(10);
      
      // Act
      await getPublicArticles(mockRequest as any, mockResponse as Response);
      
      // Assert
      expect(Article.find).toHaveBeenCalledWith({ isPublished: true });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        articles: mockArticles,
        pagination: {
          currentPage: 1,
          totalPages: 2,
          totalArticles: 10,
          hasNext: true,
          hasPrev: false
        }
      });
    });

    test('devrait filtrer par catégorie', async () => {
      // Arrange
      mockRequest = {
        query: {
          category: 'conseil',
          page: '1',
          limit: '6'
        }
      };
      
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      };
      
      (Article.find as jest.Mock) = jest.fn().mockReturnValue(mockQuery);
      (Article.countDocuments as jest.Mock) = jest.fn().mockResolvedValue(0);
      
      // Act
      await getPublicArticles(mockRequest as any, mockResponse as Response);
      
      // Assert
      expect(Article.find).toHaveBeenCalledWith({ 
        isPublished: true, 
        category: 'conseil' 
      });
    });
  });

  describe('getFeaturedArticles', () => {
    test('devrait récupérer les articles en vedette', async () => {
      // Arrange
      mockRequest = {
        query: {
          limit: '3'
        }
      };
      
      const mockFeaturedArticles = [
        {
          _id: 'featured1',
          title: 'Article en vedette 1',
          isFeatured: true,
          isPublished: true
        }
      ];
      
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockFeaturedArticles)
      };
      
      (Article.find as jest.Mock) = jest.fn().mockReturnValue(mockQuery);
      
      // Act
      await getFeaturedArticles(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(Article.find).toHaveBeenCalledWith({ 
        isPublished: true, 
        isFeatured: true 
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual(mockFeaturedArticles);
    });
  });

  describe('deleteArticle', () => {
    test('devrait supprimer un article avec succès', async () => {
      // Arrange
      mockRequest = {
        params: {
          id: 'article-id-to-delete'
        }
      };
      
      const mockDeletedArticle = {
        _id: 'article-id-to-delete',
        title: 'Article à supprimer'
      };
      
      (Article.findByIdAndDelete as jest.Mock) = jest.fn().mockResolvedValue(mockDeletedArticle);
      
      // Act
      await deleteArticle(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(Article.findByIdAndDelete).toHaveBeenCalledWith('article-id-to-delete');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        message: 'Article supprimé avec succès'
      });
    });

    test('devrait retourner 404 si l\'article n\'existe pas', async () => {
      // Arrange
      mockRequest = {
        params: {
          id: 'non-existent-id'
        }
      };
      
      (Article.findByIdAndDelete as jest.Mock) = jest.fn().mockResolvedValue(null);
      
      // Act
      await deleteArticle(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toEqual({
        message: 'Article non trouvé'
      });
    });
  });

  describe('togglePublishArticle', () => {
    test('devrait publier un article non publié', async () => {
      // Arrange
      mockRequest = {
        params: {
          id: 'article-id'
        }
      };
      
      const mockArticle = {
        _id: 'article-id',
        title: 'Article à publier',
        isPublished: false,
        publishedAt: null,
        save: jest.fn().mockResolvedValue(true)
      };
      
      (Article.findById as jest.Mock) = jest.fn().mockResolvedValue(mockArticle);
      
      // Act
      await togglePublishArticle(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(Article.findById).toHaveBeenCalledWith('article-id');
      expect(mockArticle.isPublished).toBe(true);
      expect(mockArticle.publishedAt).toBeInstanceOf(Date);
      expect(mockArticle.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({
        message: 'Article publié avec succès',
        article: mockArticle
      });
    });

    test('devrait dépublier un article publié', async () => {
      // Arrange
      mockRequest = {
        params: {
          id: 'article-id'
        }
      };
      
      const mockArticle = {
        _id: 'article-id',
        title: 'Article à dépublier',
        isPublished: true,
        publishedAt: new Date(),
        save: jest.fn().mockResolvedValue(true)
      };
      
      (Article.findById as jest.Mock) = jest.fn().mockResolvedValue(mockArticle);
      
      // Act
      await togglePublishArticle(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockArticle.isPublished).toBe(false);
      expect(mockArticle.save).toHaveBeenCalled();
      expect(responseObject).toEqual({
        message: 'Article dépublié avec succès',
        article: mockArticle
      });
    });

    test('devrait retourner 404 si l\'article n\'existe pas', async () => {
      // Arrange
      mockRequest = {
        params: {
          id: 'non-existent-id'
        }
      };
      
      (Article.findById as jest.Mock) = jest.fn().mockResolvedValue(null);
      
      // Act
      await togglePublishArticle(mockRequest as Request, mockResponse as Response);
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseObject).toEqual({
        message: 'Article non trouvé'
      });
    });
  });
}); 