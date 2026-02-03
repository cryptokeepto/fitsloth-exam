# Database Schema

## Overview

The FitSloth database uses PostgreSQL with Sequelize ORM. The schema consists of 6 main tables.

---

## Entity Relationship Diagram

```
┌─────────────┐      ┌─────────────┐      ┌─────────────────┐
│   users     │──────│   coaches   │──────│  coach_patients │
└─────────────┘      └─────────────┘      └─────────────────┘
      │                                           │
      │                                           │
      ▼                                           │
┌─────────────┐                                   │
│   weights   │                                   │
└─────────────┘                                   │
      │                                           │
      │                                           │
      ▼                                           │
┌─────────────┐      ┌─────────────┐              │
│  meal_logs  │──────│ food_items  │              │
└─────────────┘      └─────────────┘              │
```

---

## Tables

### users

Stores all user accounts (patients, coaches, and admins).

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | INTEGER | No | Primary key, auto-increment |
| email | VARCHAR(255) | No | Unique email address |
| password_hash | VARCHAR(255) | No | Bcrypt hashed password |
| name | VARCHAR(255) | No | User's full name |
| role | ENUM | No | 'patient', 'coach', or 'admin' |
| height | DECIMAL(5,2) | Yes | Height in centimeters |
| current_weight | DECIMAL(5,2) | Yes | Current weight in kg |
| target_weight | DECIMAL(5,2) | Yes | Target weight in kg |
| cal_per_day | INTEGER | Yes | Daily calorie goal |
| created_at | TIMESTAMP | No | Record creation time |
| updated_at | TIMESTAMP | No | Last update time |

**Indexes:**
- `users_email_key` (unique) on `email`

---

### coaches

Stores coach-specific information (linked to users table).

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | INTEGER | No | Primary key, auto-increment |
| user_id | INTEGER | No | Foreign key to users.id |
| specialization | VARCHAR(255) | Yes | Coach's specialization |
| created_at | TIMESTAMP | No | Record creation time |
| updated_at | TIMESTAMP | No | Last update time |

**Indexes:**
- `coaches_user_id_key` (unique) on `user_id`

**Foreign Keys:**
- `user_id` → `users.id` (ON DELETE CASCADE)

---

### coach_patients

Junction table for coach-patient assignments.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | INTEGER | No | Primary key, auto-increment |
| coach_id | INTEGER | No | Foreign key to coaches.id |
| patient_id | INTEGER | No | Foreign key to users.id (patient) |
| assigned_at | TIMESTAMP | No | When the patient was assigned |
| created_at | TIMESTAMP | No | Record creation time |
| updated_at | TIMESTAMP | No | Last update time |

**Indexes:**
- `coach_patients_coach_id_patient_id_key` (unique) on `(coach_id, patient_id)`

**Foreign Keys:**
- `coach_id` → `coaches.id` (ON DELETE CASCADE)
- `patient_id` → `users.id` (ON DELETE CASCADE)

---

### food_items

Stores food item data with nutritional information.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | INTEGER | No | Primary key, auto-increment |
| name_th | VARCHAR(255) | No | Thai name |
| name_en | VARCHAR(255) | No | English name |
| calories | INTEGER | No | Calories per serving |
| protein | DECIMAL(5,2) | No | Protein in grams |
| carbs | DECIMAL(5,2) | No | Carbohydrates in grams |
| fat | DECIMAL(5,2) | No | Fat in grams |
| serving_size | VARCHAR(100) | No | Description of serving size |
| created_at | TIMESTAMP | No | Record creation time |
| updated_at | TIMESTAMP | No | Last update time |

---

### meal_logs

Records individual meal entries for users.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | INTEGER | No | Primary key, auto-increment |
| user_id | INTEGER | No | Foreign key to users.id |
| food_item_id | INTEGER | No | Foreign key to food_items.id |
| quantity | DECIMAL(5,2) | No | Number of servings |
| meal_type | ENUM | No | 'breakfast', 'lunch', 'dinner', 'snack' |
| consumption_date | DATE | No | Date of consumption |
| calories | INTEGER | No | Total calories (calculated) |
| notes | TEXT | Yes | Optional notes |
| created_at | TIMESTAMP | No | Record creation time |
| updated_at | TIMESTAMP | No | Last update time |

**Indexes:**
- `meal_logs_user_id_consumption_date_idx` on `(user_id, consumption_date)`

**Foreign Keys:**
- `user_id` → `users.id` (ON DELETE CASCADE)
- `food_item_id` → `food_items.id` (ON DELETE RESTRICT)

---

### weights

Records weight measurements for users.

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | INTEGER | No | Primary key, auto-increment |
| user_id | INTEGER | No | Foreign key to users.id |
| weight | DECIMAL(5,2) | No | Weight in kg |
| recorded_date | DATE | No | Date of measurement |
| notes | TEXT | Yes | Optional notes |
| created_at | TIMESTAMP | No | Record creation time |
| updated_at | TIMESTAMP | No | Last update time |

**Indexes:**
- `weights_user_id_recorded_date_idx` on `(user_id, recorded_date)`

**Foreign Keys:**
- `user_id` → `users.id` (ON DELETE CASCADE)

---

## Seed Data

### Test Users

| ID | Email | Role | Password |
|----|-------|------|----------|
| 1 | patient@fitsloth.test | patient | Test123! |
| 2 | patient2@fitsloth.test | patient | Test123! |
| 3 | coach@fitsloth.test | coach | Test123! |

### Coach Assignments

- Coach (user 3) is assigned patient2 (user 2)
- Patient1 (user 1) is NOT assigned to any coach

### Food Items

8 food items are seeded:
1. Fried Rice (ข้าวผัด) - 350 cal
2. Pad Thai (ผัดไทย) - 400 cal
3. Tom Yum Goong (ต้มยำกุ้ง) - 180 cal
4. Grilled Chicken (ไก่ย่าง) - 250 cal
5. Papaya Salad (ส้มตำ) - 120 cal
6. Banana (กล้วย) - 105 cal
7. Low-fat Milk (นมไขมันต่ำ) - 102 cal
8. Vegetable Salad (สลัดผัก) - 80 cal

---

## Notes

- All tables use snake_case naming convention
- Timestamps are automatically managed by Sequelize
- The `calories` field in `meal_logs` is calculated as `food_items.calories * quantity`
- Weight changes are calculated at query time, not stored
