const { Configuration, OpenAIApi } = require("openai");

require("dotenv").config();

console.log(process.env.OPENAI_API_KEY);

// Configure OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Load the API key from .env
});

const openai = new OpenAIApi(configuration);

// Function to test OpenAI API
const testOpenAI = async () => {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003", // Specify the GPT model
            prompt: "List 3 popular tourist activities in Paris.",
            max_tokens: 100,
            temperature: 0.7,
        });

        console.log("Generated Suggestions:");
        console.log(response.data.choices[0].text.trim());
    } catch (error) {
        console.error("OpenAI API Error:", error.message);
    }
};

testOpenAI();
