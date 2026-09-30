const Prescription = require('../models/Prescription');
const Medication = require('../models/Medication');
const DoseLog = require('../models/DoseLog');
const aiService = require('../services/aiService');

exports.uploadPrescription = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const extractedData = await aiService.parsePrescriptionImage(base64Image, mimeType);

    const prescription = new Prescription({
      patient_id: req.user.id,
      image_url: '', // We don't save the image for the MVP unless required
      ai_extracted_data: extractedData,
      verification_status: 'pending'
    });

    await prescription.save();

    res.status(200).json({
      prescriptionId: prescription._id,
      ai_extracted_data: extractedData
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyPrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verifiedMedications } = req.body;

    const prescription = await Prescription.findOne({ _id: id, patient_id: req.user.id });
    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    if (prescription.verification_status !== 'pending') {
      return res.status(400).json({ error: 'Prescription already verified or rejected' });
    }

    if (!Array.isArray(verifiedMedications)) {
      return res.status(400).json({ error: 'verifiedMedications must be an array' });
    }

    prescription.verification_status = 'verified';
    await prescription.save();

    const medicationsToInsert = verifiedMedications.map(med => ({
      patient_id: req.user.id,
      name: med.name,
      strength: med.strength,
      dosage: med.dosage,
      frequency: med.frequency,
      instructions: med.instructions,
      // Default to some basic schedule or leave it to the user to configure later
      times: med.times || [],
      start_date: new Date()
    }));

    const insertedMedications = await Medication.insertMany(medicationsToInsert);

    // Optionally generate DoseLogs for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logs = [];

    insertedMedications.forEach(med => {
      if (med.times && med.times.length > 0) {
        med.times.forEach(time => {
          const [hours, minutes] = time.split(':');
          const scheduled_at = new Date(today);
          scheduled_at.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
          
          logs.push({
            medication_id: med._id,
            patient_id: req.user.id,
            scheduled_at,
            status: 'pending'
          });
        });
      }
    });

    if (logs.length > 0) {
      await DoseLog.insertMany(logs);
    }

    res.json({ message: 'Prescription verified', medications: insertedMedications });
  } catch (err) {
    next(err);
  }
};
