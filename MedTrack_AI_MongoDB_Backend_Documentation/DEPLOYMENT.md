# MedTrack AI — Deployment

## 1. Target Deployment

```text
Existing React/Next.js Frontend
          |
          | HTTPS
          v
Render Free
Node.js + Express.js
          |
          | TLS
          v
MongoDB Atlas Free

Express backend
          |
          | HTTPS
          v
Gemini API
```

The architecture is intentionally free-first for the MVP.

## 2. MongoDB Atlas Free

Create:
- one free-tier cluster,
- one application database user,
- one database such as `medtrack_ai`.

Use the connection string only in backend environment variables.

Do not commit it.

## 3. Render Free Backend

Create a Render Web Service connected to the backend Git repository/folder.

Typical settings:

```text
Runtime: Node
Build Command: npm install
Start Command: npm start
```

If the repository is a monorepo, configure the backend root directory accordingly.

## 4. Required Render Environment Variables

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=<atlas connection string>
JWT_SECRET=<strong random secret>
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=<gemini key>
FRONTEND_URL=<deployed frontend origin>
```

Render may provide its own port environment. The Express server must listen on `process.env.PORT`.

## 5. Frontend

Point the existing frontend's API base URL to:

```text
https://<render-service>.onrender.com/api
```

Do not expose any backend secret in frontend environment variables.

## 6. CORS

Production backend should allow only the actual frontend origin.

Example concept:

```text
FRONTEND_URL=https://your-frontend.example
```

Do not leave production CORS as unrestricted `*` when credentials are involved.

## 7. MongoDB Network Access

Configure Atlas network access so the deployed Render backend can connect.

Do not solve connectivity by publishing database credentials or exposing MongoDB directly to users.

The exact Atlas network configuration should be chosen according to the current Atlas/Render networking options available during deployment.

## 8. Health Check

Use:

```text
GET /api/health
```

Expected:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

## 9. Deployment Checklist

### Backend
- [ ] Repository contains backend
- [ ] `npm install` succeeds
- [ ] `npm start` succeeds
- [ ] Server uses Render `PORT`
- [ ] `/api/health` works
- [ ] MongoDB connects
- [ ] Gemini call works
- [ ] JWT auth works
- [ ] CORS works with frontend

### Database
- [ ] Atlas free cluster exists
- [ ] Database user exists
- [ ] Strong credentials
- [ ] Network access configured
- [ ] Indexes created
- [ ] No public anonymous database access

### Frontend
- [ ] API URL points to Render
- [ ] No MongoDB URI in frontend
- [ ] No JWT secret in frontend
- [ ] No Gemini secret in frontend
- [ ] Login works
- [ ] Patient dashboard works
- [ ] Caregiver dashboard works

## 10. Free-Tier Limitations

Free infrastructure is suitable for the hackathon MVP, not production-scale healthcare workloads.

Expect possible limitations such as:
- cold starts,
- limited compute,
- limited database storage,
- limited network/usage quotas,
- service sleeping/idle behavior depending on current provider policy.

Do not claim production-scale availability or healthcare compliance from free-tier hosting.

## 11. Backup / Recovery

For a hackathon, keep the database small and export/backup important demo data where practical.

Do not assume the free tier alone provides the operational guarantees required for real clinical deployment.

## 12. Rollback

Keep deployments tied to Git commits.

If a deployment breaks:
1. inspect Render logs,
2. identify the failing commit,
3. roll back to the last known-good commit,
4. fix locally,
5. retest,
6. redeploy.
