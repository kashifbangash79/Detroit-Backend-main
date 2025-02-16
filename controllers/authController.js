const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const Referral = require('../models/Referral');
require('dotenv').config(); // Load environment variables

exports.signup = async (req, res) => {
    const { email, fullName, password, dob, referralCode } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUserDetails = {
            email,
            fullName,
            password: hashedPassword,
            dob,
        };

        // Check if a referral code was provided and validate it in the Referral schema
        if (referralCode) {
            const referralRecord = await Referral.findOne({ referralCode });
            if (!referralRecord) {
                return res.status(400).json({ error: "Invalid referral code" });
            }

            // Update the referring user's credits
            const referringUser = await User.findById(referralRecord.user);
            if (!referringUser) {
                return res.status(404).json({ error: "Referring user not found" });
            }

            referringUser.creditsEarned += 10; // Credit $10 to the referring user
            await referringUser.save();

            // Add the new user to the referring user's referral list
            referralRecord.referrals.push({
                referredUser: newUserDetails._id,
                status: 'completed', // Referral completed once the user signs up
            });
            await referralRecord.save();

            // Assign the referral code to the new user
            newUserDetails.referralCode = referralCode;
        }

        // Create the new user
        const newUser = await User.create(newUserDetails);

        // Return the new user data
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Implement forgot password function with email service (use email service utility here)

