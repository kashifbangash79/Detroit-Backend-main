const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // Ensure the correct path
require('dotenv').config(); // Load environment variables


const auth = async (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('Decoded token:', decoded); // Debug: log the decoded token

        // Ensure 'userId' matches with the key used in the token
        const user = await User.findById(decoded.id); 

        if (!user) {
            return res.status(401).json({ message: 'User not found by this token' });
        }

        // Attach the user object to the request
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error); // Detailed error logging
        res.status(401).json({ message: 'Please authenticate' });
    }
};

module.exports = auth;
