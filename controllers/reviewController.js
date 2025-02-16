const Review = require('../models/Review');

exports.addReview = async (req, res) => {
    try {
        const newReview = await Review.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('createdBy', 'fullName email ') // Specify the fields to include
            .exec();

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
