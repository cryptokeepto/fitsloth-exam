'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('coaches', [
      {
        id: 1,
        user_id: 3, // coach@fitsloth.test
        specialization: 'Weight Management',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Reset sequence
    await queryInterface.sequelize.query(
      "SELECT setval('coaches_id_seq', (SELECT MAX(id) FROM coaches));"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('coaches', null, {});
  },
};
