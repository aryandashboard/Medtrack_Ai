const express = require('express');
const router = express.Router();
const multer = require('multer');
const prescriptionController = require('../controllers/prescriptionController');
const { verifyToken } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

router.use(verifyToken);

router.post('/scan', upload.single('prescription'), prescriptionController.uploadPrescription);
router.post('/:id/verify', prescriptionController.verifyPrescription);

module.exports = router;
