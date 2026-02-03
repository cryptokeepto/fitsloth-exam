# Candidate Instructions

## Welcome!

Thank you for participating in the FitSloth Junior Developer Technical Assessment. This document contains everything you need to complete the assessment successfully.

## AI Tools Policy

**AI tools are allowed** during this assessment. You may use:
- GitHub Copilot
- ChatGPT / Claude
- Any other AI coding assistants

However, you must be able to explain your solutions in the written questions.

---

## Assessment Structure

### Part A: Bug Fixes (30 points)

The application contains **10 intentional bugs** documented in [BUG_REPORT.md](./BUG_REPORT.md). Your task is to:

1. Investigate each reported issue
2. Find the root cause in the codebase
3. Implement a fix
4. Verify your fix works

**Bug Categories:**
- Logic & Calculation Bugs (4 issues)
- Security Issues (2 issues)
- UI/UX Issues (2 issues)
- Data Integrity Issues (2 issues)

### Implementation Philosophy

When fixing bugs or implementing features, use common sense to fill in any gaps in requirements. Not every edge case will be explicitly documented. If something seems like it should work a certain way based on standard software practices or user expectations, implement it that way. Focus on creating a good user experience and maintaining data integrity.

### Part B: Feature Implementation (30 points)

Implement the **Weekly Summary** feature as specified in [FEATURE_REQUIREMENTS.md](./FEATURE_REQUIREMENTS.md).

This feature allows patients to view their weekly progress including:
- Daily calorie breakdown
- Weight change
- Logging streak

### Part C: Written Questions (30 points)

Answer the questions in [ANSWERS_TEMPLATE.md](./ANSWERS_TEMPLATE.md).

> **Important:** The written section carries significant weight. We want to assess your own understanding and communication skills, so please minimize AI tool usage for this part.

### Bonus (10 points)

Optional improvements you can make:
- Code quality improvements
- Additional test coverage
- Finding and documenting additional issues
- Performance optimizations

---

## Setup Instructions

### 1. Prerequisites

Make sure you have installed:
- Node.js 18 or higher
- Docker & Docker Compose
- Git

### 2. Clone and Setup

```bash
# Clone your repository
git clone https://github.com/YOUR-USERNAME/fitsloth-exam-your-name.git
cd FitSloth_Exam

# Start the database
docker-compose up -d
# or
# docker run -d --name fitsloth-postgres -p 5432:5432 -e POSTGRES_USER=fitsloth
#    -e POSTGRES_PASSWORD=fitsloth_secret -e POSTGRES_DB=fitsloth_exam           
#   postgres:15-alpine

# Install dependencies and setup database
npm install
npm run setup
```

### 3. Start Development

```bash
# Start both backend and frontend
npm run dev
```

### 4. Verify Setup

1. Open http://localhost:3000 in your browser
2. Log in with a test account:
   - Email: `patient@fitsloth.test`
   - Password: `Test123!`
3. Navigate around to ensure the app is working

---

## Test Accounts

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| Patient | patient@fitsloth.test | Test123! | Main test patient with sample data |
| Patient 2 | patient2@fitsloth.test | Test123! | Secondary patient (assigned to coach) |
| Coach | coach@fitsloth.test | Test123! | Has patient2 assigned |

---

## Project Structure Overview

```
FitSloth_Exam/
├── shared/                    # Shared TypeScript types
│   └── src/types/            # Type definitions
│
├── backend/                   # Express API
│   ├── src/
│   │   ├── models/           # Sequelize models
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   └── middlewares/      # Auth, validation
│   ├── migrations/           # Database migrations
│   └── seeders/              # Seed data
│
├── frontend/                  # Next.js App
│   └── src/
│       ├── app/              # Pages (App Router)
│       ├── components/       # React components
│       ├── services/         # API client
│       ├── hooks/            # React Query hooks
│       └── utils/            # Helper functions
│
└── docs/                     # Documentation
```

---

## Helpful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both servers |
| `npm run dev:backend` | Backend only (http://localhost:4000) |
| `npm run dev:frontend` | Frontend only (http://localhost:3000) |
| `npm run db:reset` | Reset database to initial state |
| `docker-compose logs -f postgres` | View database logs |

---

## Submission Instructions

### 1. Create Your Repository

1. Click the **"Use this template"** button (green button, top right)
2. Select **"Create a new repository"**
3. Name your repo: `fitsloth-exam-[your-name]`
4. Set visibility to **Private**
5. Click **"Create repository"**

### 2. Clone and Work

```bash
git clone https://github.com/YOUR-USERNAME/fitsloth-exam-your-name.git
cd fitsloth-exam-your-name
```

### 3. Make Your Changes

- Create meaningful commits with clear messages
- Make sure all your bug fixes and feature code is committed
- Fill out ANSWERS_TEMPLATE.md and rename it to ANSWERS.md

### 4. Submit

1. Add the examiner as a collaborator to your private repository:
   - Go to your repo **Settings** → **Collaborators**
   - Click **"Add people"**
   - Add the examiner's GitHub username
2. Notify the examiner that your submission is ready

### 5. Submission Checklist

Before submitting, verify:
- [ ] All bug fixes are committed
- [ ] Weekly Summary feature is implemented
- [ ] ANSWERS.md is completed
- [ ] Application runs without errors (`npm run dev`)
- [ ] You can log in and test basic functionality

---

## Tips for Success

1. **Read the bug reports carefully** - They describe symptoms, not solutions
2. **Test your fixes** - Make sure each fix actually solves the reported issue
3. **Follow existing patterns** - The codebase has established conventions; follow them
4. **Commit often** - Small, meaningful commits are better than one large commit
5. **Don't over-engineer** - Focus on solving the specific issues

---

## Getting Help

If you encounter technical issues with setup (not related to the assessment itself):
- Check the README troubleshooting section
- Ensure Docker is running
- Try `npm run db:reset` to reset the database

---

## Important Notes

- The bugs are intentional and documented - don't report them as new issues
- The Weekly Summary feature should be built from scratch (not a bug fix)
- Quality over quantity - better to do fewer things well than many things poorly
- Your code will be reviewed for clarity, correctness, and adherence to best practices

---

**Good luck! We look forward to reviewing your submission.**
