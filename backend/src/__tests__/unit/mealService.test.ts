/**
 * Meal Service Unit Tests
 * Tests for ISSUE-003 (calorie calculation with quantity)
 */

import { calculateMealCalories } from '../../services/mealService';

describe('mealService', () => {
  describe('calculateMealCalories', () => {
    /**
     * ISSUE-003: Calorie calculation should multiply calories by quantity
     * Formula: totalCalories = caloriesPerServing * quantity
     */
    it('should multiply calories by quantity', () => {
      expect(calculateMealCalories(200, 2)).toBe(400);
    });

    it('should return correct calories for single serving', () => {
      expect(calculateMealCalories(350, 1)).toBe(350);
    });

    it('should return correct calories for multiple servings', () => {
      expect(calculateMealCalories(150, 3)).toBe(450);
    });

    it('should handle fractional quantities', () => {
      expect(calculateMealCalories(200, 1.5)).toBe(300);
    });

    it('should handle small quantities', () => {
      expect(calculateMealCalories(500, 0.5)).toBe(250);
    });

    it('should round to nearest integer', () => {
      // 150 * 1.3 = 195
      expect(calculateMealCalories(150, 1.3)).toBe(195);
    });

    it('should handle large calorie values', () => {
      expect(calculateMealCalories(800, 2)).toBe(1600);
    });

    it('should handle large quantities', () => {
      expect(calculateMealCalories(100, 10)).toBe(1000);
    });

    it('should return 0 for zero quantity', () => {
      expect(calculateMealCalories(200, 0)).toBe(0);
    });

    it('should handle various real-world food examples', () => {
      // Rice (130 cal/serving) x 2 servings
      expect(calculateMealCalories(130, 2)).toBe(260);
      
      // Chicken breast (165 cal) x 1.5 servings
      expect(calculateMealCalories(165, 1.5)).toBe(248);
      
      // Apple (95 cal) x 3
      expect(calculateMealCalories(95, 3)).toBe(285);
      
      // Pizza slice (285 cal) x 4 slices
      expect(calculateMealCalories(285, 4)).toBe(1140);
    });
  });
});
