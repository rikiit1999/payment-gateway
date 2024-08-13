const Deposit = require('../models/Deposit');
const User = require('../models/User');
const TransactionHistory = require('../models/TransactionHistory');
const crypto = require('crypto');

exports.deposit = async (req, res) => {
    const { amount, description } = req.body;
    const userId = req.user.id;
    
    try {
        const transactionId = crypto.randomBytes(16).toString('hex');

        const deposit = new Deposit({
            userId,
            amount,
            transactionId,
            description,
            status: 'pending'
        });

        await deposit.save();

        // Immediately update admin's balance
        const admin = await User.findOne({ isAdmin: true }); // Assuming there's a way to identify admin
        if (admin) {
            admin.balance += amount;
            await admin.save();
        }

        // Save the transaction history for admin
        const transactionHistory = new TransactionHistory({
            transactionId,
            amount,
            description,
            adminId: admin ? admin._id : null // You might need to handle this based on your setup
        });

        await transactionHistory.save();

        res.json({ msg: 'Deposit recorded and pending approval', transactionId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.approveTransaction = async (req, res) => {
    const { transactionId, adminComment } = req.body;

    try {
        const deposit = await Deposit.findOne({ transactionId });

        if (!deposit || deposit.status !== 'pending') {
            return res.status(404).json({ msg: 'Transaction not found or already processed' });
        }

        deposit.status = 'approved';
        deposit.adminComment = adminComment;
        await deposit.save();

        // Update the user's balance
        const user = await User.findById(deposit.userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.balance += deposit.amount;
        await user.save();

        res.json({ msg: 'Transaction approved and user balance updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.cancelTransaction = async (req, res) => {
    const { transactionId, adminComment } = req.body;

    try {
        const deposit = await Deposit.findOne({ transactionId });

        if (!deposit || deposit.status !== 'pending') {
            return res.status(404).json({ msg: 'Transaction not found or already processed' });
        }

        deposit.status = 'cancelled';
        deposit.adminComment = adminComment;
        await deposit.save();

        res.json({ msg: 'Transaction cancelled' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};