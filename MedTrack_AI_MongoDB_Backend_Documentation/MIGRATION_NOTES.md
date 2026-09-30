# MedTrack AI — Architecture Migration Notes

## Purpose

This document records the deliberate change from the original PRD's Supabase/PostgreSQL backend to the new MongoDB backend.

## 1. Original → New

| Original PRD | New Architecture |
|---|---|
| Supabase | Node.js + Express.js |
| PostgreSQL | MongoDB Atlas Free |
| Supabase Auth | JWT + bcrypt/bcryptjs |
| Supabase Realtime | REST refresh/polling for MVP |
| Supabase Storage | MongoDB GridFS if image retention is required |
| SQL-style tables | MongoDB collections/documents |
| Row Level Security | Express authorization + ownership checks |
| Supabase Edge Functions | Express services/controllers |

## 2. What Remains Unchanged

The product idea remains:

```text
Prescription
→ AI extraction
→ User verification
→ Medication schedule
→ Reminders
→ Dose tracking
→ Adherence
→ Caregiver monitoring
```

The following PRD requirements remain:
- authentication,
- patient dashboard,
- medicine management,
- AI prescription extraction,
- verification,
- scheduling,
- dose tracking,
- adherence,
- caregiver sharing,
- history,
- security/privacy,
- AI safety boundaries.

## 3. Realtime Change

Original:

```text
Supabase Realtime
```

New MVP:

```text
REST API
+
frontend refresh/re-fetch
```

Future option:

```text
Socket.IO / WebSockets
```

Realtime is therefore removed as a mandatory infrastructure dependency.

## 4. Database Modeling Change

Original relational concepts such as:
- profiles,
- medications,
- dose_schedules,
- dose_logs,
- caregiver_relationships,
- prescriptions

are redesigned rather than mechanically converted.

MongoDB collections:
- users
- prescriptions
- medications
- doseLogs
- caregiverRelationships

The medication schedule is embedded inside medication.

## 5. Security Change

Original:

```text
Supabase RLS
```

New:

```text
JWT authentication
+
Express authorization middleware
+
patientId ownership checks
+
caregiver relationship checks
+
Mongoose validation
```

## 6. Explicitly Removed

Do not reintroduce:
- Supabase
- PostgreSQL
- Prisma
- SQL
- Firebase
- GraphQL
- Redis
- Kafka
- microservices

unless the architecture is intentionally revisited in a future decision.

## 7. Migration Success Criteria

The migration is complete when:
- all documentation uses MongoDB consistently,
- no backend document depends on Supabase,
- API contracts are REST-based,
- authentication is JWT-based,
- database models are Mongoose-based,
- frontend talks to Express instead of Supabase,
- caregiver access works through backend authorization,
- AI calls remain server-side,
- deployment is Render + MongoDB Atlas.
