import { Request, Response } from 'express';
import { Weight, User } from '../models';
import { getWeightHistory, getLatestWeight } from '../services/weightService';
import { Op } from 'sequelize';

export const getWeights = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { startDate, endDate, limit } = req.query;

    let whereClause: any = { userId };

    if (startDate && endDate) {
      whereClause.recordedDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    const weights = await Weight.findAll({
      where: whereClause,
      order: [['recordedDate', 'DESC']],
      ...(limit ? { limit: parseInt(limit as string) } : {}),
    });

    res.json({
      success: true,
      data: weights,
    });
  } catch (error) {
    console.error('Get weights error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get weights',
    });
  }
};

export const getWeightById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const weightId = parseInt(req.params.id);

    const weight = await Weight.findOne({
      where: { id: weightId, userId },
    });

    if (!weight) {
      res.status(404).json({
        success: false,
        error: 'Weight record not found',
      });
      return;
    }

    res.json({
      success: true,
      data: weight,
    });
  } catch (error) {
    console.error('Get weight error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get weight',
    });
  }
};

export const createWeight = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { weight, recordedDate, notes } = req.body;

    // Check if weight already exists for this date
    const existingWeight = await Weight.findOne({
      where: { userId, recordedDate },
    });

    if (existingWeight) {
      // Update existing weight
      existingWeight.weight = weight;
      if (notes !== undefined) existingWeight.notes = notes;
      await existingWeight.save();

      res.json({
        success: true,
        data: existingWeight,
        message: 'Weight updated for existing date',
      });
      return;
    }

    // Create new weight record
    const newWeight = await Weight.create({
      userId,
      weight,
      recordedDate,
      notes: notes || null,
    });

    // Also update user's current weight
    await User.update(
      { currentWeight: weight },
      { where: { id: userId } }
    );

    res.status(201).json({
      success: true,
      data: newWeight,
    });
  } catch (error) {
    console.error('Create weight error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create weight',
    });
  }
};

export const updateWeight = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const weightId = parseInt(req.params.id);
    const { weight, recordedDate, notes } = req.body;

    const weightRecord = await Weight.findOne({
      where: { id: weightId, userId },
    });

    if (!weightRecord) {
      res.status(404).json({
        success: false,
        error: 'Weight record not found',
      });
      return;
    }

    if (weight !== undefined) weightRecord.weight = weight;
    if (notes !== undefined) weightRecord.notes = notes;

    // ISSUE-009: Check if changing to a date that already has a record
    if (recordedDate !== undefined && recordedDate !== weightRecord.recordedDate) {
      const existingOnDate = await Weight.findOne({
        where: {
          userId,
          recordedDate,
          id: { [Op.ne]: weightId }, // Exclude current record
        },
      });

      if (existingOnDate) {
        res.status(400).json({
          success: false,
          error: 'A weight record already exists for this date. Delete it first or choose a different date.',
        });
        return;
      }
      weightRecord.recordedDate = recordedDate;
    }

    await weightRecord.save();

    res.json({
      success: true,
      data: weightRecord,
    });
  } catch (error) {
    console.error('Update weight error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update weight',
    });
  }
};

export const deleteWeight = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const weightId = parseInt(req.params.id);

    const weight = await Weight.findOne({
      where: { id: weightId, userId },
    });

    if (!weight) {
      res.status(404).json({
        success: false,
        error: 'Weight record not found',
      });
      return;
    }

    await weight.destroy();

    // ISSUE-010: Update user's currentWeight to the latest remaining weight
    const latestWeight = await Weight.findOne({
      where: { userId },
      order: [['recordedDate', 'DESC']],
    });

    await User.update(
      { currentWeight: latestWeight ? latestWeight.weight : null },
      { where: { id: userId } }
    );

    res.json({
      success: true,
      message: 'Weight record deleted successfully',
    });
  } catch (error) {
    console.error('Delete weight error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete weight',
    });
  }
};

export const getWeightStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const weights = await getWeightHistory(userId, 30);
    const latestWeight = weights.length > 0 ? Number(weights[0].weight) : null;

    // Calculate change from oldest to newest in the last 30 days
    let weightChange: number | null = null;
    if (weights.length >= 2) {
      const oldest = Number(weights[weights.length - 1].weight);
      const newest = latestWeight!;
      weightChange = Math.round((newest - oldest) * 10) / 10;
    }

    res.json({
      success: true,
      data: {
        latestWeight,
        weightChange,
        recordCount: weights.length,
        weights: weights.slice(0, 7), // Return last 7 records
      },
    });
  } catch (error) {
    console.error('Get weight stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get weight stats',
    });
  }
};
