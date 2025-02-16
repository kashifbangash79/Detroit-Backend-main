const express = require('express');
const router = express.Router();
const { createItinerary, getAllItineraries, getItineraryById, generateSuggestions, getSuggestions } = require('../controllers/itineraryController');
const auth = require('../middleware/auth');

router.post('/create', auth, createItinerary);
router.get('/all', auth, getAllItineraries);
// router.get('/:id', auth, getItineraryById);
router.get('/suggestions/:id', auth, generateSuggestions);
router.get('/getSuggestions/:id', auth, getSuggestions);
module.exports = router;
