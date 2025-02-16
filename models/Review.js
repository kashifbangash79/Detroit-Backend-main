const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // rating: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
