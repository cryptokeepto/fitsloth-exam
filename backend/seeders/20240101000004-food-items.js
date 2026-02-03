'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('food_items', [
      {
        id: 1,
        name_th: 'ข้าวผัด',
        name_en: 'Fried Rice',
        calories: 350,
        protein: 8.0,
        carbs: 52.0,
        fat: 12.0,
        serving_size: '1 plate',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name_th: 'ผัดไทย',
        name_en: 'Pad Thai',
        calories: 400,
        protein: 12.0,
        carbs: 55.0,
        fat: 15.0,
        serving_size: '1 plate',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name_th: 'ต้มยำกุ้ง',
        name_en: 'Tom Yum Goong',
        calories: 180,
        protein: 15.0,
        carbs: 12.0,
        fat: 8.0,
        serving_size: '1 bowl',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name_th: 'ไก่ย่าง',
        name_en: 'Grilled Chicken',
        calories: 250,
        protein: 30.0,
        carbs: 2.0,
        fat: 14.0,
        serving_size: '1 piece',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        name_th: 'ส้มตำ',
        name_en: 'Papaya Salad',
        calories: 120,
        protein: 3.0,
        carbs: 22.0,
        fat: 3.0,
        serving_size: '1 plate',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        name_th: 'กล้วย',
        name_en: 'Banana',
        calories: 105,
        protein: 1.3,
        carbs: 27.0,
        fat: 0.4,
        serving_size: '1 medium',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        name_th: 'นมไขมันต่ำ',
        name_en: 'Low-fat Milk',
        calories: 102,
        protein: 8.0,
        carbs: 12.0,
        fat: 2.5,
        serving_size: '1 cup (240ml)',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        name_th: 'สลัดผัก',
        name_en: 'Vegetable Salad',
        calories: 80,
        protein: 2.0,
        carbs: 10.0,
        fat: 4.0,
        serving_size: '1 bowl',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);

    // Reset sequence
    await queryInterface.sequelize.query(
      "SELECT setval('food_items_id_seq', (SELECT MAX(id) FROM food_items));"
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('food_items', null, {});
  },
};
