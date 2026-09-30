const mongoose = require('mongoose');

const DoseLogSchema = new mongoose.Schema({
  medication_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduled_at: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'taken', 'skipped', 'missed'], default: 'pending' },
  taken_at: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DoseLog', DoseLogSchema);
