const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
    featuredStatus: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numberOfReviews: { type: Number, default: 0 },
    category: { type: String },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
