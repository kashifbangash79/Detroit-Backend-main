const Experience = require('../models/Experience');

exports.addExperience = async (req, res) => {
    try {
        const newExperience = await Experience.create(req.body);
        res.status(201).json(newExperience);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find();
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
