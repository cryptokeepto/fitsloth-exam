# Bug Report

This document lists all known issues in the FitSloth application that need to be fixed.

---

## Logic & Calculation Bugs

### ISSUE-001: BMI Shows Extremely High Values

**Reported by:** QA Team
**Severity:** High
**Area:** Patient Dashboard

**Description:**
The BMI calculation is showing extremely high values that don't make sense. For example, a patient who is 170cm tall and weighs 70kg shows a BMI of ~41, when it should be around 24.

**Steps to Reproduce:**
1. Log in as `patient@fitsloth.test`
2. View the dashboard
3. Observe the BMI value displayed

**Expected:** BMI should be calculated correctly using the standard formula
**Actual:** BMI values are much higher than expected

---

### ISSUE-002: BMI Category Shows Incorrect Classification

**Reported by:** QA Team
**Severity:** Medium
**Area:** Patient Dashboard

**Description:**
The BMI category classification seems to be using wrong thresholds. A patient with a BMI of 27 is being shown as "Normal" when according to WHO standards, they should be classified as "Overweight".

**WHO BMI Standards Reference:**
- Underweight: < 18.5
- Normal: 18.5 - 24.9
- Overweight: 25 - 29.9
- Obese: ≥ 30

**Steps to Reproduce:**
1. Log in as a patient with BMI around 27
2. Check the BMI category on the dashboard

**Expected:** BMI of 27 should show "Overweight"
**Actual:** Shows "Normal" instead

---

### ISSUE-003: Daily Calorie Total Seems Too Low

**Reported by:** Patient Feedback
**Severity:** High
**Area:** Meal Logging

**Description:**
The daily calorie total displayed doesn't match what users expect. When a patient logs a meal with quantity > 1 (e.g., 2 portions of rice), the total seems to only count calories for 1 portion.

**Steps to Reproduce:**
1. Log in as `patient@fitsloth.test`
2. Log a meal with quantity = 2 (e.g., 2 servings of ข้าวผัด which is 350 cal each)
3. Check the daily calorie summary

**Expected:** Should show 700 calories (350 × 2)
**Actual:** Shows only 350 calories

---

### ISSUE-004: Weight Change Shows Negative When Patient Lost Weight

**Reported by:** UX Team
**Severity:** Medium
**Area:** Weight Tracking

**Description:**
When a patient successfully loses weight, the weight change indicator shows a negative number, which is confusing. Users expect losing weight to be shown as positive progress.

**Example:**
- Starting weight: 75kg
- Current weight: 73kg
- Expected display: "-2kg" or "Lost 2kg" (shown as positive achievement)
- Actual display: Shows the change as a confusing negative number

**Steps to Reproduce:**
1. Log in as a patient who has lost weight
2. View the weight tracking section
3. Check the weight change indicator

---

## Security Issues

### ISSUE-005: Coach Can Access Unassigned Patients

**Reported by:** Security Audit
**Severity:** Critical
**Area:** Coach Portal

**Description:**
A coach can view details of patients who are not assigned to them by manually changing the patient ID in the URL. This is a serious authorization bypass.

**Steps to Reproduce:**
1. Log in as `coach@fitsloth.test`
2. Go to a patient detail page (e.g., `/coach/patients/2`)
3. Change the ID in the URL to another patient ID (e.g., `/coach/patients/1`)
4. The coach can see the unassigned patient's data

**Expected:** Should show "Access Denied" or redirect
**Actual:** Shows the patient's full data

---

### ISSUE-006: User Can Edit Another User's Meal

**Reported by:** Security Audit
**Severity:** Critical
**Area:** Meal Management

**Description:**
A user can update or delete another user's meal by changing the meal ID in the API request. The backend doesn't verify that the meal belongs to the requesting user.

**Steps to Reproduce:**
1. Log in as `patient@fitsloth.test`
2. Create a meal log
3. Using browser dev tools or API client, send a PUT request to update a meal belonging to another user (different meal ID)
4. The meal gets updated despite belonging to another user

**Expected:** Should return 403 Forbidden
**Actual:** Meal is updated successfully

---

## UI/UX Issues

### ISSUE-007: Weight List Doesn't Refresh After Adding New Weight

**Reported by:** QA Team
**Severity:** Medium
**Area:** Weight Tracking

**Description:**
After successfully adding a new weight entry, the weight list doesn't update to show the new entry. Users have to manually refresh the page to see their newly logged weight.

**Steps to Reproduce:**
1. Log in as `patient@fitsloth.test`
2. Go to the weight tracking page
3. Add a new weight entry
4. Success message appears, but the list still shows old data

**Expected:** Weight list should automatically include the new entry
**Actual:** Must refresh the page to see the new weight

---

### ISSUE-008: Meal Form Doesn't Clear After Submit

**Reported by:** UX Team
**Severity:** Low
**Area:** Meal Logging

**Description:**
After successfully submitting a meal, the form still shows the previously entered values. Users expect the form to reset so they can easily log another meal.

**Steps to Reproduce:**
1. Log in as `patient@fitsloth.test`
2. Go to meal logging page
3. Fill out the form and submit
4. Success message appears, but form still shows the previous values

**Expected:** Form should clear/reset after successful submission
**Actual:** Form retains previous values

---

## Data Integrity Issues

### ISSUE-009: Duplicate Weight Records When Editing Date

**Reported by:** QA Team
**Severity:** Medium
**Area:** Weight Management

**Description:**
When editing an existing weight entry and changing its date to a date that already has a weight record, the system creates duplicate entries for the same date instead of handling the conflict properly.

**Steps to Reproduce:**
1. Log in as `patient@fitsloth.test`
2. Add weight entries for two different dates (e.g., Jan 15 = 70kg, Jan 16 = 69kg)
3. Edit the Jan 16 entry and change its date to Jan 15
4. Submit the change
5. Check weight list - two entries now exist for Jan 15

**Expected:** Should either update the existing Jan 15 entry or show an error
**Actual:** Creates duplicate weight records for the same date

---

### ISSUE-010: Profile Weight Not Updated After Deleting Latest Entry

**Reported by:** QA Team
**Severity:** Medium
**Area:** Weight Management / User Profile

**Description:**
When a patient deletes their most recent weight entry, the currentWeight in their profile is not updated. This causes the dashboard to display incorrect weight data.

**Steps to Reproduce:**
1. Log in as `patient@fitsloth.test`
2. Note the current weight on the dashboard
3. Add a new weight entry (e.g., 65kg)
4. Verify dashboard now shows 65kg
5. Delete that weight entry
6. Check dashboard - still shows 65kg instead of the previous weight

**Expected:** Profile should show the most recent remaining weight after deletion
**Actual:** Profile retains the deleted weight value

---

## Summary

| Issue | Category | Severity |
|-------|----------|----------|
| ISSUE-001 | Logic | High |
| ISSUE-002 | Logic | Medium |
| ISSUE-003 | Logic | High |
| ISSUE-004 | Logic | Medium |
| ISSUE-005 | Security | Critical |
| ISSUE-006 | Security | Critical |
| ISSUE-007 | UI/UX | Medium |
| ISSUE-008 | UI/UX | Low |
| ISSUE-009 | Data Integrity | Medium |
| ISSUE-010 | Data Integrity | Medium |

**Total: 10 Issues**
