import { Request, Response, NextFunction } from 'express';
import { validationResult, body, param, query } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map((err) => ({
        field: (err as any).path,
        message: err.msg,
      })),
    });
    return;
  }

  next();
};

// Auth validations
export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

export const validateRegister = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role')
    .optional()
    .isIn(['patient', 'coach'])
    .withMessage('Role must be patient or coach'),
  body('height')
    .optional()
    .isFloat({ min: 50, max: 300 })
    .withMessage('Height must be between 50 and 300 cm'),
  body('currentWeight')
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage('Weight must be between 20 and 500 kg'),
  body('targetWeight')
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage('Target weight must be between 20 and 500 kg'),
  body('calPerDay')
    .optional()
    .isInt({ min: 500, max: 10000 })
    .withMessage('Daily calorie goal must be between 500 and 10000'),
  handleValidationErrors,
];

// Meal validations
export const validateCreateMeal = [
  body('foodItemId').isInt().withMessage('Valid food item ID is required'),
  body('quantity')
    .isFloat({ min: 0.1, max: 100 })
    .withMessage('Quantity must be between 0.1 and 100'),
  body('mealType')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Meal type must be breakfast, lunch, dinner, or snack'),
  body('consumptionDate')
    .isISO8601()
    .withMessage('Valid date is required (YYYY-MM-DD)'),
  body('notes').optional().isString(),
  handleValidationErrors,
];

export const validateUpdateMeal = [
  param('id').isInt().withMessage('Valid meal ID is required'),
  body('foodItemId').optional().isInt().withMessage('Valid food item ID is required'),
  body('quantity')
    .optional()
    .isFloat({ min: 0.1, max: 100 })
    .withMessage('Quantity must be between 0.1 and 100'),
  body('mealType')
    .optional()
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Meal type must be breakfast, lunch, dinner, or snack'),
  body('consumptionDate')
    .optional()
    .isISO8601()
    .withMessage('Valid date is required (YYYY-MM-DD)'),
  body('notes').optional().isString(),
  handleValidationErrors,
];

// Weight validations
export const validateCreateWeight = [
  body('weight')
    .isFloat({ min: 20, max: 500 })
    .withMessage('Weight must be between 20 and 500 kg'),
  body('recordedDate')
    .isISO8601()
    .withMessage('Valid date is required (YYYY-MM-DD)'),
  body('notes').optional().isString(),
  handleValidationErrors,
];

// Date query validation
export const validateDateQuery = [
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Valid date is required (YYYY-MM-DD)'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Valid start date is required (YYYY-MM-DD)'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required (YYYY-MM-DD)'),
  handleValidationErrors,
];

// ID param validation
export const validateIdParam = [
  param('id').isInt().withMessage('Valid ID is required'),
  handleValidationErrors,
];
