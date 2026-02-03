import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface FoodItemAttributes {
  id: number;
  nameTh: string;
  nameEn: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FoodItemCreationAttributes extends Optional<FoodItemAttributes, 'id'> {}

class FoodItem extends Model<FoodItemAttributes, FoodItemCreationAttributes> implements FoodItemAttributes {
  public id!: number;
  public nameTh!: string;
  public nameEn!: string;
  public calories!: number;
  public protein!: number;
  public carbs!: number;
  public fat!: number;
  public servingSize!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof FoodItem {
    FoodItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nameTh: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'name_th',
        },
        nameEn: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'name_en',
        },
        calories: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: 'Calories per serving',
        },
        protein: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 0,
          comment: 'Protein in grams per serving',
        },
        carbs: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 0,
          comment: 'Carbohydrates in grams per serving',
        },
        fat: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          defaultValue: 0,
          comment: 'Fat in grams per serving',
        },
        servingSize: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'serving_size',
          defaultValue: '1 serving',
        },
      },
      {
        sequelize,
        tableName: 'food_items',
        underscored: true,
      }
    );
    return FoodItem;
  }
}

export default FoodItem;
