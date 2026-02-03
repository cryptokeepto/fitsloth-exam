import { Router } from 'express';
import { getWeeklySummaryHandler } from '../controllers/patientController';
import { authenticate } from '../middlewares/auth';
import { requirePatient } from '../middlewares/roleAuth';

const router = Router();

// All routes require authentication and patient role
router.use(authenticate);

// Patient-specific routes
router.get('/weekly-summary', getWeeklySummaryHandler);

export default router;
