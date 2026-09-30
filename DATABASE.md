# Database Design

## Overview

MedTrack AI uses **MongoDB Atlas (Free Tier)** as its database. The choice to move from PostgreSQL to MongoDB was made to favor document flexibility, simplify deployment, and maintain zero infrastructure costs. 

## Why MongoDB for this MVP?

1. **Schema Flexibility**: AI-extracted prescription data can be unpredictable. A document database easily stores nested JSON structures without requiring rigid SQL schemas or migrations.
2. **Rapid Development**: Mongoose allows us to define application-level schemas quickly, accelerating hackathon MVP development.
3. **No Setup Cost**: MongoDB Atlas Free provides enough storage and throughput for an MVP, with zero configuration required for scaling at this stage.

---

## Collections & Document Structures

### 1. `users`

Stores authentication and profile data for both patients and caregivers.

* **Important Fields**:
  * `email` (String, unique)
  * `password_hash` (String)
  * `role` (Enum: `patient`, `caregiver`)
  * `name` (String)
* **Indexes**: `{ email: 1 }` (Unique)

### 2. `medications`

Stores the core details of a medication prescribed to a patient.

* **Important Fields**:
  * `patient_id` (ObjectId, Ref: `users`)
  * `name`, `strength`, `dosage`, `frequency` (Strings)
  * `times` (Array of Strings, e.g., ["08:00", "14:00"])
  * `timezone` (String)
  * `start_date`, `end_date` (Dates)
* **Indexes**: `{ patient_id: 1 }`

### 3. `dose_logs`

Tracks individual medication events (taken, missed, skipped).

* **Important Fields**:
  * `medication_id` (ObjectId, Ref: `medications`)
  * `patient_id` (ObjectId, Ref: `users`)
  * `scheduled_at` (Date)
  * `status` (Enum: `pending`, `taken`, `skipped`, `missed`)
  * `taken_at` (Date, optional)
* **Indexes**: `{ patient_id: 1, scheduled_at: -1 }` (Optimizes timeline fetching)

### 4. `caregiver_relationships`

Maps patients to authorized caregivers.

* **Important Fields**:
  * `patient_id` (ObjectId, Ref: `users`)
  * `caregiver_id` (ObjectId, Ref: `users`)
  * `status` (Enum: `pending`, `active`)
  * `invite_code` (String, unique)
* **Indexes**: `{ patient_id: 1, caregiver_id: 1 }` (Unique compound index)

### 5. `prescriptions`

Stores uploaded prescriptions and the intermediate AI-extracted data.

* **Important Fields**:
  * `patient_id` (ObjectId, Ref: `users`)
  * `image_url` (String)
  * `ai_extracted_data` (Object/JSON - flexible structure)
  * `verification_status` (Enum: `pending`, `verified`, `rejected`)
* **Why this structure?** By storing the raw AI data natively as a JSON object, the frontend can easily parse and display it for the verification step before converting it into rigid `medications` and `dose_schedules` records.

---

## Relationships & References

Instead of SQL joins, MongoDB will use **references** (`ObjectId`) to link documents. 
For example, to fetch a user's dashboard, the backend will query `dose_logs` where `patient_id == current_user_id`, and `populate()` the `medication_id` to include the medicine name and dosage details.

## Validation Rules

Validation is handled at the application layer via **Mongoose Schemas**.
* **Required fields** (e.g., email, password_hash) will throw errors if omitted.
* **Enums** ensure statuses are strictly limited (e.g., status must be exactly 'pending', 'taken', 'skipped', or 'missed').
