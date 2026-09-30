# PRD — Medicine Adherence & Reminder Tracker

**Product Name:** MedTrack AI
**Tagline:** *Never miss a dose. Never lose track of care.*

**Product Type:** AI-powered medicine adherence and caregiver monitoring platform
**Primary Platform:** Responsive web app / PWA
**Core Technologies:** React/Next.js + Supabase + AI/OCR + Notifications

---

## 1. Product Overview

**MedTrack AI** is a medicine adherence platform that helps patients organize prescriptions, receive timely medication reminders, and allows trusted family members or caregivers to monitor adherence through a shared real-time dashboard.

The key differentiator is **AI Prescription Parsing**:

> User uploads/takes a photo of a prescription → AI extracts medicine names, dosage, frequency, duration, and timing → user verifies the information → schedule is automatically created.

The system then tracks whether doses are taken, missed, or skipped and updates the caregiver dashboard in real time using Supabase Realtime.

---

# 2. Problem Statement

Medication schedules can become difficult to manage when patients have:

* Multiple medicines
* Different dosage frequencies
* Different durations
* Complicated prescriptions
* Busy daily routines
* Elderly family members requiring assistance

Family members/caregivers may also have no easy way to know whether medication was actually taken.

### Current problems

**Patient**

* Forgets doses
* Confuses medicine timings
* Manually enters prescription information
* Doesn't know how many doses remain

**Caregiver**

* Doesn't know whether medicine was taken
* Has to repeatedly call/message the patient
* Cannot easily monitor multiple medicines

**Healthcare workflow**

* Prescription information is often available only as an image/PDF
* Manually converting prescriptions into schedules is time-consuming

---

# 3. Proposed Solution

MedTrack AI provides a single workflow:

```text
Prescription Photo
       ↓
   AI Extraction
       ↓
User Verification
       ↓
Automatic Schedule
       ↓
Smart Reminders
       ↓
Take / Skip / Snooze
       ↓
Adherence Tracking
       ↓
Real-time Caregiver Dashboard
```

---

# 4. Goals

### Primary Goals

1. Automatically convert prescription images into structured medicine schedules.
2. Help users remember medication timings.
3. Track medication adherence.
4. Allow patients to share their medication status with trusted caregivers.
5. Provide real-time updates between patient and caregiver.
6. Build a polished working MVP suitable for a hackathon demonstration.

### Success Metrics

For the hackathon MVP:

| Metric                             |                      Target |
| ---------------------------------- | --------------------------: |
| Prescription parsing accuracy      | ≥85% on clear prescriptions |
| Schedule creation time             |                 <60 seconds |
| Reminder interaction               |                 <10 seconds |
| Real-time dashboard update         |                Near-instant |
| Prescription → schedule conversion |                  <2 minutes |

---

# 5. Target Users

## A. Patient

Example:

> An elderly patient takes 4 medicines at different times every day.

They use MedTrack AI to upload their prescription and receive reminders.

---

## B. Family Member

Example:

> A son wants to know whether his elderly parent took their morning medicine.

The son receives access to the caregiver dashboard.

---

## C. Caregiver

Example:

> A caregiver manages medication adherence for multiple patients.

They can monitor assigned patients from one dashboard.

---

# 6. Core MVP Features

## Feature 1 — User Authentication

Users can create an account using:

* Email/password
* Optional Google login

### User roles

```text
Patient
   │
   ├── Caregiver
   └── Family Member
```

A user can potentially have both patient and caregiver relationships.

---

# 7. Feature 2 — Patient Dashboard

The dashboard should immediately show:

### Today's Overview

```text
Good Evening, Rajveer

Today's Medication
────────────────────────────

✓ 8:00 AM
   Vitamin D
   Taken

● 1:00 PM
   Paracetamol
   Due in 20 minutes

○ 8:00 PM
   Antibiotic
   Upcoming

────────────────────────────

Adherence
████████████░ 92%

3 / 3 doses today
```

### Dashboard cards

* Today's doses
* Next medicine
* Adherence percentage
* Missed doses
* Active prescriptions
* Medicine inventory

---

# 8. Feature 3 — AI Prescription Scanner

This should be the **hero feature of the hackathon demo**.

User clicks:

> **Scan Prescription**

Then:

```text
┌─────────────────────────┐
│                         │
│    Upload Prescription  │
│                         │
│     📷 Take Photo       │
│                         │
│     Upload Image        │
│                         │
└─────────────────────────┘
```

AI analyzes the prescription.

### AI extracts

* Medicine name
* Strength
* Dosage
* Frequency
* Timing
* Duration
* Instructions

Example:

