const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY;
        
        // Your actual API key: 26b3d0e6d50b462d97b7c3920dd6cda9
        console.log("Fetching news with API key:", apiKey ? "Key present" : "No key found");
        
        // Check if API key exists and is valid
        if (!apiKey || apiKey === 'your_newsapi_key') {
            console.log("No valid API key, using mock data");
            return res.json(getMockNews());
        }

        // Fetch real news from NewsAPI
        // You can change 'us' to 'pk' for Pakistan news or use 'in' for India
        const response = await axios.get(
            `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`,
            { timeout: 10000 }
        );
        
        console.log(`News fetched successfully: ${response.data.articles?.length || 0} articles`);
        res.json(response.data);
        
    } catch (error) {
        console.error("News API error:", error.response?.data || error.message);
        
        // Return mock data on error
        console.log("Falling back to mock news data");
        // res.json(getMockNews());
    }
});

// Helper function to get mock news data
function getMockNews() {
    return {
        articles: [
            {
                title: "Pakistan Launches New Tech Initiative",
                description: "Government announces major technology boost for youth and startups across the country.",
                url: "https://example.com/news/1",
                source: { name: "Tech Pakistan" }
            },
            {
                title: "Weather Update: Cooler Days Ahead",
                description: "Meteorological department predicts pleasant weather in major cities this week.",
                url: "https://example.com/news/2",
                source: { name: "Weather News" }
            },
            {
                title: "Stock Market Shows Positive Trend",
                description: "PSX continues bullish trend as investor confidence grows.",
                url: "https://example.com/news/3",
                source: { name: "Business Daily" }
            },
            {
                title: "Revolutionary AI Assistant Launch",
                description: "New AI model helps developers code faster and more efficiently.",
                url: "https://example.com/news/4",
                source: { name: "AI World" }
            },
            {
                title: "Cricket World Cup Preparations Underway",
                description: "Stadiums being upgraded for upcoming international matches.",
                url: "https://example.com/news/5",
                source: { name: "Sports Hub" }
            }
        ]
    };
}

module.exports = router;