import { Request, Response } from 'express';
import User from '../models/User';
import { generateTokens } from '../utils/jwt';

// Durées des cookies en millisecondes
const ACCESS_TOKEN_COOKIE_EXPIRY = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_COOKIE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 jours

// Options de cookie sécurisées
const getCookieOptions = (expiry: number) => ({
  expires: new Date(Date.now() + expiry),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔹 Tentative d\'inscription - Données reçues:', { 
      ...req.body,
      password: req.body.password ? '[MASQUÉ]' : undefined // Ne pas logger le mot de passe
    });

    const { email, password, firstName, lastName } = req.body;
    
    // Validation des champs obligatoires uniquement
    if (!email || !password || !firstName || !lastName) {
      console.log('❌ Inscription échouée - Données obligatoires manquantes');
      res.status(400).json({ message: 'Veuillez fournir les informations obligatoires (email, mot de passe, prénom, nom)' });
      return;
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`❌ Inscription échouée - Email déjà utilisé: ${email}`);
      res.status(400).json({ message: 'Cet email est déjà utilisé' });
      return;
    }

    // Préparer les données utilisateur avec les champs optionnels
    console.log(`🔹 Préparation des données pour l'utilisateur avec email: ${email}`);
    const { dateOfBirth, ecole, promotion, ville } = req.body;
    
    // Construction de l'objet utilisateur
    const userData = {
      email,
      password,
      firstName,
      lastName,
      // Ajout des champs optionnels s'ils sont présents
      ...(dateOfBirth && { dateOfBirth }),
      ...(ecole && { ecole }),
      ...(promotion && { promotion }),
      ...(ville && { ville })
    };
    
    // Création de l'utilisateur
    console.log(`🔹 Création d'un nouvel utilisateur avec email: ${email}`);
    const user = await User.create(userData);

    console.log(`✅ Utilisateur créé avec succès - ID: ${user._id}`);

    // Générer les tokens
    console.log(`🔹 Génération des tokens JWT pour l'utilisateur: ${user._id}`);
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // Envoyer les cookies
    console.log('🔹 Envoi des cookies d\'authentification');
    res.cookie('accessToken', accessToken, getCookieOptions(ACCESS_TOKEN_COOKIE_EXPIRY));
    res.cookie('refreshToken', refreshToken, getCookieOptions(REFRESH_TOKEN_COOKIE_EXPIRY));

    // Envoyer la réponse sans le mot de passe
    console.log('✅ Inscription terminée avec succès');
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        level: user.level,
        exercicesCompleted: user.exercicesCompleted,
        stressLevel: user.stressLevel,
        ecole: user.ecole,
        promotion: user.promotion,
        ville: user.ville,
        dateOfBirth: user.dateOfBirth
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription:', error instanceof Error ? error.message : 'Unknown error', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'inscription',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔹 Tentative de connexion - Email:', req.body.email);
    
    const { email, password } = req.body;
    
    // Validation des données
    if (!email || !password) {
      console.log('❌ Connexion échouée - Email ou mot de passe manquant');
      res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe' });
      return;
    }

    // Vérifier si l'utilisateur existe
    console.log(`🔹 Recherche de l'utilisateur avec l'email: ${email}`);
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(`❌ Connexion échouée - Aucun utilisateur trouvé avec l'email: ${email}`);
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }

    // Vérifier le mot de passe
    console.log(`🔹 Vérification du mot de passe pour l'utilisateur: ${user._id}`);
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      console.log(`❌ Connexion échouée - Mot de passe incorrect pour l'utilisateur: ${user._id}`);
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }
    
    console.log(`✅ Authentification réussie pour l'utilisateur: ${user._id}`);

    // Générer les tokens
    console.log(`🔹 Génération des tokens JWT pour l'utilisateur: ${user._id}`);
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // Envoyer les cookies
    console.log('🔹 Envoi des cookies d\'authentification');
    res.cookie('accessToken', accessToken, getCookieOptions(ACCESS_TOKEN_COOKIE_EXPIRY));
    res.cookie('refreshToken', refreshToken, getCookieOptions(REFRESH_TOKEN_COOKIE_EXPIRY));

    // Envoyer la réponse sans le mot de passe
    console.log('✅ Connexion terminée avec succès');
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        level: user.level,
        exercicesCompleted: user.exercicesCompleted,
        stressLevel: user.stressLevel,
        ecole: user.ecole,
        promotion: user.promotion,
        ville: user.ville,
        dateOfBirth: user.dateOfBirth
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error instanceof Error ? error.message : 'Unknown error', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la connexion',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const logout = (req: Request, res: Response): void => {
  console.log('🔹 Tentative de déconnexion');
  
  // Supprimer les cookies
  console.log('🔹 Suppression des cookies d\'authentification');
  res.cookie('accessToken', '', { expires: new Date(0), httpOnly: true });
  res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true });
  
  console.log('✅ Déconnexion réussie');
  res.status(200).json({ success: true, message: 'Déconnexion réussie' });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔹 Récupération des informations de l\'utilisateur authentifié');
    // userId est ajouté par le middleware protect
    const userId = req.userId;
    
    if (!userId) {
      console.log('❌ Récupération échouée - Utilisateur non authentifié');
      res.status(401).json({ message: 'Non authentifié' });
      return;
    }

    console.log(`🔹 Recherche de l'utilisateur dans la base de données - ID: ${userId}`);
    const user = await User.findById(userId);
    
    if (!user) {
      console.log(`❌ Récupération échouée - Utilisateur non trouvé avec l'ID: ${userId}`);
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    console.log(`✅ Informations utilisateur récupérées avec succès - ID: ${userId}`);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        level: user.level,
        exercicesCompleted: user.exercicesCompleted,
        stressLevel: user.stressLevel,
        ecole: user.ecole,
        promotion: user.promotion,
        ville: user.ville,
        dateOfBirth: user.dateOfBirth
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des données utilisateur:', error instanceof Error ? error.message : 'Unknown error', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des données utilisateur',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
