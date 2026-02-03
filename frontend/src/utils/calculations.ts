import { BmiCategory } from '@fitsloth/shared';

/**
 * Calculate BMI using the standard formula
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (weightKg <= 0 || heightCm <= 0) {
    return 0;
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

/**
 * Get BMI category based on WHO standards
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
 * Get color class for BMI category
 */
export const getBMICategoryColor = (category: BmiCategory): string => {
  switch (category) {
    case 'Underweight':
      return 'text-blue-600';
    case 'Normal':
      return 'text-green-600';
    case 'Overweight':
      return 'text-yellow-600';
    case 'Obese':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

/**
 * Calculate weight change
 */
export const calculateWeightChange = (
  startWeight: number,
  endWeight: number
): {
  change: number;
  direction: 'loss' | 'gain' | 'none';
  displayText: string;
} => {
  const change = Math.round((startWeight - endWeight) * 10) / 10;

  let direction: 'loss' | 'gain' | 'none' = 'none';
  let displayText = 'No change';

  if (change < 0) {
    direction = 'loss';
    displayText = `${Math.abs(change)} kg lost`;
  } else if (change > 0) {
    direction = 'gain';
    displayText = `${change} kg gained`;
  }

  return { change, direction, displayText };
};

/**
 * Format calorie value with commas
 */
export const formatCalories = (calories: number): string => {
  return calories.toLocaleString();
};

/**
 * Calculate calorie percentage of goal
 */
export const calculateCaloriePercentage = (consumed: number, goal: number): number => {
  if (goal <= 0) return 0;
  return Math.round((consumed / goal) * 100);
};

/**
 * Get color for calorie progress
 */
export const getCalorieProgressColor = (percentage: number): string => {
  if (percentage < 80) {
    return 'bg-green-500';
  } else if (percentage <= 100) {
    return 'bg-yellow-500';
  } else {
    return 'bg-red-500';
  }
};

/**
 * Format date to display string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get the start of the current week (Monday)
 */
export const getWeekStartDate = (date: Date = new Date()): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
};
