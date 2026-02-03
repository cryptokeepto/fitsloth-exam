import { Request, Response } from 'express';
import { getWeeklySummary, isValidDateFormat } from '../services/summaryService';

/**
 * Patient Controller - Solution Version
 * Includes weekly summary endpoint for the feature implementation
 */

export const getWeeklySummaryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { startDate } = req.query;

    if (!startDate || typeof startDate !== 'string') {
      res.status(400).json({
        success: false,
        error: 'startDate query parameter is required (YYYY-MM-DD format)',
      });
      return;
    }

    if (!isValidDateFormat(startDate)) {
      res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD',
      });
      return;
    }

    const summary = await getWeeklySummary(userId, startDate);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Get weekly summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get weekly summary',
    });
  }
};
