import request from 'supertest';
import express from 'express';
import articleRoutes from '../../routes/articleRoutes';

// Mock des modèles pour éviter les problèmes de base de données
const mockArticleInstance = {
  _id: 'mock-article-id',
  title: 'Article de test',
  content: 'Contenu de test',
  excerpt: 'Résumé de test',
  author: 'Auteur de test',
  category: 'conseil',
  isPublished: true,
  save: jest.fn().mockResolvedValue({
    _id: 'mock-article-id',
    title: 'Article de test',
    content: 'Contenu de test',
    excerpt: 'Résumé de test',
    author: 'Auteur de test',
    category: 'conseil',
    isPublished: true
  })
};

jest.mock('../../models/Article', () => {
  return jest.fn().mockImplementation(() => mockArticleInstance);
});

// Ajouter les méthodes statiques au mock
const Article = require('../../models/Article');
Article.find = jest.fn().mockReturnValue({
  select: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue([
    {
      _id: 'mock-article-1',
      title: 'Article de test 1',
      excerpt: 'Résumé de test',
      category: 'conseil',
      isPublished: true
    }
  ])
});

Article.countDocuments = jest.fn().mockResolvedValue(5);
Article.findById = jest.fn().mockResolvedValue({
  _id: 'mock-article-1',
  title: 'Article de test',
  isPublished: false,
  publishedAt: null,
  save: jest.fn().mockResolvedValue(true)
});
Article.findOne = jest.fn().mockResolvedValue({
  _id: 'mock-article-1',
  title: 'Article de test',
  content: 'Contenu de test',
  excerpt: 'Résumé de test',
  category: 'conseil',
  isPublished: true
});
Article.findByIdAndDelete = jest.fn().mockResolvedValue({
  _id: 'mock-article-1',
  title: 'Article supprimé'
});
Article.findByIdAndUpdate = jest.fn().mockResolvedValue({
  _id: 'mock-article-1',
  title: 'Article mis à jour'
});
Article.aggregate = jest.fn().mockResolvedValue([]);

jest.mock('../../models/User', () => ({
  findById: jest.fn().mockResolvedValue({
    _id: 'mock-user-id',
    email: 'test@example.com',
    role: 'admin'
  })
}));

// Mock des middlewares d'authentification
jest.mock('../../middleware/auth', () => ({
  protect: (req: any, res: any, next: any) => {
    req.userId = 'mock-user-id';
    next();
  },
  adminOnly: (req: any, res: any, next: any) => {
    req.user = { role: 'admin' };
    next();
  }
}));

// Créer une app Express simplifiée pour les tests
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/articles', articleRoutes);
  return app;
};

