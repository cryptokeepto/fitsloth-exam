'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Generate dates for the last 7 days
    const today = new Date();
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    // Weight data for patient 1 (showing weight loss progress)
    const patient1Weights = [
      { weight: 72.0 },
      { weight: 71.5 },
      { weight: 71.8 },
      { weight: 71.2 },
      { weight: 70.8 },
      { weight: 70.5 },
      { weight: 70.0 },
    ];

    // Weight data for patient 2
    const patient2Weights = [
      { weight: 76.0 },
      { weight: 75.8 },
      { weight: 75.5 },
      { weight: 75.7 },
      { weight: 75.3 },
      { weight: 75.0 },
      { weight: 75.0 },
    ];

    const weightRecords = [];

    // Patient 1 weights
    patient1Weights.forEach((w, index) => {
      weightRecords.push({
        user_id: 1,
        weight: w.weight,
        recorded_date: dates[index],
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    // Patient 2 weights
    patient2Weights.forEach((w, index) => {
      weightRecords.push({
        user_id: 2,
        weight: w.weight,
        recorded_date: dates[index],
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    await queryInterface.bulkInsert('weights', weightRecords);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('weights', null, {});
  },
};
