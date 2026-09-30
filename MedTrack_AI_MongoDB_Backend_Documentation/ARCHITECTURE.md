# MedTrack AI — System Architecture

**Status:** MVP architecture baseline  
**Source of truth:** Existing MedTrack AI PRD, with the backend intentionally redesigned from Supabase/PostgreSQL to MongoDB.

## 1. Architecture Goal

MedTrack AI is a small college/hackathon MVP. The architecture prioritizes simplicity, free-tier deployment, understandable code, MVP security, and minimal infrastructure.

### Final MVP architecture

```text
React / Next.js Frontend
        |
        | HTTPS REST/JSON
        v
Node.js + Express.js API
        |
        | Mongoose
        v
MongoDB Atlas Free
```

Gemini AI is called from the backend, never directly from the browser with a secret API key.

```text
Prescription Image
        |
        v
Express API
        |
        v
Gemini Vision
        |
        v
Structured AI Extraction
        |
        v
User Verification
        |
        v
Confirmed Medication
        |
        v
Embedded Medication Schedule
        |
        v
Dose Logs
```

## 2. Components

### Frontend

The existing React/Next.js frontend remains the product UI.

Responsibilities:
- Authentication UI
- Patient dashboard
- Medication forms
- Prescription scanner/upload UI
- AI verification UI
- Dose actions
- Adherence charts
- Caregiver dashboard
- API communication

The frontend does **not** connect directly to MongoDB.

### Backend

Node.js + Express.js provides:
- REST API
- Authentication
- Authorization
- Request validation
- Business logic
- Medication scheduling
- Dose state transitions
- Adherence calculation
- Caregiver access checks
- Gemini integration
- Prescription processing
- Database access through Mongoose

### Database

MongoDB Atlas Free stores:
- Users
- Prescriptions and AI extraction results
- Medications and embedded schedules
- Dose logs
- Caregiver relationships

### AI

Gemini is an application service behind Express. The backend uses a server-side `GEMINI_API_KEY`.

## 3. Why MongoDB Instead of the Original SQL Design?

The original PRD used Supabase/PostgreSQL concepts such as tables, foreign keys, RLS, Supabase Auth, Realtime, and Storage.

For this MVP, MongoDB is deliberately used because:
- Medication schedules naturally group with a medication.
- Prescription extraction is naturally represented as nested data.
- AI extraction can evolve without a rigid relational schema.
- Mongoose provides schema validation.
- Atlas Free provides a simple managed database.
- The project does not require complex relational reporting.

MongoDB is not being presented as universally better than SQL; it is the chosen fit for this small document-oriented MVP.

## 4. Request / Response Flow

```text
Browser
  |
  | HTTPS request + JWT
  v
Express Router
  |
  +--> Authentication middleware
  |
  +--> Validation
  |
  +--> Authorization
  |
  +--> Controller
  |
  +--> Service / business logic
  |
  +--> Mongoose Model
  |
  v
MongoDB Atlas
```

The API returns JSON.

## 5. Authentication Flow

```text
Register
  ↓
Validate input
  ↓
Hash password with bcrypt/bcryptjs
  ↓
Store user
  ↓
Login
  ↓
Verify password
  ↓
Issue JWT
  ↓
Frontend sends Bearer token
  ↓
Express JWT middleware
```

JWT contains only minimal identity information such as `sub`, `role`, `iat`, and `exp`.

## 6. AI Prescription Flow

The PRD safety rule remains unchanged:

```text
Upload Prescription
        ↓
AI extraction
        ↓
Structured data
        ↓
Validation
        ↓
User verification
        ↓
Confirmed medication
        ↓
Schedule creation
```

The backend must reject attempts to activate medication from an unverified AI extraction.

## 7. Medication and Dose Flow

A medication contains its reusable schedule definition:

```text
Medication
  ├── frequency
  ├── times[]
  ├── startDate
  ├── endDate
  └── timezone
```

Actual dose occurrences are separate `doseLogs` documents.

```text
Medication schedule
        ↓
Expected dose occurrences
        ↓
DoseLog
        ├── upcoming
        ├── due
        ├── taken
        ├── skipped
        └── missed
```

## 8. Caregiver Flow

```text
Patient
  ↓
Create/invite caregiver relationship
  ↓
Caregiver accepts
  ↓
Relationship = accepted
  ↓
Caregiver requests patient data
  ↓
Backend verifies relationship
  ↓
Authorized data returned
```

The MVP uses REST fetching/refreshing instead of mandatory realtime infrastructure.

### Future realtime option

Socket.IO/WebSockets may be considered later if realtime becomes important. It is **not** a mandatory MVP dependency.

## 9. Prescription Image Storage

The PRD requires private prescription storage. Because the selected architecture avoids another storage provider, the preferred MongoDB-native option is **GridFS**.

- Store prescription files privately through GridFS.
- Store the GridFS file ID in the prescription document.
- Serve files through authenticated Express endpoints.
- Never expose public prescription URLs.

If historical image retrieval is not needed for the hackathon demo, image retention can be minimized and only structured extraction retained. This should be a deliberate product decision.

## 10. Security Boundaries

```text
Public Internet
      |
    HTTPS
      |
Express API
 /     |      \
Auth  Business  Gemini
 |       |        |
JWT   Mongoose   AI API
          |
          v
     MongoDB Atlas
```

Rules:
- React never receives MongoDB credentials.
- React never connects directly to MongoDB.
- Gemini secret is server-side only.
- Passwords are never stored plaintext.
- JWT is validated on protected routes.
- Patient resources are scoped to the authenticated user.
- Caregiver access requires an accepted relationship.
- Request bodies are validated.
- Production CORS is restricted.
- HTTPS is required in production.
- Rate limiting is applied to authentication and AI-heavy endpoints.

## 11. Deployment

```text
User Browser
     |
     | HTTPS
     v
Existing Frontend Hosting
     |
     | HTTPS REST API
     v
Render Free
Node.js + Express
     |
     | TLS
     v
MongoDB Atlas Free

Express
     |
     | HTTPS
     v
Gemini API
```

## 12. Error Boundaries

- `400` malformed/invalid request
- `401` missing/invalid authentication
- `403` authenticated but unauthorized
- `404` resource not found
- `409` conflict
- `422` validation failure where useful
- `429` rate limited
- `500` unexpected server error

Never return stack traces, MongoDB credentials, JWT secrets, or Gemini keys.

## 13. Deliberately Excluded

The MVP does not use:
- PostgreSQL
- Supabase
- Prisma
- MySQL
- SQL Server
- Firebase
- GraphQL
- Microservices
- Kubernetes
- Kafka
- Redis
- Docker unless later proven necessary

The backend is one Express application with clear modules.

## 14. Suggested Backend Structure

```text
backend/
├── src/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── validators/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── package.json
└── .env.example
```
