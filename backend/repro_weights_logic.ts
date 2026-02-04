
import { Sequelize, DataTypes, Op } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Setup Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'fitsloth_exam',
  process.env.DB_USER || 'fitsloth',
  process.env.DB_PASS || 'fitsloth_secret',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: DataTypes.STRING,
  name: DataTypes.STRING,
  currentWeight: { type: DataTypes.DECIMAL, field: 'current_weight' },
  height: DataTypes.DECIMAL,
}, { tableName: 'users', underscored: true });

const Weight = sequelize.define('weight', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, field: 'user_id' },
  weight: DataTypes.DECIMAL,
  recordedDate: { type: DataTypes.DATEONLY, field: 'recorded_date' },
  notes: DataTypes.TEXT,
}, { tableName: 'weights', underscored: true });

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // 1. Setup Test User
    const email = `test_repro_${Date.now()}@test.com`;
    const user = await User.create({
      email,
      name: 'Repro User',
      currentWeight: 70,
      height: 170
    });
    const userId = user.getDataValue('id');
    console.log(`Created user ${userId}`);

    // --- REPRO ISSUE-009 (Duplicate Weights) ---
    console.log('\n--- Testing ISSUE-009 ---');
    // Create Jan 15 weight
    await Weight.create({ userId, weight: 70, recordedDate: '2024-01-15' });
    // Create Jan 16 weight
    const w2 = await Weight.create({ userId, weight: 69, recordedDate: '2024-01-16' });
    
    // Try to update Jan 16 to Jan 15
    const weightId = w2.getDataValue('id');
    const weightRecord = await Weight.findByPk(weightId);
    
    const newDate = '2024-01-15';
    // Logic from controller:
    if (newDate !== weightRecord?.getDataValue('recordedDate')) {
        const existingOnDate = await Weight.findOne({
            where: {
                userId,
                recordedDate: newDate,
                id: { [Op.ne]: weightId }
            }
        });
        
        if (existingOnDate) {
            console.log('ISSUE-009: SUCCESS - Blocked duplicate date');
        } else {
            console.log('ISSUE-009: FAIL - Did not find existing record!');
            // Simulate bug
            await weightRecord?.update({ recordedDate: newDate });
        }
    } else {
        console.log('ISSUE-009: SKIPPED check? Dates equal?');
    }

    // --- REPRO ISSUE-010 (Profile Update) ---
    console.log('\n--- Testing ISSUE-010 ---');
    // Setup: User has Jan 15 (70) and maybe Jan 16 (69) if bug reproduced, or just Jan 15.
    // Let's ensure typical state: Jan 15 (70), Jan 17 (65)
    await Weight.destroy({ where: { userId } }); 
    await Weight.create({ userId, weight: 70, recordedDate: '2024-01-15' });
    const wLatest = await Weight.create({ userId, weight: 65, recordedDate: '2024-01-17' });
    
    // Update profile to match latest
    await User.update({ currentWeight: 65 }, { where: { id: userId } });
    
    // Verify start state
    let u = await User.findByPk(userId);
    console.log(`Start Weight: ${u?.getDataValue('currentWeight')} (should be 65)`);

    // Delete latest
    await wLatest.destroy();
    
    // Logic from controller:
    const latestWeight = await Weight.findOne({
        where: { userId },
        order: [['recordedDate', 'DESC']]
    });
    
    // Update profile
    await User.update(
        { currentWeight: latestWeight ? latestWeight.getDataValue('weight') : null },
        { where: { id: userId } }
    );
    
    u = await User.findByPk(userId);
    console.log(`End Weight: ${u?.getDataValue('currentWeight')} (should be 70)`);
    
    if (Number(u?.getDataValue('currentWeight')) === 70) {
        console.log('ISSUE-010: SUCCESS - Profile updated correctly');
    } else {
        console.log('ISSUE-010: FAIL - Profile NOT updated correctly');
    }

  } catch (e) {
    console.error(e);
  } finally {
    await sequelize.close();
  }
}

run();
