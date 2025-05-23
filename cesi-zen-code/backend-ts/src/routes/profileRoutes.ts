import express from 'express';
import { protect } from '../middleware/auth';
import * as profileController from '../controllers/profileController';

const router = express.Router();

// Route pour récupérer les données de profil formatées pour le BentoGrid
router.get('/data', protect, profileController.getProfileData);

// Route pour récupérer les données complètes du profil (pour le formulaire de profil)
router.get('/full', protect, profileController.getFullProfileData);

// Route pour mettre à jour les informations de profil
router.put('/update', protect, profileController.updateProfileData);

// Route pour changer le mot de passe
router.post('/change-password', protect, profileController.changePassword);

// Route de test pour le développement frontend (pas besoin d'authentification)
router.get('/test', profileController.getTestProfileData);

// Route générale de profil (pour compatibilité)
router.get('/', protect, profileController.getFullProfileData);

export default router;
