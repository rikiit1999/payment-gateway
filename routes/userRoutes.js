const express = require('express');
const router = express.Router();
const { getUserDetails } = require('../controllers/userController');
const gatewayMiddleware = require('../middlewares/gatewayMiddleware');

router.get('/me', gatewayMiddleware, getUserDetails);

module.exports = router;