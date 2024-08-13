const Deposit = require('../models/Deposit');
const User = require('../models/User');

exports.deposit = async (req, res) => {
    const { userId, amount, method, transactionId } = req.body;

    if (!userId || !amount || !method || !transactionId) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    try {
        const existingDeposit = await Deposit.findOne({ transactionId });

        if (existingDeposit) {
            if (existingDeposit.status === 'approved') {
                return res.status(400).json({ msg: 'Transaction already approved' });
            } else if (existingDeposit.status === 'cancelled') {
                return res.status(400).json({ msg: 'Transaction was cancelled' });
            } else {                
                return res.json({ msg: 'Pending', deposit: existingDeposit });
            }
        }

        const deposit = new Deposit({
            userId,
            amount,
            method,
            transactionId,
        });

        await deposit.save();

        res.json({ msg: 'Deposit created successfully', deposit });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Approve transaction
exports.approveTransaction = async (req, res) => {
    const { transactionId, adminComment } = req.body;

    try {
        const deposit = await Deposit.findOne({ transactionId });
        if (!deposit) return res.status(404).json({ msg: 'Transaction not found' });

        if (deposit.status !== 'pending') {
            return res.status(400).json({ msg: 'Transaction cannot be approved' });
        }

        deposit.status = 'approved';
        deposit.adminComment = adminComment || 'Approved by admin';
        await deposit.save();

        const user = await User.findById(deposit.userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.balance += deposit.amount;
        user.lastTransaction = Date.now();

        await user.save();

        res.json({ msg: 'Transaction approved successfully', deposit, newBalance: user.balance });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Cancel transaction
exports.cancelTransaction = async (req, res) => {
    const { transactionId, adminComment } = req.body;

    try {
        const deposit = await Deposit.findOne({ transactionId });
        if (!deposit) return res.status(404).json({ msg: 'Transaction not found' });

        if (deposit.status !== 'pending') {
            return res.status(400).json({ msg: 'Transaction cannot be canceled' });
        }

        deposit.status = 'canceled';
        deposit.adminComment = adminComment || 'Canceled by admin';
        await deposit.save();

        res.json({ msg: 'Transaction canceled successfully', deposit });
    } catch (err) {
        res.status(500).send('Server error');
    }
};