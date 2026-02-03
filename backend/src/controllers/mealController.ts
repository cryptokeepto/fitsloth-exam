import { Request, Response } from 'express';
import { MealLog, FoodItem } from '../models';
import { calculateMealCalories, getDailySummary, getMealsByType } from '../services/mealService';
import { Op } from 'sequelize';

export const getMeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { date, startDate, endDate } = req.query;

    let whereClause: any = { userId };

    if (date) {
      whereClause.consumptionDate = date;
    } else if (startDate && endDate) {
      whereClause.consumptionDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    const meals = await MealLog.findAll({
      where: whereClause,
      include: [
        {
          model: FoodItem,
          as: 'foodItem',
        },
      ],
      order: [['consumptionDate', 'DESC'], ['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: meals,
    });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get meals',
    });
  }
};

export const getMealById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const mealId = parseInt(req.params.id);

    const meal = await MealLog.findOne({
      where: { id: mealId, userId },
      include: [
        {
          model: FoodItem,
          as: 'foodItem',
        },
      ],
    });

    if (!meal) {
      res.status(404).json({
        success: false,
        error: 'Meal not found',
      });
      return;
    }

    res.json({
      success: true,
      data: meal,
    });
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get meal',
    });
  }
};

export const createMeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { foodItemId, quantity, mealType, consumptionDate, notes } = req.body;

    // Get food item to calculate calories
    const foodItem = await FoodItem.findByPk(foodItemId);
    if (!foodItem) {
      res.status(400).json({
        success: false,
        error: 'Invalid food item',
      });
      return;
    }

    // Calculate total calories
    const calories = calculateMealCalories(foodItem.calories, quantity);

    const meal = await MealLog.create({
      userId,
      foodItemId,
      quantity,
      mealType,
      consumptionDate,
      calories,
      notes: notes || null,
    });

    // Fetch with food item
    const mealWithFood = await MealLog.findByPk(meal.id, {
      include: [{ model: FoodItem, as: 'foodItem' }],
    });

    res.status(201).json({
      success: true,
      data: mealWithFood,
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create meal',
    });
  }
};

export const updateMeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const mealId = parseInt(req.params.id);
    const { foodItemId, quantity, mealType, consumptionDate, notes } = req.body;

    const meal = await MealLog.findOne({
      where: { id: mealId, userId },
    });

    if (!meal) {
      res.status(403).json({
        success: false,
        error: 'Meal not found or access denied',
      });
      return;
    }

    // Update fields
    if (foodItemId !== undefined) meal.foodItemId = foodItemId;
    if (quantity !== undefined) meal.quantity = quantity;
    if (mealType !== undefined) meal.mealType = mealType;
    if (consumptionDate !== undefined) meal.consumptionDate = consumptionDate;
    if (notes !== undefined) meal.notes = notes;

    // Recalculate calories if food item or quantity changed
    if (foodItemId !== undefined || quantity !== undefined) {
      const foodItem = await FoodItem.findByPk(meal.foodItemId);
      if (foodItem) {
        meal.calories = calculateMealCalories(foodItem.calories, Number(meal.quantity));
      }
    }

    await meal.save();

    // Fetch with food item
    const updatedMeal = await MealLog.findByPk(meal.id, {
      include: [{ model: FoodItem, as: 'foodItem' }],
    });

    res.json({
      success: true,
      data: updatedMeal,
    });
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update meal',
    });
  }
};

export const deleteMeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const mealId = parseInt(req.params.id);

    const meal = await MealLog.findOne({
      where: { id: mealId, userId },
    });

    if (!meal) {
      res.status(403).json({
        success: false,
        error: 'Meal not found or access denied',
      });
      return;
    }

    await meal.destroy();

    res.json({
      success: true,
      message: 'Meal deleted successfully',
    });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete meal',
    });
  }
};

export const getMealSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];

    const summary = await getDailySummary(userId, date);
    const mealsByType = await getMealsByType(userId, date);

    // Get user's calorie goal
    const calorieGoal = req.user?.calPerDay || null;

    res.json({
      success: true,
      data: {
        date,
        totalCalories: summary.totalCalories,
        calorieGoal,
        remaining: calorieGoal ? calorieGoal - summary.totalCalories : null,
        meals: mealsByType,
      },
    });
  } catch (error) {
    console.error('Get meal summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get meal summary',
    });
  }
};
