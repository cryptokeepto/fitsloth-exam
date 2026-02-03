import { Request, Response } from 'express';
import { User, Coach, CoachPatient, MealLog, Weight, FoodItem } from '../models';
import { calculateBMI, getBMICategory } from '../services/bmiService';
import { Op } from 'sequelize';

export const getPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    // Get coach profile
    const coach = await Coach.findOne({ where: { userId } });
    if (!coach) {
      res.status(404).json({
        success: false,
        error: 'Coach profile not found',
      });
      return;
    }

    // Get assigned patients
    const assignments = await CoachPatient.findAll({
      where: { coachId: coach.id },
    });

    const patientIds = assignments.map((a) => a.patientId);

    const patients = await User.findAll({
      where: { id: patientIds },
      attributes: ['id', 'name', 'email', 'currentWeight', 'targetWeight', 'height', 'createdAt'],
    });

    // Add BMI calculations and last activity
    const patientsWithBMI = await Promise.all(
      patients.map(async (patient) => {
        let bmi: number | null = null;
        let bmiCategory: string | null = null;

        if (patient.height && patient.currentWeight) {
          bmi = calculateBMI(Number(patient.currentWeight), Number(patient.height));
          bmiCategory = getBMICategory(bmi);
        }

        // Get last meal log date
        const lastMeal = await MealLog.findOne({
          where: { userId: patient.id },
          order: [['createdAt', 'DESC']],
        });

        return {
          id: patient.id,
          name: patient.name,
          email: patient.email,
          currentWeight: patient.currentWeight ? Number(patient.currentWeight) : null,
          targetWeight: patient.targetWeight ? Number(patient.targetWeight) : null,
          bmi,
          bmiCategory,
          lastActivity: lastMeal ? lastMeal.createdAt.toISOString() : null,
        };
      })
    );

    res.json({
      success: true,
      data: patientsWithBMI,
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get patients',
    });
  }
};

export const getPatientDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const patientId = (req as any).patientId;

    const patient = await User.findByPk(patientId, {
      attributes: ['id', 'name', 'email', 'height', 'currentWeight', 'targetWeight', 'calPerDay', 'createdAt'],
    });

    if (!patient) {
      res.status(404).json({
        success: false,
        error: 'Patient not found',
      });
      return;
    }

    let bmi: number | null = null;
    let bmiCategory: string | null = null;

    if (patient.height && patient.currentWeight) {
      bmi = calculateBMI(Number(patient.currentWeight), Number(patient.height));
      bmiCategory = getBMICategory(bmi);
    }

    res.json({
      success: true,
      data: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        height: patient.height ? Number(patient.height) : null,
        currentWeight: patient.currentWeight ? Number(patient.currentWeight) : null,
        targetWeight: patient.targetWeight ? Number(patient.targetWeight) : null,
        calPerDay: patient.calPerDay,
        bmi,
        bmiCategory,
        createdAt: patient.createdAt,
      },
    });
  } catch (error) {
    console.error('Get patient detail error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get patient details',
    });
  }
};

export const getPatientMeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const patientId = (req as any).patientId;
    const { startDate, endDate } = req.query;

    // Default to last 7 days
    const end = endDate ? new Date(endDate as string) : new Date();
    const start = startDate
      ? new Date(startDate as string)
      : new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);

    const meals = await MealLog.findAll({
      where: {
        userId: patientId,
        consumptionDate: {
          [Op.between]: [
            start.toISOString().split('T')[0],
            end.toISOString().split('T')[0],
          ],
        },
      },
      include: [{ model: FoodItem, as: 'foodItem' }],
      order: [['consumptionDate', 'DESC'], ['createdAt', 'DESC']],
    });

    const patient = await User.findByPk(patientId, {
      attributes: ['id', 'name', 'email'],
    });

    res.json({
      success: true,
      data: {
        patient: {
          id: patient!.id,
          name: patient!.name,
          email: patient!.email,
        },
        meals,
        dateRange: {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        },
      },
    });
  } catch (error) {
    console.error('Get patient meals error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get patient meals',
    });
  }
};

export const getPatientWeights = async (req: Request, res: Response): Promise<void> => {
  try {
    const patientId = (req as any).patientId;

    const weights = await Weight.findAll({
      where: { userId: patientId },
      order: [['recordedDate', 'DESC']],
      limit: 30,
    });

    const patient = await User.findByPk(patientId, {
      attributes: ['id', 'name', 'email'],
    });

    // Calculate weight change
    let weightChange: number | null = null;
    if (weights.length >= 2) {
      const latest = Number(weights[0].weight);
      const oldest = Number(weights[weights.length - 1].weight);
      weightChange = Math.round((latest - oldest) * 10) / 10;
    }

    res.json({
      success: true,
      data: {
        patient: {
          id: patient!.id,
          name: patient!.name,
          email: patient!.email,
        },
        weights,
        weightChange,
      },
    });
  } catch (error) {
    console.error('Get patient weights error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get patient weights',
    });
  }
};
