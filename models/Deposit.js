const mongoose = require('mongoose');

const PendingDepositSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    transactionId: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    status: { type: String, default: 'pending' },  // e.g., 'pending', 'approved', 'cancelled'
    adminComment: { type: String }
});

module.exports = mongoose.model('Deposit', PendingDepositSchema);