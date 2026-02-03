import { Sequelize } from 'sequelize';
import User from './User';
import Coach from './Coach';
import CoachPatient from './CoachPatient';
import FoodItem from './FoodItem';
import MealLog from './MealLog';
import Weight from './Weight';

let initialized = false;

// Initialize all models with the sequelize instance
export function initializeModels(sequelize: Sequelize) {
  if (initialized) return;

  User.initModel(sequelize);
  Coach.initModel(sequelize);
  CoachPatient.initModel(sequelize);
  FoodItem.initModel(sequelize);
  MealLog.initModel(sequelize);
  Weight.initModel(sequelize);

  // Define associations

  // User - Coach (one-to-one for coach users)
  User.hasOne(Coach, { foreignKey: 'userId', as: 'coachProfile' });
  Coach.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // Coach - Patient (many-to-many through CoachPatient)
  Coach.belongsToMany(User, {
    through: CoachPatient,
    foreignKey: 'coachId',
    otherKey: 'patientId',
    as: 'patients',
  });
  User.belongsToMany(Coach, {
    through: CoachPatient,
    foreignKey: 'patientId',
    otherKey: 'coachId',
    as: 'coaches',
  });

  // User - MealLog (one-to-many)
  User.hasMany(MealLog, { foreignKey: 'userId', as: 'mealLogs' });
  MealLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  // FoodItem - MealLog (one-to-many)
  FoodItem.hasMany(MealLog, { foreignKey: 'foodItemId', as: 'mealLogs' });
  MealLog.belongsTo(FoodItem, { foreignKey: 'foodItemId', as: 'foodItem' });

  // User - Weight (one-to-many)
  User.hasMany(Weight, { foreignKey: 'userId', as: 'weights' });
  Weight.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  initialized = true;
}

export {
  User,
  Coach,
  CoachPatient,
  FoodItem,
  MealLog,
  Weight,
};
