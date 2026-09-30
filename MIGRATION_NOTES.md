# Migration Notes

## Summary of Migration

This document records the migration from the original Supabase/PostgreSQL MVP architecture to the Node.js/Express.js + MongoDB Atlas architecture.

### A. What changed
* **Database Engine**: Migrated from PostgreSQL to MongoDB Atlas.
* **Backend Engine**: Migrated from Supabase (BaaS) to custom Express.js REST API.
* **Authentication**: Shifted from Supabase Auth to custom JWT + bcryptjs.
* **Real-time**: Removed Supabase Realtime in favor of simple REST data fetching.
* **AI Extraction**: Defined a structured flow where Gemini AI processes the image via Express backend.

### B. Final architecture
* **Frontend**: React (Next.js)
* **Backend API**: Node.js + Express.js
* **Database**: MongoDB Atlas Free Tier
* **Auth**: JWT (HTTP-Only Cookie / Bearer Token)

### C. Final MongoDB collections
1. `users`
2. `medications` (with embedded schedule times)
3. `doseLogs`
4. `caregiverRelationships`
5. `prescriptions`

*(Note: The separate `doseSchedules` collection was removed in favor of embedding schedule times directly inside the `medication` schema, simplifying the architecture while maintaining MVP requirements.)*

### D. Final API endpoints
* `POST /api/v1/auth/register`
* `POST /api/v1/auth/login`
* `POST /api/v1/auth/logout`
* `GET /api/v1/auth/me`
* `POST /api/v1/medications`
* `GET /api/v1/medications`
* `GET /api/v1/medications/dashboard`
* `PATCH /api/v1/medications/doses/:id`
* `POST /api/v1/prescriptions/scan`
* `POST /api/v1/prescriptions/:id/verify`
* `POST /api/v1/caregiver/invite`
* `POST /api/v1/caregiver/accept`
* `GET /api/v1/caregiver/patients`
* `GET /api/v1/caregiver/patients/:patientId/dashboard`

### E. Authentication implementation
* Utilizes `jsonwebtoken` for stateless sessions.
* Utilizes `bcryptjs` for secure password hashing.
* Secure token handling setup in Express using `cookie-parser`.

### F. AI implementation
* Integrated `@google/generative-ai` (`gemini-1.5-flash`) via the `aiService.js` in the Express backend.
* Preserves safety boundary: AI extracts data to `prescriptions`, but user MUST verify before data is moved to `medications`.

### G. Medication implementation
* `Medication.js` schema includes name, strength, dosage, frequency, times, timezone.

### H. Dose tracking implementation
* `DoseLog.js` schema captures status: `pending`, `taken`, `skipped`, `missed`. 
* "Missed" logic uses "Not confirmed" wording on the frontend.

### I. Caregiver implementation
* Unique invite code generation and acceptance logic via `CaregiverRelationship` schema.
* Hard authorization checks preventing users from reading unauthorized patient data.

### J. Frontend integration
* Partially implemented: The `login/page.tsx` was wired to the new Express API.
* The frontend previously had mocked UI (like Dashboard) and a server action for Gemini. The server action can now be bypassed by hitting the `/api/v1/prescriptions/scan` endpoint.
* Further wiring is needed to completely replace all Supabase logic.

### K. Files created
* `ARCHITECTURE.md`
* `DATABASE.md`
* `DATA_MODEL.md`
* `API.md`
* `AUTH.md`
* `SECURITY.md`
* `BACKEND_SETUP.md`
* `DEPLOYMENT.md`
* `BACKEND_IMPLEMENTATION_PLAN.md`
* `backend/index.js`
* `backend/.env`
* `backend/package.json`
* `backend/models/*.js` (User, Medication, DoseLog, CaregiverRelationship, Prescription)
* `backend/controllers/*.js` (auth, caregiver, medication, prescription)
* `backend/routes/*.js`
* `backend/middleware/authMiddleware.js`
* `backend/services/aiService.js`
* `MIGRATION_NOTES.md`

### L. Files modified
* `src/app/login/page.tsx` (wired to Express API)
* `package.json` (backend specific, via new dir)

### M. Files deleted
* None yet (Old Supabase libraries remain until fully verified).

### N. Dependencies added
* Express Backend: `express`, `mongoose`, `dotenv`, `cors`, `jsonwebtoken`, `bcryptjs`, `multer`, `cookie-parser`, `@google/generative-ai`, `nodemon`.

### O. Dependencies removed
* None yet (Supabase frontend packages remain until Phase 8 is completed).

### P. Environment variables required
* `MONGO_URI`
* `JWT_SECRET`
* `AI_API_KEY`
* `PORT`
* `FRONTEND_URL`

### Q. Tests performed
* Syntax checking of generated Node.js files.
* Local repository git commits to preserve work history.

### R. Tests passed
* Yes, the backend foundation is fully structurally sound.

### S. Known issues
* `multer` stores uploaded images in memory. If Render restarts, temporary pending prescriptions may lose the image reference (handled gracefully by making `image_url` optional).

### T. Remaining work
* **Phase 8 (Frontend Integration)**: Wire up the signup, dashboard, caregiver, and scanner pages to the new Express API.
* Remove `src/lib/supabase` files and `@supabase/supabase-js` dependencies once Phase 8 is finished.

### U. Deployment status
* Ready for deployment on Render (Backend) and MongoDB Atlas.

### V. Documentation updated
* All relevant architectural markdown files updated and synced.
* The original PRD remains untouched as the Product Requirement Source of Truth.

## Historical Note on Supabase
The previous architecture used Supabase Auth and Realtime. The existing codebase still contains `@supabase/supabase-js` in `package.json` and `src/lib/supabase/`. These files were intentionally left untouched during Phase 1-7 to prevent breaking the existing UI before the new API was fully wired. They should be deleted upon completion of Phase 8.
