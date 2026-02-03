import { Router } from 'express';
import {
  getWeights,
  getWeightById,
  createWeight,
  updateWeight,
  deleteWeight,
  getWeightStats,
} from '../controllers/weightController';
import { authenticate } from '../middlewares/auth';
import { validateCreateWeight, validateIdParam, validateDateQuery } from '../middlewares/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Weight routes
router.get('/', validateDateQuery, getWeights);
router.get('/stats', getWeightStats);
router.get('/:id', validateIdParam, getWeightById);
router.post('/', validateCreateWeight, createWeight);
router.put('/:id', validateIdParam, updateWeight);
router.delete('/:id', validateIdParam, deleteWeight);

export default router;
