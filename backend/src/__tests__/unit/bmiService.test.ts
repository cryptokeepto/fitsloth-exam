/**
 * BMI Service Unit Tests
 * Tests for ISSUE-001 (BMI calculation) and ISSUE-002 (BMI category thresholds)
 */

import { calculateBMI, getBMICategory, isHealthyBMI } from '../../services/bmiService';

describe('bmiService', () => {
  describe('calculateBMI', () => {
    /**
     * ISSUE-001: BMI calculation should divide weight by height squared
     * Formula: BMI = weight(kg) / height(m)²
     */
    it('should calculate BMI correctly using height squared formula', () => {
      // 70kg, 175cm -> BMI = 70 / (1.75)² = 70 / 3.0625 = 22.86 ≈ 22.9
      expect(calculateBMI(70, 175)).toBe(22.9);
    });

    it('should return correct BMI for standard weight and height', () => {
      // 60kg, 165cm -> BMI = 60 / (1.65)² = 60 / 2.7225 = 22.04 ≈ 22.0
      expect(calculateBMI(60, 165)).toBe(22.0);
    });

    it('should handle edge case with short height', () => {
      // 50kg, 150cm -> BMI = 50 / (1.5)² = 50 / 2.25 = 22.22 ≈ 22.2
      expect(calculateBMI(50, 150)).toBe(22.2);
    });

    it('should handle edge case with tall height', () => {
      // 90kg, 190cm -> BMI = 90 / (1.9)² = 90 / 3.61 = 24.93 ≈ 24.9
      expect(calculateBMI(90, 190)).toBe(24.9);
    });

    it('should round to 1 decimal place', () => {
      // 68kg, 172cm -> BMI = 68 / (1.72)² = 68 / 2.9584 = 22.985 ≈ 23.0
      expect(calculateBMI(68, 172)).toBe(23.0);
    });

    it('should handle underweight calculation', () => {
      // 45kg, 170cm -> BMI = 45 / (1.7)² = 45 / 2.89 = 15.57 ≈ 15.6
      expect(calculateBMI(45, 170)).toBe(15.6);
    });

    it('should handle overweight calculation', () => {
      // 85kg, 170cm -> BMI = 85 / (1.7)² = 85 / 2.89 = 29.41 ≈ 29.4
      expect(calculateBMI(85, 170)).toBe(29.4);
    });

    it('should handle obese calculation', () => {
      // 100kg, 170cm -> BMI = 100 / (1.7)² = 100 / 2.89 = 34.6
      expect(calculateBMI(100, 170)).toBe(34.6);
    });
  });

  describe('getBMICategory', () => {
    /**
     * ISSUE-002: BMI categories should use WHO standard thresholds
     * Underweight: < 18.5
     * Normal: 18.5 - 24.9
     * Overweight: 25 - 29.9
     * Obese: ≥ 30
     */
    it('should return Underweight for BMI < 18.5', () => {
      expect(getBMICategory(15)).toBe('Underweight');
      expect(getBMICategory(17)).toBe('Underweight');
      expect(getBMICategory(18.4)).toBe('Underweight');
    });

    it('should return Normal for BMI 18.5 - 24.9', () => {
      expect(getBMICategory(18.5)).toBe('Normal');
      expect(getBMICategory(22)).toBe('Normal');
      expect(getBMICategory(24.9)).toBe('Normal');
    });

    it('should return Overweight for BMI 25 - 29.9', () => {
      expect(getBMICategory(25)).toBe('Overweight');
      expect(getBMICategory(27)).toBe('Overweight');
      expect(getBMICategory(29.9)).toBe('Overweight');
    });

    it('should return Obese for BMI >= 30', () => {
      expect(getBMICategory(30)).toBe('Obese');
      expect(getBMICategory(35)).toBe('Obese');
      expect(getBMICategory(45)).toBe('Obese');
    });

    it('should handle boundary values correctly', () => {
      // Just below 18.5
      expect(getBMICategory(18.49)).toBe('Underweight');
      // Exactly 18.5
      expect(getBMICategory(18.5)).toBe('Normal');
      // Just below 25
      expect(getBMICategory(24.99)).toBe('Normal');
      // Exactly 25
      expect(getBMICategory(25)).toBe('Overweight');
      // Just below 30
      expect(getBMICategory(29.99)).toBe('Overweight');
      // Exactly 30
      expect(getBMICategory(30)).toBe('Obese');
    });
  });

  describe('isHealthyBMI', () => {
    it('should return true for BMI in normal range (18.5 - 24.9)', () => {
      expect(isHealthyBMI(18.5)).toBe(true);
      expect(isHealthyBMI(22)).toBe(true);
      expect(isHealthyBMI(24.9)).toBe(true);
    });

    it('should return false for BMI outside normal range', () => {
      expect(isHealthyBMI(17)).toBe(false);
      expect(isHealthyBMI(26)).toBe(false);
      expect(isHealthyBMI(32)).toBe(false);
    });
  });
});
