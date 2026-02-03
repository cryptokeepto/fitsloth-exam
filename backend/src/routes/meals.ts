import { Router } from 'express';
import {
  getMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  getMealSummary,
} from '../controllers/mealController';
import { authenticate } from '../middlewares/auth';
import { requirePatient } from '../middlewares/roleAuth';
import {
  validateCreateMeal,
  validateUpdateMeal,
  validateIdParam,
  validateDateQuery,
} from '../middlewares/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Meal routes (patient only)
router.get('/', validateDateQuery, getMeals);
router.get('/summary', validateDateQuery, getMealSummary);
router.get('/:id', validateIdParam, getMealById);
router.post('/', validateCreateMeal, createMeal);
router.put('/:id', validateUpdateMeal, updateMeal);
router.delete('/:id', validateIdParam, deleteMeal);

export default router;
