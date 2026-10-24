const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', medicationController.createMedication);
router.get('/', medicationController.getMedications);
router.get('/dashboard', medicationController.getDashboard);
router.get('/history', medicationController.getHistory);
router.patch('/doses/:id', medicationController.updateDoseStatus);
router.patch('/:id', medicationController.updateMedication);
router.delete('/:id', medicationController.deactivateMedication);

module.exports = router;
