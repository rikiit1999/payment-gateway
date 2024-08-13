const Deposit = require('../models/Deposit');
const User = require('../models/User');
const TransactionHistory = require('../models/TransactionHistory');
const crypto = require('crypto');

exports.deposit = async (req, res) => {
    const { amount, description } = req.body;
    const userId = req.user.id;
    const adminId = '66bb30c78d2fdcba3b3e308f'; // Replace with actual admin ID or logic to get admin ID

    try {
        // Generate a unique transaction ID
        const transactionId = crypto.randomBytes(16).toString('hex');

        // Create a deposit record
        const deposit = new Deposit({
            userId,
            amount,
            timestamp: Date.now(),
            transactionId,
            description
            //,method
        });

        await deposit.save();

        // Log transaction in history for admin
        const transactionHistory = new TransactionHistory({
            transactionId,
            amount,
            description,
            adminId
        });

        await transactionHistory.save();

        // Increase admin's balance (assumed admin has a user account)
        const admin = await User.findById(adminId);
        if (admin) {
            admin.balance += amount;
            await admin.save();
        }

        res.json({ msg: 'Deposit recorded and admin balance updated', transactionId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.approveTransaction = async (req, res) => {
    const { transactionId } = req.body;

    try {
        const deposit = await Deposit.findOne({ transactionId });
        if (!deposit) return res.status(404).json({ msg: 'Deposit not found' });

        const transactionHistory = await TransactionHistory.findOne({ transactionId, adminId: req.user.id });
        if (!transactionHistory) return res.status(404).json({ msg: 'Transaction history not found' });

        // Update user's balance
        const user = await User.findById(deposit.userId);
        if (user) {
            user.balance += deposit.amount;
            await user.save();
        }

        res.json({ msg: 'Deposit approved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.cancelTransaction = async (req, res) => {
    const { transactionId } = req.body;

    try {
        const deposit = await Deposit.findOne({ transactionId });
        if (!deposit) return res.status(404).json({ msg: 'Deposit not found' });

        const transactionHistory = await TransactionHistory.findOne({ transactionId, adminId: req.user.id });
        if (!transactionHistory) return res.status(404).json({ msg: 'Transaction history not found' });

        // Optionally: Handle reversal of deposit or notify about the cancellation

        res.json({ msg: 'Deposit canceled' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};