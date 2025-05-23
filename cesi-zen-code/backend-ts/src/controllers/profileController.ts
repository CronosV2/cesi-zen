import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

/**
 * Récupère les données de profil de l'utilisateur connecté
 * Ces données sont formatées pour être utilisées directement dans le BentoGrid
 */
export const getProfileData = async (req: Request, res: Response): Promise<void> => {
  try {
    // userId est ajouté par le middleware protect
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'Non authentifié' });
      return;
    }

    // Récupérer l'utilisateur avec tous ses champs
    const user = await User.findById(userId);
    
    if (!user) {
      res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      return;
    }

    // Formater les données pour le BentoGrid
    const profileData = {
      success: true,
      name: `${user.firstName} ${user.lastName}`,
      status: user.role === 'admin' ? 'Administrateur' : 'Étudiant CESI',
      level: user.level || 1,
      exercicesCompleted: user.exercicesCompleted || 0,
      stressLevel: user.stressLevel || 'Normal',
      // Données supplémentaires
      ecole: user.ecole || '',
      promotion: user.promotion || '',
      ville: user.ville || '',
      dateOfBirth: user.dateOfBirth || '',
      email: user.email
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données de profil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des données de profil',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Récupère toutes les données de profil de l'utilisateur connecté
 * Utilisé pour remplir le formulaire de profil
 */
export const getFullProfileData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'Non authentifié' });
      return;
    }

    // Récupérer l'utilisateur sans le mot de passe
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      return;
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil complet:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération du profil complet',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Met à jour les informations de profil de l'utilisateur connecté
 */
export const updateProfileData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'Non authentifié' });
      return;
    }

    // Extraire les champs modifiables du corps de la requête
    const { firstName, lastName, dateOfBirth, ecole, promotion, ville } = req.body;

    // Vérifier les champs obligatoires
    if (!firstName || !lastName) {
      res.status(400).json({ success: false, message: 'Le prénom et le nom sont requis' });
      return;
    }

    // Préparer l'objet de mise à jour
    const updateData = {
      firstName,
      lastName,
      dateOfBirth,
      ecole,
      promotion,
      ville
    };

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la mise à jour du profil',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Change le mot de passe de l'utilisateur connecté
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    
    if (!userId) {
      res.status(401).json({ success: false, message: 'Non authentifié' });
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Vérifier que tous les champs sont présents
    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400).json({ 
        success: false, 
        message: 'Tous les champs sont requis (mot de passe actuel, nouveau mot de passe, confirmation)' 
      });
      return;
    }

    // Vérifier que les nouveaux mots de passe correspondent
    if (newPassword !== confirmPassword) {
      res.status(400).json({ 
        success: false, 
        message: 'Le nouveau mot de passe et sa confirmation ne correspondent pas' 
      });
      return;
    }

    // Vérifier la longueur minimale du mot de passe
    if (newPassword.length < 6) {
      res.status(400).json({ 
        success: false, 
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' 
      });
      return;
    }

    // Récupérer l'utilisateur avec son mot de passe
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      return;
    }

    // Vérifier que le mot de passe actuel est correct
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Mot de passe actuel incorrect' });
      return;
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Sauvegarder l'utilisateur avec le nouveau mot de passe
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors du changement de mot de passe',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Point de terminaison temporaire pour fournir des données de test
 * À utiliser uniquement pendant le développement
 */
export const getTestProfileData = async (req: Request, res: Response): Promise<void> => {
  // Renvoie des données fictives pour le développement front-end
  res.status(200).json({
    name: "John Doe",
    status: "Étudiant CESI",
    level: 5,
    exercicesCompleted: 15,
    stressLevel: "Moyen",
    ecole: "CESI Bordeaux",
    promotion: "2025",
    ville: "Bordeaux",
    email: "john.doe@example.com",
    dateOfBirth: "1995-05-15"
  });
};
