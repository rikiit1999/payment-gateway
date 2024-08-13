const express = require('express');
const router = express.Router();
const { deposit } = require('../controllers/paymentController');
const auth = require('../middlewares/gatewayMiddleware');

router.post('/deposit', auth, deposit);

module.exports = router;