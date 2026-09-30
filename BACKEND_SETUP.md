# Backend Setup Guide

This guide explains how to set up the MedTrack AI Node.js/Express backend for local development.

---

## 1. Prerequisites

Ensure you have the following installed:
* **Node.js** (v18+)
* **MongoDB Atlas Account** (Free Tier)

---

## 2. MongoDB Atlas Setup

1. Create an account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a new Free M0 cluster.
3. In "Database Access", create a new database user and save the password.
4. In "Network Access", add your current IP address (or `0.0.0.0/0` for the hackathon).
5. Click "Connect" -> "Connect your application" and copy the connection string.
   *(Replace `<password>` with the password you created).*

---

## 3. Local Project Setup

1. Create a `backend` folder inside the project (or alongside the frontend).
2. Initialize the project:
   ```bash
   mkdir backend
   cd backend
   npm init -y
   ```
3. Install dependencies:
   ```bash
   npm install express mongoose dotenv cors jsonwebtoken bcryptjs multer
   npm install --save-dev nodemon
   ```
   *(Note: `multer` is used for handling prescription image uploads).*

---

## 4. Environment Variables

Create a `.env` file in the root of the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medtrack?retryWrites=true&w=majority
JWT_SECRET=super_secret_hackathon_key_replace_me
AI_API_KEY=your_openai_or_gemini_key_here
```

---

## 5. Basic Server Structure

Create an `index.js` (or `server.js`) file:

```javascript
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes placeholder
app.get('/api/v1/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

## 6. Running the Backend

Add this to your `package.json` scripts:
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

Run the development server:
```bash
npm run dev
```

---

## 7. Connecting the Existing React Frontend

In the React frontend, create a `.env.local` (or equivalent based on your bundler) and set the API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Update your frontend API service calls to use this URL instead of the old Supabase client.
