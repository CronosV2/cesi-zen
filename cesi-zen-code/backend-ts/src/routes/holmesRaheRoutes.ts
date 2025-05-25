import express from 'express';
import * as holmesRaheController from '../controllers/holmesRaheController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// Routes publiques (accessibles aux visiteurs anonymes)
// Récupérer les événements groupés par catégorie
router.get('/events/categories', holmesRaheController.getEventsByCategory);

// Routes pour utilisateurs connectés
router.use(protect); // Authentication requise pour les routes suivantes

// Soumettre un diagnostic (utilisateur connecté)
router.post('/submit', holmesRaheController.submitQuestionnaire);

// Récupérer l'historique des diagnostics de l'utilisateur
router.get('/results', holmesRaheController.getUserResults);

// Routes administrateur
router.use(adminOnly); // Seuls les admins peuvent accéder aux routes suivantes

// Configuration des événements
router.get('/admin/events', holmesRaheController.getAdminEvents);
router.post('/admin/events', holmesRaheController.createEvent);
router.put('/admin/events/:id', holmesRaheController.updateEvent);
router.delete('/admin/events/:id', holmesRaheController.deleteEvent);

// Configuration des résultats
router.get('/admin/stats', holmesRaheController.getAdminStats);

export default router; 