const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    lastTransaction: { type: Date, default: Date.now },
    isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);