const express = require('express');
const router = express.Router();
//const { deposit } = require('../controllers/paymentController');
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/gatewayMiddleware');
const adminAuth = require('../middlewares/adminAuth');

//router.post('/deposit', auth, deposit);
router.post('/deposit', auth, paymentController.deposit);

router.post('/approve', auth, adminAuth, paymentController.approveTransaction);

router.post('/cancel', auth, adminAuth, paymentController.cancelTransaction);

module.exports = router;