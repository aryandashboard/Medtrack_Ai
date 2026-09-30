# REST API Documentation

This document outlines the REST API endpoints provided by the Express.js backend.

## Base URL
`/api/v1`

## Authentication Requirements
All endpoints except `/auth/register` and `/auth/login` require a valid JWT token in the `Authorization` header.

```text
Authorization: Bearer <your_jwt_token>
```

---

## 1. Authentication Endpoints

### POST `/auth/register`
* **Purpose**: Register a new user.
* **Request Body**:
  ```json
  {
    "name": "Rajveer",
    "email": "rajveer@example.com",
    "password": "securepassword",
    "role": "patient"
  }
  ```
* **Response (201)**:
  ```json
  {
    "token": "jwt_token_string",
    "user": { "id": "...", "name": "Rajveer", "role": "patient" }
  }
  ```

### POST `/auth/login`
* **Purpose**: Authenticate an existing user.
* **Request Body**:
  ```json
  {
    "email": "rajveer@example.com",
    "password": "securepassword"
  }
  ```
* **Response (200)**: Token and user object.

---

## 2. Medications & Dashboard

### GET `/medications/dashboard`
* **Purpose**: Fetch today's dose logs, adherence stats, and active medications.
* **Response (200)**:
  ```json
  {
    "todayDoses": [...],
    "adherencePercentage": 92,
    "activeMedications": [...]
  }
  ```

### POST `/medications`
* **Purpose**: Manually add a new medication.
* **Request Body**:
  ```json
  {
    "name": "Amoxicillin",
    "dosage": "500 mg",
    "frequency": "3 times daily"
  }
  ```

### PATCH `/doses/:id`
* **Purpose**: Mark a dose as taken, skipped, or missed.
* **Request Body**:
  ```json
  {
    "status": "taken"
  }
  ```

---

## 3. AI Prescription Workflow

### POST `/prescriptions/scan`
* **Purpose**: Upload an image for AI extraction.
* **Request Body**: `multipart/form-data` (image file)
* **Response (200)**:
  ```json
  {
    "prescriptionId": "...",
    "ai_extracted_data": {
       "medications": [...]
    }
  }
  ```

### POST `/prescriptions/:id/verify`
* **Purpose**: Confirm the AI extraction is correct. This generates the actual `Medication` and `DoseSchedule` documents.
* **Request Body**:
  ```json
  {
    "verifiedMedications": [
      {
        "name": "Amoxicillin",
        "dosage": "500mg"
      }
    ]
  }
  ```

---

## 4. Caregiver Endpoints

### POST `/caregiver/invite`
* **Purpose**: Generate an invite code for a caregiver. (Called by Patient)
* **Response (201)**: `{ "inviteCode": "MT-83K29" }`

### POST `/caregiver/accept`
* **Purpose**: Accept an invite using a code. (Called by Caregiver)
* **Request Body**: `{ "inviteCode": "MT-83K29" }`

### GET `/caregiver/patients`
* **Purpose**: Fetch a list of patients the caregiver is monitoring.

### GET `/caregiver/patients/:patientId/dashboard`
* **Purpose**: Fetch the dashboard data for a specific patient.
* **Authorization Rule**: Backend verifies that a valid `CaregiverRelationship` exists between the requesting user and the `patientId`.

---

## Standard Error Responses

* **401 Unauthorized**: Missing or invalid JWT.
* **403 Forbidden**: Trying to access another user's data without a valid caregiver relationship.
* **404 Not Found**: Resource doesn't exist.
* **400 Bad Request**: Invalid input (e.g., missing required fields).
