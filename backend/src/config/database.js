// Sequelize CLI configuration file
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'fitsloth',
    password: process.env.DB_PASSWORD || 'fitsloth_secret',
    database: process.env.DB_NAME || 'fitsloth_exam',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    define: {
      underscored: true,
      timestamps: true,
    },
  },
  test: {
    username: process.env.DB_USER || 'fitsloth',
    password: process.env.DB_PASSWORD || 'fitsloth_secret',
    database: process.env.DB_NAME || 'fitsloth_exam_test',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
  },
};
