# Creating the Exam Branch

This document describes how to create the `exam` branch with intentional bugs for the assessment.

## Overview

The main branch contains the **Solution Version** (bug-free).
The exam branch should contain the **Exam Version** (with 8 bugs).

## Steps to Create Exam Branch

1. **Create the exam branch from main:**
   ```bash
   git checkout main
   git checkout -b exam
   ```

2. **Replace the following files with their buggy versions:**

   The buggy versions are provided in the `exam-files/` directory.

3. **Remove the Weekly Summary feature** (candidates will implement it):
   - Remove `frontend/src/app/weekly-summary/page.tsx` content (replace with TODO)
   - Keep the navigation link so candidates know where to add it
   - Keep the `useWeeklySummary` hook as a hint

4. **Verify the exam branch:**
   - App should still run without crashes
   - All 8 bugs should produce the documented symptoms
   - Weekly Summary page should show "Coming Soon" or similar

5. **Commit the exam branch:**
   ```bash
   git add .
   git commit -m "Create exam version with intentional bugs"
   ```

## Files to Replace

| File | Bug ID | Description |
|------|--------|-------------|
| backend/src/services/bmiService.ts | ISSUE-001, ISSUE-002 | Wrong BMI formula and thresholds |
| backend/src/services/mealService.ts | ISSUE-003 | Missing quantity multiplication |
| backend/src/middlewares/coachAuth.ts | ISSUE-005 | Missing patient assignment check |
| backend/src/controllers/mealController.ts | ISSUE-006 | Missing ownership check |
| frontend/src/utils/calculations.ts | ISSUE-004 | Wrong weight change direction |
| frontend/src/hooks/useWeights.ts | ISSUE-007 | Missing cache invalidation |
| frontend/src/components/MealForm.tsx | ISSUE-008 | Missing form reset |

## Testing the Bugs

After creating the exam branch, verify each bug:

1. **ISSUE-001:** Log in as patient, BMI should show ~41 instead of ~24
2. **ISSUE-002:** BMI of 27 should show "Normal" instead of "Overweight"
3. **ISSUE-003:** Log meal with quantity 2, total should only show 1x calories
4. **ISSUE-004:** After losing weight, change should show confusing negative
5. **ISSUE-005:** Log in as coach, change URL to unassigned patient, should see data
6. **ISSUE-006:** Use API to update another user's meal, should succeed
7. **ISSUE-007:** Add weight, list should not update until page refresh
8. **ISSUE-008:** Submit meal, form should still show previous values
