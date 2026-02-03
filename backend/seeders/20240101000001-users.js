'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('Test123!', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        email: 'patient@fitsloth.test',
        password_hash: passwordHash,
        name: 'Test Patient',
        role: 'patient',
        height: 170,
        current_weight: 70,
        target_weight: 65,
        cal_per_day: 2000,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        email: 'patient2@fitsloth.test',
        password_hash: passwordHash,
        name: 'Second Patient',
        role: 'patient',
        height: 165,
        current_weight: 75,
        target_weight: 68,
        cal_per_day: 1800,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        email: 'coach@fitsloth.test',
        password_hash: passwordHash,
        name: 'Test Coach',
        role: 'coach',
        height: null,
        current_weight: null,
        target_weight: null,
        cal_per_day: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Reset sequence
    await queryInterface.sequelize.query(
      "SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
