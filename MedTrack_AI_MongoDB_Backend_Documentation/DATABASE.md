# MedTrack AI — MongoDB Database Design

**Database:** MongoDB Atlas Free  
**ODM:** Mongoose

This is a document-oriented redesign, not a one-to-one conversion of SQL tables.

## 1. Collections

MVP collections:

1. `users`
2. `prescriptions`
3. `medications`
4. `doseLogs`
5. `caregiverRelationships`

There is intentionally **no separate `doseSchedules` collection**. The schedule definition is embedded in each medication because it belongs tightly to that medication and is normally read with it.

Actual dose occurrences are separate because they grow over time and need independent querying.

## 2. users

Stores authentication identity and basic profile information.

```json
{
  "_id": "ObjectId",
  "name": "Rajveer",
  "email": "rajveer@example.com",
  "passwordHash": "<bcrypt hash>",
  "role": "patient",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Required:
- `name`
- `email`
- `passwordHash`
- `role`

Role values:
- `patient`
- `caregiver`

A user's actual access is determined by ownership and caregiver relationships, not by role alone.

Indexes:
- unique `{ email: 1 }`

## 3. prescriptions

Stores the prescription record and AI extraction lifecycle.

```json
{
  "_id": "ObjectId",
  "patientId": "ObjectId",
  "imageFileId": "ObjectId",
  "source": "upload",
  "status": "verified",
  "aiExtraction": {
    "model": "gemini",
    "extractedAt": "Date",
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
  },
  "verifiedAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Status:
- `uploaded`
- `extracting`
- `extracted`
- `verified`
- `rejected`

`extracted` is provisional and cannot activate medication.

Indexes:
- `{ patientId: 1, createdAt: -1 }`
- `{ patientId: 1, status: 1 }`

## 4. medications

Stores confirmed medication information and its schedule definition.

```json
{
  "_id": "ObjectId",
  "patientId": "ObjectId",
  "prescriptionId": "ObjectId",
  "name": "Amoxicillin",
  "strength": "500 mg",
  "dosage": "1 capsule",
  "instructions": "After food",
  "schedule": {
    "frequency": "3 times daily",
    "times": ["08:00", "14:00", "20:00"],
    "startDate": "2026-09-30",
    "endDate": "2026-10-04",
    "timezone": "Asia/Kolkata"
  },
  "active": true,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Why schedule is embedded

Embedding:
- keeps common reads simple,
- avoids a needless collection,
- keeps schedule changes close to the medication,
- fits MongoDB's document model.

Indexes:
- `{ patientId: 1, active: 1 }`
- `{ patientId: 1, createdAt: -1 }`
- `{ prescriptionId: 1 }`

## 5. doseLogs

Stores individual expected dose occurrences and outcomes.

```json
{
  "_id": "ObjectId",
  "patientId": "ObjectId",
  "medicationId": "ObjectId",
  "scheduledAt": "Date",
  "status": "taken",
  "takenAt": "Date",
  "actionedBy": "ObjectId",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Statuses:
- `upcoming`
- `due`
- `taken`
- `skipped`
- `missed`

`missed` means an expected dose expired without confirmation. UI copy should prefer “not confirmed” where appropriate.

Indexes:
- unique `{ medicationId: 1, scheduledAt: 1 }`
- `{ patientId: 1, scheduledAt: -1 }`
- `{ patientId: 1, status: 1, scheduledAt: -1 }`

The unique medication/time index prevents duplicate dose records for one scheduled occurrence.

## 6. caregiverRelationships

Stores explicit patient-to-caregiver authorization.

```json
{
  "_id": "ObjectId",
  "patientId": "ObjectId",
  "caregiverId": "ObjectId",
  "status": "accepted",
  "inviteCode": "MT-83K29",
  "createdAt": "Date",
  "acceptedAt": "Date",
  "updatedAt": "Date"
}
```

Statuses:
- `pending`
- `accepted`
- `revoked`

Only `accepted` grants caregiver access.

Indexes:
- unique `{ patientId: 1, caregiverId: 1 }`
- `{ caregiverId: 1, status: 1 }`
- `{ patientId: 1, status: 1 }`
- unique active invite code if invite codes are used

## 7. Logical Relationships

```text
User (patient)
  |
  +----< Prescription
  |
  +----< Medication
  |          |
  |          +----< DoseLog
  |
  +----< CaregiverRelationship >---- User (caregiver)
```

MongoDB references are ObjectIds.

## 8. Embedded vs Referenced

Embedded:
- Medication schedule
- AI-extracted medication candidates

Referenced:
- Prescription → patient
- Medication → patient
- Medication → prescription
- DoseLog → patient
- DoseLog → medication
- DoseLog → actionedBy
- CaregiverRelationship → patient
- CaregiverRelationship → caregiver

## 9. Validation

Mongoose schemas should enforce:
- required fields,
- enum values,
- email format,
- reasonable string lengths,
- valid ObjectIds,
- valid dates,
- schedule time format,
- end date >= start date,
- non-empty medication name.

Business validation must additionally enforce ownership and authorization.

## 10. Adherence

```text
Adherence % =
Taken expected doses / Expected doses × 100
```

The result is a tracking metric, not a medical judgment.

## 11. Why Dose Logs Are Separate

Dose logs can grow continuously. Embedding all history into medication documents would make documents larger and historical queries harder.

Therefore:
- schedule definition = embedded,
- actual dose occurrences = separate collection.

## 12. Atlas Free

Atlas Free is suitable for a college/hackathon MVP, not a production-scale healthcare workload.

Avoid uncontrolled file growth, unnecessary data, and excessive indexes. Monitor storage and usage.

## 13. Privacy

The database is private and accessed only by the backend.

Never expose:
- MongoDB URI
- database credentials
- Gemini API key
to React.
