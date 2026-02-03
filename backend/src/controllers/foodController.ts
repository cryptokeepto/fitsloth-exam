import { Request, Response } from 'express';
import { FoodItem } from '../models';
import { Op } from 'sequelize';

export const getFoods = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;

    let whereClause = {};

    if (search) {
      whereClause = {
        [Op.or]: [
          { nameTh: { [Op.iLike]: `%${search}%` } },
          { nameEn: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    const foods = await FoodItem.findAll({
      where: whereClause,
      order: [['nameEn', 'ASC']],
    });

    res.json({
      success: true,
      data: foods,
    });
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get foods',
    });
  }
};

export const getFoodById = async (req: Request, res: Response): Promise<void> => {
  try {
    const foodId = parseInt(req.params.id);

    const food = await FoodItem.findByPk(foodId);

    if (!food) {
      res.status(404).json({
        success: false,
        error: 'Food item not found',
      });
      return;
    }

    res.json({
      success: true,
      data: food,
    });
  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get food',
    });
  }
};
