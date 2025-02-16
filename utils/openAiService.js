const { OpenAI } = require('openai');
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
    throw new Error("Missing OpenAI API Key. Please set OPENAI_API_KEY in your environment variables.");
}

const openai = new OpenAI({ apiKey });

/**
 * Parses the itinerary response from OpenAI into a structured format.
 * @param {string} textResponse - The raw text response from OpenAI.
 * @returns {Array} - An array of day objects with activities.
 */
const parseItineraryResponse = (textResponse) => {
  const days = textResponse.split("###").slice(1); // Splitting by "###" to get each day separately
  return days.map((dayText, index) => {
      const lines = dayText.trim().split("\n").filter(line => line.trim() !== '');
      const dayTitle = lines.shift().replace(/\*\*(.*?)\*\*/g, '$1').trim(); // Extract day title

      const activities = [];
      let currentActivity = {};

      lines.forEach(line => {
          if (line.startsWith("- **")) {
              if (Object.keys(currentActivity).length > 0) {
                  activities.push(currentActivity);
              }
              currentActivity = { 
                  time: line.match(/\*\*(.*?)\*\*/)[1] // Extract "Morning Activity", "Midday Activity", etc.
              };
          } else if (line.startsWith("  - Title:")) {
              currentActivity.title = line.replace("  - Title: ", "").trim();
          } else if (line.startsWith("  - Budget:")) {
              currentActivity.budget = line.replace("  - Budget: ", "").trim();
          } else if (line.startsWith("  - Description:")) {
              currentActivity.description = line.replace("  - Description: ", "").trim();
          } else if (line.startsWith("  - Tips:")) {
              currentActivity.tips = line.replace("  - Tips: ", "").trim();
          } else if (line.startsWith("  - Duration:")) {
              currentActivity.duration = line.replace("  - Duration: ", "").trim();
          } else if (line.startsWith("  - Location:")) {
              currentActivity.location = line.replace("  - Location: ", "").trim();
          }
      });

      if (Object.keys(currentActivity).length > 0) {
          activities.push(currentActivity);
      }

      return {
          days: `Day ${index + 1}`,
          day: dayTitle,
          activities
      };
  });
};

/**
 * Generates activity suggestions based on user details.
 * @param {Object} details - User details for the itinerary.
 * @returns {Array} - An array of day objects with activities.
 */

