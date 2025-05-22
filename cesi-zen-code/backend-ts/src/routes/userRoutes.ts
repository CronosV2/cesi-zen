import express from 'express';
import * as userController from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, userController.getAllUsers);
router.post('/test', userController.createTestUser);

export default router;
