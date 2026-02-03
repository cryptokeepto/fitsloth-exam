'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('coach_patients', [
      {
        id: 1,
        coach_id: 1,
        patient_id: 2, // patient2@fitsloth.test is assigned to coach
        assigned_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Note: patient@fitsloth.test (id: 1) is NOT assigned to any coach

    // Reset sequence
    await queryInterface.sequelize.query(
      "SELECT setval('coach_patients_id_seq', (SELECT MAX(id) FROM coach_patients));"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('coach_patients', null, {});
  },
};
