const User = require('../models/User');

exports.deposit = async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.balance += amount;
        user.lastTransaction = Date.now();

        await user.save();

        res.json({ msg: 'Deposit successful', balance: user.balance });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};