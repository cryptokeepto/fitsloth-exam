import { Request, Response } from 'express';
import { User, Coach } from '../models';
import { generateToken } from '../middlewares/auth';
import { calculateBMI, getBMICategory } from '../services/bmiService';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role, height, currentWeight, targetWeight, calPerDay } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'Email already registered',
      });
      return;
    }

    // Hash password
    const passwordHash = await User.hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      name,
      role: role || 'patient',
      height: height || null,
      currentWeight: currentWeight || null,
      targetWeight: targetWeight || null,
      calPerDay: calPerDay || null,
    });

    // If role is coach, create coach profile
    if (role === 'coach') {
      await Coach.create({
        userId: user.id,
        specialization: null,
      });
    }

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: user.toSafeJSON(),
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }

    // Generate token
    const token = generateToken(user);

    // Calculate BMI if height and weight are available
    let bmi: number | null = null;
    let bmiCategory: string | null = null;

    if (user.height && user.currentWeight) {
      bmi = calculateBMI(Number(user.currentWeight), Number(user.height));
      bmiCategory = getBMICategory(bmi);
    }

    res.json({
      success: true,
      data: {
        user: {
          ...user.toSafeJSON(),
          bmi,
          bmiCategory,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
      return;
    }

    // Calculate BMI if height and weight are available
    let bmi: number | null = null;
    let bmiCategory: string | null = null;

    if (req.user.height && req.user.currentWeight) {
      bmi = calculateBMI(Number(req.user.currentWeight), Number(req.user.height));
      bmiCategory = getBMICategory(bmi);
    }

    res.json({
      success: true,
      data: {
        ...req.user.toSafeJSON(),
        bmi,
        bmiCategory,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile',
    });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
      return;
    }

    const { name, height, currentWeight, targetWeight, calPerDay } = req.body;

    // Update user fields
    if (name !== undefined) req.user.name = name;
    if (height !== undefined) req.user.height = height;
    if (currentWeight !== undefined) req.user.currentWeight = currentWeight;
    if (targetWeight !== undefined) req.user.targetWeight = targetWeight;
    if (calPerDay !== undefined) req.user.calPerDay = calPerDay;

    await req.user.save();

    // Calculate BMI
    let bmi: number | null = null;
    let bmiCategory: string | null = null;

    if (req.user.height && req.user.currentWeight) {
      bmi = calculateBMI(Number(req.user.currentWeight), Number(req.user.height));
      bmiCategory = getBMICategory(bmi);
    }

    res.json({
      success: true,
      data: {
        ...req.user.toSafeJSON(),
        bmi,
        bmiCategory,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
    });
  }
};
