# MedTrack AI — Data Model

## Overview

The MongoDB model intentionally groups data according to access patterns and document ownership rather than copying the original relational table layout.

## Collections

```text
users
prescriptions
medications
doseLogs
caregiverRelationships
```

## 1. User

```text
User
├── _id
├── name
├── email
├── passwordHash
├── role
├── createdAt
└── updatedAt
```

Ownership:
- User owns their own patient data.
- Caregiver access is granted through relationships.

## 2. Prescription

```text
Prescription
├── _id
├── patientId ──────> User
├── imageFileId
├── source
├── status
├── aiExtraction
│   ├── model
│   ├── extractedAt
│   └── medications[]
├── verifiedAt
├── createdAt
└── updatedAt
```

The AI extraction is embedded because it is part of the prescription processing event.

## 3. Medication

```text
Medication
├── _id
├── patientId ──────> User
├── prescriptionId ─> Prescription
├── name
├── strength
├── dosage
├── instructions
├── schedule
│   ├── frequency
│   ├── times[]
│   ├── startDate
│   ├── endDate
│   └── timezone
├── active
├── createdAt
└── updatedAt
```

The schedule is embedded because it defines how this medication is expected to be taken.

## 4. DoseLog

```text
DoseLog
├── _id
├── patientId ────> User
├── medicationId -> Medication
├── scheduledAt
├── status
├── takenAt
├── actionedBy ───> User
├── createdAt
└── updatedAt
```

Dose logs are referenced because they grow over time.

## 5. CaregiverRelationship

```text
CaregiverRelationship
├── _id
├── patientId ────> User
├── caregiverId ──> User
├── status
├── inviteCode
├── createdAt
├── acceptedAt
└── updatedAt
```

## Lifecycle

### Prescription

```text
uploaded
  ↓
extracting
  ↓
extracted
  ↓
verified
```

or:

```text
extracted → rejected
```

### Dose

```text
upcoming → due → taken
                  ↘ skipped
                  ↘ missed
```

The UI should use “not confirmed” when communicating missed status to avoid claiming certainty about what happened outside the app.

### Caregiver relationship

```text
pending → accepted → revoked
```

## Ownership Rules

Every patient-owned document contains `patientId`.

This makes authorization explicit and testable.

## Key Design Principle

MongoDB should not be treated as “SQL tables with JSON.”

The important MongoDB choices are:

- embed tightly coupled schedule data,
- embed AI extraction inside its parent prescription,
- reference independently growing dose logs,
- use explicit ObjectId references for ownership,
- design indexes around actual queries.

## MVP Data Retention

Keep data minimal.

Avoid collecting information not required by the PRD.

Prescription image retention should be limited to what the hackathon workflow actually needs.