exports.getActivitySuggestions = async (details) => {
    try {
      console.log("This is the details received to ChatGPT :: ", details);
  
      // Destructure all fields from the details object
      const {
        destination,
        title,
        startDate,
        endDate,
        arrivalTime,
        departureTime,
        purpose,
        duration,
        interest,
        transportation,
        cuisinePreferences,
        diningPreferences,
        activityPreferences,
        entertainmentPreferences,
        dietaryPreferences,
        landmarks,
        preferredPace,
        accessibility,
        specialOccasion,
        additionalActivities,
        exploreNearby,
        budget,
      } = details;
  
      // Parse the start date and calculate the number of days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const numDays = parseInt(duration);
  
      if(isNaN(numDays)){
        throw new Error("Invalid start or end date. Please provide valid dates.");
      }
    
      // Build the detailed prompt for ChatGPT
      let activitiesPrompt = `You are an expert travel planner. Create a **detailed and descriptive** itinerary based on the following details:\n\n`;
  
      // Add general trip details
      activitiesPrompt += `**Destination**: ${destination}\n`;
      activitiesPrompt += `**Title**: ${title}\n`;
      activitiesPrompt += `**Purpose**: ${purpose}\n`;
      activitiesPrompt += `**Start Date**: ${start.toDateString()}\n`;
      activitiesPrompt += `**End Date**: ${end.toDateString()}\n`;
      activitiesPrompt += `**Duration**: ${numDays} days\n`;
      activitiesPrompt += `**Arrival Time**: ${arrivalTime}\n`;
      activitiesPrompt += `**Departure Time**: ${departureTime}\n`;
      activitiesPrompt += `**Budget**: ${budget ? `$${budget}` : "Not specified"}\n`;
      activitiesPrompt += `**Transportation Preferences**: ${transportation}\n`;
      activitiesPrompt += `**Preferred Pace**: ${preferredPace}\n`;
      activitiesPrompt += `**Accessibility Needs**: ${accessibility}\n`;
      activitiesPrompt += `**Special Occasion**: ${specialOccasion}\n`;
      activitiesPrompt += `**Additional Activities**: ${additionalActivities}\n`;
      activitiesPrompt += `**Explore Nearby Areas**: ${exploreNearby}\n\n`;
  
      // Add preferences and interests
      activitiesPrompt += `**Interests**: ${interest.join(", ") || "Not specified"}\n`;
      activitiesPrompt += `**Cuisine Preferences**: ${cuisinePreferences.join(", ") || "Not specified"}\n`;
      activitiesPrompt += `**Dining Preferences**: ${diningPreferences.join(", ") || "Not specified"}\n`;
      activitiesPrompt += `**Activity Preferences**: ${activityPreferences.join(", ") || "Not specified"}\n`;
      activitiesPrompt += `**Entertainment Preferences**: ${entertainmentPreferences.join(", ") || "Not specified"}\n`;
      activitiesPrompt += `**Dietary Preferences**: ${dietaryPreferences.join(", ") || "Not specified"}\n`;
      activitiesPrompt += `**Landmarks/Attractions**: ${landmarks.join(", ") || "Not specified"}\n\n`;
  
      // Add guidelines for the itinerary
      activitiesPrompt += `Plan activities for ${numDays} days. Each day should include:\n`;
      activitiesPrompt += `1. **Morning Activity** (Title, Budget, Description, Tips, Duration, Location)\n`;
      activitiesPrompt += `2. **Midday Activity** (Title, Budget, Description, Tips, Duration, Location)\n`;
      activitiesPrompt += `3. **Afternoon Activity** (Title, Budget, Description, Tips, Duration, Location)\n`;
      activitiesPrompt += `4. **Evening Activity** (Title, Budget, Description, Tips, Duration, Location)\n\n`;
      activitiesPrompt += `**Guidelines for Descriptions**:\n`;
      activitiesPrompt += `- Provide **detailed descriptions** of each activity, including what makes it unique or special.\n`;
      activitiesPrompt += `- Include **practical tips** such as best times to visit, how to get there, and any must-know information.\n`;
      activitiesPrompt += `- Mention the **duration** of each activity and its **exact location**.\n`;
      activitiesPrompt += `- Make the itinerary engaging and informative, as if you're guiding a traveler personally.\n\n`;
  
      // Add daily activities structure
      for (let i = 0; i < numDays; i++) {
        const dayDate = new Date(start);
        dayDate.setDate(start.getDate() + i);
  
        activitiesPrompt += `### **Day ${i + 1} (${dayDate.toDateString()})**\n`;
        activitiesPrompt += `- **Morning Activity**:\n  - Title: [Title]\n  - Budget: [Budget]\n  - Description: [Detailed description]\n  - Tips: [Practical tips]\n  - Duration: [Duration]\n  - Location: [Location]\n`;
        activitiesPrompt += `- **Midday Activity**:\n  - Title: [Title]\n  - Budget: [Budget]\n  - Description: [Detailed description]\n  - Tips: [Practical tips]\n  - Duration: [Duration]\n  - Location: [Location]\n`;
        activitiesPrompt += `- **Afternoon Activity**:\n  - Title: [Title]\n  - Budget: [Budget]\n  - Description: [Detailed description]\n  - Tips: [Practical tips]\n  - Duration: [Duration]\n  - Location: [Location]\n`;
        activitiesPrompt += `- **Evening Activity**:\n  - Title: [Title]\n  - Budget: [Budget]\n  - Description: [Detailed description]\n  - Tips: [Practical tips]\n  - Duration: [Duration]\n  - Location: [Location]\n\n`;
      }
  

      console.log("this is the activity Prompt:::::::: ", activitiesPrompt);
      // Call ChatGPT API
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: activitiesPrompt }],
        max_tokens: 3000, // Increased token limit for more detailed responses
        temperature: 0.7,
      });
  
      // Parse and format the response
      const formattedResponse = parseItineraryResponse(response.choices[0].message.content.trim());
  
      return formattedResponse;
    } catch (error) {
      console.error("Error generating activity suggestions:", error.message);
      throw new Error("Failed to generate activity suggestions. Please try again later.");
    }
  };