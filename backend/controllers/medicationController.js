const Medication = require('../models/Medication');
const DoseLog = require('../models/DoseLog');

exports.createMedication = async (req, res, next) => {
  try {
    const { name, strength, dosage, frequency, times, timezone, instructions, start_date, end_date } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Medicine name is required' });
    }

    const medication = new Medication({
      patient_id: req.user.id,
      name,
      strength,
      dosage,
      frequency,
      times: times || [],
      timezone: timezone || 'UTC',
      instructions,
      start_date,
      end_date
    });

    await medication.save();

    // Optionally, we could generate initial DoseLogs here based on the schedule, 
    // but for the MVP, generating them lazily or on a simple daily cron is common.
    // For immediate dashboard usage, let's just create today's doses if times are provided.
    
    if (times && times.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const doseLogs = times.map(time => {
        const [hours, minutes] = time.split(':');
        const scheduled_at = new Date(today);
        scheduled_at.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        
        return {
          medication_id: medication._id,
          patient_id: req.user.id,
          scheduled_at,
          status: 'pending'
        };
      });

      await DoseLog.insertMany(doseLogs);
    }

    res.status(201).json({ medication });
  } catch (err) {
    next(err);
  }
};

exports.getMedications = async (req, res, next) => {
  try {
    const medications = await Medication.find({ patient_id: req.user.id, active: true });
    res.json({ medications });
  } catch (err) {
    next(err);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayDoses = await DoseLog.find({
      patient_id: req.user.id,
      scheduled_at: { $gte: today, $lt: tomorrow }
    }).populate('medication_id');

    const activeMedications = await Medication.find({ patient_id: req.user.id, active: true });

    // Calculate adherence for the past 7 days (simplified)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentDoses = await DoseLog.find({
      patient_id: req.user.id,
      scheduled_at: { $gte: sevenDaysAgo, $lt: tomorrow },
      status: { $in: ['taken', 'missed', 'skipped'] }
    });

    let adherencePercentage = 100;
    if (recentDoses.length > 0) {
      const takenDoses = recentDoses.filter(d => d.status === 'taken').length;
      adherencePercentage = Math.round((takenDoses / recentDoses.length) * 100);
    }

    res.json({
      todayDoses,
      adherencePercentage,
      activeMedications
    });
  } catch (err) {
    next(err);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const doseLogs = await DoseLog.find({ patient_id: req.user.id })
      .populate('medication_id')
      .sort({ scheduled_at: -1 })
      .limit(100);
    res.json({ doseLogs });
  } catch (err) {
    next(err);
  }
};

exports.updateDoseStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['taken', 'skipped', 'missed', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const doseLog = await DoseLog.findOne({ _id: id, patient_id: req.user.id });
    if (!doseLog) {
      return res.status(404).json({ error: 'Dose log not found' });
    }

    doseLog.status = status;
    if (status === 'taken') {
      doseLog.taken_at = new Date();
    }
    
    await doseLog.save();

    res.json({ doseLog });
  } catch (err) {
    next(err);
  }
};

exports.updateMedication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const medication = await Medication.findOneAndUpdate(
      { _id: id, patient_id: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!medication) {
      return res.status(404).json({ error: 'Medication not found or unauthorized' });
    }

    res.json({ medication });
  } catch (err) {
    next(err);
  }
};

exports.deactivateMedication = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const medication = await Medication.findOneAndUpdate(
      { _id: id, patient_id: req.user.id },
      { active: false },
      { new: true }
    );

    if (!medication) {
      return res.status(404).json({ error: 'Medication not found or unauthorized' });
    }

    res.json({ message: 'Medication deactivated successfully', medication });
  } catch (err) {
    next(err);
  }
};
