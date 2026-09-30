const mongoose = require('mongoose');

const CaregiverRelationshipSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caregiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Can be null until accepted
  invite_code: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'active', 'revoked'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// Ensure a caregiver can only have one active relationship with a given patient
CaregiverRelationshipSchema.index({ patient_id: 1, caregiver_id: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('CaregiverRelationship', CaregiverRelationshipSchema);
