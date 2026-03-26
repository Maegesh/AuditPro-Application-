# AuditPro — Frontend Manual Testing Document

**Project:** AuditPro — Enterprise Audit Management System
**Frontend:** React + TypeScript + Vite
**Prepared By:** QA / Developer
**Date:** 2025

---

## Test Environment Setup

| Item | Value |
|---|---|
| Frontend URL | http://localhost:5173 |
| Backend URL | https://localhost:7167 |
| Browser | Chrome / Edge (latest) |
| Prerequisites | Backend running, DB seeded with Admin/Auditor/Employee users |

---

## Test Status Legend

| Symbol | Meaning |
|---|---|
| ✅ | Pass |
| ❌ | Fail |
| ⚠️ | Partial / Bug |
| — | Not Tested |

---

---

# MODULE 1 — AUTHENTICATION

## TC-001 — Login Page UI
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Open http://localhost:5173 | Login page loads with left branded panel and right form | — |
| 2 | Check left panel | Shows AuditPro logo, tagline, feature list, stats bar | — |
| 3 | Check right panel | Shows email field, password field, Sign In button, role badges | — |
| 4 | Check responsiveness (resize to mobile) | Left panel hides, form takes full screen | — |

## TC-002 — Login Validations
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Click Sign In with empty fields | Shows "Please fill in all fields." error | — |
| 2 | Enter email only, click Sign In | Shows "Please fill in all fields." error | — |
| 3 | Enter wrong email/password, click Sign In | Shows "Invalid email or password." error in red box | — |
| 4 | Verify error shows as inline message (not alert/redirect) | Red error box appears below password field | — |

## TC-003 — Login Success & Role Routing
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Login with Admin credentials | Redirects to /admin dashboard | — |
| 2 | Login with Auditor credentials | Redirects to /auditor dashboard | — |
| 3 | Login with Employee credentials | Redirects to /employee dashboard | — |
| 4 | Check localStorage after login | token, role, name are stored | — |

## TC-004 — Password Field
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Click eye icon on password field | Password becomes visible | — |
| 2 | Click eye icon again | Password is hidden again | — |

## TC-005 — Protected Routes
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Access /admin without login | Redirects to login page | — |
| 2 | Access /auditor without login | Redirects to login page | — |
| 3 | Access /employee without login | Redirects to login page | — |
| 4 | Login as Employee, try accessing /admin | Redirects to login or shows unauthorized | — |

---

---

# MODULE 2 — ADMIN

## TC-006 — Admin Dashboard
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Login as Admin, land on /admin | Dashboard loads with stat cards | — |
| 2 | Check stat cards | Shows Total Users, Departments, Audits, Pending Approvals counts | — |
| 3 | Check Quick Actions section | Shows navigation cards for all admin features | — |
| 4 | Click a Quick Action card | Navigates to correct page | — |

## TC-007 — Sidebar Navigation (Admin)
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Check sidebar items | Dashboard, Audits, Users, Departments, Observations, Corrective Actions | — |
| 2 | Click each sidebar item | Navigates to correct page | — |
| 3 | Check active item highlight | Current page item is highlighted in blue | — |
| 4 | Check AuditPro logo in sidebar | Visible at top | — |
| 5 | Check Role label at bottom | Shows "Role: Admin" | — |

## TC-008 — Navbar (Admin)
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Check navbar title on each page | Title matches current page (e.g. "Audits", "Users") | — |
| 2 | Check user avatar | Shows first letter of logged-in user's name | — |
| 3 | Check user name and role | Shows name and "Admin" label | — |
| 4 | Click Logout button | Clears localStorage, redirects to login | — |

## TC-009 — Departments
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Navigate to /admin/departments | Departments page loads | — |
| 2 | Click Create Department | Modal opens | — |
| 3 | Submit empty form | Shows "Department name is required" error | — |
| 4 | Enter department name, submit | Department created, appears in list | — |
| 5 | Check empty state | Shows empty state message when no departments | — |

