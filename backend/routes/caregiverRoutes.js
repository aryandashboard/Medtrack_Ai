const express = require('express');
const router = express.Router();
const caregiverController = require('../controllers/caregiverController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/invite', caregiverController.generateInvite);
router.post('/accept', caregiverController.acceptInvite);
router.get('/patients', caregiverController.getPatients);
router.get('/patients/:patientId/dashboard', caregiverController.getPatientDashboard);

module.exports = router;
