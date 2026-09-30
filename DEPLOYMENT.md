# Deployment Guide

This guide outlines how to deploy the MedTrack AI MVP for free using MongoDB Atlas and Render.

---

## 1. Free Tier Limitations (Important for MVP)

While the chosen stack is 100% free, be aware of the following limitations for your hackathon demo:
* **Render Free Tier**: The backend service will "spin down" (sleep) after 15 minutes of inactivity. When spinning back up, the first request may take 30-50 seconds. Workaround: Ping the backend before the live demo starts.
* **MongoDB Atlas Free Tier**: Limited to 512MB storage and shared RAM. More than enough for an MVP, but not for a production healthcare app.
* **Image Uploads**: Render ephemeral disk deletes files on restart. For the MVP, store prescription images temporarily in memory or upload them to a free storage bucket (like Cloudinary or AWS S3 Free Tier) rather than saving them to the Render local filesystem.

---

## 2. MongoDB Atlas Configuration

1. Log into your MongoDB Atlas account.
2. In **Network Access**, ensure `0.0.0.0/0` (Allow access from anywhere) is set. This is required because Render's free tier IPs are dynamic.
3. In **Database Access**, ensure you have a user with a strong password.
4. Copy the connection string.

---

## 3. Render Backend Deployment

1. Push your `backend` code to a GitHub repository.
2. Log into [Render.com](https://render.com) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   * **Build Command**: `npm install`
   * **Start Command**: `node index.js` (or `npm start`)
   * **Instance Type**: Free
5. **Environment Variables**: Add the variables from your local `.env`:
   * `MONGO_URI`
   * `JWT_SECRET`
   * `AI_API_KEY`
   * `PORT` (Render handles this automatically, but you can set it if needed).
6. Click **Create Web Service**. Wait for the build to finish.
7. Copy the Render URL (e.g., `https://medtrack-api.onrender.com`).

---

## 4. Frontend Deployment (React / Next.js)

Assuming the frontend is deployed on Vercel or Render:

1. In your frontend hosting platform's environment variables, set the API URL to the new Render backend URL:
   ```env
   NEXT_PUBLIC_API_URL=https://medtrack-api.onrender.com/api/v1
   ```
2. Re-deploy the frontend.

---

## 5. CORS Configuration (Crucial)

To prevent the frontend from being blocked by the backend, configure CORS in your Express app correctly for production:

```javascript
const corsOptions = {
  origin: ['https://your-frontend-domain.vercel.app', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // required if using cookies, otherwise optional
};

app.use(cors(corsOptions));
```

---

## 6. Deployment Checklist

* [ ] MongoDB Network Access set to `0.0.0.0/0`.
* [ ] GitHub repo contains the backend code (without `.env`).
* [ ] Render Web Service created.
* [ ] Render Environment Variables set.
* [ ] CORS configured to allow the frontend URL.
* [ ] Frontend environment variables updated to point to the Render backend.
* [ ] Pre-demo check: Ping the Render URL 2 minutes before presenting to wake up the server.
