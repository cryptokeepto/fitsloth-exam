# Feature Requirements: Weekly Summary

## Overview

Implement a Weekly Summary feature that allows patients to view their progress over a 7-day period. This feature provides insights into calorie consumption patterns, weight changes, and logging consistency.

> **Note:** Use common sense to address any obvious gaps in these requirements. Not every edge case or UI detail will be explicitly specified. When in doubt, follow standard software practices and prioritize a good user experience.

---

## User Story

**As a** patient using FitSloth,
**I want to** see a weekly summary of my diet and weight progress,
**So that** I can track my health journey and stay motivated.

---

## Backend Requirements

### API Endpoint

**Endpoint:** `GET /api/patients/weekly-summary`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | string | Yes | Start date of the week (YYYY-MM-DD format) |

**Authentication:** Required (JWT token)

**Authorization:** Patient role only (must be own data)

### Response Format

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
        { "date": "2024-01-16", "total": 2100 },
        { "date": "2024-01-17", "total": 0 },
        { "date": "2024-01-18", "total": 1950 },
        { "date": "2024-01-19", "total": 2200 },
        { "date": "2024-01-20", "total": 1800 },
        { "date": "2024-01-21", "total": 1900 }
      ],
      "average": 1685.71,
      "total": 11800
    },
    "weight": {
      "start": 75.0,
      "end": 74.5,
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

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| period.startDate | string | First day of the summary period |
| period.endDate | string | Last day of the summary period |
| calories.daily | array | Daily calorie totals for each day |
| calories.average | number | Average daily calories (total / 7) |
| calories.total | number | Sum of all calories for the week |
| weight.start | number/null | Weight on start date (or nearest) |
| weight.end | number/null | Weight on end date (or nearest) |
| weight.change | number/null | Difference (end - start) |
| logging.daysLogged | number | Number of days with at least one meal |
| logging.totalMeals | number | Total meal entries for the week |
| logging.streak | string | Formatted string "X/7 days" |

### Edge Cases

1. **No meals logged:** Return empty daily array, average = 0
2. **No weight data:** Return null for weight fields
3. **Partial weight data:** Use available data for start/end
4. **Invalid date:** Return 400 Bad Request
5. **Future dates:** Return empty data (no error)

### Error Responses

```json
// 400 Bad Request - Invalid date format
{
  "success": false,
  "error": "Invalid date format. Use YYYY-MM-DD"
}

// 401 Unauthorized - Not logged in
{
  "success": false,
  "error": "Authentication required"
}
```

---

## Frontend Requirements

### Navigation

Add "Weekly Summary" link to the patient navigation menu, positioned after "History".

### Page Layout (Or you can design it yourself)

```
┌─────────────────────────────────────────────────────┐
│  Weekly Summary                                      │
├─────────────────────────────────────────────────────┤
│  Week of: [Date Picker: Jan 15, 2024]  [View]       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────────┐  ┌─────────────────┐           │
│  │  Weight Change  │  │  Logging Streak │           │
│  │     -0.5 kg     │  │    6/7 days     │           │
│  │       ↓         │  │                 │           │
│  └─────────────────┘  └─────────────────┘           │
│                                                      │
│  ┌─────────────────────────────────────────────────┐│
│  │  Daily Calories                                 ││
│  │  ▁ ▃ ▁ ▂ ▄ ▂ ▂                                 ││
│  │  M  T  W  T  F  S  S                           ││
│  │                                                 ││
│  │  Average: 1,686 cal/day  |  Total: 11,800 cal  ││
│  └─────────────────────────────────────────────────┘│
│                                                      │
│  [Download JSON]                                     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Components Required

1. **Date Picker**
   - Select week start date (Monday)
   - Default to current week
   - Cannot select future weeks

2. **Weight Change Card**
   - Display weight change in kg
   - Show arrow icon (↓ for loss, ↑ for gain)
   - Green for loss, red for gain (configurable)
   - Show "No data" if no weights recorded

3. **Logging Streak Card**
   - Display "X/7 days"
   - Optionally show total meals logged

4. **Calorie Chart**
   - Bar chart showing 7 days
   - Label each day (Mon-Sun or dates)
   - Show average and total below

5. **Download Button**
   - Export summary data as JSON file
   - Filename: `weekly-summary-YYYY-MM-DD.json`

### States to Handle

1. **Loading:** Show loading spinner while fetching
2. **Error:** Display error message with retry option
3. **Empty:** Show friendly message "No data for this week"
4. **Success:** Display all data components

### Styling

- Follow existing Tailwind CSS patterns
- Use consistent card styling with other pages
- Responsive design (mobile-friendly)

---

## Acceptance Criteria

### Backend

- [ ] Endpoint returns correct calorie totals per day
- [ ] Calorie average is calculated correctly
- [ ] Weight start/end are from the correct dates
- [ ] Weight change is calculated correctly
- [ ] Days logged count is accurate
- [ ] Returns proper error for invalid date
- [ ] Returns empty data (not error) for weeks with no data

### Frontend

- [ ] Weekly summary page is accessible from navigation
- [ ] Date picker allows selecting past weeks
- [ ] Weight change displays with correct arrow direction
- [ ] Calorie chart shows 7 days of data
- [ ] Loading state is shown while fetching
- [ ] Error state shows helpful message
- [ ] Empty state handles no data gracefully
- [ ] Download button exports valid JSON

### Integration

- [ ] Frontend correctly calls backend API
- [ ] Data flows from backend to UI components
- [ ] Changing date triggers new data fetch

---

## Technical Notes

### Suggested Backend Implementation

```typescript
// services/summaryService.ts
async function getWeeklySummary(userId: number, startDate: Date) {
  // 1. Calculate end date (startDate + 6 days)
  // 2. Query meal_logs for the date range
  // 3. Query weights for the date range
  // 4. Aggregate and return data
}
```

### Suggested Frontend Implementation

```typescript
// hooks/useWeeklySummary.ts
function useWeeklySummary(startDate: string) {
  return useQuery({
    queryKey: ['weekly-summary', startDate],
    queryFn: () => fetchWeeklySummary(startDate),
  });
}
```

### Date Handling Tips

- Use consistent date format (YYYY-MM-DD)
- Be aware of timezone issues
- Consider using date-fns or similar library
- Store dates as DATE type in PostgreSQL

---

## Example Test Cases

1. **Normal week with full data**
   - 7 days of meals, weights on day 1 and 7
   - Verify all calculations are correct

2. **Week with partial data**
   - Only 3 days of meals, 1 weight entry
   - Verify handling of missing data

3. **Week with no data**
   - No meals or weights
   - Verify empty state display

4. **Invalid date format**
   - Send "15-01-2024" instead of "2024-01-15"
   - Verify error handling

---

## Out of Scope

The following are NOT required:
- Weekly email reports
- Comparison with previous weeks
- Goal tracking
- PDF export
- Coach access to patient summaries
