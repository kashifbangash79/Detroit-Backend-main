const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referralCode: { type: String, required: true, unique: true },
    referrals: [{
        referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now },
        status: { type: String, default: 'pending' }  // e.g., pending, completed
    }],
    invitedFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);
