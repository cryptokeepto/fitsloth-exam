import { Router } from 'express';
import { getFoods, getFoodById } from '../controllers/foodController';
import { authenticate } from '../middlewares/auth';
import { validateIdParam } from '../middlewares/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Food routes
router.get('/', getFoods);
router.get('/:id', validateIdParam, getFoodById);

export default router;
