# MedTrack AI — REST API Contract

**Local base:** `http://localhost:5000/api`  
**Production base:** `https://<render-service>/api`

Authenticated requests use:

```http
Authorization: Bearer <JWT>
```

## 1. Response Format

Success:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request"
  }
}
```

## 2. Authentication

### POST `/auth/register`

Request:

```json
{
  "name": "Rajveer",
  "email": "rajveer@example.com",
  "password": "strong-password"
}
```

Creates a user and returns a JWT.

### POST `/auth/login`

Request:

```json
{
  "email": "rajveer@example.com",
  "password": "strong-password"
}
```

Verifies bcrypt hash and returns JWT.

### POST `/auth/logout`

Protected.

For stateless JWT MVP auth, logout removes the token on the client. No blacklist is required initially.

### GET `/auth/me`

Protected. Returns the authenticated user.

## 3. Dashboard

### GET `/dashboard`

Protected.

Returns:
- today's dose logs,
- next dose,
- adherence summary,
- missed/not-confirmed doses,
- active medications,
- recent prescription information.

Data must come from MongoDB, not hardcoded mock data.

## 4. Medications

### GET `/medications`

Protected. Returns medications owned by the patient.

Optional:
```text
?active=true
```

### POST `/medications`

Protected.

```json
{
  "name": "Vitamin D",
  "strength": "1000 IU",
  "dosage": "1 tablet",
  "frequency": "once daily",
  "times": ["08:00"],
  "startDate": "2026-09-30",
  "endDate": "2026-10-30",
  "instructions": "After food"
}
```

### GET `/medications/:id`

Protected. Owner or authorized caregiver only.

### PATCH `/medications/:id`

Protected. Owner only for modification.

### DELETE `/medications/:id`

Protected. Prefer deactivation/soft delete so historical dose records remain useful.

## 5. Dose Tracking

### GET `/doses/today`

Protected.

### GET `/doses/history?from=YYYY-MM-DD&to=YYYY-MM-DD`

Protected.

### POST `/doses/:id/taken`

Protected.

Sets:
- `status = taken`
- `takenAt`
- `actionedBy`

### POST `/doses/:id/skip`

Protected.

### POST `/doses/:id/snooze`

Protected.

Request:

```json
{
  "minutes": 10
}
```

Validate reasonable values.

### POST `/doses/generate`

Internal/service operation. Must not be an unrestricted public endpoint.

## 6. Adherence

### GET `/adherence?from=YYYY-MM-DD&to=YYYY-MM-DD`

Response:

```json
{
  "success": true,
  "data": {
    "expected": 30,
    "taken": 27,
    "skipped": 1,
    "missed": 2,
    "percentage": 90
  }
}
```

This is a tracking calculation, not clinical advice.

## 7. Prescriptions

### POST `/prescriptions/extract`

Protected multipart upload.

Backend:
1. validates image,
2. stores privately if retention is enabled,
3. sends image to Gemini,
4. validates structured output,
5. saves provisional extraction,
6. returns extraction for review.

It must not activate medication automatically.

### GET `/prescriptions`

Protected.

### GET `/prescriptions/:id`

Protected.

### POST `/prescriptions/:id/verify`

Protected.

Request:

```json
{
  "medications": [
    {
      "name": "Amoxicillin",
      "strength": "500 mg",
      "dosage": "1 capsule",
      "frequency": "3 times daily",
      "times": ["08:00", "14:00", "20:00"],
      "durationDays": 5,
      "instructions": "After food"
    }
  ]
}
```

Server verifies ownership, records verification, and creates confirmed medications.

### POST `/prescriptions/:id/reject`

Protected. Rejects extraction without activating medications.

## 8. Caregiver Relationships

### POST `/caregiver/invites`

Protected patient endpoint. Creates an invite.

### POST `/caregiver/accept`

Protected caregiver endpoint.

```json
{
  "inviteCode": "MT-83K29"
}
```

### GET `/caregiver/relationships`

Protected.

### DELETE `/caregiver/relationships/:id`

Protected. Revokes access.

## 9. Caregiver Patient Data

### GET `/caregiver/patients`

Protected.

### GET `/caregiver/patients/:patientId/dashboard`

Protected. Requires an accepted caregiver relationship.

### GET `/caregiver/patients/:patientId/doses`

Protected.

### GET `/caregiver/patients/:patientId/adherence`

Protected.

Caregivers are read-only for medication/dose state in the MVP.

## 10. Health

### GET `/health`

Public.

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

## 11. Authorization Matrix

| Resource | Patient owner | Authorized caregiver | Other |
|---|---:|---:|---:|
| Own profile | Read/update | No | No |
| Own medications | CRUD | Read | No |
| Own prescriptions | Read/create/verify | Read if allowed | No |
| Own doses | Read/action | Read | No |
| Own adherence | Read | Read | No |
| Relationship | Manage | Accept/revoke own | No |
| Other patient data | No | Accepted relationship only | No |

## 12. Errors

- `400` BAD_REQUEST
- `401` UNAUTHORIZED
- `403` FORBIDDEN
- `404` NOT_FOUND
- `409` CONFLICT
- `422` VALIDATION_ERROR
- `429` RATE_LIMITED
- `500` INTERNAL_ERROR

Never leak stack traces or secrets.
