const User = require('../models/User');

const adminAuth = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ msg: 'Access denied' });
        }
        next();
    } catch (err) {
        res.status(500).send('Server error');
    }
};

module.exports = adminAuth;