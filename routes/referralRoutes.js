const express = require('express');
const router = express.Router();
const { generateReferralCode, getReferralStatus, getUserCredits } = require('../controllers/referralController');
const auth = require('../middleware/auth');

router.get('/generate', auth, generateReferralCode);
router.get('/status', auth, getReferralStatus);
router.get('/credits', auth, getUserCredits);

module.exports = router;
