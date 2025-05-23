import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { register } from '../../controllers/authController';
import User from '../../models/User';
import { generateTokens } from '../../utils/jwt';

// Mock des dépendances
jest.mock('../../models/User');
jest.mock('../../utils/jwt');
jest.mock('bcryptjs');

describe('Auth Controller - Register', () => {
  // Configuration avant chaque test
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    
    // Créer un objet response avec des fonctions mockées
    responseObject = {
      success: false,
      message: '',
      user: null,
      token: null
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation(result => {
        responseObject = result;
        return mockResponse;
      }),
      cookie: jest.fn().mockReturnThis()
    };
    
    // Configurer le mock de bcrypt - Le contrôleur utilise le hook pre-save de Mongoose, donc on ne l'appelle pas directement
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
    
    // Configurer le mock de generateTokens
    (generateTokens as jest.Mock).mockReturnValue({ accessToken: 'mocked-jwt-token', refreshToken: 'mocked-refresh-token' });
  });
  
  afterAll(async () => {
    // Fermer la connexion mongoose après tous les tests
    await mongoose.connection.close();
  });

  // Test de création d'utilisateur réussie
  test('devrait créer un utilisateur avec succès et retourner 201', async () => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      ecole: 'CESI',
      promotion: '2025',
      ville: 'Paris'
    };
    
    mockRequest = {
      body: userData
    };
    
    // Mock User.findOne pour retourner null (utilisateur n'existe pas)
    (User.findOne as jest.Mock).mockResolvedValue(null);
    
    // Mock User.create pour simuler la création
    (User.create as jest.Mock).mockResolvedValue({
      _id: 'mocked-user-id',
      ...userData,
      password: 'hashedPassword123',
      role: 'student',
      isActive: true
    });
    
    // Act
    await register(mockRequest as Request, mockResponse as Response);
    
    // Assert
    expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
    // Nous ne vérifions pas bcrypt.hash car il est appelé dans le middleware pre-save, pas directement dans le contrôleur
    expect(User.create).toHaveBeenCalled();
    expect(generateTokens).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'accessToken', 
      'mocked-jwt-token',
      expect.any(Object)
    );
    // Comparer avec la réponse réelle du contrôleur qui inclut success et user
    expect(responseObject).toEqual(
      expect.objectContaining({
        success: true,
        user: expect.objectContaining({
          id: 'mocked-user-id',
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: 'student',
          // Les champs optionnels
          dateOfBirth: userData.dateOfBirth,
          ecole: userData.ecole,
          promotion: userData.promotion,
          ville: userData.ville
        })
      })
    );
  });
  
  // Test de création d'utilisateur avec email déjà existant
  test('devrait retourner 400 si l\'email existe déjà', async () => {
    // Arrange
    mockRequest = {
      body: {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Existing',
        lastName: 'User'
      }
    };
    
    // Mock User.findOne pour retourner un utilisateur existant
    (User.findOne as jest.Mock).mockResolvedValue({
      email: 'existing@example.com'
    });
    
    // Act
    await register(mockRequest as Request, mockResponse as Response);
    
    // Assert
    expect(User.findOne).toHaveBeenCalledWith({ email: 'existing@example.com' });
    expect(User.create).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(responseObject).toEqual({
      // Le contrôleur ne renvoie pas la propriété success
      message: 'Cet email est déjà utilisé'
    });
  });
  
  // Test avec des données incomplètes
  test('devrait retourner 400 si les données sont incomplètes', async () => {
    // Arrange - Manque firstName
    mockRequest = {
      body: {
        email: 'test@example.com',
        password: 'Password123!',
        lastName: 'User'
      }
    };
    
    // Act
    await register(mockRequest as Request, mockResponse as Response);
    
    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(responseObject).toEqual({
      // Utiliser le message exact que renvoie le contrôleur
      message: 'Veuillez fournir les informations obligatoires (email, mot de passe, prénom, nom)'
    });
    
    // Arrange - Manque email
    mockRequest = {
      body: {
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      }
    };
    
    // Act
    await register(mockRequest as Request, mockResponse as Response);
    
    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });
  
  // Test avec une erreur interne du serveur
  test('devrait gérer les erreurs internes du serveur', async () => {
    // Arrange
    mockRequest = {
      body: {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User'
      }
    };
    
    // Mock User.findOne pour simuler une erreur
    const mockError = new Error('Database connection failed');
    (User.findOne as jest.Mock).mockRejectedValue(mockError);
    
    // Act
    await register(mockRequest as Request, mockResponse as Response);
    
    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(responseObject).toEqual(
      expect.objectContaining({
        message: 'Erreur lors de l\'inscription',
        error: 'Database connection failed'
        // Utiliser objectContaining car il peut y avoir d'autres propriétés
      })
    );
  });
  
  // Test pour vérifier que les champs optionnels sont correctement gérés
  test('devrait créer un utilisateur avec seulement les champs obligatoires', async () => {
    // Arrange - Uniquement les champs obligatoires
    const requiredUserData = {
      email: 'minimal@example.com',
      password: 'Password123!',
      firstName: 'Minimal',
      lastName: 'User'
    };
    
    mockRequest = {
      body: requiredUserData
    };
    
    // Mock User.findOne pour retourner null
    (User.findOne as jest.Mock).mockResolvedValue(null);
    
    // Mock User.create pour simuler la création
    (User.create as jest.Mock).mockResolvedValue({
      _id: 'mocked-user-id',
      ...requiredUserData,
      password: 'hashedPassword123',
      role: 'student',
      isActive: true
    });
    
    // Act
    await register(mockRequest as Request, mockResponse as Response);
    
    // Assert
    // Vérifier que User.create a été appelé avec les données correctes, mais sans vérifier le mot de passe haché
    // car cela est géré par le middleware pre-save
    expect(User.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: requiredUserData.email,
        firstName: requiredUserData.firstName,
        lastName: requiredUserData.lastName
        // Ne pas vérifier le mot de passe car il sera haché par le middleware
      })
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
  });
});
