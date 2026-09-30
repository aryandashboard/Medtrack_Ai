# Backend Implementation Plan

This document outlines the exact, step-by-step order for building the new Express/MongoDB backend for MedTrack AI. Following this sequence ensures that dependencies between features are handled correctly.

---

## Phase 1: Setup & Foundation

**Goal**: Get the server running and connected to the database.

1. **Initialize Project**: Create the `backend` folder, run `npm init`, and install core dependencies (`express`, `mongoose`, `dotenv`, `cors`).
2. **Setup Server**: Create `index.js`, configure middleware (JSON body parser, CORS), and set up a basic health-check endpoint (`GET /api/v1/health`).
3. **Database Connection**: Create an Atlas Free cluster, get the connection string, and implement the Mongoose connection logic in `index.js`.
4. **Testing Checkpoint**: Run the server (`npm run dev`) and verify it logs "MongoDB connected" and responds to the health check.

---

## Phase 2: Data Models (Mongoose)

**Goal**: Define the application schemas.

1. Create a `models/` directory.
2. Implement `User.js` (Patient/Caregiver).
3. Implement `Medication.js` (includes schedule fields).
4. Implement `DoseLog.js`.
5. Implement `CaregiverRelationship.js`.
6. Implement `Prescription.js`.

---

## Phase 3: Authentication & Authorization

**Goal**: Secure the API.

1. **Dependencies**: Install `jsonwebtoken` and `bcryptjs`.
2. **Auth Controllers**: Create `controllers/authController.js`.
   * Implement `register` (hash password, save User, return JWT).
   * Implement `login` (verify password, return JWT).
3. **Auth Routes**: Create `routes/authRoutes.js` and mount it to `/api/v1/auth`.
4. **Auth Middleware**: Create `middleware/authMiddleware.js` to extract and verify the JWT from the `Authorization` header.
5. **Testing Checkpoint**: Use Postman/Insomnia to register a user, login, and access a dummy protected route.

---

## Phase 4: Core Medication & Dashboard Features

**Goal**: Support the manual MVP workflow.

1. **Medication Endpoints**: Create `controllers/medicationController.js`.
   * `POST /medications` (Manual entry)
   * `GET /medications` (List active meds)
2. **Dashboard Endpoint**: Implement `GET /medications/dashboard`.
   * Query today's `DoseLogs` for the user.
   * Calculate adherence percentage.
3. **Dose Tracking**: 
   * `PATCH /doses/:id` (Update status to taken, skipped, missed).
4. **Testing Checkpoint**: Create a medication manually, fetch the dashboard, and mark a dose as taken.

---

## Phase 5: The AI Prescription Workflow

**Goal**: Integrate the hero feature.

1. **File Uploads**: Install and configure `multer` to handle image uploads in memory.
2. **AI Integration**: Create `services/aiService.js` to call the Vision API (OpenAI/Gemini).
3. **Upload Route**: Implement `POST /prescriptions/scan`.
   * Upload image -> send to AI -> save raw result to `Prescription` model -> return JSON to frontend.
4. **Verification Route**: Implement `POST /prescriptions/:id/verify`.
   * Receive verified data from frontend -> update `Prescription` status -> create `Medication` and `DoseSchedule` documents.
5. **Testing Checkpoint**: Upload a sample prescription image and verify the database is populated correctly after confirmation.

---

## Phase 6: Caregiver Features

**Goal**: Connect patients and caregivers.

1. **Invite Logic**: 
   * `POST /caregiver/invite` (Generate random code, save pending relationship).
   * `POST /caregiver/accept` (Find code, update relationship to active).
2. **Caregiver Dashboard**:
   * `GET /caregiver/patients` (List linked patients).
   * `GET /caregiver/patients/:id/dashboard` (Fetch patient data, applying authorization checks).
3. **Testing Checkpoint**: Create a second user, link them via invite code, and fetch the first user's dashboard data as the caregiver.

---

## Phase 7: Final Polish & Deployment

**Goal**: Ship the backend.

1. **Error Handling**: Add a global error handling middleware to catch unhandled async errors and format JSON error responses.
2. **CORS Update**: Ensure CORS is configured for the deployed frontend URL.
3. **Render Deployment**: Push to GitHub, connect to Render, and add environment variables.
4. **Frontend Integration**: Update all frontend fetch/axios calls to point to the new backend API. Remove Supabase client code from the frontend.
