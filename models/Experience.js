const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
    date: { type: Date},
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numberOfReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
