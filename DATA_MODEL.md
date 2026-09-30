# Data Model (Mongoose Schemas)

This document outlines the proposed Mongoose schemas for the MedTrack AI backend.

## 1. User Schema

```javascript
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['patient', 'caregiver'], default: 'patient' },
  createdAt: { type: Date, default: Date.now }
});
```

## 2. Medication Schema

```javascript
const MedicationSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  strength: { type: String }, // e.g., "500 mg"
  dosage: { type: String }, // e.g., "1 capsule"
  frequency: { type: String }, // e.g., "3 times daily"
  times: [{ type: String }], // Array of times e.g., ["08:00", "14:00", "20:00"]
  timezone: { type: String, default: 'UTC' }, // For accurate notifications
  instructions: { type: String }, // e.g., "after food"
  start_date: { type: Date, default: Date.now },
  end_date: { type: Date },
  createdAt: { type: Date, default: Date.now }
});
```

## 3. Dose Log Schema

```javascript
const DoseLogSchema = new mongoose.Schema({
  medication_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduled_at: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'taken', 'skipped', 'missed'], default: 'pending' },
  taken_at: { type: Date },
  createdAt: { type: Date, default: Date.now }
});
```

## 4. Caregiver Relationship Schema

```javascript
const CaregiverRelationshipSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caregiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be null until accepted
  invite_code: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'active', 'revoked'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
```

## 5. Prescription (AI Extraction) Schema

```javascript
const PrescriptionSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image_url: { type: String, required: true },
  ai_extracted_data: { type: mongoose.Schema.Types.Mixed }, // Flexible JSON storage
  verification_status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
```
