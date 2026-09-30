const mongoose = require('mongoose');

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
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Medication', MedicationSchema);
