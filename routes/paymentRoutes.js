const express = require('express');
const router = express.Router();
const { deposit } = require('../controllers/paymentController');
const gatewayMiddleware = require('../middlewares/gatewayMiddleware');

router.post('/deposit', gatewayMiddleware, deposit);

module.exports = router;