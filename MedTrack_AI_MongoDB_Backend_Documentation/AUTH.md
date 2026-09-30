# MedTrack AI — Authentication Design

## 1. Stack

- Express.js
- JWT / `jsonwebtoken`
- bcrypt/bcryptjs
- MongoDB/Mongoose

No Supabase Auth is used.

## 2. Registration

```text
POST /api/auth/register
        ↓
Validate
        ↓
Normalize email
        ↓
Check duplicate
        ↓
bcrypt hash
        ↓
Create User
        ↓
Issue JWT
```

Never store plaintext passwords.

## 3. Password Hashing

Use bcrypt/bcryptjs with a configurable cost factor appropriate for Render Free.

Never:
- log passwords,
- return password hashes,
- put passwords in JWTs,
- send hashes to React.

## 4. Login

```text
POST /api/auth/login
        ↓
Find normalized email
        ↓
Compare bcrypt hash
        ↓
Sign JWT
```

Use generic failure messages such as `Invalid email or password`.

## 5. JWT

Recommended payload:

```json
{
  "sub": "userObjectId",
  "role": "patient",
  "iat": 0,
  "exp": 0
}
```

Environment:

```env
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
```

Keep secrets out of source control.

## 6. Protected Middleware

For:

```http
Authorization: Bearer <token>
```

Middleware:
1. reads header,
2. verifies signature,
3. verifies expiration,
4. attaches identity to `req.user`.

Invalid/missing token → `401`.

## 7. Authorization

Authentication asks who the user is. Authorization asks whether they can access a resource.

Patient-owned query example:

```js
Medication.findOne({
  _id: medicationId,
  patientId: req.user.id
})
```

Do not fetch by `_id` alone and assume ownership.

Caregiver access requires an accepted relationship.

## 8. Logout

For stateless JWT MVP auth:
- frontend removes token,
- future requests stop sending it.

A refresh-token/revocation system is a future enhancement if needed.

## 9. Frontend Token Handling

Prefer short-lived access tokens and secure HttpOnly cookies where compatible with the existing frontend.

If Bearer tokens are used, document the exact client storage strategy and avoid unnecessarily long-lived insecure storage.

Never expose JWT signing secrets.

## 10. Security Controls

- Email normalization
- Password minimum length
- Generic login errors
- Login rate limiting
- Strong JWT secret
- Token expiration
- HTTPS in production
- No credentials in source control
- No sensitive logs

## 11. Roles

MVP roles:
- `patient`
- `caregiver`

Roles do not replace ownership checks. A caregiver role must not grant access to every patient.

## 12. Google Login

The PRD calls Google login optional. It should remain optional and not block the MVP. Email/password JWT authentication is sufficient for the first working backend.