```text
Prescription detected

1. Amoxicillin
   500 mg
   1 capsule
   3 times/day
   5 days
   After food

2. Pantoprazole
   40 mg
   1 tablet
   Once/day
   10 days
   Before breakfast
```

---

# 9. Important Safety Mechanism — AI Verification

The AI should **never directly activate an extracted prescription without user confirmation**.

After extraction:

```text
AI detected 2 medicines

┌────────────────────────────┐
│ Amoxicillin                │
│ 500 mg                     │
│ 3× daily                   │
│ 5 days                     │
│                            │
│ [ Edit ] [ ✓ Confirm ]     │
└────────────────────────────┘
```

User confirms the information.

### Why this matters

Prescription handwriting/OCR can be wrong.

Therefore:

> **AI assists with data entry; the patient/user confirms the final schedule.**

The app should also display a clear disclaimer that it does not diagnose conditions or replace medical advice.

---

# 10. Feature 4 — Manual Medicine Entry

Users should also be able to manually add medicines.

### Form

```text
Medicine Name
[______________]

Dosage
[______________]

Frequency
[ Once daily ▼ ]

Time
[ 8:00 AM ]

Duration
[ 7 days ]

Instructions
[ Before food ▼ ]

[ Save Medicine ]
```

---

# 11. Feature 5 — Smart Reminder System

The system generates reminders based on the schedule.

Example:

### 8:00 AM

> 💊 Time to take Amoxicillin 500 mg

Buttons:

```text
[ ✓ Taken ]

[ Snooze 10 min ]

[ Skip ]
```

---

# 12. Reminder Logic

Each medication creates scheduled dose events.

Example:

```text
Medicine:
Amoxicillin

Frequency:
3 times/day

Times:
08:00
14:00
20:00

Duration:
5 days
```

System creates:

```text
Dose #1 → 08:00
Dose #2 → 14:00
Dose #3 → 20:00
...
```

---

# 13. Feature 6 — Dose Tracking

Every scheduled dose can have one of four states:

```text
UPCOMING
    ↓
DUE
    ↓
TAKEN
    OR
SKIPPED
    OR
MISSED
```

### Status definitions

**Taken**

User explicitly confirms the dose.

**Skipped**

User intentionally chooses Skip.

**Missed**

The reminder expires without confirmation.

---

# 14. Feature 7 — Adherence Score

Calculate:

```text
Adherence % =
Taken doses / Expected doses × 100
```

Example:

```text
Expected doses = 30
Taken doses = 27

Adherence = 90%
```

Display:

```text
Your adherence

90%

27 / 30 doses taken
```

Avoid presenting the score as a medical judgment; it's simply a tracking metric.

---

# 15. Feature 8 — Caregiver Dashboard

This is the second major hackathon feature.

Patient can generate:

```text
Caregiver Invite Code

MT-83K29
```

or invite someone through an email/account connection.

Once connected:

### Caregiver sees

```text
Rajveer's Medication Status

Today
────────────────────

Morning       ✓ Taken
Afternoon     ✓ Taken
Evening       ⚠ Pending

Adherence
92%

Missed this week
1 dose
```

---

# 16. Supabase Realtime

This is where Supabase becomes important.

When patient clicks:

> **Taken**

Database updates:

```text
dose_status = "taken"
```

Supabase Realtime broadcasts the update.

Caregiver dashboard immediately changes:

```text
Afternoon Medicine
✓ Taken
```

without refreshing the page.

### Demo moment

This can be one of your strongest hackathon demonstrations:

**Laptop 1:** Patient clicks "Taken"

**Laptop 2:** Caregiver dashboard instantly changes.

---

# 17. Feature 9 — Missed Dose Alert

If a dose isn't marked as taken after a configurable period:

```text
Patient:
⚠ You haven't confirmed your 2:00 PM dose.

Caregiver:
⚠ Rajveer has not confirmed his 2:00 PM medication.
```

Important:

The system should say **"not confirmed"** rather than claiming the person definitely didn't take the medicine.

---

# 18. Feature 10 — Medication History

Patient can see:

```text
Medication History

September 27

08:00 AM
Amoxicillin
✓ Taken

02:00 PM
Amoxicillin
✓ Taken

08:00 PM
Amoxicillin
✕ Missed
```

Filters:

* Today
* This week
* This month
* Medicine

---

# 19. Feature 11 — Medication Timeline

Visual timeline:

```text
08:00 ── ✓ Amoxicillin

13:00 ── ✓ Pantoprazole

16:00 ── ● Vitamin D

20:00 ── ○ Amoxicillin
```

This makes the application much easier to understand during a demo.

---

# 20. AI Architecture

### Input

```text
Prescription Image
       ↓
Image preprocessing
       ↓
OCR / Vision AI
       ↓
Structured extraction
       ↓
Validation
       ↓
JSON
```

