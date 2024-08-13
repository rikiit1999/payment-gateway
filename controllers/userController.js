const User = require('../models/User');

exports.getUserDetails = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};