# System Architecture

## Overview

MedTrack AI is an AI-powered medicine adherence platform designed as a simple, secure, and free MVP. The architecture follows a modern **MERN-like stack** (using only standard REST APIs instead of real-time websockets for simplicity). 

The system enables patients to manage their medications, use AI to extract prescription details, track doses, and share adherence data with caregivers.

---

## 1. Complete System Architecture

The architecture relies on a clear separation of concerns between the frontend (React), backend (Node.js/Express.js), and database (MongoDB).

```text
       [ React Frontend ]
               │
               │ HTTPS (REST API & JWT)
               │
       [ Express.js Backend ]
               │
               │ Mongoose (TCP)
               │
       [ MongoDB Atlas (Free Tier) ]
```

### Components

1. **Frontend**: React-based Single Page Application (SPA). Handles UI, local state, AI photo upload, and user interactions.
2. **Backend**: Node.js + Express.js API. Provides endpoints for authentication, medication management, and AI processing integration.
3. **Database**: MongoDB Atlas. A NoSQL document database storing users, medications, dose logs, and prescriptions.

---

## 2. Request/Response Flow

For standard operations (e.g., fetching a dashboard or creating a medication):

1. **Client** makes an HTTP request with a JWT in the `Authorization` header.
2. **Express Router** receives the request.
3. **Auth Middleware** verifies the JWT and extracts the `userId`.
4. **Controller** processes the request and calls the appropriate Mongoose model.
5. **MongoDB** executes the query and returns the document(s).
6. **Controller** formats the response as JSON and sends it back to the client.

---

## 3. Authentication Flow

Authentication is state-less using JSON Web Tokens (JWT).

1. **Registration**: User submits email/password. Backend hashes the password using `bcryptjs` and saves to MongoDB.
2. **Login**: User submits email/password. Backend verifies hash, generates a JWT signed with a secret key, and returns it.
3. **Protected Routes**: Frontend attaches the JWT as `Bearer <token>`. Backend verifies it on every protected request.

---

## 4. Data Flow

Data follows standard CRUD operations mapped to REST endpoints. 

* **Read**: Frontend polls or refreshes data to reflect changes (e.g., patient clicking "Taken"). Real-time WebSockets (like Supabase Realtime) are intentionally omitted for the MVP to maintain simplicity and zero cost.
* **Write**: Updates to dose statuses or new medications instantly update the MongoDB database via Express controllers.

---

## 5. AI Prescription Flow

1. **Upload**: User uploads an image via the frontend.
2. **API Request**: Frontend sends the image to the backend `/api/prescriptions/upload`.
3. **Processing**: Backend forwards the image to a Vision AI API (e.g., OpenAI/Gemini) and receives structured JSON.
4. **Storage**: Backend saves the raw AI extraction result to MongoDB with a status of `pending_verification`.
5. **Verification**: Frontend presents the data to the user. User corrects and confirms.
6. **Activation**: Backend updates the status to `verified` and generates the corresponding `Medication` and `DoseSchedule` documents.

---

## 6. Caregiver Flow

1. **Invite**: Patient generates a unique invite code.
2. **Link**: Caregiver enters the code in their dashboard.
3. **Association**: Backend creates a `CaregiverRelationship` document linking `patientId` and `caregiverId`.
4. **Monitoring**: Caregiver dashboard fetches data from endpoints (e.g., `/api/caregiver/patients/:id/doses`), authorized by checking the active relationship in the database.

---

## 7. Deployment Architecture

The application is deployed using free-tier services.

```text
[ Client Browsers ]
       │
[ React Frontend Host (e.g., Vercel / Render) ]
       │
[ Render (Free Tier - Web Service) ]  <-- Node.js / Express
       │
[ MongoDB Atlas (Free Cluster) ]
```

---

## 8. Security Boundaries

* **Frontend**: Never holds database credentials or API keys for the database.
* **Backend**: Acts as the gatekeeper. Validates all inputs. Enforces authorization (checking if `userId` owns the requested resource).
* **Database**: Accessible only by the backend IP (or Render IPs) using connection string credentials.

---

## 9. Major Changes from Original PRD

1. **Database**: Shifted from PostgreSQL (Supabase) to MongoDB Atlas.
2. **Backend Engine**: Shifted from Supabase BaaS to a custom Express.js REST API.
3. **Real-time Updates**: Removed Supabase Realtime. Dashboard updates rely on standard API fetching/refreshing to keep the architecture simple.
4. **Auth**: Replaced Supabase Auth with custom JWT + bcrypt authentication.
