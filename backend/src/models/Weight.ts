import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface WeightAttributes {
  id: number;
  userId: number;
  weight: number;
  recordedDate: string;
  notes: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WeightCreationAttributes extends Optional<WeightAttributes, 'id' | 'notes'> {}

class Weight extends Model<WeightAttributes, WeightCreationAttributes> implements WeightAttributes {
  public id!: number;
  public userId!: number;
  public weight!: number;
  public recordedDate!: string;
  public notes!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof Weight {
    Weight.init(
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
        weight: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
          comment: 'Weight in kg',
        },
        recordedDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'recorded_date',
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'weights',
        underscored: true,
        indexes: [
          {
            fields: ['user_id', 'recorded_date'],
          },
        ],
      }
    );
    return Weight;
  }
}

export default Weight;