Example AI output:

```json
{
  "medications": [
    {
      "name": "Amoxicillin",
      "strength": "500 mg",
      "dosage": "1 capsule",
      "frequency": "3 times daily",
      "duration": "5 days",
      "instruction": "after food"
    }
  ]
}
```

The frontend converts this JSON into the medication schedule.

---

# 21. Suggested Technical Architecture

```text
                 ┌──────────────────┐
                 │   React / Next.js│
                 │     Frontend     │
                 └────────┬─────────┘
                          │
                 ┌────────▼─────────┐
                 │    Supabase      │
                 │                  │
                 │ Auth             │
                 │ PostgreSQL       │
                 │ Realtime         │
                 │ Storage          │
                 └────────┬─────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
       ┌──────▼──────┐        ┌──────▼──────┐
       │ AI Vision   │        │ Notification│
       │ / OCR       │        │ Service     │
       └─────────────┘        └─────────────┘
```

---

# 22. Recommended Database Schema

### `profiles`

```text
id
name
email
phone
role
created_at
```

### `medications`

```text
id
patient_id
name
strength
dosage
frequency
instructions
start_date
end_date
created_at
```

### `dose_schedules`

```text
id
medication_id
scheduled_time
frequency
```

### `dose_logs`

```text
id
medication_id
patient_id
scheduled_at
status
taken_at
```

Possible status:

```text
pending
taken
skipped
missed
```

### `caregiver_relationships`

```text
id
patient_id
caregiver_id
status
created_at
```

### `prescriptions`

```text
id
patient_id
image_url
ai_extracted_data
verified
created_at
```

---

# 23. Row Level Security

This is important because medication information is sensitive.

Basic rules:

### Patient

Can access:

```text
Own profile
Own prescriptions
Own medicines
Own dose logs
```

### Caregiver

Can access:

```text
Only patients who explicitly shared access
```

### Nobody

Should be able to access another patient's medication information without authorization.

---

# 24. Main User Flow

```text
              SIGN UP
                 ↓
          Select "Patient"
                 ↓
          Patient Dashboard
                 ↓
       ┌─────────┴──────────┐
       ↓                    ↓
 Scan Prescription      Add Manually
       ↓                    ↓
     AI OCR                 Form
       ↓                    ↓
       └─────────┬──────────┘
                 ↓
           Verify Details
                 ↓
          Create Schedule
                 ↓
          Set Reminders
                 ↓
         Take / Skip Dose
                 ↓
          Track Adherence
                 ↓
       Share With Caregiver
                 ↓
      Real-Time Dashboard
```

---

# 25. Caregiver Flow

```text
Caregiver Sign Up
       ↓
Enter Invite Code
       ↓
Patient Approves
       ↓
Caregiver Dashboard
       ↓
View Medication Status
       ↓
Real-time Updates
       ↓
Missed Dose Notification
```

---

# 26. UI Pages

For the hackathon, build approximately **7–9 screens**.

### 1. Landing Page

```text
MedTrack AI

Never miss a dose.
Never lose track of care.

[ Get Started ]

AI Prescription Scanner
Smart Reminders
Family Monitoring
```

### 2. Login / Signup

### 3. Patient Dashboard

### 4. Prescription Scanner

### 5. AI Verification Screen

### 6. Medicine Schedule

### 7. Medication History

### 8. Caregiver Dashboard

### 9. Settings / Sharing

---

# 27. Design Direction

Use a **clean healthcare SaaS aesthetic**.

### Recommended style

* White/light background
* Soft blue/teal accent
* Rounded cards
* Large readable typography
* Clear status indicators
* Minimal clutter
* Mobile-first responsive design

Avoid making it look like a hospital management system.

It should feel like:

> **Apple Health + modern SaaS dashboard + AI assistant**

---

# 28. Hackathon "Wow" Moment

Your demo should tell a story rather than simply clicking through screens.

### Demo scenario

**Step 1**

Upload a handwritten prescription.

### Step 2

AI says:

```text
3 medicines detected
```

### Step 3

Show extracted information.

```text
✓ Medicine
✓ Dosage
✓ Frequency
✓ Duration
```

### Step 4

Click:

> **Confirm & Create Schedule**

### Step 5

Dashboard automatically creates today's medication timeline.

### Step 6

Trigger reminder:

> 💊 It's time for your medicine.

Click:

> **Taken**

### Step 7

Switch to caregiver dashboard.

Immediately show:

> **Rajveer's afternoon dose — ✓ Taken**

### Step 8

Show adherence analytics.

```text
Weekly adherence

92%

Taken       27
Missed       2
Skipped      1
```

