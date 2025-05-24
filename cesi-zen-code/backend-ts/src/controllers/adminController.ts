import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

// Récupérer tous les utilisateurs (admin)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔹 [ADMIN] Récupération de tous les utilisateurs');
    
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Construction du filtre de recherche
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && role !== 'all') {
      filter.role = role;
    }

    // Récupérer les utilisateurs avec pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Compter le total d'utilisateurs
    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    console.log(`✅ [ADMIN] ${users.length} utilisateurs récupérés sur ${total} total`);
    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: pageNum,
        totalPages,
        total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('❌ [ADMIN] Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Créer un nouvel utilisateur (admin)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('🔹 [ADMIN] Création d\'un nouvel utilisateur');
    
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      role = 'student',
      dateOfBirth,
      ecole,
      promotion,
      ville 
    } = req.body;

    // Validation des champs obligatoires
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({
        success: false,
        message: 'Email, mot de passe, prénom et nom sont requis'
      });
      return;
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
      return;
    }

    // Créer l'utilisateur
    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      role,
      isActive: true,
      ...(dateOfBirth && { dateOfBirth }),
      ...(ecole && { ecole }),
      ...(promotion && { promotion }),
      ...(ville && { ville })
    });

    console.log(`✅ [ADMIN] Utilisateur créé avec l'ID: ${newUser._id}`);
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('❌ [ADMIN] Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Mettre à jour un utilisateur (admin)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      firstName, 
      lastName, 
      email,
      role,
      dateOfBirth,
      ecole,
      promotion,
      ville,
      isActive
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        role,
        dateOfBirth,
        ecole,
        promotion,
        ville,
        isActive
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ [ADMIN] Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'utilisateur',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Désactiver un utilisateur
export const deactivateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const adminUserId = req.userId;

    if (id === adminUserId) {
      res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas désactiver votre propre compte'
      });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur désactivé avec succès',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la désactivation de l\'utilisateur'
    });
  }
};

// Réactiver un utilisateur
export const activateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur réactivé avec succès',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réactivation de l\'utilisateur'
    });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const adminUserId = req.userId;

    if (id === adminUserId) {
      res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'utilisateur'
    });
  }
};

// Réinitialiser le mot de passe d'un utilisateur
export const resetUserPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réinitialisation du mot de passe'
    });
  }
};

// Obtenir les statistiques des utilisateurs
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const studentUsers = await User.countDocuments({ role: 'student' });
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    const schoolStats = await User.aggregate([
      {
        $match: { 
          $and: [
            { ecole: { $ne: null } },
            { ecole: { $ne: '' } }
          ]
        }
      },
      {
        $group: {
          _id: '$ecole',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        adminUsers,
        studentUsers,
        recentUsers,
        schoolStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
}; 