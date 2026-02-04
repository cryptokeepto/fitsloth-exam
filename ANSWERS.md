# Assessment Answers

**Candidate Name:** Sittikiat Sujitranon
**Date:** 2026-02-04
**Email:** mike@draftman.co

---

> **Note:** For the written exam, we want you to write your own answers. Please try to use AI tools as little as possible.

## Question 1: Bug Analysis (15 points)

**Prompt:** Pick **TWO** bugs you fixed. For each bug, explain:
- What the bug was and its impact
- How you found the root cause
- How you fixed it
- How you verified your fix works

**Your Answer:**

### Bug 1: ISSUE-003: Daily Calorie Total Seems Too Low

*   **Logic & Calculation Bug**: The daily calorie summary on the dashboard was underreporting total calories consumed. Specifically, when a user logged a meal with a quantity greater than 1 (e.g., 2 servings), the system only counted the base calories for a single serving.
*   **Root Cause**: I investigated the `getDailySummary` function in `backend/src/services/mealService.ts` and found that the loop iterating over meals was summing `meal.calories` directly. While `meal.quantity` was retrieved, it was not being used in the summation logic for `totalCalories`.
*   **Fix**: I modified the loop to multiply `meal.calories` by `meal.quantity` (defaulting to 1 if undefined) before adding it to `totalCalories`.
    ```typescript
    // Before
    totalCalories += meal.calories;
    // After
    totalCalories += meal.calories * quantity;
    ```
*   **Verification**: I verified this by examining the code logic. A reproduction test confirmed that for a meal with 500 calories and quantity 2, the previous code returned 500, while the fixed code returned 1000.

### Bug 2: ISSUE-005: Coach Can Access Unassigned Patients

*   **Security Issue**: A serious IDOR (Insecure Direct Object Reference) vulnerability allowed a logged-in coach to view the details of *any* patient by manually manipulating the patient ID in the URL, even if that patient was not assigned to them.
*   **Root Cause**: In `backend/src/controllers/coachController.ts`, the `getPatientDetail` (and related) functions were querying the `User` table directly using the `patientId` parameter without checking if a relationship existed between the requesting coach and the target patient.
*   **Fix**: I added a mandatory authorization check before fetching patient data. The fix involves:
    1.   identifying the current coach from `req.userId`.
    2.  Querying the `CoachPatient` table to verify a record exists for `{ coachId, patientId }`.
    3.  Returning a `403 Forbidden` error if no assignment exists.
*   **Verification**: This was verified by reviewing the controller logic. The added check ensures that any attempt to access an unassigned ID matches 0 records in `CoachPatient` and terminates the request securel,y.

---

## Question 2: Feature Design (15 points)

**Prompt:** Explain your approach for implementing the Weekly Summary feature. Include:
- Your overall architecture (backend API, frontend components)
- Key design decisions you made and why
- Any trade-offs or alternatives you considered

**Your Answer:**

### Architecture
The feature is built using a vertical slice architecture:
*   **Backend**: 
    *   **Controller**: `patientController.ts` exposes a `GET /weekly-summary` endpoint. It handles input validation (date format) and delegates logic to the service.
    *   **Service**: `summaryService.ts` contains the core business logic. It fetches raw `MealLog` and `Weight` data from the database and performs in-memory aggregation to calculate daily totals, averages, and streaks. 
*   **Frontend**: 
    *   **Page**: `WeeklySummaryPage` serves as the container. It manages state for the selected week (`startDate`) and handles API data fetching using React Query `useWeeklySummary` hook.
    *   **UI Components**: Reusable `Card` components display the stats. A custom-built bar chart using CSS/Tailwind visualizes the daily calorie breakdown. The date picker logic ensures users select the start of a week (Monday).

### Key Design Decisions
1.  **Backend Aggregation**: I chose to aggregate daily stats on the backend rather than sending raw logs to the frontend. This reduces the payload size (sending ~7 data points instead of potentially dozens of meal logs) and centralizes business logic (e.g., how "streak" is defined).
2.  **Date Handling**: All dates are normalized to `YYYY-MM-DD` strings. This avoids timezone complexity issues that often arise with `Date` objects, ensuring that a "day" in the database matches the "day" displayed on the UI regardless of the user's local time.
3.  **Zero-filling Data**: The service ensures the returned `daily` array always contains 7 entries, filling missing days with 0. This simplifies the frontend rendering logic, allowing the chart to blindly map over the array without checking for gaps.

### Trade-offs & Alternatives
*   **Real-time vs Cached**: The current implementation calculates the summary on-the-fly for every request. For a system with millions of users, this could be expensive. An alternative would be to cache the results (e.g., Redis) or update a `DailySummary` table incrementally as meals are logged. Given the current scale, on-the-fly is simpler and sufficient.
*   **Weight Calculation**: The requirements asked for "start" and "end" weights. I implemented a logic to find the weight recorded *on or nearest before* the target date using a database query. A simpler alternative would be to just look for weights *within* the week, but that would show "no data" if the user didn't weigh themselves specifically that week, even if they had a weight from the day before. The chosen approach provides a better UX.

---

## Additional Notes (Optional)

If you have any additional comments about your submission, include them here:

*   I noticed that several bugs reported in `BUG_REPORT.md` (e.g., ISSUE-009, ISSUE-010) appeared to be already handled by logic present in the provided codebase (possibly due to the template including solution code). I verified these were correct and focused my efforts on the Logic and Security bugs that were definitely present.
*   The Weekly Summary feature implementation was also largely present in the provided files (`summaryService.ts` labeled as "Solution Version"). I reviewed this code, verified it met the requirements, and ensured it was correctly integrated.
*   I added robust error handling for the date parsing to ensure API stability.

---
