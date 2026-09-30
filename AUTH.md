# Authentication Flow

Since we are no longer using Supabase, MedTrack AI implements custom JWT-based authentication using Express and MongoDB.

## Technologies Used
* **bcryptjs**: For securely hashing passwords before storing them in MongoDB.
* **jsonwebtoken (JWT)**: For generating stateless session tokens.

---

## 1. Registration Flow

1. User submits email, name, password, and role to `/api/v1/auth/register`.
2. Backend checks if the email already exists in the `users` collection.
3. Backend generates a salt and hashes the password using `bcryptjs`.
4. The user is saved to MongoDB (storing the hash, not the plain text password).
5. Backend signs a JWT containing the user's `_id` and `role`.
6. Token is returned to the frontend.

---

## 2. Login Flow

1. User submits email and password to `/api/v1/auth/login`.
2. Backend looks up the user by email.
3. Backend compares the provided password with the stored hash using `bcrypt.compare()`.
4. If valid, backend generates a new JWT and returns it.
5. If invalid, returns a `401 Unauthorized` response.

---

## 3. Session Handling

* **Token Storage**: The frontend should store the JWT securely (e.g., in `localStorage` or memory, depending on security vs persistence requirements for the MVP).
* **Protected Routes**: Every API request to protected routes must include the token in the headers:
  ```
  Authorization: Bearer <token>
  ```
* **Middleware**: Express uses a custom auth middleware `verifyToken` that:
  1. Extracts the token from the header.
  2. Verifies the signature using `process.env.JWT_SECRET`.
  3. Attaches the decoded payload (`req.user`) to the request object.
  4. Calls `next()` if valid, or returns `401` if expired/invalid.

---

## 4. Logout

Because JWTs are stateless, logging out is handled entirely on the frontend by simply **deleting the token**. No backend call is strictly required for the MVP.

---

## Security Considerations
* Ensure `JWT_SECRET` is long, random, and kept out of version control (stored in `.env`).
* Token expiry should be reasonably short (e.g., `7d` for a smooth MVP experience, or shorter for production).
* Passwords must NEVER be logged or returned in any API response.
