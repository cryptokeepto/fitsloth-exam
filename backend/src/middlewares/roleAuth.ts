import { Request, Response, NextFunction } from 'express';

type UserRole = 'patient' | 'coach' | 'admin';

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        success: false,
        error: 'Access denied. Insufficient permissions.',
      });
      return;
    }

    next();
  };
};

export const requirePatient = requireRole('patient');
export const requireCoach = requireRole('coach');
export const requireAdmin = requireRole('admin');
export const requireCoachOrAdmin = requireRole('coach', 'admin');
