import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface MealLogAttributes {
  id: number;
  userId: number;
  foodItemId: number;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  consumptionDate: string;
  calories: number;
  notes: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MealLogCreationAttributes extends Optional<MealLogAttributes, 'id' | 'notes'> {}

class MealLog extends Model<MealLogAttributes, MealLogCreationAttributes> implements MealLogAttributes {
  public id!: number;
  public userId!: number;
  public foodItemId!: number;
  public quantity!: number;
  public mealType!: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  public consumptionDate!: string;
  public calories!: number;
  public notes!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof MealLog {
    MealLog.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'user_id',
          references: {
            model: 'users',
            key: 'id',
          },
        },
        foodItemId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'food_item_id',
          references: {
            model: 'food_items',
            key: 'id',
          },
        },
        quantity: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 1,
        },
        mealType: {
          type: DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
          allowNull: false,
          field: 'meal_type',
        },
        consumptionDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'consumption_date',
        },
        calories: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: 'Total calories for this entry',
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'meal_logs',
        underscored: true,
        indexes: [
          {
            fields: ['user_id', 'consumption_date'],
          },
        ],
      }
    );
    return MealLog;
  }
}

export default MealLog;
