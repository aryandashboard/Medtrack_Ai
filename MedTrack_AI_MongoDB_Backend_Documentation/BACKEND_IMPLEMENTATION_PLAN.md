# MedTrack AI — Backend Implementation Plan

## Objective

Build the smallest backend that fully supports the existing MVP without rebuilding the frontend.

Architecture:

```text
React / Next.js
      ↓
Express REST API
      ↓
Mongoose
      ↓
MongoDB Atlas
```

## Phase 0 — Freeze Architecture

Before coding:
- Remove Supabase from backend planning.
- Confirm MongoDB collections.
- Confirm JWT strategy.
- Confirm API contract.
- Confirm environment variables.
- Confirm frontend API base URL.

**Checkpoint:** Documentation is internally consistent.

## Phase 1 — Backend Foundation

Build:
- Express app
- environment configuration
- security middleware
- CORS
- global error handling
- `/api/health`
- Mongoose connection

Test:
- server starts,
- MongoDB connects,
- health endpoint responds.

## Phase 2 — Authentication

Build:
- User model
- registration
- login
- bcrypt/bcryptjs hashing
- JWT generation
- JWT middleware
- `/auth/me`

Test:
- register,
- duplicate email rejection,
- login,
- wrong password rejection,
- protected route rejection without token,
- valid token acceptance.

## Phase 3 — Medication Core

Build:
- Medication model
- embedded schedule
- create/list/read/update/deactivate
- ownership checks

Test:
- patient can manage own medications,
- another patient cannot access them,
- invalid schedules are rejected.

## Phase 4 — Dose Engine

Build:
- DoseLog model
- generation of expected doses
- due/upcoming logic
- taken
- skipped
- snooze
- missed/not-confirmed handling

Test:
- correct number of dose occurrences,
- no duplicate dose logs,
- correct state transitions,
- historical logs remain intact.

## Phase 5 — Adherence

Build:
- adherence calculation
- dashboard summary
- history queries

Formula:

```text
taken / expected × 100
```

Test:
- 100% case,
- partial adherence,
- zero expected doses,
- date ranges,
- timezone behavior.

## Phase 6 — Prescription + Gemini

Build:
- Prescription model
- upload validation
- Gemini extraction service
- structured output validation
- extraction persistence
- verification endpoint

Safety requirement:

```text
AI extraction ≠ active medication
```

Test:
- clear prescription,
- malformed AI output,
- missing fields,
- verification,
- rejected extraction,
- no medication creation before verification.

## Phase 7 — Verification → Medication

Build the transactional-ish application flow:

```text
Verified prescription
       ↓
Validate final user-edited fields
       ↓
Create confirmed medications
       ↓
Generate dose occurrences
```

MongoDB operations should be designed so partial failures do not leave confusing active records. Use MongoDB transactions only if the deployment configuration supports them reliably; otherwise implement idempotent operations and explicit recovery.

## Phase 8 — Caregiver System

Build:
- invite generation
- invite acceptance
- relationship storage
- revoke
- authorized patient list
- caregiver dashboard endpoints

Test:
- pending relationship cannot grant access,
- accepted relationship grants read access,
- revoked relationship immediately loses access,
- unrelated users cannot access patient data.

## Phase 9 — Prescription File Privacy

If historical prescription image storage is required:
- use private GridFS,
- authenticated retrieval,
- upload size/type validation.

If the hackathon does not need image retrieval after extraction, minimize retention instead.

## Phase 10 — Frontend Integration

Replace hardcoded/mock data with API data.

Integration order:
1. auth,
2. dashboard,
3. medications,
4. doses,
5. adherence,
6. prescription scanner,
7. verification,
8. caregiver dashboard.

## Phase 11 — Notifications

MVP:
- in-app reminder state,
- browser notifications if practical.

Do not block the backend on SMS, WhatsApp, email, or voice systems.

## Phase 12 — Testing

### Backend tests

- authentication
- authorization
- medication CRUD
- dose transitions
- adherence
- prescription verification
- caregiver authorization
- validation
- error handling

### Integration tests

Run:

```text
Register
→ Login
→ Add medication
→ Generate dose
→ Mark taken
→ Check adherence
```

Then:

```text
Patient
→ Invite caregiver
→ Caregiver accepts
→ Caregiver reads dashboard
```

And:

```text
Prescription
→ Gemini extraction
→ User verification
→ Medication creation
→ Dose generation
```

## Phase 13 — Deployment

Deploy backend to Render Free.

Connect:
- Render → MongoDB Atlas
- Frontend → Render API
- Render → Gemini

Run production smoke tests.

## Definition of Done

The backend is MVP-complete when:

- [ ] Auth works
- [ ] Patient ownership works
- [ ] Medication CRUD works
- [ ] Schedules work
- [ ] Dose logs work
- [ ] Taken/skip/snooze work
- [ ] Missed/not-confirmed behavior works
- [ ] Adherence works
- [ ] Gemini extraction works
- [ ] User verification is mandatory
- [ ] Caregiver authorization works
- [ ] Dashboard uses real data
- [ ] Errors are handled
- [ ] Secrets are protected
- [ ] Render deployment works
- [ ] MongoDB Atlas works
- [ ] Frontend integration works

## Explicit Non-Goals

Do not add:
- microservices,
- Redis,
- Kafka,
- GraphQL,
- Kubernetes,
- complex queues,
- clinical decision support,
- diagnosis,
- pharmacy,
- payments,
- EHR integration,
- hospital integration,
- unnecessary notification providers.
