const mongoose = require('mongoose');

const DepositSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    method: { type: String, required: true },  // e.g., 'credit_card', 'momo'
    transactionId: { type: String, unique: true, required: true },
    status: { type: String, default: 'pending' },  // e.g., 'pending', 'approved', 'cancelled'
    adminComment: { type: String }
});

module.exports = mongoose.model('Deposit', DepositSchema);