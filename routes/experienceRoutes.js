const express = require('express');
const router = express.Router();
const { addExperience, getExperiences } = require('../controllers/experienceController');

router.post('/add', addExperience);
router.get('/', getExperiences);

module.exports = router;
