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
    const { email, password, firstName, lastName } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Cet email est déjà utilisé' });
      return;
    }

    // Créer l'utilisateur
    const user = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    // Générer les tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // Envoyer les cookies
    res.cookie('accessToken', accessToken, getCookieOptions(ACCESS_TOKEN_COOKIE_EXPIRY));
    res.cookie('refreshToken', refreshToken, getCookieOptions(REFRESH_TOKEN_COOKIE_EXPIRY));

    // Envoyer la réponse sans le mot de passe
    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'inscription',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }

    // Générer les tokens
    const { accessToken, refreshToken } = generateTokens(user._id.toString());

    // Envoyer les cookies
    res.cookie('accessToken', accessToken, getCookieOptions(ACCESS_TOKEN_COOKIE_EXPIRY));
    res.cookie('refreshToken', refreshToken, getCookieOptions(REFRESH_TOKEN_COOKIE_EXPIRY));

    // Envoyer la réponse sans le mot de passe
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la connexion',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const logout = (req: Request, res: Response): void => {
  // Supprimer les cookies
  res.cookie('accessToken', '', { expires: new Date(0), httpOnly: true });
  res.cookie('refreshToken', '', { expires: new Date(0), httpOnly: true });
  
  res.status(200).json({ success: true, message: 'Déconnexion réussie' });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // userId est ajouté par le middleware protect
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'Non authentifié' });
      return;
    }

    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des données utilisateur',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
