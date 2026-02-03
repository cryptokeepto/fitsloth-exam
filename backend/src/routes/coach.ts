import { Router } from 'express';
import {
  getPatients,
  getPatientDetail,
  getPatientMeals,
  getPatientWeights,
} from '../controllers/coachController';
import { authenticate } from '../middlewares/auth';
import { requireCoach } from '../middlewares/roleAuth';
import { verifyCoachPatientAccess } from '../middlewares/coachAuth';

const router = Router();

// All routes require authentication and coach role
router.use(authenticate);
router.use(requireCoach);

// Coach routes
router.get('/patients', getPatients);

// Routes that require patient access verification
router.get('/patients/:id', verifyCoachPatientAccess, getPatientDetail);
router.get('/patients/:id/meals', verifyCoachPatientAccess, getPatientMeals);
router.get('/patients/:id/weights', verifyCoachPatientAccess, getPatientWeights);

export default router;
