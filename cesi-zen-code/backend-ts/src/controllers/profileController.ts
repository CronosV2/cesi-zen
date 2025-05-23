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
    console.log('🔹 Tentative de changement de mot de passe');
    const userId = req.userId;
    
    console.log('🔹 Vérification de l\'authentification - UserId:', userId ? 'Présent' : 'Absent');
    if (!userId) {
      console.log('❌ Changement de mot de passe échoué - Utilisateur non authentifié');
      res.status(401).json({ success: false, message: 'Non authentifié' });
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;
    console.log('🔹 Données reçues:', { 
      currentPassword: currentPassword ? '[MASQUÉ]' : undefined,
      newPassword: newPassword ? '[MASQUÉ]' : undefined,
      confirmPassword: confirmPassword ? '[MASQUÉ]' : undefined
    });

    // Vérifier que tous les champs sont présents
    if (!currentPassword || !newPassword || !confirmPassword) {
      console.log('❌ Changement de mot de passe échoué - Données manquantes');
      res.status(400).json({ 
        success: false, 
        message: 'Tous les champs sont requis (mot de passe actuel, nouveau mot de passe, confirmation)' 
      });
      return;
    }
    console.log('🔹 Vérification des champs réussie - Tous les champs sont présents');

    // Vérifier que les nouveaux mots de passe correspondent
    if (newPassword !== confirmPassword) {
      console.log('❌ Changement de mot de passe échoué - Les mots de passe ne correspondent pas');
      res.status(400).json({ 
        success: false, 
        message: 'Le nouveau mot de passe et sa confirmation ne correspondent pas' 
      });
      return;
    }
    console.log('🔹 Vérification de correspondance réussie - Les mots de passe correspondent');

    // Vérifier la longueur minimale du mot de passe
    if (newPassword.length < 6) {
      console.log('❌ Changement de mot de passe échoué - Mot de passe trop court');
      res.status(400).json({ 
        success: false, 
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' 
      });
      return;
    }
    console.log('🔹 Vérification de longueur réussie - Mot de passe suffisamment long');

    // Récupérer l'utilisateur avec son mot de passe
    console.log(`🔹 Recherche de l'utilisateur dans la base de données - ID: ${userId}`);
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      console.log(`❌ Changement de mot de passe échoué - Utilisateur non trouvé avec l'ID: ${userId}`);
      res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      return;
    }
    
    console.log(`🔹 Utilisateur trouvé - Vérification du champ password: ${user.password ? 'Présent' : 'Absent'}`);
    
    if (!user.password) {
      console.log('❌ Changement de mot de passe échoué - Champ password manquant');
      res.status(500).json({ success: false, message: 'Erreur de configuration utilisateur' });
      return;
    }

    // Vérifier que le mot de passe actuel est correct
    console.log('🔹 Vérification du mot de passe actuel');
    
    try {
      const isMatch = await user.comparePassword(currentPassword);
      
      if (!isMatch) {
        console.log('❌ Changement de mot de passe échoué - Mot de passe actuel incorrect');
        res.status(400).json({ success: false, message: 'Mot de passe actuel incorrect' });
        return;
      }
      console.log('✅ Mot de passe actuel vérifié avec succès');
    } catch (err) {
      console.error('❌ Exception lors de la vérification du mot de passe:', err instanceof Error ? err.message : 'Unknown error');
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la vérification du mot de passe actuel',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
      return;
    }

    // Hacher le nouveau mot de passe
    console.log('🔹 Génération du salt pour le hachage du nouveau mot de passe');
    const salt = await bcrypt.genSalt(10);
    
    console.log('🔹 Hachage du nouveau mot de passe');
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Sauvegarder l'utilisateur avec le nouveau mot de passe
    console.log('🔹 Sauvegarde de l\'utilisateur avec le nouveau mot de passe');
    try {
      await user.save();
      
      console.log('✅ Mot de passe modifié avec succès');
      res.status(200).json({
        success: true,
        message: 'Mot de passe modifié avec succès'
      });
    } catch (saveErr) {
      console.error('❌ Erreur lors de la sauvegarde de l\'utilisateur:', saveErr instanceof Error ? saveErr.message : 'Unknown error');
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la sauvegarde du nouveau mot de passe',
        error: saveErr instanceof Error ? saveErr.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('❌ Erreur lors du changement de mot de passe:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors du changement de mot de passe',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
  console.log('Fin de la fonction changePassword');

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
