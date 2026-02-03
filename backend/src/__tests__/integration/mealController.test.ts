/**
 * Meal Controller Tests
 * Tests for ISSUE-006 (Meal ownership verification)
 */

import { Request, Response } from 'express';

// Mock the models
jest.mock('../../models/MealLog', () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock('../../models/FoodItem', () => ({
  findByPk: jest.fn(),
}));

import MealLog from '../../models/MealLog';
import { updateMeal, deleteMeal } from '../../controllers/mealController';

describe('mealController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      userId: 1,
      params: { id: '100' },
      body: { quantity: 2 },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('updateMeal', () => {
    /**
     * ISSUE-006: Should verify meal ownership before update
     */
    it('should return 403 when user tries to update another user\'s meal', async () => {
      // Meal belongs to user 2, but user 1 is requesting
      (MealLog.findOne as jest.Mock).mockResolvedValue(null); // findOne with userId check returns null

      await updateMeal(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('access denied'),
        })
      );
    });

    it('should update meal when user owns it', async () => {
      const mockMeal = {
        id: 100,
        userId: 1,
        quantity: 1,
        save: jest.fn().mockResolvedValue(true),
      };
      (MealLog.findOne as jest.Mock).mockResolvedValue(mockMeal);
      (MealLog.findByPk as jest.Mock).mockResolvedValue({
        ...mockMeal,
        foodItem: { name: 'Test Food' },
      });

      await updateMeal(mockReq as Request, mockRes as Response);

      expect(mockMeal.save).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it('should query meal with both mealId AND userId', async () => {
      (MealLog.findOne as jest.Mock).mockResolvedValue(null);

      await updateMeal(mockReq as Request, mockRes as Response);

      expect(MealLog.findOne).toHaveBeenCalledWith({
        where: { id: 100, userId: 1 },
      });
    });
  });

  describe('deleteMeal', () => {
    /**
     * ISSUE-006: Should verify meal ownership before delete
     */
    it('should return 403 when user tries to delete another user\'s meal', async () => {
      (MealLog.findOne as jest.Mock).mockResolvedValue(null);

      await deleteMeal(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('access denied'),
        })
      );
    });

    it('should delete meal when user owns it', async () => {
      const mockMeal = {
        id: 100,
        userId: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };
      (MealLog.findOne as jest.Mock).mockResolvedValue(mockMeal);

      await deleteMeal(mockReq as Request, mockRes as Response);

      expect(mockMeal.destroy).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it('should query meal with both mealId AND userId for deletion', async () => {
      (MealLog.findOne as jest.Mock).mockResolvedValue(null);

      await deleteMeal(mockReq as Request, mockRes as Response);

      expect(MealLog.findOne).toHaveBeenCalledWith({
        where: { id: 100, userId: 1 },
      });
    });
  });
});
