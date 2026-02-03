/**
 * Coach Auth Middleware Tests
 * Tests for ISSUE-005 (Coach patient access verification)
 */

import { Request, Response, NextFunction } from 'express';

// Mock the models
jest.mock('../../models/Coach', () => ({
  findOne: jest.fn(),
}));

jest.mock('../../models/CoachPatient', () => ({
  findOne: jest.fn(),
}));

import Coach from '../../models/Coach';
import CoachPatient from '../../models/CoachPatient';
import { verifyCoachPatientAccess } from '../../middlewares/coachAuth';

describe('coachAuth middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      user: { id: 1, role: 'coach' } as any,
      params: { patientId: '2' },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('verifyCoachPatientAccess', () => {
    /**
     * ISSUE-005: Coach should only access assigned patients
     */
    it('should call next() when coach is assigned to patient', async () => {
      const mockCoach = { id: 10, userId: 1 };
      (Coach.findOne as jest.Mock).mockResolvedValue(mockCoach);
      (CoachPatient.findOne as jest.Mock).mockResolvedValue({ coachId: 10, patientId: 2 });

      await verifyCoachPatientAccess(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 403 when patient is NOT assigned to coach', async () => {
      const mockCoach = { id: 10, userId: 1 };
      (Coach.findOne as jest.Mock).mockResolvedValue(mockCoach);
      (CoachPatient.findOne as jest.Mock).mockResolvedValue(null); // No assignment

      await verifyCoachPatientAccess(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('not assigned'),
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 404 when coach record not found', async () => {
      (Coach.findOne as jest.Mock).mockResolvedValue(null);

      await verifyCoachPatientAccess(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid patient ID', async () => {
      mockReq.params = { patientId: 'invalid' };

      await verifyCoachPatientAccess(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should verify correct coach-patient relationship', async () => {
      const mockCoach = { id: 10, userId: 1 };
      (Coach.findOne as jest.Mock).mockResolvedValue(mockCoach);
      (CoachPatient.findOne as jest.Mock).mockResolvedValue({ coachId: 10, patientId: 2 });

      await verifyCoachPatientAccess(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(CoachPatient.findOne).toHaveBeenCalledWith({
        where: { coachId: 10, patientId: 2 },
      });
    });
  });
});
