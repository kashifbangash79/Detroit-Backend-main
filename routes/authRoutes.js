// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken'); // Ensure you import jwt
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// Local authentication routes
router.post('/signup', signup);
router.post('/login', login);

// Google authentication routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // Requesting profile and email scopes
}));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET); // Set token expiration if needed
        res.json({ token, user: req.user });
    }
);

// Facebook authentication routes
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email'] // Requesting email scope
}));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Set token expiration if needed
        res.json({ token, user: req.user });
    }
);

module.exports = router;