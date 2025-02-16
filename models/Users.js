// models/Users.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String,  }, // Only for local authentication
    dob: { type: Date,  },
    profileImage: { type: String },
    creditsEarned: { type: Number, default: 0 },
    referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    role: { type: String, default: 'user' },
    googleId: { type: String, unique: true }, // For Google authentication
    facebookId: { type: String, unique: true }, // For Facebook authentication
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);