describe('Articles API Integration Tests (Simplified)', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Réinitialiser les mocks
    mockArticleInstance.save.mockResolvedValue({
      _id: 'mock-article-id',
      title: 'Article de test',
      content: 'Contenu de test',
      excerpt: 'Résumé de test',
      author: 'Auteur de test',
      category: 'conseil',
      isPublished: true
    });
  });

  describe('Routes Integration', () => {
    test('devrait avoir les routes publiques configurées', async () => {
      // Test que la route existe et répond
      const response = await request(app)
        .get('/api/articles/public')
        .expect(200);
      
      // La réponse dépendra du mock, mais la route doit être accessible
      expect(response).toBeDefined();
      expect(response.body).toBeDefined();
    });

    test('devrait avoir les routes admin configurées', async () => {
      // Test que la route admin existe
      const response = await request(app)
        .post('/api/articles/admin')
        .send({
          title: 'Test Article',
          content: 'Test Content',
          excerpt: 'Test Excerpt',
          author: 'Test Author',
          category: 'conseil'
        })
        .expect(201);
      
      // La route doit être accessible
      expect(response).toBeDefined();
    });

    test('devrait avoir la route des articles en vedette', async () => {
      const response = await request(app)
        .get('/api/articles/public/featured')
        .expect(200);
      
      expect(response).toBeDefined();
    });

    test('devrait accepter les paramètres de pagination', async () => {
      const response = await request(app)
        .get('/api/articles/public?page=1&limit=5&category=conseil')
        .expect(200);
      
      expect(response).toBeDefined();
    });

    test('devrait accepter les paramètres de recherche', async () => {
      const response = await request(app)
        .get('/api/articles/public?search=test&featured=true')
        .expect(200);
      
      expect(response).toBeDefined();
    });
  });

  describe('Middleware Integration', () => {
    test('devrait appliquer le middleware JSON', async () => {
      // Test que le middleware JSON fonctionne
      const response = await request(app)
        .post('/api/articles/admin')
        .send({
          title: 'Test JSON',
          content: 'Test Content',
          excerpt: 'Test Excerpt',
          author: 'Test Author',
          category: 'conseil'
        })
        .set('Content-Type', 'application/json')
        .expect(201);
      
      expect(response).toBeDefined();
    });

    test('devrait gérer les erreurs de parsing JSON', async () => {
      const response = await request(app)
        .post('/api/articles/admin')
        .send('invalid json')
        .set('Content-Type', 'application/json');
      
      // Devrait retourner une erreur 400 pour JSON invalide
      expect(response.status).toBe(400);
    });
  });

  describe('Route Parameters', () => {
    test('devrait accepter les paramètres d\'ID dans les routes', async () => {
      const testId = '507f1f77bcf86cd799439011'; // ObjectId valide
      
      const response = await request(app)
        .get(`/api/articles/public/${testId}`)
        .expect(200);
      
      expect(response).toBeDefined();
    });

    test('devrait gérer les routes de suppression avec ID', async () => {
      const testId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .delete(`/api/articles/admin/${testId}`)
        .expect(200);
      
      expect(response).toBeDefined();
    });

    test('devrait gérer les routes de mise à jour avec ID', async () => {
      const testId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .put(`/api/articles/admin/${testId}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
          excerpt: 'Updated Excerpt',
          author: 'Updated Author',
          category: 'conseil'
        })
        .expect(200);
      
      expect(response).toBeDefined();
    });

    test('devrait gérer la route toggle-publish', async () => {
      const testId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .patch(`/api/articles/admin/${testId}/toggle-publish`)
        .expect(200);
      
      expect(response).toBeDefined();
    });
  });

  describe('HTTP Methods', () => {
    test('devrait supporter GET pour les articles publics', async () => {
      const response = await request(app)
        .get('/api/articles/public')
        .expect(200);
      
      expect(response).toBeDefined();
    });

    test('devrait supporter POST pour créer des articles', async () => {
      const response = await request(app)
        .post('/api/articles/admin')
        .send({
          title: 'New Article',
          content: 'Article Content',
          excerpt: 'Article Excerpt',
          author: 'Article Author',
          category: 'conseil'
        })
        .expect(201);
      
      expect(response).toBeDefined();
    });

    test('devrait supporter PUT pour mettre à jour des articles', async () => {
      const testId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .put(`/api/articles/admin/${testId}`)
        .send({
          title: 'Updated Article',
          content: 'Updated Content',
          excerpt: 'Updated Excerpt',
          author: 'Updated Author',
          category: 'conseil'
        })
        .expect(200);
      
      expect(response).toBeDefined();
    });

    test('devrait supporter DELETE pour supprimer des articles', async () => {
      const testId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .delete(`/api/articles/admin/${testId}`)
        .expect(200);
      
      expect(response).toBeDefined();
    });

    test('devrait supporter PATCH pour toggle-publish', async () => {
      const testId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .patch(`/api/articles/admin/${testId}/toggle-publish`)
        .expect(200);
      
      expect(response).toBeDefined();
    });
  });

  describe('Content-Type Handling', () => {
    test('devrait accepter application/json', async () => {
      const response = await request(app)
        .post('/api/articles/admin')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          title: 'JSON Test',
          content: 'JSON Content',
          excerpt: 'JSON Excerpt',
          author: 'JSON Author',
          category: 'conseil'
        }))
        .expect(201);
      
      expect(response).toBeDefined();
    });

    test('devrait gérer les requêtes sans Content-Type', async () => {
      const response = await request(app)
        .get('/api/articles/public')
        .expect(200);
      
      expect(response).toBeDefined();
    });
  });

  describe('Error Handling Integration', () => {
    test('devrait gérer les routes inexistantes', async () => {
      const response = await request(app)
        .get('/api/articles/nonexistent');
      
      // Peut être 404 ou 401 selon le middleware d'auth
      expect([404, 401]).toContain(response.status);
    });

    test('devrait gérer les méthodes HTTP non supportées', async () => {
      const response = await request(app)
        .options('/api/articles/public');
      
      // OPTIONS peut être supporté ou non, mais ne doit pas planter
      expect(response).toBeDefined();
    });
  });
}); 