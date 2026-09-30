const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', medicationController.createMedication);
router.get('/', medicationController.getMedications);
router.get('/dashboard', medicationController.getDashboard);
router.patch('/doses/:id', medicationController.updateDoseStatus);

module.exports = router;
