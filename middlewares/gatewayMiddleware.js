const jwt = require('jsonwebtoken');
const User = require('../models/User');

const gatewayMiddleware = async (req, res, next) => {
    const token = req.header('x-auth-token');
    console.log('Token:', token);  // Debug: Check token

    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded:', decoded);  // Debug: Check decoded token
        req.user = decoded;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = gatewayMiddleware;