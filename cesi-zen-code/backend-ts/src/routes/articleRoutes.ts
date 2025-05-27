import express from 'express';
import {
  // Routes publiques
  getPublicArticles,
  getPublicArticleById,
  getFeaturedArticles,
  
  // Routes admin
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePublishArticle,
  getArticleStats
} from '../controllers/articleController';
import { protect, adminOnly } from '../middleware/auth';

const router = express.Router();

// Routes publiques (accessibles à tous)
router.get('/public', getPublicArticles);
router.get('/public/featured', getFeaturedArticles);
router.get('/public/:id', getPublicArticleById);

// Routes admin (protection requise)
router.use(protect); // Toutes les routes suivantes nécessitent une authentification
router.use(adminOnly); // Toutes les routes suivantes nécessitent des droits admin

router.get('/admin/stats', getArticleStats);
router.get('/admin', getAllArticles);
router.get('/admin/:id', getArticleById);
router.post('/admin', createArticle);
router.put('/admin/:id', updateArticle);
router.patch('/admin/:id/toggle-publish', togglePublishArticle);
router.delete('/admin/:id', deleteArticle);

export default router; 