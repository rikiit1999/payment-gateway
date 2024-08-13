const mongoose = require('mongoose');

const TransactionHistorySchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    description: { type: String, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to admin who handled the transaction
});

module.exports = mongoose.model('TransactionHistory', TransactionHistorySchema);