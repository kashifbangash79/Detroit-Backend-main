const User = require('../models/Users');
const Referral = require('../models/Referral');

exports.generateReferralCode = async (req, res) => {
    try {
        const referralCode = `DETROIT-${Date.now()}`;
        const referral = await Referral.create({ user: req.user._id, referralCode });
        res.json({ referralCode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReferralStatus = async (req, res) => {
    try {
        const referral = await Referral.findOne({ user: req.user._id }).populate('referrals');
        res.json(referral);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserCredits = async (req, res) => {
    try {
        // Get the logged-in user's ID from the request
        const userId = req.user._id;

        // Find the user and select the creditsEarned field
        const user = await User.findById(userId, 'creditsEarned');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the credits earned
        res.json({ creditsEarned: user.creditsEarned });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};