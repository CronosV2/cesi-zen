import express from 'express';
import * as adminController from '../controllers/adminController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// Obtenir les statistiques des utilisateurs
router.get('/users/stats', protect, adminOnly, adminController.getUserStats);

// Récupérer tous les utilisateurs avec pagination et filtres
router.get('/users', protect, adminOnly, adminController.getAllUsers);

// Créer un nouvel utilisateur
router.post('/users', protect, adminOnly, adminController.createUser);

// Mettre à jour un utilisateur
router.put('/users/:id', protect, adminOnly, adminController.updateUser);

// Désactiver un utilisateur
router.patch('/users/:id/deactivate', protect, adminOnly, adminController.deactivateUser);

// Réactiver un utilisateur
router.patch('/users/:id/activate', protect, adminOnly, adminController.activateUser);

// Supprimer un utilisateur
router.delete('/users/:id', protect, adminOnly, adminController.deleteUser);

// Réinitialiser le mot de passe d'un utilisateur
router.patch('/users/:id/reset-password', protect, adminOnly, adminController.resetUserPassword);

export default router; 