import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

// Create sequelize instance immediately
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fitsloth_exam',
  username: process.env.DB_USER || 'fitsloth',
  password: process.env.DB_PASSWORD || 'fitsloth_secret',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
  },
});

// Export as default and named export to ensure it's always available
export default sequelize;
export { sequelize };
