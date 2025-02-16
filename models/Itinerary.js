const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    destination: { type: String, required: true },
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    arrivalTime: { type: String }, // New field for arrival time
    departureTime: { type: String }, // New field for departure time
    purpose: { type: String }, // Purpose of visit
    duration: { type: String }, // Calculated duration
    interest: [{ type: String }], // Array for multiple interests
    transportation: { type: String }, // Transportation preferences
    cuisinePreferences: [{ type: String }], // Array for cuisine preferences
    diningPreferences: [{ type: String }], // Array for dining preferences
    activityPreferences: [{ type: String }], // Array for activity preferences
    entertainmentPreferences: [{ type: String }], // Array for entertainment preferences
    dietaryPreferences: [{ type: String }], // Array for dietary preferences
    landmarks: [{ type: String }], // Array for Detroit landmarks/attractions
    accommodation: { type: String }, // Accommodation preferences
    preferredPace: { type: String }, // Preferred pace of the trip
    accessibility: { type: String }, // Special accessibility features
    specialOccasion: { type: String }, // Celebrating a special occasion
    additionalActivities: { type: String }, // Additional activity suggestions
    exploreNearby: { type: String }, // Explore nearby areas outside Detroit
    budget: { type: Number }, // Budget for the trip
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who created the itinerary
    shareLinks: { // Social media share links
        facebook: { type: String },
        instagram: { type: String },
        tiktok: { type: String },
    },
    activities: [{ // New field to store generated activities
        days: String,
        dayTitle: String,
        activities: [{
            timeSlot: String,
            title: String,
            budget: String,
            description: String,
            location: String,
            duration: String
        }]
    }]
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);