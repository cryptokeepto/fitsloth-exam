import { Op, fn, col, literal } from 'sequelize';
import { MealLog, Weight, FoodItem } from '../models';
import { WeeklySummaryData, DailyCalories } from '@fitsloth/shared';

/**
 * Summary Service - Solution Version
 * Handles weekly summary calculations for the feature implementation task
 */

/**
 * Get weekly summary for a patient
 * @param userId - User ID
 * @param startDate - Start date of the week (YYYY-MM-DD)
 * @returns Weekly summary data
 */
export const getWeeklySummary = async (
  userId: number,
  startDate: string
): Promise<WeeklySummaryData> => {
  // Calculate end date (6 days after start = 7 days total)
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const endDate = end.toISOString().split('T')[0];

  // Get all meals for the week
  const meals = await MealLog.findAll({
    where: {
      userId,
      consumptionDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [{ model: FoodItem, as: 'foodItem' }],
    order: [['consumptionDate', 'ASC']],
  });

  // Calculate daily calories
  const dailyCaloriesMap: Map<string, number> = new Map();

  // Initialize all 7 days with 0
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    dailyCaloriesMap.set(date.toISOString().split('T')[0], 0);
  }

  // Sum up calories per day
  meals.forEach((meal) => {
    const date = meal.consumptionDate;
    const current = dailyCaloriesMap.get(date) || 0;
    dailyCaloriesMap.set(date, current + meal.calories);
  });

  // Convert to array
  const dailyCalories: DailyCalories[] = Array.from(dailyCaloriesMap.entries()).map(
    ([date, total]) => ({ date, total })
  );

  // Calculate totals
  const totalCalories = dailyCalories.reduce((sum, day) => sum + day.total, 0);
  const averageCalories = Math.round((totalCalories / 7) * 100) / 100;

  // Get weight data
  const weights = await Weight.findAll({
    where: {
      userId,
      recordedDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['recordedDate', 'ASC']],
  });

  let weightStart: number | null = null;
  let weightEnd: number | null = null;

  if (weights.length > 0) {
    weightStart = Number(weights[0].weight);
    weightEnd = Number(weights[weights.length - 1].weight);
  }

  const weightChange = weightStart !== null && weightEnd !== null
    ? Math.round((weightEnd - weightStart) * 10) / 10
    : null;

  // Calculate logging stats
  const daysWithMeals = new Set(meals.map((m) => m.consumptionDate)).size;

  return {
    period: {
      startDate,
      endDate,
    },
    calories: {
      daily: dailyCalories,
      average: averageCalories,
      total: totalCalories,
    },
    weight: {
      start: weightStart,
      end: weightEnd,
      change: weightChange,
    },
    logging: {
      daysLogged: daysWithMeals,
      totalMeals: meals.length,
      streak: `${daysWithMeals}/7 days`,
    },
  };
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDateFormat = (date: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;

  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
};
