const CaregiverRelationship = require('../models/CaregiverRelationship');
const User = require('../models/User');
const DoseLog = require('../models/DoseLog');
const crypto = require('crypto');

exports.generateInvite = async (req, res, next) => {
  try {
    // Generate a random 6-character code
    const inviteCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    const relationship = new CaregiverRelationship({
      patient_id: req.user.id,
      invite_code: inviteCode,
      status: 'pending'
    });

    await relationship.save();

    res.status(201).json({ inviteCode });
  } catch (err) {
    next(err);
  }
};

exports.acceptInvite = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    const relationship = await CaregiverRelationship.findOne({ invite_code: inviteCode, status: 'pending' });
    if (!relationship) {
      return res.status(404).json({ error: 'Invalid or expired invite code' });
    }

    relationship.caregiver_id = req.user.id;
    relationship.status = 'active';
    await relationship.save();

    res.json({ message: 'Relationship established successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'You are already a caregiver for this patient' });
    }
    next(err);
  }
};

exports.getPatients = async (req, res, next) => {
  try {
    const relationships = await CaregiverRelationship.find({ caregiver_id: req.user.id, status: 'active' }).populate('patient_id', 'name email');
    
    const patients = relationships.map(rel => ({
      id: rel.patient_id._id,
      name: rel.patient_id.name,
      email: rel.patient_id.email
    }));

    res.json({ patients });
  } catch (err) {
    next(err);
  }
};

exports.getPatientDashboard = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // Authorization check
    const relationship = await CaregiverRelationship.findOne({ 
      patient_id: patientId, 
      caregiver_id: req.user.id, 
      status: 'active' 
    });

    if (!relationship) {
      return res.status(403).json({ error: 'Not authorized to view this patient' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayDoses = await DoseLog.find({
      patient_id: patientId,
      scheduled_at: { $gte: today, $lt: tomorrow }
    }).populate('medication_id');

    res.json({ todayDoses });
  } catch (err) {
    next(err);
  }
};
