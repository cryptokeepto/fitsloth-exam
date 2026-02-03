'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Sample meal logs for patient 1
    const mealLogs = [
      // Today's meals
      {
        user_id: 1,
        food_item_id: 1, // Fried Rice
        quantity: 1,
        meal_type: 'breakfast',
        consumption_date: today,
        calories: 350, // 350 * 1
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        food_item_id: 3, // Tom Yum Goong
        quantity: 1,
        meal_type: 'lunch',
        consumption_date: today,
        calories: 180,
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        food_item_id: 4, // Grilled Chicken
        quantity: 1,
        meal_type: 'lunch',
        consumption_date: today,
        calories: 250,
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        food_item_id: 6, // Banana
        quantity: 2,
        meal_type: 'snack',
        consumption_date: today,
        calories: 210, // 105 * 2
        notes: 'Afternoon snack',
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Yesterday's meals
      {
        user_id: 1,
        food_item_id: 2, // Pad Thai
        quantity: 1,
        meal_type: 'lunch',
        consumption_date: yesterday,
        calories: 400,
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        food_item_id: 5, // Papaya Salad
        quantity: 1,
        meal_type: 'dinner',
        consumption_date: yesterday,
        calories: 120,
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        food_item_id: 8, // Vegetable Salad
        quantity: 1,
        meal_type: 'dinner',
        consumption_date: yesterday,
        calories: 80,
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Patient 2 meals
      {
        user_id: 2,
        food_item_id: 1, // Fried Rice
        quantity: 1,
        meal_type: 'breakfast',
        consumption_date: today,
        calories: 350,
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        food_item_id: 2, // Pad Thai
        quantity: 1,
        meal_type: 'lunch',
        consumption_date: today,
        calories: 400,
        notes: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('meal_logs', mealLogs);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('meal_logs', null, {});
  },
};
