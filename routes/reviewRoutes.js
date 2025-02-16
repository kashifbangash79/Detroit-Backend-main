const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/reviewController');
const auth=require('../middleware/auth');
router.post('/add',auth, addReview);
router.get('/', getReviews);

module.exports = router;
