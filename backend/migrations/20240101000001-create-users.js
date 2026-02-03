'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('patient', 'coach', 'admin'),
        allowNull: false,
        defaultValue: 'patient',
      },
      height: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Height in cm',
      },
      current_weight: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Current weight in kg',
      },
      target_weight: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Target weight in kg',
      },
      cal_per_day: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Daily calorie goal',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('users', ['email']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
