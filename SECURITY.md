# Security Guidelines

Security is critical for MedTrack AI as it handles health-related schedules. This document outlines the security mechanisms implemented for the Express/MongoDB MVP.

---

## 1. MongoDB & Database Security

* **No Credentials in Frontend**: The React frontend must NEVER contain the MongoDB connection string.
* **Network Access**: MongoDB Atlas should be configured to only allow connections from specific IPs (e.g., the Render deployment IPs) or `0.0.0.0/0` only if strictly required for the hackathon MVP, secured by strong credentials.
* **Connection String**: Stored securely in backend `.env` variables (`MONGO_URI`).

---

## 2. Environment Variables

Sensitive keys must be stored in `.env` and never committed to GitHub.
* `MONGO_URI`
* `JWT_SECRET`
* `AI_API_KEY` (e.g., OpenAI/Gemini keys for OCR)

---

## 3. JWT and API Authorization

* **Verification**: The `verifyToken` middleware validates the JWT on every protected route.
* **Patient Data Isolation**: 
  When querying data (e.g., `GET /medications`), the backend MUST filter by the authenticated user's ID extracted from the token (`req.user.id`).
  ```javascript
  const medications = await Medication.find({ patient_id: req.user.id });
  ```
* **Caregiver Authorization**:
  When a caregiver requests a patient's data, the backend MUST verify an `active` relationship exists in the `caregiver_relationships` collection before returning data.

---

## 4. Password Security

* Passwords are NEVER stored in plain text.
* All passwords are hashed using `bcryptjs` with a reasonable salt round (e.g., 10).
* Passwords are omitted from all API responses (e.g., when returning the user object on login).

---

## 5. Input Validation

* **Express validation**: Request bodies should be validated (using libraries like `zod`, `joi`, or manual checks) before hitting the database to prevent NoSQL injection and malformed data.
* **Mongoose validation**: Schemas define types and required fields as a second layer of defense.

---

## 6. HTTPS

* The MVP backend deployed on Render will automatically use HTTPS. All communications between the React frontend and the Express backend must occur over HTTPS.

---

## 7. AI Boundary Constraints

* The AI is strictly an OCR/Extraction tool.
* It must not have direct write access to the database.
* It must not modify existing prescriptions.
* All AI outputs must be validated by the patient (Verification Status) before they are converted into active `medications` and `dose_schedules`.
