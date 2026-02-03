import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface CoachAttributes {
  id: number;
  userId: number;
  specialization: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CoachCreationAttributes extends Optional<CoachAttributes, 'id' | 'specialization'> {}

class Coach extends Model<CoachAttributes, CoachCreationAttributes> implements CoachAttributes {
  public id!: number;
  public userId!: number;
  public specialization!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof Coach {
    Coach.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
          field: 'user_id',
          references: {
            model: 'users',
            key: 'id',
          },
        },
        specialization: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'coaches',
        underscored: true,
      }
    );
    return Coach;
  }
}

export default Coach;