## TC-010 — Users
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Navigate to /admin/users | Users list loads | — |
| 2 | Click Create User | Modal opens | — |
| 3 | Submit empty form | Shows validation error | — |
| 4 | Fill all fields, submit | User created, email sent to user, appears in list | — |
| 5 | Check role filter | Filters users by role correctly | — |
| 6 | Check search | Filters users by name | — |

## TC-011 — Audits (Admin)
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Navigate to /admin/audits | Audits page loads | — |
| 2 | Click Create Audit | Modal opens | — |
| 3 | Submit empty form | Shows "All fields are required" error | — |
| 4 | Select department | Auditor dropdown populates with auditors from that department | — |
| 5 | Select a past start date | Shows "Start date cannot be in the past" error | — |
| 6 | Set end date before start date | Shows "End date must be after start date" error | — |
| 7 | Fill all valid fields, submit | Audit created, appears in list with Scheduled status | — |
| 8 | Click View Details on a card | Popup modal opens showing full audit details | — |
| 9 | Check modal content | Shows Audit Name, Department, Auditor, Auditor Email, Created By, Dates | — |
| 10 | Close modal | Modal closes, card unchanged | — |
| 11 | Check status filter tabs | Filters audits by status correctly | — |
| 12 | Check search | Filters audits by name | — |
| 13 | Approve a PendingApproval audit | Status changes to Completed | — |

## TC-012 — Admin Observations (Read-only view)
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Navigate to /admin/observations | Page loads | — |
| 2 | Select an audit from dropdown | Observations for that audit load | — |
| 3 | Check observation details | Shows title, description, severity, location, finding, risk, recommendation | — |
| 4 | Check proof document link | If uploaded, shows download link | — |

## TC-013 — Admin Corrective Actions (Read-only view)
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Navigate to /admin/corrective-actions | Page loads | — |
| 2 | Select an audit | Observations load | — |
| 3 | Expand an observation | Corrective actions for that observation show | — |
| 4 | Check action details | Shows description, root cause, expected outcome, assigned employee, status | — |

---

---

# MODULE 3 — AUDITOR

## TC-014 — Auditor Dashboard
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Login as Auditor | Auditor dashboard loads | — |
| 2 | Check stat cards | Shows total, scheduled, in progress, pending approval counts | — |
| 3 | Check Quick Actions | Shows My Audits, Add Observation, Submit Audit cards | — |

## TC-015 — Auditor Audits
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Navigate to /auditor/audits | Shows audits assigned to this auditor | — |
| 2 | Check corrective action summary on card | Shows X/Y actions resolved | — |
| 3 | Click Add Observation | Navigates to observations page with auditId pre-selected | — |
| 4 | Submit audit with no observations | Shows error "Cannot submit: no observations have been added" | — |
| 5 | Submit audit with unresolved actions | Shows error "Cannot submit: not all corrective actions are resolved" | — |
| 6 | Submit valid audit | Status changes to PendingApproval | — |
| 7 | Click Refresh button | Reloads audit list and action summaries | — |

## TC-016 — Observations
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Navigate to /auditor/observations | Page loads with audit selector | — |
| 2 | Without selecting audit, click Add Observation | Shows "Select an audit first" error | — |
| 3 | Select an audit | Observations for that audit load | — |
| 4 | Click Add Observation, submit empty form | Shows "All fields are required" error | — |
| 5 | Set due date in the past | Shows "Due date cannot be in the past" error | — |
| 6 | Set due date beyond audit end date | Shows "Due date cannot exceed audit end date" error | — |
| 7 | Fill all fields without proof file, submit | Observation created successfully | — |
| 8 | Fill all fields with PDF proof file, submit | Observation created with proof document | — |
| 9 | Check proof document link | Shows "Download Proof Document" link | — |
| 10 | Click proof document link | PDF downloads correctly | — |
| 11 | Check completed audit | Shows read-only banner, Add Observation button hidden | — |

