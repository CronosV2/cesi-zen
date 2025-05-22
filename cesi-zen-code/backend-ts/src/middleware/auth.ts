import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Étendre l'interface Request pour inclure userId
declare module 'express' {
  interface Request {
    userId?: string;
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Récupérer le token du header ou du cookie
    const authHeader = req.headers.authorization;
    const token = req.cookies?.accessToken || (authHeader && authHeader.startsWith('Bearer') 
      ? authHeader.split(' ')[1] 
      : undefined);

    if (!token) {
      res.status(401).json({ message: 'Non authentifié' });
      return;
    }

    // Vérifier que JWT_ACCESS_SECRET est défini
    const jwtSecret = process.env.JWT_ACCESS_SECRET;
    if (!jwtSecret) {
      console.error('JWT_ACCESS_SECRET not defined in environment variables');
      res.status(500).json({ message: 'Erreur de configuration du serveur' });
      return;
    }

    // Vérifier le token
    const decoded = verifyToken(token, jwtSecret);
    if (!decoded) {
      res.status(401).json({ message: 'Token invalide' });
      return;
    }

    // Ajouter l'utilisateur à la requête
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Erreur d\'authentification' });
  }
};
