const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const city = req.query.city || "Mingora";
        const apiKey = process.env.WEATHER_API_KEY;
        
        console.log(`Fetching weather for: ${city}`);
        
        // Use the exact same URL that worked in your browser
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
        
        const response = await axios.get(url);
        
        // Send back the exact same data you saw in the browser
        res.json(response.data);
        
    } catch (error) {
        console.error("Weather API error:", error.response?.data || error.message);
        
        // Handle specific errors
        if (error.response?.status === 404) {
            res.status(404).json({ 
                error: "City not found",
                message: `"${req.query.city}" could not be found. Please check the spelling.`
            });
        } else if (error.response?.status === 401) {
            res.status(401).json({ 
                error: "Invalid API key",
                message: "Your API key is invalid or not activated"
            });
        } else {
            res.status(500).json({ 
                error: "Failed to fetch weather data",
                message: error.message
            });
        }
    }
});

module.exports = router;