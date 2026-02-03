import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  role: 'patient' | 'coach' | 'admin';
  height: number | null;
  currentWeight: number | null;
  targetWeight: number | null;
  calPerDay: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'height' | 'currentWeight' | 'targetWeight' | 'calPerDay'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public passwordHash!: string;
  public name!: string;
  public role!: 'patient' | 'coach' | 'admin';
  public height!: number | null;
  public currentWeight!: number | null;
  public targetWeight!: number | null;
  public calPerDay!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method to check password
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  // Method to hash password
  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // Convert to safe JSON (exclude password)
  public toSafeJSON() {
    const values = this.toJSON() as UserAttributes & { passwordHash?: string };
    delete (values as any).passwordHash;
    return values;
  }

  public static initModel(sequelize: Sequelize): typeof User {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        passwordHash: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'password_hash',
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('patient', 'coach', 'admin'),
          allowNull: false,
          defaultValue: 'patient',
        },
        height: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
          comment: 'Height in cm',
        },
        currentWeight: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
          field: 'current_weight',
          comment: 'Current weight in kg',
        },
        targetWeight: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
          field: 'target_weight',
          comment: 'Target weight in kg',
        },
        calPerDay: {
          type: DataTypes.INTEGER,
          allowNull: true,
          field: 'cal_per_day',
          comment: 'Daily calorie goal',
        },
      },
      {
        sequelize,
        tableName: 'users',
        underscored: true,
      }
    );
    return User;
  }
}

export default User;
