import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// Load env before anything else
dotenv.config();

// Create sequelize instance directly here to avoid circular imports
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

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize models first (using dynamic import to control timing)
    const { initializeModels } = await import('./models');
    initializeModels(sequelize);

    // Now dynamically import routes (which depend on models)
    const authRoutes = (await import('./routes/auth')).default;
    const mealRoutes = (await import('./routes/meals')).default;
    const weightRoutes = (await import('./routes/weights')).default;
    const coachRoutes = (await import('./routes/coach')).default;
    const foodRoutes = (await import('./routes/foods')).default;
    const patientRoutes = (await import('./routes/patients')).default;

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/meals', mealRoutes);
    app.use('/api/weights', weightRoutes);
    app.use('/api/coach', coachRoutes);
    app.use('/api/foods', foodRoutes);
    app.use('/api/patients', patientRoutes);

    await sequelize.authenticate();
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

// Export for potential use in tests
export { sequelize };
export default app;
