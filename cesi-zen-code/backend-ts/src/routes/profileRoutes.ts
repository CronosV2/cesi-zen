import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// Ces fonctions devront être implémentées dans un profileController
// Pour l'instant, on utilise des placeholders
router.get('/', protect, (req, res) => {
  res.status(200).json({ message: 'Profile route working' });
});

router.put('/', protect, (req, res) => {
  res.status(200).json({ message: 'Profile update endpoint' });
});

export default router;