That gives judges a clear **AI + real-time + social impact** story.

---

# 29. AI Features — MVP vs Future

### Hackathon MVP

Build:

* Prescription image analysis
* Medicine extraction
* Dosage extraction
* Frequency extraction
* Duration extraction
* User verification

### Future

Potential additions:

* Natural-language medicine questions
* Drug interaction warnings
* Medicine refill predictions
* Voice reminders
* Regional-language prescription reading
* Voice assistant
* WhatsApp notifications
* Pharmacy integration
* Doctor portal
* Smart adherence insights

**Important:** Drug interaction and clinical recommendations should use medically validated data sources and professional review rather than relying solely on a general-purpose AI model.

---

# 30. Notifications

For MVP:

### In-app

```text
🔔 Medicine Reminder
Time to take Amoxicillin 500 mg.
```

### Future

* Push notifications
* Email
* SMS
* WhatsApp
* Voice call

For a hackathon, **in-app + browser notifications** are enough to demonstrate the concept.

---

# 31. Security & Privacy

Because the system handles health-related information, security should be a major part of the PRD.

Requirements:

* Authentication
* HTTPS
* Supabase Row Level Security
* Private prescription storage
* Authorized caregiver access
* No public prescription URLs
* Minimal data collection
* Ability to revoke caregiver access
* Audit-friendly dose history

### AI safety

The AI should:

> Extract and organize information.

It should **not**:

* Diagnose diseases
* Change prescribed dosages
* Recommend starting/stopping medication
* Override doctor instructions

---

# 32. Non-Goals for Hackathon

Do **not** attempt to build these in the first version:

❌ Doctor consultation
❌ Online pharmacy
❌ Payment system
❌ Full electronic health record
❌ Medical diagnosis
❌ Automatic medication changes
❌ Insurance integration
❌ Hospital integration
❌ Complex clinical decision support

They will consume development time without improving your core demo.

---

# 33. MVP Scope

### Must Have

| Feature                 | Priority |
| ----------------------- | -------- |
| Authentication          | P0       |
| Patient dashboard       | P0       |
| Add medicine            | P0       |
| AI prescription scanner | P0       |
| AI extraction           | P0       |
| Verification            | P0       |
| Medication schedule     | P0       |
| Take/Skip               | P0       |
| Adherence tracking      | P0       |
| Caregiver sharing       | P0       |
| Supabase Realtime       | P0       |

### Nice to Have

| Feature                   | Priority |
| ------------------------- | -------- |
| Push notifications        | P1       |
| Medication history charts | P1       |
| Dark mode                 | P2       |
| Voice reminders           | P2       |
| WhatsApp alerts           | P2       |
| Refill prediction         | P3       |

---

# 34. Suggested Tech Stack

### Frontend

**Next.js + TypeScript**

or

**React + Vite**

### UI

* Tailwind CSS
* shadcn/ui
* Lucide icons
* Recharts

### Backend

**Supabase**

* PostgreSQL
* Auth
* Realtime
* Storage
* Edge Functions

### AI

Use a vision-capable AI model for prescription extraction.

### Deployment

```text
Frontend → Vercel
Backend → Supabase
```

---

# 35. Team Division

If you have **4 people**:

### Person 1 — Frontend

* Landing page
* Dashboard
* Medicine UI
* Responsive design

### Person 2 — Backend

* Supabase
* Database
* Authentication
* RLS
* Realtime

### Person 3 — AI

* Prescription image processing
* OCR
* Structured JSON extraction
* Verification workflow

### Person 4 — Integration / Demo

* Notifications
* Caregiver dashboard
* Analytics
* Testing
* Deployment
* Presentation

---

# 36. Hackathon Pitch

### 30-second pitch

> **"Medication schedules shouldn't depend on memory. MedTrack AI turns a prescription photo into a verified medication schedule in seconds, reminds patients when it's time to take their medicine, and lets trusted family members monitor adherence in real time. With AI handling prescription extraction and Supabase Realtime connecting patients and caregivers, we're turning medication management from a daily guessing game into a simple, connected experience."**

---

# 37. One-Line Value Proposition

> **MedTrack AI converts prescriptions into smart medication schedules and connects patients with caregivers through real-time adherence tracking.**

---

# 38. Key Differentiator

Don't pitch it simply as:

> "A medicine reminder app."

There are already many reminder apps.

Pitch it as:

> **"An AI-powered prescription-to-adherence system with real-time caregiver connectivity."**

Your strongest combination is:

**AI Prescription Parsing + Smart Scheduling + Adherence Tracking + Supabase Realtime Caregiver Dashboard**

That gives you **four technologies/features working together in one clear user journey**, which is much stronger for a hackathon demo.
