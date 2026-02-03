import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface CoachPatientAttributes {
  id: number;
  coachId: number;
  patientId: number;
  assignedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CoachPatientCreationAttributes extends Optional<CoachPatientAttributes, 'id' | 'assignedAt'> {}

class CoachPatient extends Model<CoachPatientAttributes, CoachPatientCreationAttributes> implements CoachPatientAttributes {
  public id!: number;
  public coachId!: number;
  public patientId!: number;
  public assignedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): typeof CoachPatient {
    CoachPatient.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        coachId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'coach_id',
          references: {
            model: 'coaches',
            key: 'id',
          },
        },
        patientId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'patient_id',
          references: {
            model: 'users',
            key: 'id',
          },
        },
        assignedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'assigned_at',
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: 'coach_patients',
        underscored: true,
        indexes: [
          {
            unique: true,
            fields: ['coach_id', 'patient_id'],
          },
        ],
      }
    );
    return CoachPatient;
  }
}

export default CoachPatient;
