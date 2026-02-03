import { Op } from 'sequelize';
import { MealLog, FoodItem } from '../models';

/**
 * Calculate total calories for a meal entry
 */
export const calculateMealCalories = (
  caloriesPerServing: number,
  quantity: number
): number => {
  return Math.round(caloriesPerServing * quantity);
};

/**
 * Get daily calorie summary for a user
 */
export const getDailySummary = async (
  userId: number,
  date: string
): Promise<{
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
}> => {
  const meals = await MealLog.findAll({
    where: {
      userId,
      consumptionDate: date,
    },
    include: [
      {
        model: FoodItem,
        as: 'foodItem',
      },
    ],
  });

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  meals.forEach((meal) => {
    const foodItem = (meal as any).foodItem;
    const quantity = Number(meal.quantity);

    totalCalories += meal.calories;
    totalProtein += Number(foodItem.protein) * quantity;
    totalCarbs += Number(foodItem.carbs) * quantity;
    totalFat += Number(foodItem.fat) * quantity;
  });

  return {
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
    mealCount: meals.length,
  };
};

/**
 * Get meals grouped by meal type for a specific date
 */
export const getMealsByType = async (
  userId: number,
  date: string
): Promise<{
  breakfast: any[];
  lunch: any[];
  dinner: any[];
  snack: any[];
}> => {
  const meals = await MealLog.findAll({
    where: {
      userId,
      consumptionDate: date,
    },
    include: [
      {
        model: FoodItem,
        as: 'foodItem',
      },
    ],
    order: [['createdAt', 'ASC']],
  });

  const grouped = {
    breakfast: [] as any[],
    lunch: [] as any[],
    dinner: [] as any[],
    snack: [] as any[],
  };

  meals.forEach((meal) => {
    grouped[meal.mealType].push(meal);
  });

  return grouped;
};

/**
 * Get meal history for a date range
 */
export const getMealHistory = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<any[]> => {
  return MealLog.findAll({
    where: {
      userId,
      consumptionDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    include: [
      {
        model: FoodItem,
        as: 'foodItem',
      },
    ],
    order: [['consumptionDate', 'DESC'], ['createdAt', 'DESC']],
  });
};

/**
 * Check if a meal belongs to a user
 */
export const verifyMealOwnership = async (
  mealId: number,
  userId: number
): Promise<boolean> => {
  const meal = await MealLog.findOne({
    where: {
      id: mealId,
      userId: userId,
    },
  });

  return meal !== null;
};
