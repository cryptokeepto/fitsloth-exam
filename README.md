# FitSloth Technical Assessment

Welcome to the FitSloth Junior Developer Technical Assessment. This project simulates a simplified HealthTech application for diet and weight management.

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm or yarn

### Setup Instructions

1. **Start the database**
   ```bash
   docker-compose up -d
   ```

2. **Install dependencies and setup**
   ```bash
   npm install
   npm run setup
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - pgAdmin: http://localhost:5050

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@fitsloth.test | Test123! |
| Patient 2 | patient2@fitsloth.test | Test123! |
| Coach | coach@fitsloth.test | Test123! |

## Project Structure

```
FitSloth_Exam/
├── shared/           # Shared TypeScript types
├── backend/          # Express API server
├── frontend/         # Next.js web application
└── docs/             # API and database documentation
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend in development mode |
| `npm run dev:backend` | Start only the backend server |
| `npm run dev:frontend` | Start only the frontend application |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed the database with test data |
| `npm run db:reset` | Reset database (drop, migrate, seed) |
| `npm run build` | Build all packages for production |

## Documentation

- [Candidate Instructions](./CANDIDATE_INSTRUCTIONS.md)
- [Bug Report](./BUG_REPORT.md)
- [Grading Rubric](./GRADING_RUBRIC.md)
- [Feature Requirements](./FEATURE_REQUIREMENTS.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, React Query |
| Backend | Node.js (Express), TypeScript, Sequelize ORM |
| Database | PostgreSQL |
| Auth | JWT-based authentication |

## Assessment Overview

This assessment consists of three main parts:

1. **Bug Fixes (50 points)** - Find and fix 8 intentional bugs
2. **Feature Implementation (30 points)** - Build the Weekly Summary feature
3. **Written Questions (10 points)** - Answer 2 technical questions
4. **Bonus (10 points)** - Code improvements, tests, additional findings

See [CANDIDATE_INSTRUCTIONS.md](./CANDIDATE_INSTRUCTIONS.md) for complete details.

---

**Good luck!** - The FitSloth Team
