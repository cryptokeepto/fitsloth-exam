/**
 * Weight Controller Tests
 * Tests for ISSUE-009 (duplicate date prevention) and ISSUE-010 (profile update on delete)
 */

import { Request, Response } from 'express';
import { Op } from 'sequelize';

// Mock the models
jest.mock('../../models/Weight', () => ({
  findOne: jest.fn(),
  findAll: jest.fn(),
}));

jest.mock('../../models/User', () => ({
  update: jest.fn(),
}));

import Weight from '../../models/Weight';
import User from '../../models/User';
import { updateWeight, deleteWeight } from '../../controllers/weightController';

describe('weightController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      userId: 1,
      params: { id: '100' },
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('updateWeight', () => {
    /**
     * ISSUE-009: Should prevent duplicate weight records for same date
     */
    it('should return 400 when changing date to one that already exists', async () => {
      const existingWeight = {
        id: 100,
        userId: 1,
        recordedDate: '2024-01-15',
        weight: 70,
        save: jest.fn(),
      };
      
      mockReq.body = { recordedDate: '2024-01-20' };
      
      // First call returns the weight being edited
      (Weight.findOne as jest.Mock)
        .mockResolvedValueOnce(existingWeight)
        // Second call finds existing record on new date
        .mockResolvedValueOnce({ id: 200, recordedDate: '2024-01-20' });

      await updateWeight(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('already exists'),
        })
      );
      expect(existingWeight.save).not.toHaveBeenCalled();
    });

    it('should allow update when new date has no existing record', async () => {
      const existingWeight = {
        id: 100,
        userId: 1,
        recordedDate: '2024-01-15',
        weight: 70,
        save: jest.fn().mockResolvedValue(true),
      };
      
      mockReq.body = { recordedDate: '2024-01-20' };
      
      (Weight.findOne as jest.Mock)
        .mockResolvedValueOnce(existingWeight)
        .mockResolvedValueOnce(null); // No existing record on new date

      await updateWeight(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
      expect(existingWeight.save).toHaveBeenCalled();
    });

    it('should allow update when keeping the same date', async () => {
      const existingWeight = {
        id: 100,
        userId: 1,
        recordedDate: '2024-01-15',
        weight: 70,
        save: jest.fn().mockResolvedValue(true),
      };
      
      mockReq.body = { weight: 71 }; // Only updating weight, not date
      
      (Weight.findOne as jest.Mock).mockResolvedValueOnce(existingWeight);

      await updateWeight(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it('should check for duplicate with correct query parameters', async () => {
      const existingWeight = {
        id: 100,
        userId: 1,
        recordedDate: '2024-01-15',
        weight: 70,
        save: jest.fn(),
      };
      
      mockReq.body = { recordedDate: '2024-01-20' };
      
      (Weight.findOne as jest.Mock)
        .mockResolvedValueOnce(existingWeight)
        .mockResolvedValueOnce(null);

      await updateWeight(mockReq as Request, mockRes as Response);

      // Verify the duplicate check query
      expect(Weight.findOne).toHaveBeenNthCalledWith(2, {
        where: {
          userId: 1,
          recordedDate: '2024-01-20',
          id: { [Op.ne]: 100 }, // Exclude current record
        },
      });
    });
  });

  describe('deleteWeight', () => {
    /**
     * ISSUE-010: Should update user's currentWeight after deleting latest weight
     */
    it('should update user profile with latest remaining weight after delete', async () => {
      const weightToDelete = {
        id: 100,
        userId: 1,
        weight: 72,
        destroy: jest.fn().mockResolvedValue(true),
      };
      
      const latestRemainingWeight = {
        id: 99,
        weight: 71,
        recordedDate: '2024-01-14',
      };
      
      (Weight.findOne as jest.Mock)
        .mockResolvedValueOnce(weightToDelete)
        .mockResolvedValueOnce(latestRemainingWeight);
      
      (User.update as jest.Mock).mockResolvedValue([1]);

      await deleteWeight(mockReq as Request, mockRes as Response);

      expect(User.update).toHaveBeenCalledWith(
        { currentWeight: 71 },
        { where: { id: 1 } }
      );
    });

    it('should set currentWeight to null when no weights remain', async () => {
      const weightToDelete = {
        id: 100,
        userId: 1,
        weight: 72,
        destroy: jest.fn().mockResolvedValue(true),
      };
      
      (Weight.findOne as jest.Mock)
        .mockResolvedValueOnce(weightToDelete)
        .mockResolvedValueOnce(null); // No remaining weights
      
      (User.update as jest.Mock).mockResolvedValue([1]);

      await deleteWeight(mockReq as Request, mockRes as Response);

      expect(User.update).toHaveBeenCalledWith(
        { currentWeight: null },
        { where: { id: 1 } }
      );
    });

    it('should query for latest weight by recordedDate DESC', async () => {
      const weightToDelete = {
        id: 100,
        userId: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      
      (Weight.findOne as jest.Mock)
        .mockResolvedValueOnce(weightToDelete)
        .mockResolvedValueOnce(null);
      
      (User.update as jest.Mock).mockResolvedValue([1]);

      await deleteWeight(mockReq as Request, mockRes as Response);

      expect(Weight.findOne).toHaveBeenNthCalledWith(2, {
        where: { userId: 1 },
        order: [['recordedDate', 'DESC']],
      });
    });

    it('should return success after updating profile', async () => {
      const weightToDelete = {
        id: 100,
        userId: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      
      (Weight.findOne as jest.Mock)
        .mockResolvedValueOnce(weightToDelete)
        .mockResolvedValueOnce(null);
      
      (User.update as jest.Mock).mockResolvedValue([1]);

      await deleteWeight(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: expect.stringContaining('deleted'),
        })
      );
    });
  });
});
