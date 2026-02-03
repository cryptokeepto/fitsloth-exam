# Grading Rubric

**Total Points: 100**

---

## Part A: Bug Fixes (30 points)

### Easy Bugs (2 points each = 8 points)

| Issue | Description | Points | Criteria |
|-------|-------------|--------|----------|
| ISSUE-001 | BMI calculation formula | 2 | Uses correct formula: weight / (height in meters)² |
| ISSUE-002 | BMI category thresholds | 2 | Uses WHO standards correctly |
| ISSUE-004 | Weight change direction | 2 | Shows weight loss as positive progress |
| ISSUE-008 | Form clear after submit | 2 | Form resets after successful meal submission |

### Medium Bugs (4 points each = 16 points)

| Issue | Description | Points | Criteria |
|-------|-------------|--------|----------|
| ISSUE-003 | Calorie calculation with quantity | 4 | Correctly multiplies calories by quantity |
| ISSUE-005 | Coach authorization bypass | 4 | Validates coach-patient assignment |
| ISSUE-006 | Meal ownership verification | 4 | Verifies meal belongs to requesting user |
| ISSUE-007 | Weight list cache invalidation | 4 | List updates after adding new weight |

### Database/Data Integrity Bugs (3 points each = 6 points)

| Issue | Description | Points | Criteria |
|-------|-------------|--------|----------|
| ISSUE-009 | Duplicate weight dates on update | 3 | Prevents duplicate dates when editing weight entries |
| ISSUE-010 | currentWeight not synced on delete | 3 | Updates profile weight after deleting latest entry |

### Bug Fix Evaluation Criteria

**Full Points:**
- Bug is correctly identified
- Fix addresses the root cause
- Fix doesn't introduce new issues
- Code follows existing patterns

**Partial Points (50-75%):**
- Bug is fixed but solution is not optimal
- Minor side effects introduced
- Code style doesn't match existing patterns

**Minimal Points (25-50%):**
- Partial fix that improves but doesn't fully resolve
- Workaround rather than proper fix

**No Points:**
- Bug not addressed
- Fix breaks other functionality
- Incorrect understanding of the issue

---

## Part B: Feature Implementation (30 points)

### Weekly Summary Feature

#### Backend API (10 points)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Endpoint exists | 2 | GET /api/patients/weekly-summary works |
| Correct data aggregation | 4 | Daily calorie totals are accurate |
| Weight data included | 2 | Start/end weights and change calculated |
| Edge case handling | 2 | Handles weeks with no data gracefully |

#### Frontend UI (12 points)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Page accessible | 2 | Weekly summary page exists in navigation |
| Date selection | 2 | User can select week to view |
| Data display | 5 | Shows calories, weight change, logging streak |
| Visual presentation | 3 | Clean, readable layout (chart optional) |

#### Error Handling (8 points)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Loading states | 2 | Shows loading indicator while fetching |
| Error messages | 2 | Displays helpful error messages |
| Empty state | 2 | Handles weeks with no data |
| Input validation | 2 | Validates date input |

### Feature Evaluation Criteria

**Full Points:**
- Feature works as specified
- Follows existing code patterns
- Handles edge cases
- Good user experience

**Partial Points:**
- Core functionality works
- Some requirements missing
- Minor UI/UX issues

**Minimal Points:**
- Basic structure present
- Significant functionality gaps
- Does not follow specification

---

## Part C: Written Questions (30 points)

> **Important:** This section carries significant weight (30%) because it measures the candidate's own understanding and communication skills. AI tool usage is discouraged for written answers.

### Question 1: Bug Analysis (15 points)

*Candidate must analyze TWO bugs. Points are split across both bugs.*

| Criterion | Points | Description |
|-----------|--------|-------------|
| **Bug 1 Analysis** | | |
| Problem identification | 1.5 | Clearly explains what the bug was and its impact |
| Root cause analysis | 2 | Demonstrates understanding of why the bug occurred |
| Solution explanation | 2 | Explains the fix with technical accuracy |
| Verification method | 1.5 | Describes how they tested the fix works |
| **Bug 2 Analysis** | | |
| Problem identification | 1.5 | Clearly explains what the bug was and its impact |
| Root cause analysis | 2 | Demonstrates understanding of why the bug occurred |
| Solution explanation | 2 | Explains the fix with technical accuracy |
| Verification method | 1.5 | Describes how they tested the fix works |
| **Overall Quality** | 1 | Well-structured, appropriate length (150-200 words total) |

### Question 2: Feature Design (15 points)

| Criterion | Points | Description |
|-----------|--------|-------------|
| Architecture overview | 3 | Clear description of overall implementation approach |
| Backend design | 3 | Explains API design, data flow, and database queries |
| Frontend design | 3 | Explains component structure and state management |
| Design decisions | 3 | Justifies key technical choices made |
| Trade-offs & limitations | 2 | Discusses alternatives considered or known limitations |
| Communication clarity | 1 | Well-organized, easy to follow explanation |

### Written Question Criteria

**Full Points (90-100%):**
- Clear, well-structured response demonstrating genuine understanding
- Specific details about their own implementation
- Technical accuracy with appropriate terminology
- Appropriate length (150-200 words per question)

**Good Points (70-89%):**
- Solid response with minor gaps
- Shows understanding but may lack some specifics
- Generally accurate with minor issues

**Partial Points (50-69%):**
- Response addresses the question but is too brief or generic
- Missing key technical details
- Some inaccuracies or unclear explanations

**Minimal Points (below 50%):**
- Does not adequately address the question
- Major technical misunderstandings
- Appears to lack genuine understanding of the work done

---

## Bonus Points (10 points)

| Category | Max Points | Examples |
|----------|------------|----------|
| Code improvements | 4 | Refactoring, better patterns, type safety |
| Additional tests | 3 | Unit tests, integration tests |
| Extra bug findings | 2 | Finding and documenting unlisted issues |
| Documentation | 1 | Code comments, README improvements |

### Bonus Criteria

Points awarded for:
- Improvements beyond what was required
- High-quality additions
- Clear documentation of bonus work

---

## Grading Summary

| Section | Points | Weight |
|---------|--------|--------|
| Part A: Bug Fixes | 30 | 30% |
| Part B: Feature Implementation | 30 | 30% |
| Part C: Written Questions | 30 | 30% |
| Bonus | 10 | 10% |
| **Total** | **100** | **100%** |

---

## Grade Scale

| Score | Grade | Assessment |
|-------|-------|------------|
| 90-100 | A | Excellent - Strong hire recommendation |
| 80-89 | B | Good - Hire recommendation |
| 70-79 | C | Satisfactory - Consider for hire |
| 60-69 | D | Below average - Concerns about readiness |
| <60 | F | Unsatisfactory - Not recommended |

---

## Additional Notes for Graders

1. **Commit History:** Review commit messages and frequency
2. **Code Quality:** Assess readability and maintainability
3. **Testing:** Note if candidate tested their own changes
4. **Communication:** Evaluate written question clarity
5. **Attention to Detail:** Check for typos, unused code, etc.

**Red Flags:**
- Copy-pasted code without understanding
- Fixes that break other functionality
- Security fixes that aren't complete
- Plagiarized written responses

**AI-Generated Written Answers:**
- Written responses should demonstrate personal understanding
- Watch for overly generic or templated answers
- Responses that lack specific details about *their* implementation may indicate over-reliance on AI
- Candidates were instructed to minimize AI usage for written questions
