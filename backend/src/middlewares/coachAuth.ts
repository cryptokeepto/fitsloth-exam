import { Request, Response, NextFunction } from 'express';
import { Coach, CoachPatient } from '../models';

/**
 * Middleware to verify coach has access to a patient
 */
export const verifyCoachPatientAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    // Get patient ID from route params
    const patientId = parseInt(req.params.patientId || req.params.id);

    if (isNaN(patientId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid patient ID',
      });
      return;
    }

    // Find the coach record for this user
    const coach = await Coach.findOne({
      where: { userId: req.user.id },
    });

    if (!coach) {
      res.status(403).json({
        success: false,
        error: 'Coach profile not found',
      });
      return;
    }

    // Verify the patient is assigned to this coach
    const assignment = await CoachPatient.findOne({
      where: { coachId: coach.id, patientId },
    });

    if (!assignment) {
      res.status(403).json({
        success: false,
        error: 'Access denied. Patient is not assigned to you.',
      });
      return;
    }

    // Store coach info for later use
    (req as any).coach = coach;
    (req as any).patientId = patientId;

    next();
  } catch (error) {
    console.error('Coach auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Authorization check failed',
    });
  }
};
