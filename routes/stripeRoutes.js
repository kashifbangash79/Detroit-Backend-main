const express = require('express');
const router = express.Router();
const { charge} = require('../controllers/stripeController');
const auth=require('../middleware/auth');

router.post('/charge', auth, charge);   

module.exports = router;
