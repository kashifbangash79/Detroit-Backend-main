const express = require('express');
const router = express.Router();
// const { addExperience, getExperiences } = require('../controllers/experienceController');

const { events } = require("../controllers/eventsCtrl");

router.get('/events', events);

module.exports = router;