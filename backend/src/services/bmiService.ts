import { BmiCategory } from '@fitsloth/shared';

/**
 * Calculate BMI
 *
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimeters
 * @returns BMI value
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (weightKg <= 0 || heightCm <= 0) {
    throw new Error('Weight and height must be positive numbers');
  }

  // Convert height from cm to meters
  const heightM = heightCm / 100;

  const bmi = weightKg / (heightM * heightM);

  // Round to 1 decimal place
  return Math.round(bmi * 10) / 10;
};

/**
 * Get BMI category
 *
 * @param bmi - BMI value
 * @returns BMI category
 */
export const getBMICategory = (bmi: number): BmiCategory => {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi < 25) {
    return 'Normal';
  } else if (bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
};

/**
 * Get BMI with category
 */
export const getBMIWithCategory = (
  weightKg: number,
  heightCm: number
): { bmi: number; category: BmiCategory } => {
  const bmi = calculateBMI(weightKg, heightCm);
  const category = getBMICategory(bmi);

  return { bmi, category };
};

/**
 * Check if BMI is in healthy range
 */
export const isHealthyBMI = (bmi: number): boolean => {
  return bmi >= 18.5 && bmi < 25;
};

/**
 * Calculate ideal weight range for a given height
 */
export const getIdealWeightRange = (
  heightCm: number
): { min: number; max: number } => {
  const heightM = heightCm / 100;
  const heightSquared = heightM * heightM;

  return {
    min: Math.round(18.5 * heightSquared * 10) / 10,
    max: Math.round(24.9 * heightSquared * 10) / 10,
  };
};
