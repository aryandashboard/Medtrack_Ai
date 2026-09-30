const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image_url: { type: String }, // Optional if using memory processing, but good to have if we store temporarily
  ai_extracted_data: { type: mongoose.Schema.Types.Mixed }, // Flexible JSON storage
  verification_status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', PrescriptionSchema);