## TC-017 — Corrective Actions
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Click Corrective Actions count on observation | Expands to show actions list | — |
| 2 | Click Assign Action | Modal opens | — |
| 3 | Submit empty form | Shows "All fields are required" error | — |
| 4 | Set due date in the past | Shows "Due date cannot be in the past" error | — |
| 5 | Fill all fields, submit | Action created, employee receives email notification | — |
| 6 | Check action appears in list | Shows description, assigned employee, status, due date | — |

---

---

# MODULE 4 — EMPLOYEE

## TC-018 — Employee Dashboard
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Login as Employee | Employee dashboard loads | — |
| 2 | Check stat cards | Shows Total Assigned, Open, In Progress, Resolved counts | — |
| 3 | Click Quick Action cards | Navigates to correct filtered actions page | — |

## TC-019 — Employee Actions
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Navigate to /employee/actions | Shows corrective actions assigned to this employee | — |
| 2 | Check action card details | Shows description, root cause, expected outcome, due date, status | — |
| 3 | Check Proof Document section | Shows download link if proof exists, or "No proof document attached" | — |
| 4 | Click Action Report button | Downloads corrective action PDF report | — |
| 5 | Click Action Report when unavailable | Shows toast error "Failed to generate action report" (not alert) | — |
| 6 | Click Update Status on a non-resolved action | Modal opens | — |
| 7 | Change status to In Progress, submit | Status updates on card | — |
| 8 | Change status to Resolved, submit | Status updates, auditor receives email notification | — |
| 9 | Check Resolved action | Update Status button is hidden | — |
| 10 | Check status filter from dashboard | Only actions with that status show | — |

## TC-020 — Toast Notifications (Employee)
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Trigger a failed action report download | Red toast appears bottom-right | — |
| 2 | Check toast auto-dismiss | Toast disappears after 3.5 seconds | — |
| 3 | Click X on toast | Toast dismisses immediately | — |

---

---

# MODULE 5 — SHARED

## TC-021 — Profile Page
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Navigate to profile (any role) | Profile page loads with current user details | — |
| 2 | Update name field, submit | Name updates successfully | — |
| 3 | Update password field, submit | Password updates successfully | — |
| 4 | Submit empty form | Shows validation error | — |

## TC-022 — Logout
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Click Logout from any role | Redirects to login page | — |
| 2 | Check localStorage after logout | token, role, name are cleared | — |
| 3 | Try accessing protected route after logout | Redirects to login | — |

---

---

# MODULE 6 — EMAIL NOTIFICATIONS

## TC-023 — Email Triggers
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Admin creates a new user | User receives welcome email with credentials | — |
| 2 | Auditor assigns corrective action to employee | Employee receives assignment email | — |
| 3 | Employee updates action status | Auditor receives status update email | — |
| 4 | Admin approves audit | Auditor receives approval notification email | — |

---

---

# MODULE 7 — NEGATIVE / EDGE CASES

## TC-024 — General Edge Cases
| # | Test Step | Expected Result | Status |
|---|---|---|---|
| 1 | Login and immediately go offline, perform action | Shows appropriate error message | — |
| 2 | Access page with no data | Empty state component shows with message | — |
| 3 | Create audit with no auditors in selected department | Auditor dropdown shows "No auditors in this department" | — |
| 4 | Upload non-PDF file as proof document | File input restricts to PDF only | — |
| 5 | Submit audit with observations but no corrective actions | Shows "no corrective actions" error | — |
| 6 | Submit audit with unresolved corrective actions | Shows specific observation name in error | — |

---

---

# TEST SUMMARY

| Module | Total TCs | Pass | Fail | Not Tested |
|---|---|---|---|---|
| Authentication | 5 | — | — | — |
| Admin | 8 | — | — | — |
| Auditor | 4 | — | — | — |
| Employee | 3 | — | — | — |
| Shared | 2 | — | — | — |
| Email | 1 | — | — | — |
| Edge Cases | 1 | — | — | — |
| **Total** | **24** | — | — | — |

---

**Tested By:**
**Date:**
**Build / Version:**
**Overall Result:** Pass / Fail
