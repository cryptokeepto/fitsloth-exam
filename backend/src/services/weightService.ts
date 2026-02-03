import { Op } from 'sequelize';
import { Weight } from '../models';

/**
 * Weight Service - Solution Version
 * Handles weight tracking calculations and operations
 */

/**
 * Get weight change between two dates
 * @param userId - User ID
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 * @returns Weight change (positive = gained, negative = lost)
 */
export const getWeightChange = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<{
  startWeight: number | null;
  endWeight: number | null;
  change: number | null;
}> => {
  // Get weight closest to start date
  const startWeight = await Weight.findOne({
    where: {
      userId,
      recordedDate: {
        [Op.lte]: startDate,
      },
    },
    order: [['recordedDate', 'DESC']],
  });

  // Get weight closest to end date
  const endWeight = await Weight.findOne({
    where: {
      userId,
      recordedDate: {
        [Op.lte]: endDate,
      },
    },
    order: [['recordedDate', 'DESC']],
  });

  const startWeightValue = startWeight ? Number(startWeight.weight) : null;
  const endWeightValue = endWeight ? Number(endWeight.weight) : null;

  let change: number | null = null;
  if (startWeightValue !== null && endWeightValue !== null) {
    // SOLUTION: end - start gives correct direction
    // positive = gained weight, negative = lost weight
    change = Math.round((endWeightValue - startWeightValue) * 10) / 10;
  }

  return {
    startWeight: startWeightValue,
    endWeight: endWeightValue,
    change,
  };
};

/**
 * Get latest weight for a user
 */
export const getLatestWeight = async (userId: number): Promise<number | null> => {
  const weight = await Weight.findOne({
    where: { userId },
    order: [['recordedDate', 'DESC']],
  });

  return weight ? Number(weight.weight) : null;
};

/**
 * Get weight history for a user
 */
export const getWeightHistory = async (
  userId: number,
  limit?: number
): Promise<Weight[]> => {
  return Weight.findAll({
    where: { userId },
    order: [['recordedDate', 'DESC']],
    ...(limit ? { limit } : {}),
  });
};

/**
 * Get weights within a date range
 */
export const getWeightsInRange = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<Weight[]> => {
  return Weight.findAll({
    where: {
      userId,
      recordedDate: {
        [Op.between]: [startDate, endDate],
      },
    },
    order: [['recordedDate', 'ASC']],
  });
};

/**
 * Calculate weight progress towards goal
 */
export const calculateWeightProgress = (
  currentWeight: number,
  startWeight: number,
  targetWeight: number
): {
  totalToLose: number;
  lostSoFar: number;
  remaining: number;
  percentComplete: number;
} => {
  const totalToLose = startWeight - targetWeight;
  const lostSoFar = startWeight - currentWeight;
  const remaining = currentWeight - targetWeight;
  const percentComplete = totalToLose > 0
    ? Math.round((lostSoFar / totalToLose) * 100)
    : 0;

  return {
    totalToLose: Math.round(totalToLose * 10) / 10,
    lostSoFar: Math.round(lostSoFar * 10) / 10,
    remaining: Math.round(remaining * 10) / 10,
    percentComplete: Math.max(0, Math.min(100, percentComplete)),
  };
};
