const Itinerary = require('../models/Itinerary');
const { getActivitySuggestions } = require('../utils/openAiService');
const  mongoose = require('mongoose');
require('dotenv').config();

exports.createItinerary = async (req, res) => {
    try {
        const itineraryData = { ...req.body, createdBy: req.user._id };

        // Ensure arrays are properly processed
        itineraryData.interest = req.body.interest || [];
        itineraryData.diningPreferences = req.body.diningPreferences || [];
        itineraryData.activityPreferences = req.body.activityPreferences || [];

        // Generate social media share links
        const baseUrl = process.env.APP_URL || 'https://example.com';
        const itineraryId = new mongoose.Types.ObjectId(); // Pre-generate the ID
        itineraryData._id = itineraryId;

        itineraryData.shareLinks = {
            facebook: `${baseUrl}/itineraries/${itineraryId}?utm_source=facebook`,
            instagram: `${baseUrl}/itineraries/${itineraryId}?utm_source=instagram`,
            tiktok: `${baseUrl}/itineraries/${itineraryId}?utm_source=tiktok`,
        };

        // Save the itinerary
        const newItinerary = await Itinerary.create(itineraryData);
        console.log("this is the new Itinerary created ::::", newItinerary)
        console.log("this is the new Itinerary Data ::::",itineraryData)
        res.status(201).json({
            message: "Itinerary created successfully",
            itinerary: newItinerary,
        });
    } catch (error) {
        console.error("Error creating itinerary:", error);
        res.status(500).json({ error: error.message });
    }
};

// Endpoint to get itineraries along with their activities
exports.getAllItineraries = async (req, res) => {
    try {
        // Find itineraries created by the user
        const itineraries = await Itinerary.find({ createdBy: req.user._id });

        // Structure the response to include activities for each itinerary
        const structuredItineraries = itineraries.map(itinerary => {
            return {
                _id: itinerary._id,
                destination: itinerary.destination,
                title: itinerary.title,
                startDate: itinerary.startDate,
                purpose: itinerary.purpose,
                duration: itinerary.duration,
                interest: itinerary.interest,
                budget: itinerary.budget,
                diningPreferences: itinerary.diningPreferences,
                activityPreferences: itinerary.activityPreferences,
                shareLinks: itinerary.shareLinks,
                activitiesByDay: itinerary.activities.map(day => ({
                    dayTitle: day.dayTitle,
                    activities: day.activities.map(activity => ({
                        timeSlot: activity.timeSlot,
                        title: activity.title,
                        budget: activity.budget,
                        description: activity.description
                    }))
                }))
            };
        });

        // Return the structured itineraries
        res.json(structuredItineraries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getItineraryById = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        res.json(itinerary);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.generateSuggestions = async (req, res) => {
    const itineraryId = req.params.id;
    console.log("Received request to generate suggestions for itinerary:", itineraryId);

    try {
        const itinerary = await Itinerary.findById(itineraryId);
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }

        const details = {
            destination: itinerary.destination,
            title: itinerary.title,
            startDate: itinerary.startDate,
            endDate: itinerary.endDate,
            arrivalTime: itinerary.arrivalTime,
            departureTime: itinerary.departureTime,
            purpose: itinerary.purpose,
            duration: itinerary.duration,
            interest: itinerary.interest,
            transportation: itinerary.transportation,
            cuisinePreferences: itinerary.cuisinePreferences,
            diningPreferences: itinerary.diningPreferences,
            activityPreferences: itinerary.activityPreferences,
            entertainmentPreferences: itinerary.entertainmentPreferences,
            dietaryPreferences: itinerary.dietaryPreferences,
            landmarks: itinerary.landmarks,
            preferredPace: itinerary.preferredPace,
            accessibility: itinerary.accessibility,
            specialOccasion: itinerary.specialOccasion,
            additionalActivities: itinerary.additionalActivities,
            exploreNearby: itinerary.exploreNearby,
            budget: itinerary.budget,
          };

        // Get activity suggestions from OpenAI
        const activitySuggestions = await getActivitySuggestions(details);
        console.log("Activity Suggestions from OpenAI:", JSON.stringify(activitySuggestions, null, 2)); // Debug log

        // Validate response structure
        if (!Array.isArray(activitySuggestions)) {
            throw new Error("Invalid response format from OpenAI");
        }

        // Process the response into a structured format
        const activitiesByDay = activitySuggestions.map(day => ({
            days: day.days,
            dayTitle: day.day, // Extracting "Day 1", "Day 2", etc.
            activities: day.activities.map(activity => ({
                timeSlot: activity.time, // Extracting time slot
                title: activity.title,
                budget: activity.budget,
                description: activity.description + activity.tips,
                location: activity.location,
                duration: activity.duration
            }))
        }));

        // Save activities in the itinerary document
        itinerary.activities = activitiesByDay;
        await itinerary.save();

        // Send back the structured response
        res.json({
            title: itinerary.title,
            startDate: itinerary.startDate,
            duration: itinerary.duration,
            activitiesByDay
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Endpoint to get only activities of a specific itinerary
exports.getSuggestions = async (req, res) => {
    const itineraryId = req.params.id;
    console.log("Received request to get activities for itinerary:", itineraryId);

    try {
        const itinerary = await Itinerary.findById(itineraryId);
        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }

        // Create a structured response with day titles and their respective activities
        const structuredActivities = [];

        // Iterate through each day's activities
        for (const day of itinerary.activities) {
            structuredActivities.push({
                days:day.days,
                dayTitle: day.dayTitle,
                activities: day.activities.map(activity => ({
                    timeSlot: activity.timeSlot,
                    title: activity.title,
                    budget: activity.budget,
                    description: activity.description + activity.tips,
                    location:activity.location,
                    duration: activity.duration
                }))
            });
        }

        // Return only the structured activities
        res.json(structuredActivities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};