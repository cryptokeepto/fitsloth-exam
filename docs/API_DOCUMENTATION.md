# API Documentation

Base URL: `http://localhost:4000/api`

## Authentication

All endpoints except `/auth/login` and `/auth/register` require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/register

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "patient",
  "height": 170,
  "currentWeight": 70,
  "targetWeight": 65,
  "calPerDay": 2000
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "patient",
      "height": 170,
      "currentWeight": 70,
      "targetWeight": 65,
      "calPerDay": 2000,
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### POST /auth/login

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "patient",
      "bmi": 24.2,
      "bmiCategory": "Normal"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### GET /auth/profile

Get current user's profile.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "patient",
    "height": 170,
    "currentWeight": 70,
    "targetWeight": 65,
    "calPerDay": 2000,
    "bmi": 24.2,
    "bmiCategory": "Normal"
  }
}
```

---

## Meal Endpoints

### GET /meals

Get meals for the authenticated user.

**Query Parameters:**
- `date` (optional): Filter by date (YYYY-MM-DD)
- `startDate` (optional): Start of date range
- `endDate` (optional): End of date range

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "foodItemId": 1,
      "quantity": 1.5,
      "mealType": "breakfast",
      "consumptionDate": "2024-01-15",
      "calories": 525,
      "notes": null,
      "foodItem": {
        "id": 1,
        "nameTh": "ข้าวผัด",
        "nameEn": "Fried Rice",
        "calories": 350,
        "protein": 8.0,
        "carbs": 52.0,
        "fat": 12.0
      }
    }
  ]
}
```

### POST /meals

Create a new meal log.

**Request Body:**
```json
{
  "foodItemId": 1,
  "quantity": 1.5,
  "mealType": "breakfast",
  "consumptionDate": "2024-01-15",
  "notes": "Optional note"
}
```

**Response:** `201 Created`

### PUT /meals/:id

Update a meal log.

**Request Body:**
```json
{
  "quantity": 2,
  "notes": "Updated note"
}
```

**Response:** `200 OK`

### DELETE /meals/:id

Delete a meal log.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Meal deleted successfully"
}
```

### GET /meals/summary

Get daily meal summary.

**Query Parameters:**
- `date` (optional): Date to get summary for (defaults to today)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "totalCalories": 1850,
    "calorieGoal": 2000,
    "remaining": 150,
    "meals": {
      "breakfast": [...],
      "lunch": [...],
      "dinner": [...],
      "snack": [...]
    }
  }
}
```

---

## Weight Endpoints

### GET /weights

Get weight history.

**Query Parameters:**
- `startDate` (optional): Start of date range
- `endDate` (optional): End of date range
- `limit` (optional): Maximum number of records

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "weight": 70.5,
      "recordedDate": "2024-01-15",
      "notes": null
    }
  ]
}
```

### POST /weights

Log a new weight.

**Request Body:**
```json
{
  "weight": 70.5,
  "recordedDate": "2024-01-15",
  "notes": "Morning weigh-in"
}
```

**Response:** `201 Created`

### DELETE /weights/:id

Delete a weight record.

**Response:** `200 OK`

### GET /weights/stats

Get weight statistics.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "latestWeight": 70.0,
    "weightChange": -0.5,
    "recordCount": 7,
    "weights": [...]
  }
}
```

---

## Food Endpoints

### GET /foods

Get list of food items.

**Query Parameters:**
- `search` (optional): Search by name

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nameTh": "ข้าวผัด",
      "nameEn": "Fried Rice",
      "calories": 350,
      "protein": 8.0,
      "carbs": 52.0,
      "fat": 12.0,
      "servingSize": "1 plate"
    }
  ]
}
```

---

## Patient Endpoints

### GET /patients/weekly-summary

Get weekly summary for the authenticated patient.

**Query Parameters:**
- `startDate` (required): Start date of the week (YYYY-MM-DD)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-01-15",
      "endDate": "2024-01-21"
    },
    "calories": {
      "daily": [
        { "date": "2024-01-15", "total": 1850 },
        { "date": "2024-01-16", "total": 2100 }
      ],
      "average": 1975,
      "total": 13825
    },
    "weight": {
      "start": 70.5,
      "end": 70.0,
      "change": -0.5
    },
    "logging": {
      "daysLogged": 6,
      "totalMeals": 18,
      "streak": "6/7 days"
    }
  }
}
```

---

## Coach Endpoints

### GET /coach/patients

Get list of assigned patients.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "Patient Name",
      "email": "patient@example.com",
      "currentWeight": 70,
      "targetWeight": 65,
      "bmi": 24.2,
      "bmiCategory": "Normal",
      "lastActivity": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

### GET /coach/patients/:id

Get patient details (must be assigned to the coach).

**Response:** `200 OK`

### GET /coach/patients/:id/meals

Get patient's meal history.

**Query Parameters:**
- `startDate` (optional): Start of date range
- `endDate` (optional): End of date range

**Response:** `200 OK`

### GET /coach/patients/:id/weights

Get patient's weight history.

**Response:** `200 OK`

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 500 | Internal Server Error |
