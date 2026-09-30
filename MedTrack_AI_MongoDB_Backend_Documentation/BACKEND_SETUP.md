# MedTrack AI — Backend Setup

## 1. Prerequisites

- Node.js LTS
- npm
- Git
- MongoDB Atlas account
- Gemini API key

No local MongoDB installation is required.

## 2. Folder

```text
project/
├── frontend/
└── backend/
```

The existing frontend is not rebuilt.

## 3. Initialize

```bash
mkdir backend
cd backend
npm init -y
```

Runtime dependencies:

```bash
npm install express mongoose cors dotenv jsonwebtoken bcryptjs helmet express-rate-limit multer @google/generative-ai
```

Development dependency:

```bash
npm install -D nodemon
```

If the existing project already has a working Gemini SDK, keep one consistent SDK instead of adding multiple clients.

## 4. Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

## 5. Environment

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=<server-side-key>
FRONTEND_URL=http://localhost:3000
```

Do not commit `.env`.

## 6. MongoDB Atlas

1. Create Atlas account.
2. Create free-tier cluster.
3. Create database user.
4. Set strong password.
5. Configure network access.
6. Copy connection string.
7. Put it in `MONGODB_URI`.
8. Use a database name such as `medtrack_ai`.

Never place the URI in React.

## 7. Mongoose Connection

Use one connection module.

Startup:

```text
load environment
    ↓
connect Mongoose
    ↓
start Express server
```

If MongoDB cannot connect, fail clearly rather than starting a partially broken API.

## 8. Express Middleware

Recommended order:

```text
Express
 ↓
Helmet
 ↓
CORS
 ↓
JSON body parser
 ↓
Request logging
 ↓
Routes
 ↓
404 handler
 ↓
Global error handler
```

JWT middleware is attached to protected routes.

## 9. Frontend Connection

Existing frontend should use its API environment variable.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Production:

```env
NEXT_PUBLIC_API_URL=https://<render-service>.onrender.com/api
```

The frontend must never contain:
- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`

## 10. Local Run

Backend:

```bash
cd backend
npm run dev
```

Test:

```text
GET http://localhost:5000/api/health
```

Then run the existing frontend separately.

## 11. Recommended Build Order

1. Environment/config
2. MongoDB connection
3. User model
4. Registration/login
5. JWT middleware
6. Medication model
7. Medication CRUD
8. Schedule validation
9. Dose log model
10. Dose generation
11. Taken/skip/snooze
12. Adherence
13. Prescription model
14. Gemini extraction
15. Verification → medication creation
16. Caregiver relationship
17. Caregiver endpoints
18. Private prescription image handling
19. Notifications where practical
20. Testing + frontend integration

## 12. Debugging

Check:
- Atlas cluster status
- database credentials
- network access
- URI/database name
- special-character encoding in passwords
- browser Network tab
- frontend API URL
- Authorization header
- CORS origin
