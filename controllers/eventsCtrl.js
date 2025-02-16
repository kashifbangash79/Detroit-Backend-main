require('dotenv').config();
const axios = require("axios");

const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const BASE_URL = "https://app.ticketmaster.com/discovery/v2";

exports.events = async (req, res) => {
    console.log("this is the event api key:", TICKETMASTER_API_KEY);
    
    try {
        const response = await axios.get(`${BASE_URL}/events.json`, {
            params: {
                apikey: TICKETMASTER_API_KEY,
                city: "Detroit",
                stateCode: "MI",
                countryCode: "US",
                size: 100, // Number of events to return
            },
        });

        // Check if events exist
        const events = response.data._embedded?.events || [];

        // Extract required fields
        const formattedEvents = events.map(event => ({
            id: event.id,
            image: event.images?.[0]?.url || null, // Fetch first available image
            name: event.name,
            url: event.url,
            price: {
                min: event.priceRanges?.[0]?.min || 'N/A',
                max: event.priceRanges?.[0]?.max || 'N/A'
            },
            venue_name: event._embedded?.venues?.[0]?.name || 'Unknown',
            venue_city: event._embedded?.venues?.[0]?.city?.name || 'Unknown',
            venue_state: event._embedded?.venues?.[0]?.state?.name || 'Unknown',
            date: event.dates?.start?.localDate || "Unknown",
            time: event.dates?.start?.localTime || "Unknown"
        }));

        res.json(formattedEvents);
    } catch (error) {
        console.error("Error fetching events:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch events" });
    }
};
